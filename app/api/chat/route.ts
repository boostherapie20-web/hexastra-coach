import { NextRequest, NextResponse } from 'next/server'
import { runHexastraFlow } from '@/lib/hexastra/orchestrator/runHexastraFlow'
import type { BirthProfile, ContextType, PractitionerUsageHex, UiAction } from '@/lib/hexastra/types'
import type { PlanKey } from '@/lib/plans'
import type { ChatMessage } from '@/lib/chat/chatPayloadBuilder'

export const runtime = 'nodejs'

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []
  return messages
    .filter((m): m is { role?: unknown; content?: unknown } => Boolean(m && typeof m === 'object'))
    .map((m): ChatMessage => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: typeof m.content === 'string' ? m.content.trim() : '',
    }))
    .filter((m) => m.content.length > 0)
    .slice(-20)
}

function normalizeBirthData(raw: any): BirthProfile | null {
  if (!raw || typeof raw !== 'object') return null
  return {
    firstName: typeof raw.firstName === 'string' ? raw.firstName : undefined,
    lastName: typeof raw.lastName === 'string' ? raw.lastName : undefined,
    date: typeof raw.date === 'string' ? raw.date : typeof raw.birthDate === 'string' ? raw.birthDate : undefined,
    time: typeof raw.time === 'string' ? raw.time : typeof raw.birthTime === 'string' ? raw.birthTime : undefined,
    place: typeof raw.place === 'string' ? raw.place : typeof raw.birthCity === 'string' ? raw.birthCity : undefined,
    country: typeof raw.country === 'string' ? raw.country : typeof raw.birthCountryName === 'string' ? raw.birthCountryName : undefined,
    lat: typeof raw.lat === 'number' ? raw.lat : raw.birthLat ? Number(raw.birthLat) : undefined,
    lon: typeof raw.lon === 'number' ? raw.lon : raw.birthLng ? Number(raw.birthLng) : undefined,
    gender: typeof raw.gender === 'string' ? raw.gender : undefined,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await runHexastraFlow({
      plan: (typeof body?.plan === 'string' ? body.plan : 'free') as PlanKey,
      language: typeof body?.language === 'string' ? body.language : typeof body?.chatLanguage === 'string' ? body.chatLanguage : 'fr',
      requestType:
        body?.requestType === 'micro_profile' || body?.requestType === 'micro_year' || body?.requestType === 'micro_month'
          ? body.requestType
          : 'chat',
      birthData: normalizeBirthData(body?.birthData),
      practitionerUsage:
        body?.practitionerUsage === 'self' || body?.practitionerUsage === 'client'
          ? body.practitionerUsage
          : body?.practitionerUsage === 'personal'
          ? 'self'
          : null,
      contextType: (typeof body?.contextType === 'string' ? body.contextType : 'general') as ContextType,
      selectedMenuKey: typeof body?.selectedMenuKey === 'string' ? body.selectedMenuKey : null,
      selectedSubmenuKey: typeof body?.selectedSubmenuKey === 'string' ? body.selectedSubmenuKey : null,
      uiAction: (typeof body?.uiAction === 'string' ? body.uiAction : 'send_message') as UiAction,
      conversationId: typeof body?.conversationId === 'string' ? body.conversationId : null,
      messages: sanitizeMessages(body?.messages),
      evolutionProfile: body?.evolutionProfile && typeof body.evolutionProfile === 'object' ? body.evolutionProfile : null,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('[api/chat]', error)
    return NextResponse.json(
      {
        message: 'Je n’ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.',
        reply: 'Je n’ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.',
        mode: 'libre',
        plan: 'free',
        flowState: { step: 'analysis', completed: false },
        conversationId: crypto.randomUUID(),
      },
      { status: 500 },
    )
  }
}
