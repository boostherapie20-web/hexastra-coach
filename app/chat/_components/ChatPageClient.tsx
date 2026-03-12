'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PremiumBackground from '@/app/components/PremiumBackground'
import { createClient } from '@/lib/supabase/client'
import Composer from './Composer'
import LeftSidebar from './LeftSidebar'
import MessageList from './MessageList'
import BirthFormModal from './BirthFormModal'
import PaywallBanner from './PaywallBanner'
import {
  STORAGE_KEYS,
  EMPTY_BIRTH_DATA,
  makeReadingTitle,
  hasBirthData,
  formatBirthContextForApi,
  type Msg,
  type Mode,
  type Project,
  type Reading,
  type BirthData,
} from '../_lib/chat'
import {
  FREE_USAGE_STORAGE_KEY,
  FREE_USAGE_FIRST_MSG_KEY,
  buildPlanApiContext,
  canContinueChat,
  canUseChatMode,
  isFreePlan,
  type PlanKey,
} from '@/lib/plans'
import { useChatLanguage, useTranslation } from '@/lib/i18n/useTranslation'
import LanguageSwitcher from '@/app/components/LanguageSwitcher'

const MODES: Array<{ key: Mode; labelKey: string }> = [
  { key: 'essentiel', labelKey: 'chat.modeEssentiel' },
  { key: 'premium', labelKey: 'chat.modePremium' },
  { key: 'praticien', labelKey: 'chat.modePraticien' },
]

function IconMenu() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="13" height="1.3" rx="0.65" fill="currentColor" />
      <rect x="2" y="8" width="9" height="1.3" rx="0.65" fill="currentColor" opacity="0.7" />
      <rect x="2" y="12" width="11" height="1.3" rx="0.65" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

const WELCOME_MESSAGE: Msg = {
  id: 'welcome',
  role: 'assistant',
  content: '__welcome__',
  created_at: new Date().toISOString(),
}

function getInitials(email: string) {
  if (!email) return 'HX'
  const clean = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ')
  const parts = clean.split(' ').filter(Boolean)

  if (parts.length === 0) return 'HX'

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function isValidReading(value: unknown): value is Reading {
  if (!value || typeof value !== 'object') return false
  const reading = value as Partial<Reading>

  return (
    typeof reading.id === 'string' &&
    typeof reading.title === 'string' &&
    typeof reading.date === 'string'
  )
}

function isValidProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false
  const project = value as Partial<Project>
  return typeof project.id === 'string' && typeof project.name === 'string'
}

export default function ChatPageClient() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  const chatLanguage = useChatLanguage()
  const { t } = useTranslation()

  const [messages, setMessages] = useState<Msg[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('essentiel')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)

  const [readings, setReadings] = useState<Reading[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [showLeft, setShowLeft] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1600)
  const [userEmail, setUserEmail] = useState('')

  const [birthData, setBirthData] = useState<BirthData>(EMPTY_BIRTH_DATA)
  const [showBirthForm, setShowBirthForm] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)

  /**
   * Plan lu depuis Supabase user_metadata.plan (mis à jour par le webhook Stripe).
   */
  const [userPlan, setUserPlan] = useState<PlanKey>('free')

  /** Nombre de messages envoyés dans la fenêtre de 24h en cours (plan gratuit) */
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0)
  /** Timestamp auquel la fenêtre de 24h se réinitialise */
  const [freeResetAt, setFreeResetAt] = useState<Date | null>(null)

  const cacheRef = useRef<Map<string, string>>(new Map())
  const hasPrefilled = useRef(false)

  const isWelcome = useMemo(
    () => messages.length === 1 && messages[0]?.content === '__welcome__',
    [messages]
  )

  const userInitials = getInitials(userEmail)
  const desktopLeft = viewportWidth >= 1100

  useEffect(() => {
    let mounted = true

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      if (data.user?.email) setUserEmail(data.user.email)
      const plan = (data.user?.user_metadata?.plan as PlanKey) ?? 'free'
      setUserPlan(plan)
    })

    return () => {
      mounted = false
    }
  }, [supabase])

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.birthData)
      if (stored) {
        const parsed = JSON.parse(stored) as BirthData
        if (parsed && typeof parsed === 'object') setBirthData(parsed)
      }
    } catch { /* noop */ }
  }, [])

  const handleBirthDataChange = useCallback((next: BirthData) => {
    setBirthData(next)
    try { localStorage.setItem(STORAGE_KEYS.birthData, JSON.stringify(next)) } catch { /* noop */ }
  }, [])

  useEffect(() => {
    try {
      const storedReadings = localStorage.getItem(STORAGE_KEYS.readings)
      const storedProjects = localStorage.getItem(STORAGE_KEYS.projects)

      if (storedReadings) {
        const parsed = JSON.parse(storedReadings)
        if (Array.isArray(parsed)) {
          setReadings(parsed.filter(isValidReading))
        }
      }

      if (storedProjects) {
        const parsed = JSON.parse(storedProjects)
        if (Array.isArray(parsed)) {
          setProjects(parsed.filter(isValidProject))
        }
      }
    } catch {
      setReadings([])
      setProjects([])
    }
  }, [])

  useEffect(() => {
    const query = searchParams.get('q')
    if (!query || hasPrefilled.current) return
    hasPrefilled.current = true
    setInput(query)
  }, [searchParams])

  /** Sync compteur free — fenêtre glissante de 24h depuis le premier message */
  useEffect(() => {
    if (!isFreePlan(userPlan)) return
    try {
      const firstMsgRaw = localStorage.getItem(FREE_USAGE_FIRST_MSG_KEY)
      if (firstMsgRaw) {
        const firstMsgTime = new Date(firstMsgRaw).getTime()
        const resetAt = new Date(firstMsgTime + 24 * 60 * 60 * 1000)
        if (Date.now() >= resetAt.getTime()) {
          // 24h écoulées → reset
          localStorage.removeItem(FREE_USAGE_FIRST_MSG_KEY)
          localStorage.setItem(FREE_USAGE_STORAGE_KEY, '0')
          setFreeMessagesUsed(0)
          setFreeResetAt(null)
        } else {
          const n = parseInt(localStorage.getItem(FREE_USAGE_STORAGE_KEY) ?? '0', 10)
          setFreeMessagesUsed(Number.isFinite(n) ? n : 0)
          setFreeResetAt(resetAt)
        }
      } else {
        setFreeMessagesUsed(0)
        setFreeResetAt(null)
      }
    } catch {
      setFreeMessagesUsed(0)
    }
  }, [userPlan])

  const persistReadings = useCallback((next: Reading[]) => {
    setReadings(next)
    localStorage.setItem(STORAGE_KEYS.readings, JSON.stringify(next))
  }, [])

  const persistProjects = useCallback((next: Project[]) => {
    setProjects(next)
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(next))
  }, [])

  const saveReading = useCallback(
    (conversation: Msg[]) => {
      const lastAssistant = [...conversation]
        .reverse()
        .find((message) => message.role === 'assistant')
      const firstUser = conversation.find((message) => message.role === 'user')

      if (!lastAssistant || !firstUser) return

      const reading: Reading = {
        id: `${Date.now()}`,
        title: makeReadingTitle(firstUser.content),
        science:
          mode === 'essentiel'
            ? 'Mode Essentiel'
            : mode === 'premium'
              ? 'Mode Premium'
              : 'Mode Praticien',
        date: new Date().toISOString(),
        preview: lastAssistant.content.slice(0, 220),
      }

      persistReadings([reading, ...readings].slice(0, 80))
    },
    [mode, persistReadings, readings]
  )

  const handleCreateProject = useCallback(() => {
    const name = window.prompt('Nom du projet')?.trim()
    if (!name) return

    persistProjects([
      ...projects,
      {
        id: `${Date.now()}`,
        name,
        collapsed: false,
      },
    ])
  }, [persistProjects, projects])

  const handleAssignReadingToProject = useCallback(
    (readingId: string, projectId: string) => {
      const next = readings.map((reading) =>
        reading.id === readingId ? { ...reading, projectId } : reading
      )
      persistReadings(next)
    },
    [persistReadings, readings]
  )

  const handleOpenReading = useCallback((reading: Reading) => {
    setMessages([
      {
        id: `reading-${reading.id}`,
        role: 'assistant',
        content: `Lecture sauvegardée\n\n${reading.preview}`,
        created_at: reading.date,
      },
    ])
    setShowLeft(false)
  }, [])

  const handleSend = useCallback(
    async (provided?: string) => {
      const baseContent = (provided ?? input).trim()
      const attachNote = attachedFile ? `\n\n[Pièce jointe : ${attachedFile.name}]` : ''
      const content = baseContent + attachNote
      if (!content.trim() || isTyping) return

      // Guard plan gratuit : limite quotidienne
      if (!canContinueChat(userPlan, freeMessagesUsed)) return

      const userMessage: Msg = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      }

      const baseMessages = isWelcome ? [] : messages
      const nextConversation = [...baseMessages, userMessage]

      setMessages(nextConversation)
      setInput('')
      setAttachedFile(null)
      setIsTyping(true)

      const cachedReply = cacheRef.current.get(content)

      if (cachedReply) {
        const assistantMessage: Msg = {
          id: `${Date.now()}-cached`,
          role: 'assistant',
          content: cachedReply,
          created_at: new Date().toISOString(),
          cached: true,
        }

        const finalConversation = [...nextConversation, assistantMessage]

        setTimeout(() => {
          setMessages(finalConversation)
          setIsTyping(false)
          saveReading(finalConversation)
        }, 180)

        return
      }

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mode,
            conversationId,
            chatLanguage,
            ...buildPlanApiContext(userPlan),
            ...(hasBirthData(birthData) ? { birthContext: formatBirthContextForApi(birthData) } : {}),
            messages: nextConversation.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          }),
        })

        const data = await response.json()

        const reply =
          typeof data?.reply === 'string'
            ? data.reply
            : 'Une erreur est survenue.'

        const assistantMessage: Msg = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: reply,
          created_at: new Date().toISOString(),
        }

        const finalConversation = [...nextConversation, assistantMessage]

        setMessages(finalConversation)
        setIsTyping(false)
        cacheRef.current.set(content, reply)
        setConversationId(data?.conversationId ?? null)
        saveReading(finalConversation)

        // Incrémenter le compteur free
        if (isFreePlan(userPlan)) {
          const next = freeMessagesUsed + 1
          setFreeMessagesUsed(next)
          try {
            localStorage.setItem(FREE_USAGE_STORAGE_KEY, String(next))
            // Enregistrer le timestamp du premier message si pas encore fait
            if (!localStorage.getItem(FREE_USAGE_FIRST_MSG_KEY)) {
              const now = new Date().toISOString()
              localStorage.setItem(FREE_USAGE_FIRST_MSG_KEY, now)
              setFreeResetAt(new Date(Date.now() + 24 * 60 * 60 * 1000))
            }
          } catch { /* noop */ }
        }
      } catch {
        setMessages([
          ...nextConversation,
          {
            id: `${Date.now()}-error`,
            role: 'assistant',
            content:
              "Je n'ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.",
            created_at: new Date().toISOString(),
          },
        ])
        setIsTyping(false)
      }
    },
    [attachedFile, birthData, conversationId, freeMessagesUsed, input, isTyping, isWelcome, messages, mode, saveReading, userPlan]
  )

  const handleNewReading = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setConversationId(null)
    setInput('')
  }, [])

  const sidebar = (
    <LeftSidebar
      projects={projects}
      readings={readings}
      userInitials={userInitials}
      onNewReading={handleNewReading}
      onCreateProject={handleCreateProject}
      onOpenReading={handleOpenReading}
      onAssignReadingToProject={handleAssignReadingToProject}
    />
  )

  const isLimitReached = isFreePlan(userPlan) && !canContinueChat(userPlan, freeMessagesUsed)

  const modeSwitch = isFreePlan(userPlan) ? null : (
    <div className="hx-mode-switch">
      {MODES.map((item) => {
        const locked = !canUseChatMode(userPlan, item.key)
        return (
          <button
            key={item.key}
            type="button"
            className={`hx-mode-btn${mode === item.key ? ' is-active' : ''}${locked ? ' is-locked' : ''}`}
            onClick={() => { if (!locked) setMode(item.key) }}
            title={locked ? (item.key === 'premium' ? t('pricing.modeUnlockPremium') : item.key === 'praticien' ? t('pricing.modeUnlockPraticien') : t('pricing.modeUnlockDefault')) : undefined}
          >
            {t(item.labelKey)}
            {locked && <span className="hx-mode-lock" aria-hidden="true">↑</span>}
          </button>
        )
      })}
    </div>
  )

  // On the welcome screen the sidebar is never pinned, so show overlay on all viewports
  const mobileOverlay = (isWelcome ? showLeft : (!desktopLeft && showLeft)) ? (
    <div
      className="hx-chat-overlay"
      onClick={() => setShowLeft(false)}
      role="presentation"
    >
      <aside
        className="hx-chat-mobile-sheet hx-chat-mobile-sheet-left hx-chat-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {sidebar}
      </aside>
    </div>
  ) : null

  const composerProps = {
    value: input,
    onChange: setInput,
    onSend: () => void handleSend(),
    onQuickPrompt: (v: string) => void handleSend(v),
    showQuickPrompts: false,
    onAttach: (file: File) => setAttachedFile(file),
    attachedFileName: attachedFile?.name,
    onRemoveAttach: () => setAttachedFile(null),
    onBirthFormOpen: () => setShowBirthForm(true),
    highlightBirth: isWelcome,
  }

  /* ─── WELCOME SCREEN ─── */
  if (isWelcome) {
    return (
      <div className="hx-chat-page">
        <PremiumBackground />
        {mobileOverlay}
        {showBirthForm && (
          <BirthFormModal
            data={birthData}
            onChange={handleBirthDataChange}
            onClose={() => setShowBirthForm(false)}
          />
        )}

        <div className="hx-welcome-screen">
          <header className="hx-welcome-nav">
            <div className="hx-welcome-nav-brand">
              <button
                type="button"
                className="hx-icon-btn"
                onClick={() => setShowLeft(true)}
                aria-label="Historique"
              >
                <IconMenu />
              </button>
            </div>

            {modeSwitch}

            <LanguageSwitcher variant="flag" className="hx-nav-lang" />
          </header>

          <div className="hx-welcome-body">
            <div className="hx-welcome-center">
              <div className="hx-chat-hero-eyebrow">
                <span className="hx-chat-hero-dot" aria-hidden="true" />
                {t('chat.welcomeEyebrow')}
              </div>

              <h1 className="hx-welcome-title">
                {t('chat.welcomeTitle')}<br />
                <em>{t('chat.welcomeTitleEm')}</em>
              </h1>

              <p className="hx-welcome-subtitle">
                {t('chat.welcomeSubtitle')}
              </p>

              <div className="hx-welcome-input">
                {isLimitReached ? (
                  <PaywallBanner plan={userPlan} resetAt={freeResetAt} />
                ) : (
                  <Composer {...composerProps} />
                )}
              </div>

            </div>
          </div>

          <footer className="hx-welcome-footer">
            {t('chat.disclaimer')}
          </footer>
        </div>
      </div>
    )
  }

  /* ─── CONVERSATION SCREEN ─── */
  return (
    <div className="hx-chat-page">
      <PremiumBackground />
      {mobileOverlay}
      {showBirthForm && (
        <BirthFormModal
          data={birthData}
          onChange={handleBirthDataChange}
          onClose={() => setShowBirthForm(false)}
        />
      )}

      <div className="hx-app-layout">
        {desktopLeft && (
          <aside className="hx-app-sidebar">
            {sidebar}
          </aside>
        )}

        <main className="hx-app-main">
          <div className="hx-app-topbar">
            <div className="hx-app-topbar-left">
              {!desktopLeft && (
                <button
                  type="button"
                  className="hx-icon-btn"
                  onClick={() => setShowLeft(true)}
                  aria-label="Menu"
                >
                  <IconMenu />
                </button>
              )}
            </div>

            {modeSwitch}

            <LanguageSwitcher variant="flag" className="hx-nav-lang" />
          </div>

          <div className="hx-app-feed hx-scroll-soft">
            <div className="hx-app-feed-inner">
              <MessageList messages={messages} isTyping={isTyping} />
            </div>
          </div>

          <div className="hx-app-bottom">
            <div className="hx-app-composer-wrap">
              {isLimitReached ? (
                <PaywallBanner plan={userPlan} resetAt={freeResetAt} />
              ) : (
                <Composer {...composerProps} />
              )}
              {!isLimitReached && (
                <p className="hx-app-disclaimer">
                  {t('chat.disclaimer')}
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}