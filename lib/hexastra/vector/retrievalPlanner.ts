import type { DomainRoute, FlowStep } from '@/lib/hexastra/types'
import type { PlanKey } from '@/lib/plans'

export type RetrievalPlan = {
  topK: number
  includeKnowledge: boolean
  includeCompressedContext: boolean
  profile: 'minimal' | 'balanced' | 'deep'
  querySuffix: string
}

function planToTopK(plan: PlanKey): number {
  if (plan === 'practitioner') return 10
  if (plan === 'premium') return 7
  if (plan === 'essential') return 6
  return 5
}

export function buildRetrievalPlan(args: {
  plan: PlanKey
  flowStep: FlowStep
  domainRoute: DomainRoute
  specializedSource?: string | null
}): RetrievalPlan {
  const base = planToTopK(args.plan)
  const routeBias =
    args.domainRoute === 'fusion' ? 'KS FUSION V13 synthèse multidimensionnelle arbiter sentinel narrative composer' :
    args.domainRoute === 'neurokua' ? 'NeuroKua équilibre état intérieur fatigue surcharge recharge clarté stabilisation' :
    args.domainRoute === 'gps_kua' ? 'GPS Kua orientation direction environnement équilibre espace' :
    args.domainRoute === 'relationship' ? 'relations amour communication tension lien levier' :
    args.domainRoute === 'career' ? 'travail argent projet carrière stabilité stratégie' :
    args.domainRoute === 'decision' ? 'décision arbitrage levier risque timing choix' :
    args.domainRoute === 'timing' ? 'timing phase transition stabilisation expansion fenêtre' :
    args.domainRoute === 'wellbeing' ? 'bien-être calme recentrage fatigue récupération' :
    'HexAstra Coach guidance stratégique mémoire garde-fous'

  const stepBias =
    args.flowStep === 'sensitive_support' ? 'priorité sécurité, simplification, ancrage, une seule priorité' :
    args.flowStep === 'decision' ? 'priorité décision, risques, options, levier principal' :
    args.flowStep === 'deep_reading' ? 'priorité lecture complète, structure, profondeur, synthèse rapide' :
    args.flowStep === 'clarification' ? 'priorité sous-angles, exploration obligatoire, clarification' :
    args.flowStep === 'menu' ? 'priorité menu, orientation, sous-thèmes, choix utilisateur' :
    'priorité réponse utile, claire, orientée action'

  const sourceBias = args.specializedSource ? `source métier prioritaire: ${args.specializedSource}` : 'aucune source métier prioritaire'

  if (args.flowStep === 'menu') {
    return {
      topK: 3,
      includeKnowledge: true,
      includeCompressedContext: true,
      profile: 'minimal',
      querySuffix: `${routeBias}\n${stepBias}\n${sourceBias}`,
    }
  }

  if (args.flowStep === 'sensitive_support') {
    return {
      topK: 4,
      includeKnowledge: true,
      includeCompressedContext: true,
      profile: 'minimal',
      querySuffix: `${routeBias}\n${stepBias}\n${sourceBias}`,
    }
  }

  if (args.flowStep === 'deep_reading' || args.plan === 'practitioner') {
    return {
      topK: base + 2,
      includeKnowledge: true,
      includeCompressedContext: true,
      profile: 'deep',
      querySuffix: `${routeBias}\n${stepBias}\n${sourceBias}`,
    }
  }

  return {
    topK: base,
    includeKnowledge: true,
    includeCompressedContext: true,
    profile: 'balanced',
    querySuffix: `${routeBias}\n${stepBias}\n${sourceBias}`,
  }
}
