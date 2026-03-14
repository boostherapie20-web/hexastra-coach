import type { EmotionalState } from '@/lib/hexastra/types'

export function detectEmotionalState(message: string): EmotionalState {
  const text = message.toLowerCase().trim()

  if (!text) return 'neutral'

  if (/(j['’]en peux plus|épuis|epuis|angoiss|stress|satur|perdu|plus quoi faire|n'en peux plus|urgent)/i.test(text)) {
    return 'surcharge'
  }

  if (/(je dois choisir|j['’]hésite|que faire|quelle option|décider|decision)/i.test(text)) {
    return 'decision'
  }

  if (/(comprendre|pourquoi|analyse|clarifie|éclairer|clarifier)/i.test(text)) {
    return 'clarification'
  }

  if (/(explorer|voir|tendance|phase|énergie|envie de savoir|curieux)/i.test(text)) {
    return 'exploration'
  }

  return 'neutral'
}
