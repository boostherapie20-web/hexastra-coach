export function detectTimingIntensity(message: string): 'exploration' | 'adjustment' | 'bascule' | 'tension' {
  const text = message.toLowerCase()
  if (/urgent|je ne sais plus|je suis perdu|je n'en peux plus|pression/.test(text)) return 'tension'
  if (/je dois décider|rupture|déménagement|lancement|changer de travail/.test(text)) return 'bascule'
  if (/doute|inconfort|hésite|fatigue/.test(text)) return 'adjustment'
  return 'exploration'
}
