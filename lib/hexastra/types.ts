import type { PlanKey } from '@/lib/plans'

export type HexastraMode = 'libre' | 'libre_avance' | 'libre_approfondi' | 'praticien'

export type FlowStep =
  | 'language'
  | 'birthdata'
  | 'practitioner_usage'
  | 'micro_profile'
  | 'micro_year'
  | 'micro_month'
  | 'menu'
  | 'analysis'

export type ContextType =
  | 'general'
  | 'decision'
  | 'relationship'
  | 'career'
  | 'energy'
  | 'wellbeing'
  | 'timing'
  | 'hexastraReading'
  | 'science'

export type UiAction =
  | 'new_reading'
  | 'open_menu'
  | 'select_menu_item'
  | 'select_submenu_item'
  | 'send_message'
  | 'restart_flow'

export type PractitionerUsageHex = 'self' | 'client' | null

export type BirthProfile = {
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

export type HexastraMenuItem = {
  key: string
  label: string
  description: string
  contextType: ContextType
  promptHint?: string
  submenu?: HexastraMenuItem[]
}

export type HexastraFlowState = {
  step: FlowStep
  completed: boolean
}

export type HexastraApiResponse = {
  message: string
  reply?: string
  mode: HexastraMode
  plan: PlanKey
  flowState: HexastraFlowState
  conversationId: string
  menu?: {
    visible: boolean
    items: HexastraMenuItem[]
  }
  suggestions?: string[]
  metadata?: {
    contextType?: ContextType
    practitionerUsage?: PractitionerUsageHex
    shouldPersistMemory?: boolean
    selectedMenuKey?: string | null
    selectedSubmenuKey?: string | null
  }
  updatedEvolutionProfile?: Record<string, unknown> | null
}

export type SessionStateRecord = {
  current_theme?: string | null
  current_context_type?: ContextType | null
  menu_level?: 'main' | 'submenu' | null
  last_selected_menu_key?: string | null
  last_selected_submenu_key?: string | null
  active_flow?: string | null
}

export type UserMemoryRecord = {
  main_goal?: string | null
  life_context?: string | null
  life_phase?: string | null
  dominant_life_zone?: string | null
  dominant_potential?: string | null
  reading_level?: string | null
  last_profile_reading_at?: string | null
  last_year_reading_at?: string | null
  last_month_reading_at?: string | null
}

export type BuildPromptInput = {
  plan: PlanKey
  mode: HexastraMode
  language: string
  contextType: ContextType
  practitionerUsage: PractitionerUsageHex
  selectedMenuLabel?: string | null
  selectedSubmenuLabel?: string | null
  requestType: 'micro_profile' | 'micro_year' | 'micro_month' | 'chat'
}
