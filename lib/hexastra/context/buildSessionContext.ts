import type { SupabaseClient } from '@supabase/supabase-js'
import type { ContextType, SessionStateRecord } from '@/lib/hexastra/types'
import { readSessionState } from '@/lib/hexastra/memory/sessionMemory'
import { detectDominantPotential } from '@/lib/hexastra/detection/detectDominantPotential'
import { detectLifePhase } from '@/lib/hexastra/detection/detectLifePhase'
import { detectReadingLevel } from '@/lib/hexastra/detection/detectReadingLevel'
import { detectTimingIntensity } from '@/lib/hexastra/detection/detectTimingIntensity'

export type HexastraSessionContext = {
  state: SessionStateRecord | null
  currentTheme: string | null
  contextType: ContextType
  selectedMenuKey: string | null
  selectedSubmenuKey: string | null
  readingLevel: string
  timing: string
  dominantPotential: string
  lifePhase: string
}

export async function buildSessionContext({
  supabase,
  conversationId,
  message,
  contextType,
  selectedMenuKey,
  selectedSubmenuKey,
  practitioner,
}: {
  supabase: SupabaseClient | null
  conversationId: string | null
  message: string
  contextType?: ContextType
  selectedMenuKey?: string | null
  selectedSubmenuKey?: string | null
  practitioner?: boolean
}): Promise<HexastraSessionContext> {
  const state = await readSessionState(supabase, conversationId)
  const resolvedContext = contextType ?? state?.current_context_type ?? 'general'
  const theme = state?.current_theme ?? (resolvedContext === 'general' ? null : resolvedContext)

  return {
    state,
    currentTheme: theme,
    contextType: resolvedContext,
    selectedMenuKey: selectedMenuKey ?? state?.last_selected_menu_key ?? null,
    selectedSubmenuKey: selectedSubmenuKey ?? state?.last_selected_submenu_key ?? null,
    readingLevel: detectReadingLevel(message, practitioner),
    timing: detectTimingIntensity(message),
    dominantPotential: detectDominantPotential(message),
    lifePhase: detectLifePhase(message),
  }
}
