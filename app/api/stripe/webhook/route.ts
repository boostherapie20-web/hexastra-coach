import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type PlanType = 'free' | 'essentiel' | 'premium' | 'praticien'

function getPlanFromPriceId(priceId: string): PlanType | null {
  if (priceId === process.env.STRIPE_ESSENTIEL_MONTHLY)      return 'essentiel'
  if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY)  return 'premium'
  if (priceId === process.env.STRIPE_PRICE_PRATICIEN_MONTHLY) return 'praticien'
  return null
}

async function setPlan(stripeCustomerId: string, plan: PlanType) {
  const customer = await stripe.customers.retrieve(stripeCustomerId) as Stripe.Customer
  const email = customer.email
  if (!email) { console.error('No email for customer', stripeCustomerId); return }

  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) { console.error('listUsers error', error); return }

  const user = users.users.find(u => u.email === email)
  if (!user) { console.error('No Supabase user for email', email); return }

  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, plan, updated_at: new Date().toISOString() })

  if (upsertError) console.error('Error updating plan', upsertError)
  else console.log('Plan set to', plan, 'for', email)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const priceId = sub.items.data[0]?.price.id
        const plan = getPlanFromPriceId(priceId)
        if (sub.status === 'active' && plan) {
          await setPlan(sub.customer as string, plan)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await setPlan(sub.customer as string, 'free')
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const plan = getPlanFromPriceId(sub.items.data[0]?.price.id)
          if (plan) await setPlan(sub.customer as string, plan)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Payment failed for', invoice.customer)
        break
      }

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          const plan = getPlanFromPriceId(sub.items.data[0]?.price.id)
          if (plan) await setPlan(sub.customer as string, plan)
        }
        break
      }
    }
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
