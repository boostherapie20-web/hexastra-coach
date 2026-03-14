/**
 * Profile Module — builds a personalized profile context block.
 * Injected silently into the AI prompt to ground all responses
 * in the user's actual birth data and micro-profile state.
 */

type BirthInfo = {
  firstName?: string
  lastName?: string
  date?: string          // YYYY-MM-DD
  time?: string          // HH:MM
  place?: string
  country?: string
  gender?: string
}

export type ProfileContext = {
  /** Has enough data to personalize responses */
  hasProfile: boolean
  /** Short name to use in responses */
  displayName: string
  /** Instruction block to inject before conversation */
  instructionBlock: string | null
}

export function buildProfileContext(
  birthData: BirthInfo | null | undefined,
  microProfileExists: boolean,
): ProfileContext {
  if (!birthData?.date) {
    return {
      hasProfile: false,
      displayName: '',
      instructionBlock: null,
    }
  }

  const name = [birthData.firstName, birthData.lastName].filter(Boolean).join(' ').trim()
  const displayName = birthData.firstName?.trim() || name || 'l\'utilisateur'

  const lines: string[] = [
    `[CONTEXTE PROFIL UTILISATEUR — UTILISATION IMPLICITE UNIQUEMENT]`,
    `Prénom : ${displayName}`,
  ]

  if (birthData.date) lines.push(`Date de naissance : ${birthData.date}`)
  if (birthData.time && birthData.time !== '12:00') {
    lines.push(`Heure de naissance : ${birthData.time}`)
  }
  if (birthData.place) lines.push(`Lieu de naissance : ${birthData.place}${birthData.country ? `, ${birthData.country}` : ''}`)
  if (birthData.gender) lines.push(`Genre : ${birthData.gender}`)

  lines.push('')

  if (microProfileExists) {
    lines.push(`Le micro-profil de ${displayName} a déjà été généré cette session/période.`)
    lines.push(`Ne pas répéter le micro-profil. L'utiliser implicitement pour personnaliser les réponses.`)
    lines.push(`Utiliser le prénom naturellement dans les réponses si pertinent.`)
  } else {
    lines.push(`Le micro-profil n'a pas encore été généré — il sera fourni séparément.`)
    lines.push(`En attendant, utiliser les données de naissance pour personnaliser l'approche.`)
  }

  lines.push(`[FIN CONTEXTE PROFIL]`)

  return {
    hasProfile: true,
    displayName,
    instructionBlock: lines.join('\n'),
  }
}
