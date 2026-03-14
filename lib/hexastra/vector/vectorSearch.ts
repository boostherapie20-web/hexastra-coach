type RetrieveKnowledgeArgs = {
  query: string
  plan?: string
  vectorStoreId: string
  apiKey: string
  domainRoute?: string | null
}

export type RetrievedKnowledgeItem = {
  id: string
  file_id?: string
  file_name?: string
  score: number
  text: string
  attributes?: Record<string, string | number | boolean>
}

function cleanText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim()
}

function normalizeContent(content: any): string {
  if (!Array.isArray(content)) return ''

  return content
    .map((item) => {
      if (item?.type === 'text' && typeof item?.text === 'string') {
        return item.text
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')
    .trim()
}

function getTopK(plan?: string): number {
  if (plan === 'practitioner') return 8
  if (plan === 'premium') return 6
  return 5
}

export async function retrieveKnowledge({
  query,
  plan,
  vectorStoreId,
  apiKey,
}: RetrieveKnowledgeArgs): Promise<RetrievedKnowledgeItem[]> {
  const trimmedQuery = cleanText(query)
  if (!trimmedQuery || !vectorStoreId || !apiKey) return []

  const topK = getTopK(plan)

  const res = await fetch(
    `https://api.openai.com/v1/vector_stores/${vectorStoreId}/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: trimmedQuery,
        max_num_results: topK,
        rewrite_query: true,
      }),
      signal: AbortSignal.timeout(20000),
    },
  )

  const json = await res.json().catch(() => null)

  if (!res.ok || !json) {
    console.error('[vectorSearch] OpenAI vector search failed', {
      status: res.status,
      body: json,
    })
    return []
  }

  const data = Array.isArray(json.data) ? json.data : []

  return data
    .map((item: any, index: number) => {
      const text = normalizeContent(item?.content)

      return {
        id: typeof item?.id === 'string' ? item.id : `result_${index}`,
        file_id: typeof item?.file_id === 'string' ? item.file_id : undefined,
        file_name: typeof item?.file_name === 'string' ? item.file_name : undefined,
        score: typeof item?.score === 'number' ? item.score : 0,
        text,
        attributes:
          item?.attributes && typeof item.attributes === 'object'
            ? item.attributes
            : undefined,
      }
    })
    .filter((item) => item.text.length > 0)
}
