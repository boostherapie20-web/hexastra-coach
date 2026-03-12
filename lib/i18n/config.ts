export type Lang = 'fr' | 'en' | 'es' | 'pt' | 'de' | 'it'

export interface LangMeta {
  code: Lang
  label: string   // English label
  native: string  // label in its own language
  flag: string    // emoji flag
}

export const SUPPORTED_LANGUAGES: LangMeta[] = [
  { code: 'fr', label: 'French',     native: 'Français',    flag: '🇫🇷' },
  { code: 'en', label: 'English',    native: 'English',     flag: '🇬🇧' },
  { code: 'es', label: 'Spanish',    native: 'Español',     flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', native: 'Português',   flag: '🇵🇹' },
  { code: 'de', label: 'German',     native: 'Deutsch',     flag: '🇩🇪' },
  { code: 'it', label: 'Italian',    native: 'Italiano',    flag: '🇮🇹' },
]

export const DEFAULT_LANGUAGE: Lang = 'en'

/** Languages not yet released — kept for future reference */
export const FUTURE_LANGUAGES: string[] = ['ja', 'zh', 'ar', 'ru']

export const STORAGE_KEY = 'hexastra.lang'

/** Whether the AI should respond in the user's selected language */
export const AUTO_TRANSLATE_CHAT = true

/** Map browser language codes to our supported codes */
export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE
  const raw = navigator.language?.slice(0, 2).toLowerCase() ?? ''
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === raw)
  return found ? found.code : DEFAULT_LANGUAGE
}

export function getLangMeta(code: Lang): LangMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[1]
}
