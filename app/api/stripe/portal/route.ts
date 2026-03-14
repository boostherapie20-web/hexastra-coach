import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const stripe   = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  // Trouver le customer Stripe via l'email
  const customers = await stripe.customers.list({ email: user.email, limit: 1 })
  if (!customers.data.length) {
    return NextResponse.json({ error: 'Aucun abonnement trouvé' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: `${appUrl}/account`,
  })

  return NextResponse.json({ url: session.url })
}
