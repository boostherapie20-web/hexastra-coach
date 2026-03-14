export function detectReadingLevel(message: string, practitioner = false): string {
  const text = message.toLowerCase()
  if (practitioner || /diagnostic|levier|stratég|hiérarch|consult|client/.test(text)) return 'praticien'
  if (/projet|transition|vision|décision|choisir|stratég/.test(text)) return 'strategique'
  if (/pourquoi|schéma|comprendre|réagit|sens/.test(text)) return 'reflexion'
  if (/stress|perdu|fatigu|doute|émotion|angoiss/.test(text)) return 'emotionnel'
  return 'concret'
}
