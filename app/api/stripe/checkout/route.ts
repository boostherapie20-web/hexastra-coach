import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_PREMIUM
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  if (!stripeKey || stripeKey === 'sk_test_AREMPLACER') {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
  const { readingId } = await req.json()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId!, quantity: 1 }],
    metadata: { userId: user.id, readingId: readingId || '' },
    success_url: `${baseUrl}/reading/${readingId}?payment=success`,
    cancel_url: `${baseUrl}/chat?payment=cancelled`,
  })

  await supabase.from('orders').insert({
    user_id: user.id, reading_id: readingId || null,
    stripe_session_id: session.id, status: 'pending',
  })

  return NextResponse.json({ url: session.url })
}
