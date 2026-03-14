import { createClient as createSupabaseServer } from '@/lib/supabase/server'
import { getModeForPlan } from '@/lib/hexastra/config/planModeMap'
import { buildSystemPrompt } from '@/lib/hexastra/prompts/buildSystemPrompt'
import { buildUserContext } from '@/lib/hexastra/context/buildUserContext'
import { buildSessionContext } from '@/lib/hexastra/context/buildSessionContext'
import { buildChatPayload } from '@/lib/hexastra/payload/buildChatPayload'
import { getMenuForMode, findMenuItem } from '@/lib/hexastra/menus/getMenuForMode'
import { persistConversationMessage, writeSessionState } from '@/lib/hexastra/memory/sessionMemory'
import { writeUserMemory } from '@/lib/hexastra/memory/userMemory'
import type { BirthProfile, ContextType, DomainRoute, HexastraApiResponse, PractitionerUsageHex, UiAction } from '@/lib/hexastra/types'
import type { PlanKey } from '@/lib/plans'
import type { ChatMessage } from '@/lib/chat/chatPayloadBuilder'

const VECTOR_STORE_ID = process.env.OPENAI_VECTOR_STORE_ID || ''
const API_URL = (process.env.HEXASTRA_API_URL || 'https://hexastra-api-production.up.railway.app').replace(/\/$/, '')
const API_KEY = process.env.HEXASTRA_API_KEY || ''

type SpecializedModuleResult = {
  source: 'gps_kua' | 'neurokua' | 'fusion'
  publicSummary: string
  raw: Record<string, unknown> | null
}

function normalizePlan(plan: unknown): PlanKey {
  return plan === 'essential' || plan === 'premium' || plan === 'practitioner' ? plan : 'free'
}

function isBirthComplete(birth: BirthProfile | null): boolean {
  return Boolean(birth?.firstName && birth?.date && birth?.place)
}

function buildMissingBirthMessage(language: string): string {
  return language.startsWith('en')
    ? 'To personalize the reading, I need your first name, birth date, birth time (or unknown), and birth city + country.'
    : 'Pour personnaliser la lecture, j’ai besoin de ton prénom, de ta date de naissance, de ton heure de naissance (ou inconnue), et de ta ville + pays de naissance.'
}

function buildPractitionerUsageMessage(language: string): string {
  return language.startsWith('en')
    ? 'Is this analysis for 1 — yourself or 2 — a client?'
    : 'Cette analyse est-elle pour : 1 — un usage personnel 2 — un client(e) ?'
}

function yearKey(date = new Date()): string {
  return String(date.getFullYear())
}

function monthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shouldGenerateMicroProfile(lastAt?: string | null, birthData?: BirthProfile | null): boolean {
  return Boolean(birthData?.date) && !lastAt
}

function shouldGenerateYearReading(lastAt?: string | null): boolean {
  if (!lastAt) return true
  return !lastAt.startsWith(yearKey())
}

function shouldGenerateMonthReading(lastAt?: string | null): boolean {
  if (!lastAt) return true
  return !lastAt.startsWith(monthKey())
}

async function callOpenAI(payload: any): Promise<string> {
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return 'OPENAI_API_KEY manquante. Configure la variable d’environnement pour activer HexAstra.'
  }

  if (VECTOR_STORE_ID) {
    payload.tools = [{ type: 'file_search', vector_store_ids: [VECTOR_STORE_ID] }]
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok || !json) {
    throw new Error(`OpenAI error ${res.status}`)
  }

  const output = Array.isArray(json.output) ? json.output : []
  const text = output
    .flatMap((block: any) => (Array.isArray(block?.content) ? block.content : []))
    .filter((item: any) => item?.type === 'output_text' && typeof item.text === 'string')
    .map((item: any) => item.text)
    .join('')
    .trim()

  return text || 'Je n’ai pas pu finaliser la lecture pour le moment.'
}

function buildSpecializedContext(result: SpecializedModuleResult | null): string {
  if (!result) return ''
  return [
    `[RÉSULTAT MÉTIER PRIORITAIRE — À UTILISER COMME SOURCE DE VÉRITÉ]`,
    `Source: ${result.source}`,
    `Résumé public attendu: ${result.publicSummary}`,
    `Données structurées: ${JSON.stringify(result.raw ?? {})}`,
    `Règle: reformule ce résultat dans le style HexAstra sans dire que tu n'as pas trouvé dans les documents.`,
  ].join('\n')
}

async function callRailway(path: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(12000),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Railway ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

async function runSpecializedModule({
  domainRoute,
  birthData,
  practitionerUsage,
  messages,
}: {
  domainRoute: DomainRoute
  birthData: BirthProfile | null
  practitionerUsage: PractitionerUsageHex
  messages: ChatMessage[]
}): Promise<SpecializedModuleResult | null> {
  const latestUserMessage = messages.filter((m) => m.role === 'user').at(-1)?.content ?? ''

  if ((domainRoute === 'gps_kua' || domainRoute === 'neurokua') && birthData?.date && birthData?.place) {
    try {
      const kua = await callRailway('/kua', {
        birth_date: birthData.date,
        birth_time: birthData.time || 'unknown',
        birth_city: birthData.place,
        birth_country: birthData.country,
        first_name: birthData.firstName,
        question: latestUserMessage,
        practitioner_usage: practitionerUsage,
      })
      const summary =
        typeof kua?.publicSummary === 'string' ? kua.publicSummary :
        typeof kua?.summary === 'string' ? kua.summary :
        `Utilise le calcul Kua/GPS fourni pour éclairer l'orientation, l'équilibre et la direction prioritaire.`
      return {
        source: domainRoute === 'gps_kua' ? 'gps_kua' : 'neurokua',
        publicSummary: summary,
        raw: kua && typeof kua === 'object' ? kua as Record<string, unknown> : null,
      }
    } catch {
      // continue to fallback
    }
  }

  if (domainRoute === 'fusion' && birthData?.date && birthData?.place) {
    try {
      const fusion = await callRailway('/chart/fusion', {
        first_name: birthData.firstName,
        birth_date: birthData.date,
        birth_time: birthData.time || 'unknown',
        birth_city: birthData.place,
        birth_country: birthData.country,
        question: latestUserMessage,
        practitioner_usage: practitionerUsage,
      })
      const summary =
        typeof fusion?.publicSummary === 'string' ? fusion.publicSummary :
        typeof fusion?.summary === 'string' ? fusion.summary :
        `Utilise la synthèse fusionnée fournie comme signal dominant de la réponse finale.`
      return {
        source: 'fusion',
        publicSummary: summary,
        raw: fusion && typeof fusion === 'object' ? fusion as Record<string, unknown> : null,
      }
    } catch {
      // continue to fallback
    }
  }

  return null
}

export async function runHexastraFlow(input: {
  plan?: PlanKey
  language?: string
  requestType: 'micro_profile' | 'micro_year' | 'micro_month' | 'chat'
  birthData: BirthProfile | null
  practitionerUsage: PractitionerUsageHex
  contextType?: ContextType
  selectedMenuKey?: string | null
  selectedSubmenuKey?: string | null
  uiAction?: UiAction
  conversationId?: string | null
  messages: ChatMessage[]
  evolutionProfile?: Record<string, unknown> | null
}) : Promise<HexastraApiResponse> {
  const supabase = await createSupabaseServer().catch(() => null as any)
  const { data: authData } = supabase?.auth ? await supabase.auth.getUser() : { data: { user: null } }
  const user = authData?.user ?? null

  const fallbackLanguage = input.language ?? 'fr'
  const fallbackPlan = normalizePlan(input.plan)
  const userContext = await buildUserContext({
    supabase,
    user,
    fallbackPlan,
    fallbackLanguage,
    birthData: input.birthData,
    practitionerUsage: input.practitionerUsage,
  })

  const plan = userContext.plan
  const mode = getModeForPlan(plan)
  const conversationId = input.conversationId ?? crypto.randomUUID()
  const latestUserMessage = input.messages.filter((m) => m.role === 'user').at(-1)?.content ?? ''

  const sessionContext = await buildSessionContext({
    supabase,
    conversationId,
    message: latestUserMessage,
    contextType: input.contextType,
    selectedMenuKey: input.selectedMenuKey,
    selectedSubmenuKey: input.selectedSubmenuKey,
    practitioner: mode === 'praticien',
  })

  if (plan === 'practitioner' && !userContext.practitionerUsage && input.requestType === 'chat') {
    return {
      message: buildPractitionerUsageMessage(userContext.language),
      reply: buildPractitionerUsageMessage(userContext.language),
      mode,
      plan,
      conversationId,
      flowState: { step: 'practitioner_usage', completed: false },
      metadata: { practitionerUsage: null, contextType: sessionContext.contextType, shouldPersistMemory: false },
    }
  }

  if (!isBirthComplete(userContext.birthData) && input.requestType === 'chat') {
    return {
      message: buildMissingBirthMessage(userContext.language),
      reply: buildMissingBirthMessage(userContext.language),
      mode,
      plan,
      conversationId,
      flowState: { step: 'birthdata', completed: false },
      metadata: { practitionerUsage: userContext.practitionerUsage, contextType: sessionContext.contextType, shouldPersistMemory: false },
    }
  }

  const userMemory = userContext.memory
  const profileDue = shouldGenerateMicroProfile(userMemory?.last_profile_reading_at, userContext.birthData)
  const yearDue = shouldGenerateYearReading(userMemory?.last_year_reading_at)
  const monthDue = shouldGenerateMonthReading(userMemory?.last_month_reading_at)

  let effectiveRequestType = input.requestType
  if (input.requestType === 'chat') {
    if (profileDue) effectiveRequestType = 'micro_profile'
    else if (yearDue) effectiveRequestType = 'micro_year'
    else if (monthDue) effectiveRequestType = 'micro_month'
  }

  const selectedMenu = findMenuItem(mode, input.selectedSubmenuKey ?? input.selectedMenuKey ?? null)
  const specializedResult = effectiveRequestType === 'chat'
    ? await runSpecializedModule({
        domainRoute: selectedMenu?.domainRoute ?? sessionContext.domainRoute,
        birthData: userContext.birthData,
        practitionerUsage: userContext.practitionerUsage,
        messages: input.messages,
      })
    : null

  const systemPrompt = buildSystemPrompt({
    plan,
    mode,
    language: userContext.language,
    contextType: selectedMenu?.contextType ?? sessionContext.contextType,
    practitionerUsage: userContext.practitionerUsage,
    selectedMenuLabel: input.selectedMenuKey ? findMenuItem(mode, input.selectedMenuKey)?.label ?? null : null,
    selectedSubmenuLabel: input.selectedSubmenuKey ? findMenuItem(mode, input.selectedSubmenuKey)?.label ?? null : null,
    requestType: effectiveRequestType,
    domainRoute: selectedMenu?.domainRoute ?? sessionContext.domainRoute,
    specializedSource: specializedResult?.source ?? null,
  })

  const menuInstruction = input.uiAction === 'select_menu_item' || input.uiAction === 'select_submenu_item'
    ? `${selectedMenu ? `L’utilisateur a choisi : ${selectedMenu.label}. ${selectedMenu.description}` : ''} ${selectedMenu?.promptHint ?? ''}`.trim()
    : ''

  const specializedInstruction = buildSpecializedContext(specializedResult)
  const messages = [
    ...input.messages,
    ...(menuInstruction ? [{ role: 'user' as const, content: menuInstruction }] : []),
    ...(specializedInstruction ? [{ role: 'assistant' as const, content: specializedInstruction }] : []),
  ]

  const payload = buildChatPayload({
    systemPrompt,
    userContext,
    sessionContext,
    messages,
  })

  const message = await callOpenAI(payload)

  const flowStep =
    effectiveRequestType === 'micro_profile' ? 'micro_profile' :
    effectiveRequestType === 'micro_year' ? 'micro_year' :
    effectiveRequestType === 'micro_month' ? 'micro_month' :
    'analysis'

  const menuVisible = effectiveRequestType === 'micro_month' || input.uiAction === 'open_menu' || input.uiAction === 'restart_flow'
  const menuItems = getMenuForMode(mode)

  await persistConversationMessage(supabase, conversationId, 'user', latestUserMessage || menuInstruction || `[${effectiveRequestType}]`)
  await persistConversationMessage(supabase, conversationId, 'assistant', message, { flowStep, mode, contextType: selectedMenu?.contextType ?? sessionContext.contextType, domainRoute: selectedMenu?.domainRoute ?? sessionContext.domainRoute, activeModule: specializedResult?.source ?? sessionContext.activeModule })

  await writeSessionState(supabase, conversationId, {
    current_theme: selectedMenu?.label ?? sessionContext.currentTheme ?? null,
    current_context_type: selectedMenu?.contextType ?? sessionContext.contextType,
    menu_level: input.selectedSubmenuKey ? 'submenu' : 'main',
    last_selected_menu_key: input.selectedMenuKey ?? sessionContext.selectedMenuKey,
    last_selected_submenu_key: input.selectedSubmenuKey ?? sessionContext.selectedSubmenuKey,
    active_flow: flowStep,
  })

  const nowIso = new Date().toISOString()
  if (user?.id) {
    const memoryPatch: Record<string, string | null> = {
      reading_level: sessionContext.readingLevel,
      dominant_potential: sessionContext.dominantPotential,
      life_phase: sessionContext.lifePhase,
    }
    if (effectiveRequestType === 'micro_profile') memoryPatch.last_profile_reading_at = nowIso
    if (effectiveRequestType === 'micro_year') memoryPatch.last_year_reading_at = nowIso
    if (effectiveRequestType === 'micro_month') memoryPatch.last_month_reading_at = nowIso
    await writeUserMemory(supabase, user.id, memoryPatch)
  }

  return {
    message,
    reply: message,
    mode,
    plan,
    conversationId,
    flowState: { step: menuVisible ? 'menu' : flowStep, completed: true },
    menu: { visible: menuVisible, items: menuItems },
    suggestions: menuVisible ? menuItems.slice(0, 4).map((item) => item.label) : undefined,
    metadata: {
      contextType: selectedMenu?.contextType ?? sessionContext.contextType,
      practitionerUsage: userContext.practitionerUsage,
      shouldPersistMemory: true,
      selectedMenuKey: input.selectedMenuKey ?? sessionContext.selectedMenuKey,
      selectedSubmenuKey: input.selectedSubmenuKey ?? sessionContext.selectedSubmenuKey,
    },
    updatedEvolutionProfile: input.evolutionProfile ?? null,
  }
}
