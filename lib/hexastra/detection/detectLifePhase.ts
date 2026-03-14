export function detectLifePhase(message: string): string {
  const text = message.toLowerCase()
  if (/hésite|perte de repère|transition|changement sans clarté/.test(text)) return 'transition'
  if (/équilibre|organis|optimis|stabil/.test(text)) return 'stabilisation'
  if (/ouvrir|lancer|croissance|opportun/.test(text)) return 'expansion'
  if (/fatigu|ralenti|tri|repli|repos/.test(text)) return 'contraction'
  return 'unknown'
}
