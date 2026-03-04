import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const schema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional().nullable(),
  birthData: z.object({
    birthDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  }).optional().nullable(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'JSON invalide' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const { message, conversationId, birthData } = parsed.data

  // Créer ou réutiliser conversation
  let convId = conversationId
  if (!convId) {
    const { data: conv } = await supabase.from('conversations')
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select('id').single()
    convId = conv?.id
  }

  // Créer job
  const { data: job } = await supabase.from('job_status')
    .insert({ user_id: user.id, job_type: birthData ? 'free_reading' : 'free_reading', status: 'pending' })
    .select('id').single()

  // Sauvegarder message user
  await supabase.from('messages').insert({
    conversation_id: convId, user_id: user.id, role: 'user', content: message,
  })

  // Appeler n8n si configuré
  const n8nUrl = process.env.N8N_WEBHOOK_CHAT_URL
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET

  if (n8nUrl && n8nUrl !== 'https://AREMPLACER') {
    try {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-webhook-secret': n8nSecret || '' },
        body: JSON.stringify({ userId: user.id, conversationId: convId, jobId: job?.id, message, birthData }),
      })
    } catch (e) {
      console.error('n8n error:', e)
    }
  }

  return NextResponse.json({ jobId: job?.id, conversationId: convId })
}
