import type { Mode } from '@/app/chat/_lib/chat'

export type PlanKey = 'free' | 'essential' | 'premium' | 'practitioner'

export type AnalysisDepth = 'low' | 'medium' | 'high' | 'expert'

export type PlanCapabilities = {
  canUseChat: boolean
  /** null = illimité */
  maxMessagesPerDay: number | null
  analysisDepth: AnalysisDepth
  availableModes: Mode[]
  canUsePractitionerMode: boolean
  canAnalyzeForClients: boolean
  canGetLongResponses: boolean
  canAccessDeepAnalysis: boolean
  canAccessProfessionalFormat: boolean
}

export type PlanUiData = {
  key: PlanKey
  label: string
  price: string
  period: string
  desc: string
  features: string[]
  cta: string
  href: string
  badge?: string
  highlighted?: boolean
}

export type PlanApiContext = {
  plan: PlanKey
  analysisDepth: AnalysisDepth
  practitionerEnabled: boolean
  longResponseAllowed: boolean
  professionalUseAllowed: boolean
}
