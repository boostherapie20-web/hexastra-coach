import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const PRICE_MAP: Record<string, string> = {
  premium_monthly:    process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
  praticien_monthly:  process.env.STRIPE_PRICE_PRATICIEN_MONTHLY!,
}

export async function POST(req: NextRequest) {
  try {
    const { priceKey } = await req.json()

    const priceId = PRICE_MAP[priceKey]
    if (!priceId) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    // Récupérer l'utilisateur connecté
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Trouver ou créer le customer Stripe
    let customerId: string | undefined

    if (user?.email) {
      const existing = await stripe.customers.list({ email: user.email, limit: 1 })
      if (existing.data.length > 0) {
        customerId = existing.data[0].id
      } else {
        const customer = await stripe.customers.create({ email: user.email })
        customerId = customer.id
      }
    }

    // Créer la session Checkout en mode subscription
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      customer_email: customerId ? undefined : user?.email,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      locale: 'fr',
      subscription_data: {
        metadata: {
          supabase_user_id: user?.id || '',
          price_key: priceKey,
        },
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
