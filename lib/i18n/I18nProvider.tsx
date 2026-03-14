'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import type { Lang } from './config'
import { DEFAULT_LANGUAGE, STORAGE_KEY, detectBrowserLang } from './config'

// ── Dynamic translation loader ──────────────────────────────────────────────

async function loadTranslations(lang: Lang): Promise<Record<string, any>> {
  try {
    const mod = await import(`./translations/${lang}.json`)
    return mod.default ?? mod
  } catch {
    if (lang !== DEFAULT_LANGUAGE) {
      const fallback = await import(`./translations/${DEFAULT_LANGUAGE}.json`)
      return fallback.default ?? fallback
    }
    return {}
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

export interface I18nContext {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, fallback?: string) => string
}

export const I18nCtx = createContext<I18nContext>({
  lang: DEFAULT_LANGUAGE,
  setLang: () => {},
  t: (key) => key,
})

// ── Provider ─────────────────────────────────────────────────────────────────

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always start with DEFAULT_LANGUAGE on both server and client to avoid hydration mismatch.
  // After mount, read localStorage / browser preference and switch if needed.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANGUAGE)
  const [dict, setDict] = useState<Record<string, any>>({})

  // Resolve stored/browser language after first paint (client-only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null
      if (stored) { setLangState(stored); return }
    } catch {}
    const detected = detectBrowserLang()
    if (detected !== DEFAULT_LANGUAGE) setLangState(detected)
  }, [])

  useEffect(() => {
    loadTranslations(lang).then(setDict)
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    try { localStorage.setItem(STORAGE_KEY, l) } catch {}
    setLangState(l)
  }, [])

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const parts = key.split('.')
      let node: any = dict
      for (const p of parts) {
        if (node == null || typeof node !== 'object') return fallback ?? key
        node = node[p]
      }
      if (typeof node === 'string') return node
      return fallback ?? key
    },
    [dict],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}
