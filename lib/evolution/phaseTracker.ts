/**
 * Phase Tracker — probabilistic detection of the user's current life phase.
 *
 * Phases: expansion | stabilisation | transition | contraction | unknown
 * Detection is based on lexical signals only — no absolute conclusions.
 */

import type { LifePhase } from '@/types/evolution'

type PhaseSignal = {
  phase: LifePhase
  patterns: RegExp[]
  weight: number
}

const PHASE_SIGNALS: PhaseSignal[] = [
  {
    phase: 'transition',
    patterns: [
      /je (vais|souhaite|envisage|dois) (changer|quitter|partir|démissionner)/i,
      /reconversion/i,
      /tout (change|est en train de changer|bascule)/i,
      /nouvelle (étape|vie|direction|orientation|page)/i,
      /déménagement/i,
      /rupture|séparation/i,
      /je recommence (à zéro|tout)/i,
      /je (me) repositionne/i,
      /changement (majeur|important|profond)/i,
    ],
    weight: 10,
  },
  {
    phase: 'expansion',
    patterns: [
      /je (viens de )?lance(r|)/i,
      /nouveau projet/i,
      /en plein(e)? (élan|dynamique|croissance|développement)/i,
      /ça (décolle|progresse|avance bien)/i,
      /beaucoup d'(opportunités|énergie|projets)/i,
      /je suis (très )?motivé/i,
      /montée en puissance/i,
      /tout (s'accélère|s'ouvre)/i,
    ],
    weight: 8,
  },
  {
    phase: 'contraction',
    patterns: [
      /je (me sens|suis) épuisé/i,
      /je n'ai (plus|pas) (d'énergie|envie|force)/i,
      /je (me) retire/i,
      /besoin de (pause|repos|recul)/i,
      /ralentir|ralentissement/i,
      /je suis à plat/i,
      /saturation|burnout|burn.?out/i,
      /plus rien ne (fonctionne|marche|avance)/i,
      /je n'y arrive (plus|pas)/i,
    ],
    weight: 9,
  },
  {
    phase: 'stabilisation',
    patterns: [
      /consolider|consolidation/i,
      /sécuriser|sécurisation/i,
      /maintenir|maintien/i,
      /tenir le cap/i,
      /stabiliser|stabilité/i,
      /garder le (rythme|cap)/i,
      /ça tient|ça fonctionne/i,
      /routine qui (marche|fonctionne)/i,
    ],
    weight: 7,
  },
]

export type PhaseDetectionResult = {
  phase: LifePhase
  confidence: number
}

export function detectLifePhase(text: string): PhaseDetectionResult {
  if (!text.trim()) return { phase: 'unknown', confidence: 0 }

  const scores: Record<string, number> = {}

  for (const signal of PHASE_SIGNALS) {
    const matchCount = signal.patterns.filter((p) => p.test(text)).length
    if (matchCount > 0) {
      scores[signal.phase] = (scores[signal.phase] ?? 0) + matchCount * signal.weight
    }
  }

  const entries = Object.entries(scores).sort(([, a], [, b]) => b - a)
  if (entries.length === 0 || entries[0][1] === 0) {
    return { phase: 'unknown', confidence: 0 }
  }

  const total = entries.reduce((acc, [, v]) => acc + v, 0)
  return {
    phase: entries[0][0] as LifePhase,
    confidence: total > 0 ? entries[0][1] / total : 0,
  }
}
