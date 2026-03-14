/**
 * Retrieval Policy — defines retrieval parameters per subscription plan.
 *
 * Strategy: quality > quantity.
 * Each tier gets progressively richer access, but all are bounded
 * to avoid token waste. Practitioner gets the deepest retrieval
 * with the largest context budget, compressed before injection.
 */

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

const CONFIGS: Record<PlanKey, RetrievalConfig> = {
  free: {
    topK: 4,
    scoreThreshold: 0.45,
    maxDocsAfterDedup: 4,
    maxCharsPerDoc: 1200,
    maxContextChars: 6000,
  },
  essential: {
    topK: 6,
    scoreThreshold: 0.42,
    maxDocsAfterDedup: 5,
    maxCharsPerDoc: 1600,
    maxContextChars: 9000,
  },
  premium: {
    topK: 8,
    scoreThreshold: 0.38,
    maxDocsAfterDedup: 6,
    maxCharsPerDoc: 1800,
    maxContextChars: 12000,
  },
  practitioner: {
    topK: 12,
    scoreThreshold: 0.32,
    maxDocsAfterDedup: 8,
    maxCharsPerDoc: 2200,
    maxContextChars: 18000,
  },
}

export function getRetrievalConfig(plan: PlanKey): RetrievalConfig {
  return CONFIGS[plan] ?? CONFIGS.free
}

/** Maps API plan strings (from route.ts body) to PlanKey */
export function normalizePlanKey(raw: string): PlanKey {
  if (raw === 'practitioner') return 'practitioner'
  if (raw === 'premium') return 'premium'
  if (raw === 'essential') return 'essential'
  return 'free'
}
