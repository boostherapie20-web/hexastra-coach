'use client'

import { useContext } from 'react'
import { I18nCtx } from './I18nProvider'
import type { Lang } from './config'
import { AUTO_TRANSLATE_CHAT } from './config'

export type { Lang }

/**
 * Returns `{ t, lang, setLang }`.
 *
 * `t('auth.signIn')` resolves the dotted key from the active language JSON.
 * Falls back to the key string when not found.
 */
export function useTranslation() {
  return useContext(I18nCtx)
}

/**
 * Returns the language code to inject into the chat API payload.
 * Only meaningful when AUTO_TRANSLATE_CHAT is true.
 */
export function useChatLanguage(): string | undefined {
  const { lang } = useContext(I18nCtx)
  return AUTO_TRANSLATE_CHAT ? lang : undefined
}
