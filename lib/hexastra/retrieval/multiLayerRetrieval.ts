import { retrieveKnowledge } from "@/lib/vectorSearch"

type LayerResult = {
  source: string
  text: string
  score: number
}

export async function multiLayerRetrieval({
  query,
  plan,
  vectorStoreId,
  apiKey,
  domainRoute,
}: {
  query: string
  plan: string
  vectorStoreId: string
  apiKey: string
  domainRoute?: string
}) {

  const layers = []

  // layer 1 : knowledge principal
  const knowledge = await retrieveKnowledge({
    query,
    plan,
    vectorStoreId,
    apiKey,
    domainRoute
  })

  layers.push(
    ...knowledge.map(k => ({
      source: "knowledge",
      text: k.text,
      score: k.score
    }))
  )

  // layer 2 : KS Fusion
  if (query.toLowerCase().includes("ks") ||
      query.toLowerCase().includes("fusion")) {

    const fusion = await retrieveKnowledge({
      query: `${query} KS Fusion V13 orchestrateur`,
      plan,
      vectorStoreId,
      apiKey,
      domainRoute: "fusion"
    })

    layers.push(
      ...fusion.map(k => ({
        source: "ks_fusion",
        text: k.text,
        score: k.score + 0.1
      }))
    )
  }

  // layer 3 : domain
  if (domainRoute) {

    const domain = await retrieveKnowledge({
      query,
      plan,
      vectorStoreId,
      apiKey,
      domainRoute
    })

    layers.push(
      ...domain.map(k => ({
        source: "domain",
        text: k.text,
        score: k.score + 0.05
      }))
    )
  }

  return layers
    .sort((a,b) => b.score - a.score)
    .slice(0, 10)
}
