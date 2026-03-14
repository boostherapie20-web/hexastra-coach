/**
 * Evolution System — type definitions.
 *
 * UserEvolutionProfile is the compact, persistent representation of what
 * HexAstra knows about a user's trajectory over time.
 * It is stored client-side (localStorage) and sent with every chat request.
 */

export type LifePhase =
  | 'expansion'
  | 'stabilisation'
  | 'transition'
  | 'contraction'
  | 'unknown'

export type DominantZone =
  | 'security'
  | 'relationship'
  | 'identity'
  | 'direction'
  | 'personal_expansion'
  | 'meaning'
  | 'unknown'

export type DominantPotential =
  | 'creation'
  | 'influence'
  | 'structuration'
  | 'accompagnement'
  | 'exploration'
  | 'unknown'

export type TensionLevel = 1 | 2 | 3 | 4 | 5

export type UserEvolutionProfile = {
  /** User's first name (from birth data) */
  firstName?: string
  /** Session language */
  language?: 'fr' | 'en' | 'es' | 'de' | 'pt' | 'it'
  /** Subscription plan */
  plan?: string
  /** Practitioner mode: personal or client */
  practitionerUsage?: 'personal' | 'client' | null
  /** Stated or detected main objective */
  mainObjective?: string
  /** Current dominant life theme */
  dominantTheme?: string
  /** Dominant life zone */
  dominantZone?: DominantZone
  /** Current life phase */
  currentPhase?: LifePhase
  /** Emotional tension level 1–5 */
  tensionLevel?: TensionLevel
  /** Dominant action potential */
  dominantPotential?: DominantPotential
  /** Recent high-impact levers identified (max 3) */
  currentLevers?: string[]
  /** Recurring patterns observed across sessions */
  recurringPatterns?: string[]
  /** Stable context notes that persist across sessions */
  stableContextNotes?: string[]
  /** Short summary of last meaningful session */
  lastSessionSummary?: string
  /** ISO timestamp of last update */
  updatedAt?: string
}

export type EvolutionUpdateInput = {
  userMessage: string
  assistantResponse: string
  currentProfile: UserEvolutionProfile | null
}

export type EvolutionDecision = {
  shouldUpdate: boolean
  fieldsToUpdate: string[]
  nextProfile: UserEvolutionProfile
}
