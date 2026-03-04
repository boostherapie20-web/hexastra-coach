import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const { userId, readingId } = session.metadata!

    await supabase.from('orders')
      .update({ status: 'paid', stripe_payment_id: session.payment_intent as string })
      .eq('stripe_session_id', session.id)

    // Déclencher n8n premium
    const n8nUrl = process.env.N8N_WEBHOOK_PREMIUM_URL
    if (n8nUrl && n8nUrl !== 'https://AREMPLACER') {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || '' },
        body: JSON.stringify({ userId, readingId, sessionId: session.id }),
      })
    }
  }

  return NextResponse.json({ received: true })
}
