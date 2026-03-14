import type { DomainRoute } from '@/lib/hexastra/types'

export function classifyQuery(message: string): DomainRoute {
  const text = message.toLowerCase()

  if (/(\bkua\b|direction|orientation|boussole|feng|gps)/i.test(text)) return 'gps_kua'
  if (/(neurokua|énergie|energie|équilibre|equilibre|fatigue|stress|surcharge|recharge)/i.test(text)) return 'neurokua'
  if (/(lecture générale|lecture generale|hexastra complète|hexastra complete|fusion|synthèse|synthese)/i.test(text)) return 'fusion'
  if (/(relation|couple|amour|famille|proches)/i.test(text)) return 'relationship'
  if (/(travail|carrière|carriere|argent|professionnel|emploi|projet pro)/i.test(text)) return 'career'
  if (/(décision|decision|choix|trancher|attendre|agir)/i.test(text)) return 'decision'
  if (/(timing|cycle|phase|période|periode|mois à venir|prochains mois)/i.test(text)) return 'timing'
  if (/(bien-être|bien etre|bien etre|recentrage|confiance|motivation intérieure|motivation interieure)/i.test(text)) return 'wellbeing'
  if (/(science|astrolex|porteum|triangle|enneagram|ennéagram|numérologie|numerologie)/i.test(text)) return 'science'

  return 'general'
}
