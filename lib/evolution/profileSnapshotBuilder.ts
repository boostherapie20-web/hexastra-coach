/**
 * Profile Snapshot Builder — extracts signals from one exchange
 * and produces an updated UserEvolutionProfile.
 *
 * All detection is synchronous, zero-latency, heuristic-only.
 */

import type {
  UserEvolutionProfile,
  DominantPotential,
  DominantZone,
  TensionLevel,
} from '@/types/evolution'
import { detectLifePhase } from './phaseTracker'
import { detectDominantTheme } from './themeTracker'
import { buildSessionSummary } from './sessionSummarizer'
import {
  shouldUpdatePhase,
  shouldUpdateDominantTheme,
  shouldPersistSignal,
  shouldReplaceObjective,
  shouldUpdatePotential,
  shouldUpdateZone,
  shouldUpdateTension,
} from './memoryPolicy'

// ── Potential detection ───────────────────────────────────────────────────────

type PotentialSignal = { potential: DominantPotential; patterns: RegExp[] }

const POTENTIAL_SIGNALS: PotentialSignal[] = [
  {
    potential: 'creation',
    patterns: [
      /créer|lancer|inventer|idée|expression|projet créatif|autonomie créative/i,
      /j'ai des idées|je veux créer|besoin de liberté (créative|d'expression)/i,
    ],
  },
  {
    potential: 'influence',
    patterns: [
      /convaincre|fédérer|communiquer|impact|visibilité|leadership/i,
      /rassembler|motiver les autres|prise de parole|reconnaissance/i,
    ],
  },
  {
    potential: 'structuration',
    patterns: [
      /organiser|planifier|sécuriser|optimiser|construire dans la durée/i,
      /besoin de (structure|cadre|clarté)|sens des responsabilités/i,
    ],
  },
  {
    potential: 'accompagnement',
    patterns: [
      /aider|soutenir|transmettre|accompagner|coacher|guider/i,
      /forte empathie|posture de soutien|orientation humaine/i,
    ],
  },
  {
    potential: 'exploration',
    patterns: [
      /découvrir|changer|nouveau (défi|contexte|projet)|explorer/i,
      /besoin de nouveauté|liberté de mouvement|difficulté avec la routine/i,
    ],
  },
]

function detectPotential(text: string): DominantPotential {
  for (const { potential, patterns } of POTENTIAL_SIGNALS) {
    if (patterns.some((p) => p.test(text))) return potential
  }
  return 'unknown'
}

// ── Zone detection ────────────────────────────────────────────────────────────

type ZoneSignal = { zone: DominantZone; patterns: RegExp[] }

const ZONE_SIGNALS: ZoneSignal[] = [
  {
    zone: 'security',
    patterns: [/sécurité (matérielle|financière)?|stabilité|logement|revenus suffisants/i],
  },
  {
    zone: 'relationship',
    patterns: [/couple|relation (amoureuse|affective)|famille|amour|lien (profond|important)/i],
  },
  {
    zone: 'identity',
    patterns: [/identité|qui je suis|confiance en moi|estime de moi|image de soi/i],
  },
  {
    zone: 'direction',
    patterns: [/direction (de vie|professionnelle)?|carrière|objectif principal|voie|but/i],
  },
  {
    zone: 'personal_expansion',
    patterns: [/grandir|évoluer|apprendre|me développer|potentiel|croissance personnelle/i],
  },
  {
    zone: 'meaning',
    patterns: [/sens (de ma vie|de tout)?|purpose|mission de vie|pourquoi|raison d'être/i],
  },
]

function detectZone(text: string): DominantZone {
  for (const { zone, patterns } of ZONE_SIGNALS) {
    if (patterns.some((p) => p.test(text))) return zone
  }
  return 'unknown'
}

// ── Tension detection ─────────────────────────────────────────────────────────

const HIGH_TENSION_PATTERNS = [
  /je suis (complètement |totalement )?(perdu|dépassé|épuisé|à bout)/i,
  /urgence|crisis|crise|je n'(en )?peux plus/i,
  /tout s'effondre|ça ne va (vraiment )?pas/i,
]
const MEDIUM_TENSION_PATTERNS = [
  /stressé|anxieux|inquiet|tendu|difficile/i,
  /je ne sais pas (quoi faire|comment|par où)/i,
]

function detectTension(text: string): TensionLevel | undefined {
  if (HIGH_TENSION_PATTERNS.some((p) => p.test(text))) return 4
  if (MEDIUM_TENSION_PATTERNS.some((p) => p.test(text))) return 3
  return undefined
}

// ── Objective extraction ──────────────────────────────────────────────────────

const OBJECTIVE_PATTERNS = [
  /mon objectif (est|c'est|principal est) (.{10,100})/i,
  /je veux (vraiment |absolument )?(.{10,80})/i,
  /je cherche (vraiment )?à (.{10,80})/i,
  /j'ai besoin de (.{10,80}) (pour|afin)/i,
  /mon but (est|c'est) (.{10,80})/i,
]

function extractObjective(text: string): string | null {
  for (const pattern of OBJECTIVE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const group = match[match.length - 1]
      return group.trim().replace(/[.!?]+$/, '').slice(0, 100)
    }
  }
  return null
}

// ── Lever extraction ──────────────────────────────────────────────────────────

function extractLever(assistantResponse: string): string | null {
  const patterns = [
    /Le levier prioritaire[^:]*:\s*→?\s*([^\n]{15,80})/i,
    /Levier principal\s*:\s*([^\n]{15,80})/i,
    /→\s*([A-ZÀÂÄÉÈÊËÏÎÔÙÛÜ][a-zàâäéèêëïîôùûüç][^\n]{14,79})/,
  ]
  for (const p of patterns) {
    const m = assistantResponse.match(p)
    if (m?.[1]) return m[1].replace(/[*_]/g, '').trim().slice(0, 80)
  }
  return null
}

// ── Main builder ──────────────────────────────────────────────────────────────

type SnapshotInput = {
  userMessage: string
  assistantResponse: string
  currentProfile: UserEvolutionProfile | null
}

export function buildProfileSnapshot(input: SnapshotInput): UserEvolutionProfile {
  const { userMessage, assistantResponse, currentProfile } = input
  const profile: UserEvolutionProfile = { ...(currentProfile ?? {}) }
  const combined = `${userMessage} ${assistantResponse}`

  // Phase
  const phaseResult = detectLifePhase(userMessage)
  if (shouldUpdatePhase(profile.currentPhase, phaseResult.phase, phaseResult.confidence)) {
    profile.currentPhase = phaseResult.phase
  }

  // Theme
  const themeResult = detectDominantTheme(userMessage)
  if (
    themeResult.theme &&
    shouldUpdateDominantTheme(profile.dominantTheme, themeResult.theme, themeResult.score)
  ) {
    profile.dominantTheme = themeResult.theme
  }

  // Objective
  if (shouldPersistSignal(userMessage)) {
    const objective = extractObjective(userMessage)
    if (objective && shouldReplaceObjective(profile.mainObjective, objective)) {
      profile.mainObjective = objective
    }
  }

  // Potential
  const potential = detectPotential(combined)
  if (shouldUpdatePotential(profile.dominantPotential, potential)) {
    profile.dominantPotential = potential
  }

  // Zone
  const zone = detectZone(userMessage)
  if (shouldUpdateZone(profile.dominantZone, zone)) {
    profile.dominantZone = zone
  }

  // Tension
  const tension = detectTension(userMessage)
  if (tension && shouldUpdateTension(profile.tensionLevel, tension)) {
    profile.tensionLevel = tension
  }

  // Levers (keep last 3)
  const lever = extractLever(assistantResponse)
  if (lever) {
    const levers = profile.currentLevers ?? []
    if (!levers.includes(lever)) {
      profile.currentLevers = [lever, ...levers].slice(0, 3)
    }
  }

  // Session summary
  profile.lastSessionSummary = buildSessionSummary({
    userMessage,
    assistantResponse,
    dominantTheme: profile.dominantTheme,
    currentPhase: profile.currentPhase,
  })

  profile.updatedAt = new Date().toISOString()

  return profile
}
