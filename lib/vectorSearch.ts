/**
 * Vector Search — adaptive retrieval from OpenAI Vector Store.
 *
 * Uses the Vector Stores Search API directly, giving full control
 * over topK and scoring before context is injected into the prompt.
 * This replaces the automatic file_search tool for better token control.
 *
 * Endpoint: POST /v1/vector_stores/{vector_store_id}/search
 */

import { getRetrievalConfig, normalizePlanKey, type PlanKey } from './retrievalPolicy'

export type SearchResult = {
  fileId: string
  filename: string
  score: number
  text: string
}

type ApiContentBlock = {
  type: string
  text?: string
}

type ApiSearchResult = {
  file_id: string
  filename: string
  score: number
  content: ApiContentBlock[]
}

type ApiSearchResponse = {
  data: ApiSearchResult[]
  object?: string
}

/** Extract plain text from a result's content blocks */
function extractText(content: ApiContentBlock[]): string {
  return content
    .filter((b) => b.type === 'text' && typeof b.text === 'string')
    .map((b) => b.text as string)
    .join('\n')
    .trim()
}

/**
 * Retrieve documents from the vector store for a given query + plan.
 * Returns raw scored results — compression is handled separately.
 *
 * Returns empty array (never throws) so the chat still works if
 * the vector store is unavailable.
 */
export async function retrieveKnowledge({
  query,
  plan,
  vectorStoreId,
  apiKey,
}: {
  query: string
  plan: PlanKey | string
  vectorStoreId: string
  apiKey: string
}): Promise<SearchResult[]> {
  if (!query.trim() || !vectorStoreId || !apiKey) return []

  const config = getRetrievalConfig(normalizePlanKey(plan))

  try {
    const res = await fetch(
      `https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          query: query.slice(0, 800),  // cap query length
          max_num_results: config.topK,
          reranking: { ranker: 'auto' },
        }),
        signal: AbortSignal.timeout(8000),
      },
    )

    if (!res.ok) {
      console.warn(`[vectorSearch] API error ${res.status} — skipping retrieval`)
      return []
    }

    const data: ApiSearchResponse = await res.json()

    if (!Array.isArray(data?.data)) return []

    return data.data
      .filter((r) => typeof r.score === 'number' && r.score >= config.scoreThreshold)
      .map((r) => ({
        fileId: r.file_id ?? '',
        filename: r.filename ?? '',
        score: r.score,
        text: extractText(r.content ?? []),
      }))
      .filter((r) => r.text.length > 40)  // skip near-empty chunks
  } catch (err) {
    console.warn('[vectorSearch] retrieval failed — skipping:', err)
    return []
  }
}
