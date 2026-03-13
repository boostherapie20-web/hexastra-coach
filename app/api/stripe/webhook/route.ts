import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const PRICE_KEY_TO_PLAN: Record<string, string> = {
  essentiel_monthly: 'essential',
  premium_monthly:   'premium',
  praticien_monthly: 'practitioner',
}

export async function POST(req: NextRequest) {
  const stripeKey     = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const body   = await req.text()
  const sig    = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Signature manquante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // ── Paiement complété ───────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // session.metadata contient supabase_user_id + price_key (ajoutés dans /checkout)
    const userId   = session.metadata?.supabase_user_id
    const priceKey = session.metadata?.price_key
    const plan     = priceKey ? (PRICE_KEY_TO_PLAN[priceKey] ?? null) : null

    if (supabaseUrl && supabaseKey && userId && plan) {
      const admin = createAdminClient()

      // Mettre à jour le plan dans les user_metadata Supabase
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { plan },
      })

      // Marquer la commande comme payée
      await admin
        .from('orders')
        .update({ status: 'paid', stripe_payment_id: session.payment_intent as string })
        .eq('stripe_session_id', session.id)
    }

    // Déclencher n8n premium
    const n8nUrl    = process.env.N8N_WEBHOOK_PREMIUM_URL
    const n8nSecret = process.env.N8N_WEBHOOK_SECRET
    if (n8nUrl && n8nUrl !== 'https://AREMPLACER') {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-webhook-secret': n8nSecret ?? '',
        },
        body: JSON.stringify({ userId, plan, sessionId: session.id }),
      })
    }
  }

  // ── Abonnement annulé / expiré → repasser en free ───────────────────────
  if (
    event.type === 'customer.subscription.deleted' ||
    event.type === 'customer.subscription.paused'
  ) {
    const sub      = event.data.object as Stripe.Subscription
    const userId   = sub.metadata?.supabase_user_id

    if (supabaseUrl && supabaseKey && userId) {
      const admin = createAdminClient()
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: { plan: 'free' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
