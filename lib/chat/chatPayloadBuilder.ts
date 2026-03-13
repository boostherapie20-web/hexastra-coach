import type { BirthData } from '@/app/chat/_lib/chat'
import type { PlanKey } from '@/lib/plans'
import type { PractitionerUsage } from './bootstrapTypes'
import type { UserEvolutionProfile } from '@/types/evolution'
import { buildPlanApiContext } from '@/lib/plans'
import { getEntitlements } from './entitlements'

export type RequestType = 'micro_profile' | 'micro_year' | 'micro_month' | 'chat'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

/** Shape expected by /api/chat for birthData */
type ApiBirthData = {
  firstName?: string
  lastName?: string
  date?: string
  time?: string
  place?: string
  country?: string
  lat?: number
  lon?: number
  gender?: string
}

function toApiBirthData(bd: BirthData): ApiBirthData {
  return {
    firstName: bd.firstName || undefined,
    lastName: bd.lastName || undefined,
    date: bd.birthDate || undefined,
    time: bd.birthTime || undefined,
    place: bd.birthCity || undefined,
    country: bd.birthCountryName || bd.birthCountryCode || undefined,
    lat: bd.birthLat ? Number(bd.birthLat) : undefined,
    lon: bd.birthLng ? Number(bd.birthLng) : undefined,
    gender: bd.gender || undefined,
  }
}

/** Targeted system instruction injected for each micro-reading type */
function microReadingInstruction(requestType: RequestType, bd: BirthData): string | null {
  const name = bd.firstName?.trim() || 'l\'utilisateur'

  if (requestType === 'micro_profile') {
    return (
      `[INSTRUCTION MICRO-PROFIL — GÉNÉRER MAINTENANT]\n` +
      `Génère le Micro-Profil pour ${name} selon la structure exacte du système HexAstra :\n` +
      `- Essence principale\n` +
      `- Fonctionnement intérieur\n` +
      `- Sensibilité dominante\n` +
      `- Force naturelle\n` +
      `- Zone de vigilance\n` +
      `Clôture : "Cette lecture décrit ton fonctionnement de base. Nous pouvons maintenant explorer ta situation actuelle."\n` +
      `Format : 6-10 lignes. Aucune question. Génère directement.`
    )
  }

  if (requestType === 'micro_year') {
    const year = new Date().getFullYear()
    return (
      `[INSTRUCTION MICRO-ANNÉE — GÉNÉRER MAINTENANT]\n` +
      `Génère la Micro-Année ${year} pour ${name} selon la structure exacte du système HexAstra :\n` +
      `- Phase de l'année\n` +
      `- Mouvement principal\n` +
      `- Opportunité dominante\n` +
      `- Point de vigilance\n` +
      `- Attitude optimale\n` +
      `Clôture : "Ce cycle donne le contexte de ton année. Explorons maintenant ta situation actuelle."\n` +
      `Format : 5-8 lignes. Aucune question. Génère directement.`
    )
  }

  if (requestType === 'micro_month') {
    const d = new Date()
    const monthNames = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
    const monthLabel = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    return (
      `[INSTRUCTION MICRO-MOIS — GÉNÉRER MAINTENANT]\n` +
      `Génère le Micro-Mois de ${monthLabel} pour ${name} selon la structure exacte du système HexAstra :\n` +
      `- Thème principal du mois\n` +
      `- Ce qui est favorable\n` +
      `- Point de vigilance\n` +
      `- Conseil clé\n` +
      `Clôture : "Ton profil, ton année et ton contexte actuel sont maintenant posés. Que souhaites-tu explorer ?"\n` +
      `Puis affiche le menu correspondant au mode actif.\n` +
      `Format : 2-4 lignes. Aucune question. Génère directement.`
    )
  }

  return null
}

export type ChatPayload = {
  requestType: RequestType
  mode: string
  conversationId: string | null
  chatLanguage: string
  plan: string
  analysisDepth: string
  practitionerEnabled: boolean
  longResponseAllowed: boolean
  professionalUseAllowed: boolean
  practitionerUsage: PractitionerUsage
  birthData: ApiBirthData | null
  messages: ChatMessage[]
  evolutionProfile: UserEvolutionProfile | null
}

export function buildChatPayload({
  requestType,
  plan,
  birthData,
  practitionerUsage,
  chatLanguage,
  conversationId,
  messages,
  evolutionProfile = null,
}: {
  requestType: RequestType
  plan: PlanKey
  birthData: BirthData
  practitionerUsage: PractitionerUsage
  chatLanguage: string
  conversationId: string | null
  messages: ChatMessage[]
  evolutionProfile?: UserEvolutionProfile | null
}): ChatPayload {
  const planCtx = buildPlanApiContext(plan)
  const ents = getEntitlements(plan)

  const apiBirthData = toApiBirthData(birthData)

  // For micro-readings, replace the user message with a targeted instruction
  let finalMessages = messages
  if (requestType !== 'chat') {
    const instruction = microReadingInstruction(requestType, birthData)
    if (instruction) {
      finalMessages = [{ role: 'user', content: instruction }]
    }
  }

  return {
    requestType,
    mode: ents.chatMode,
    conversationId,
    chatLanguage,
    plan: planCtx.plan,
    analysisDepth: planCtx.analysisDepth,
    practitionerEnabled: planCtx.practitionerEnabled,
    longResponseAllowed: planCtx.longResponseAllowed,
    professionalUseAllowed: planCtx.professionalUseAllowed,
    practitionerUsage,
    birthData: apiBirthData,
    messages: finalMessages,
    evolutionProfile,
  }
}
