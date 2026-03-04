import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

// Client Supabase avec le service_role (contourne RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Map Price ID → plan
function getPlanFromPriceId(priceId: string): 'premium' | 'praticien' | null {
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY) return 'premium'
  if (priceId === process.env.STRIPE_PRICE_PRATICIEN_MONTHLY) return 'praticien'
  return null
}

async function setPlan(stripeCustomerId: string, plan: 'free' | 'premium' | 'praticien') {
  // Récupérer l'email depuis Stripe
  const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer
  const email = customer.email

  if (!email) {
    console.error('No email found for customer', stripeCustomerId)
    return
  }

  // Trouver l'utilisateur Supabase par email
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
  if (usersError) { console.error('listUsers error', usersError); return }

  const user = users.users.find(u => u.email === email)
  if (!user) { console.error('No Supabase user found for email', email); return }

  // Mettre à jour le plan
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, plan, updated_at: new Date().toISOString() })

  if (error) console.error('Error updating plan', error)
  else console.log(`Plan updated to "${plan}" for user ${email}`)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      // ── Abonnement créé ou réactivé ─────────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)

        if (subscription.status === 'active' && plan) {
          await setPlan(subscription.customer as string, plan)
        }

        // Abonnement annulé mais encore actif jusqu'à la fin de période
        if (subscription.status === 'canceled' || subscription.cancel_at_period_end) {
          // On garde le plan actif jusqu'à la vraie fin
          console.log('Subscription canceled, will downgrade at period end')
        }
        break
      }

      // ── Abonnement résilié définitivement ────────────────
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await setPlan(subscription.customer as string, 'free')
        break
      }

      // ── Paiement réussi (renouvellement mensuel) ─────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          if (plan) await setPlan(subscription.customer as string, plan)
        }
        break
      }

      // ── Paiement échoué ──────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Payment failed for customer', invoice.customer)
        // Optionnel : envoyer un email de relance via Supabase
        break
      }

      // ── Checkout terminé (premier paiement) ─────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const plan = getPlanFromPriceId(priceId)
          if (plan) await setPlan(subscription.customer as string, plan)
        }
        break
      }

      default:
        // Ignorer les autres événements
        break
    }
  } catch (err: any) {
    console.error('Webhook processing error:', err.message)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
