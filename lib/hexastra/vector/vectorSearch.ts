import { getTopK } from "./retrievalPolicy"

export async function searchVectorStore(domain: string, message: string) {

  const topK = getTopK(domain, message.length)

  const results = await fetch(process.env.VECTOR_API!, {
    method: "POST",
    body: JSON.stringify({
      query: message,
      top_k: topK,
      namespace: domain
    })
  })

  return results.json()

}