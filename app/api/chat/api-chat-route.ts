// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages = [], threadId, mode = 'libre', persona, profile } = body

    const n8nUrl = process.env.N8N_CHAT_URL

    // ── Route vers n8n si configuré ──
    if (n8nUrl) {
      const r = await fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-app-version': '1.0.0',
        },
        body: JSON.stringify({
          userId: 'demo-user', // TODO: remplacer par session réelle
          threadId: threadId ?? null,
          mode,
          persona: persona ?? null,
          messages,
          profile: profile ?? {},
        }),
      })

      if (!r.ok) throw new Error(`n8n error: ${r.status}`)
      const data = await r.json()

      // Contrat JSON n8n attendu :
      // { reply, threadId, chips, needsBirthData, askedFields, profileUpdate, analysisSnapshot, nextStep }
      return NextResponse.json(data)
    }

    // ── Fallback : appel direct OpenAI (dev / sans n8n) ──
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: 'HexAstra n\'est pas encore configuré. Revenez bientôt.',
        threadId: threadId ?? `thread_${Date.now()}`,
        chips: [],
      })
    }

    const systemPrompt = `Tu es HexAstra Coach, un assistant intelligent d'analyse personnelle.
Tu aides les utilisateurs à comprendre leur situation actuelle, leurs cycles personnels et leurs décisions importantes.
Tu parles en français sauf si l'utilisateur parle anglais.
Tu es précis, bienveillant, jamais vague.
Tu ne fais pas de prédictions absolues. Tu apportes de la clarté et du recul.
Si tu n'as pas encore les informations de naissance de l'utilisateur, demande-les naturellement dans la conversation (date, heure, lieu).
Format : réponses courtes et claires, 2-4 paragraphes max. Pas de listes à puces systématiques.`

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-12), // garde les 12 derniers messages max
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    })

    if (!r.ok) throw new Error(`OpenAI error: ${r.status}`)
    const data = await r.json()

    return NextResponse.json({
      reply: data.choices[0]?.message?.content ?? 'Je n\'ai pas pu générer de réponse.',
      threadId: threadId ?? `thread_${Date.now()}`,
      chips: [],
    })

  } catch (err) {
    console.error('[/api/chat]', err)
    return NextResponse.json(
      { reply: 'Une erreur est survenue. Réessayez dans un instant.', threadId: null, chips: [] },
      { status: 200 } // on retourne 200 pour que le front affiche le message d'erreur
    )
  }
}
