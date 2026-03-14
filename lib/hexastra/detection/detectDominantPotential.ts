export function detectDominantPotential(message: string): string {
  const text = message.toLowerCase()
  if (/créer|idée|lancer|invent/.test(text)) return 'creation'
  if (/leader|communi|rassembler|visibil/.test(text)) return 'influence'
  if (/organis|structure|cadre|stabil/.test(text)) return 'structuration'
  if (/aider|accomp|conseil|transmett/.test(text)) return 'accompagnement'
  if (/nouveau|explor|changer|mobilit/.test(text)) return 'exploration'
  return 'unknown'
}
