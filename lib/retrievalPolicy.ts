import type { DomainRoute } from '@/lib/hexastra/types'

export type PlanKey = 'free' | 'essential' | 'premium' | 'practitioner'

export type RetrievalConfig = {
  /** Number of candidate documents to fetch from the vector store */
  topK: number
  /** Minimum relevance score [0-1] — lower = more permissive */
  scoreThreshold: number
  /** Max documents to keep after deduplication */
  maxDocsAfterDedup: number
  /** Max characters per individual document chunk */
  maxCharsPerDoc: number
  /** Max total characters for the entire injected knowledge block */
  maxContextChars: number
}

const BASE_CONFIGS: Record<PlanKey, RetrievalConfig> = {
  free: {
    topK: 8,
    scoreThreshold: 0.42,
    maxDocsAfterDedup: 5,
    maxCharsPerDoc: 1400,
    maxContextChars: 7500,
  },
  essential: {
    topK: 12,
    scoreThreshold: 0.38,
    maxDocsAfterDedup: 7,
    maxCharsPerDoc: 1700,
    maxContextChars: 11000,
  },
  premium: {
    topK: 18,
    scoreThreshold: 0.34,
    maxDocsAfterDedup: 9,
    maxCharsPerDoc: 2200,
    maxContextChars: 16000,
  },
  practitioner: {
    topK: 24,
    scoreThreshold: 0.28,
    maxDocsAfterDedup: 12,
    maxCharsPerDoc: 2600,
    maxContextChars: 24000,
  },
}

const DOMAIN_MULTIPLIERS: Partial<Record<DomainRoute, { topK?: number; docs?: number; chars?: number }>> = {
  gps_kua: { topK: 8, docs: 2, chars: 5000 },
  neurokua: { topK: 6, docs: 2, chars: 3500 },
  fusion: { topK: 10, docs: 3, chars: 7000 },
  science: { topK: 6, docs: 2, chars: 3000 },
}

export function getRetrievalConfig(plan: PlanKey): RetrievalConfig {
  return BASE_CONFIGS[plan] ?? BASE_CONFIGS.free
}

export function getAdaptiveRetrievalConfig({
  plan,
  domainRoute,
  query,
}: {
  plan: PlanKey
  domainRoute?: DomainRoute
  query?: string
}): RetrievalConfig {
  const base = getRetrievalConfig(plan)
  const domain = domainRoute ? DOMAIN_MULTIPLIERS[domainRoute] : undefined
  const queryLength = (query ?? '').trim().length
  const complexityBoost = queryLength > 450 ? 6 : queryLength > 220 ? 3 : 0

  return {
    topK: Math.min(base.topK + (domain?.topK ?? 0) + complexityBoost, 36),
    scoreThreshold: base.scoreThreshold,
    maxDocsAfterDedup: Math.min(base.maxDocsAfterDedup + (domain?.docs ?? 0), 16),
    maxCharsPerDoc: Math.min(base.maxCharsPerDoc + Math.floor((domain?.chars ?? 0) / 4), 3200),
    maxContextChars: Math.min(base.maxContextChars + (domain?.chars ?? 0), 32000),
  }
}

/** Maps API plan strings (from route.ts body) to PlanKey */
export function normalizePlanKey(raw: string): PlanKey {
  if (raw === 'practitioner') return 'practitioner'
  if (raw === 'premium') return 'premium'
  if (raw === 'essential') return 'essential'
  return 'free'
}
