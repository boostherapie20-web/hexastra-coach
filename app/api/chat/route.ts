import { NextRequest, NextResponse } from 'next/server'
import { runHexastraFlow } from '@/lib/hexastra/orchestrator/runHexastraFlow'
import type {
  BirthProfile,
  ContextType,
  PractitionerUsageHex,
  UiAction,
} from '@/lib/hexastra/types'
import type { PlanKey } from '@/lib/plans'
import type { ChatMessage } from '@/lib/chat/chatPayloadBuilder'

export const runtime = 'nodejs'

function sanitizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []

  return messages
    .filter(
      (m): m is { role?: unknown; content?: unknown } =>
        Boolean(m && typeof m === 'object')
    )
    .map(
      (m): ChatMessage => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: typeof m.content === 'string' ? m.content.trim() : '',
      })
    )
    .filter((m) => m.content.length > 0)
    .slice(-20)
}

function normalizePlan(plan: unknown): PlanKey {
  return plan === 'essential' ||
    plan === 'premium' ||
    plan === 'practitioner' ||
    plan === 'free'
    ? plan
    : 'free'
}

function normalizeContextType(value: unknown): ContextType {
  return typeof value === 'string' ? (value as ContextType) : 'general'
}

function normalizeUiAction(value: unknown): UiAction {
  return typeof value === 'string' ? (value as UiAction) : 'send_message'
}

function normalizePractitionerUsage(value: unknown): PractitionerUsageHex {
  if (value === 'self' || value === 'client') return value
  if (value === 'personal') return 'self'
  return null
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

function normalizeBirthData(raw: unknown): BirthProfile | null {
  if (!raw || typeof raw !== 'object') return null

  const data = raw as Record<string, unknown>

  const birth: BirthProfile = {
    firstName: typeof data.firstName === 'string' ? data.firstName.trim() : undefined,
    lastName: typeof data.lastName === 'string' ? data.lastName.trim() : undefined,
    date:
      typeof data.date === 'string'
        ? data.date.trim()
        : typeof data.birthDate === 'string'
          ? data.birthDate.trim()
          : undefined,
    time:
      typeof data.time === 'string'
        ? data.time.trim()
        : typeof data.birthTime === 'string'
          ? data.birthTime.trim()
          : undefined,
    place:
      typeof data.place === 'string'
        ? data.place.trim()
        : typeof data.birthCity === 'string'
          ? data.birthCity.trim()
          : undefined,
    country:
      typeof data.country === 'string'
        ? data.country.trim()
        : typeof data.birthCountryName === 'string'
          ? data.birthCountryName.trim()
          : undefined,
    lat: toOptionalNumber(data.lat ?? data.birthLat),
    lon: toOptionalNumber(data.lon ?? data.birthLng),
    gender: typeof data.gender === 'string' ? data.gender.trim() : undefined,
  }

  const hasUsefulData = Boolean(
    birth.firstName ||
      birth.lastName ||
      birth.date ||
      birth.time ||
      birth.place ||
      birth.country ||
      typeof birth.lat === 'number' ||
      typeof birth.lon === 'number'
  )

  return hasUsefulData ? birth : null
}

function buildSafeErrorResponse() {
  return {
    message:
      'Je n’ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.',
    reply:
      'Je n’ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.',
    mode: 'free',
    plan: 'free',
    flowState: { step: 'error', completed: false },
    conversationId: crypto.randomUUID(),
    metadata: {
      shouldPersistMemory: false,
    },
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== 'object') {
      return NextResponse.json(buildSafeErrorResponse(), { status: 400 })
    }

    const response = await runHexastraFlow({
      plan: normalizePlan((body as Record<string, unknown>).plan),
      language:
        typeof (body as Record<string, unknown>).language === 'string'
          ? ((body as Record<string, unknown>).language as string)
          : typeof (body as Record<string, unknown>).chatLanguage === 'string'
            ? ((body as Record<string, unknown>).chatLanguage as string)
            : 'fr',
      requestType:
        (body as Record<string, unknown>).requestType === 'micro_profile' ||
        (body as Record<string, unknown>).requestType === 'micro_year' ||
        (body as Record<string, unknown>).requestType === 'micro_month'
          ? ((body as Record<string, unknown>).requestType as
              | 'micro_profile'
              | 'micro_year'
              | 'micro_month')
          : 'chat',
      birthData: normalizeBirthData((body as Record<string, unknown>).birthData),
      practitionerUsage: normalizePractitionerUsage(
        (body as Record<string, unknown>).practitionerUsage
      ),
      contextType: normalizeContextType(
        (body as Record<string, unknown>).contextType
      ),
      selectedMenuKey:
        typeof (body as Record<string, unknown>).selectedMenuKey === 'string'
          ? ((body as Record<string, unknown>).selectedMenuKey as string)
          : null,
      selectedSubmenuKey:
        typeof (body as Record<string, unknown>).selectedSubmenuKey === 'string'
          ? ((body as Record<string, unknown>).selectedSubmenuKey as string)
          : null,
      uiAction: normalizeUiAction((body as Record<string, unknown>).uiAction),
      conversationId:
        typeof (body as Record<string, unknown>).conversationId === 'string'
          ? ((body as Record<string, unknown>).conversationId as string)
          : null,
      messages: sanitizeMessages((body as Record<string, unknown>).messages),
      evolutionProfile:
        (body as Record<string, unknown>).evolutionProfile &&
        typeof (body as Record<string, unknown>).evolutionProfile === 'object'
          ? ((body as Record<string, unknown>).evolutionProfile as Record<
              string,
              unknown
            >)
          : null,
    })

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error('[api/chat] fatal error', error)
    return NextResponse.json(buildSafeErrorResponse(), { status: 500 })
  }
}
