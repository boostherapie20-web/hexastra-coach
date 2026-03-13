'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PremiumBackground from '@/app/components/PremiumBackground'
import { createClient } from '@/lib/supabase/client'
import Composer from './Composer'
import LeftSidebar from './LeftSidebar'
import MessageList from './MessageList'
import BirthFormModal from './BirthFormModal'
import BirthDataInlineForm from './BirthDataInlineForm'
import PractitionerUsageStep from './PractitionerUsageStep'
import PaywallBanner from './PaywallBanner'
import {
  STORAGE_KEYS,
  EMPTY_BIRTH_DATA,
  makeReadingTitle,
  type Msg,
  type Project,
  type Reading,
  type BirthData,
} from '../_lib/chat'
import {
  FREE_USAGE_STORAGE_KEY,
  FREE_USAGE_FIRST_MSG_KEY,
  canContinueChat,
  isFreePlan,
  type PlanKey,
} from '@/lib/plans'
import {
  computeBootstrapStep,
  isBirthDataComplete,
} from '@/lib/chat/bootstrapMachine'
import { getEntitlements } from '@/lib/chat/entitlements'
import {
  loadMicroReadings,
  markProfileDone,
  markYearDone,
  markMonthDone,
} from '@/lib/chat/microReadingScheduler'
import {
  buildChatPayload,
  type RequestType,
  type ChatMessage,
} from '@/lib/chat/chatPayloadBuilder'
import {
  PRACTITIONER_USAGE_KEY,
  type MicroReadings,
  type PractitionerUsage,
} from '@/lib/chat/bootstrapTypes'
import { routeUserQuery } from '@/lib/chat/queryRouter'
import {
  loadEvolutionProfile,
  saveEvolutionProfile,
} from '@/lib/stores/userEvolutionStore'
import type { UserEvolutionProfile } from '@/types/evolution'
import { useChatLanguage, useTranslation } from '@/lib/i18n/useTranslation'
import LanguageSwitcher from '@/app/components/LanguageSwitcher'

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
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')
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
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [readings, setReadings] = useState<Reading[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [showLeft, setShowLeft] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1600)
  const [userEmail, setUserEmail] = useState('')

  const [birthData, setBirthData] = useState<BirthData>(EMPTY_BIRTH_DATA)
  const [showBirthForm, setShowBirthForm] = useState(false)
  const [attachedFile, setAttachedFile] = useState<File | null>(null)

  /** Plan loaded from Supabase user_metadata.plan */
  const [userPlan, setUserPlan] = useState<PlanKey>('free')
  const [planLoaded, setPlanLoaded] = useState(false)

  /** Practitioner usage: personal vs client */
  const [practitionerUsage, setPractitionerUsage] = useState<PractitionerUsage>(null)

  /** Micro-readings completion state */
  const [microReadings, setMicroReadings] = useState<MicroReadings>({
    profileKey: null,
    yearKey: null,
    monthKey: null,
  })

  /** Evolution profile — loaded from localStorage, updated after each exchange */
  const [evolutionProfile, setEvolutionProfile] = useState<UserEvolutionProfile | null>(null)

  /** Free plan usage tracking */
  const [freeMessagesUsed, setFreeMessagesUsed] = useState(0)
  const [freeResetAt, setFreeResetAt] = useState<Date | null>(null)

  const cacheRef = useRef<Map<string, string>>(new Map())
  const hasPrefilled = useRef(false)
  const microTriggerRef = useRef<string | null>(null)

  // ── Derived state ─────────────────────────────────────────────────────────

  /** Mode auto-derived from plan — never user-selectable */
  const mode = planLoaded ? getEntitlements(userPlan).chatMode : 'essentiel'

  const step = computeBootstrapStep({
    planLoaded,
    plan: userPlan,
    practitionerUsage,
    birthData,
    microReadings,
  })

  const isWelcome = useMemo(
    () => messages.length === 1 && messages[0]?.content === '__welcome__',
    [messages]
  )

  const desktopLeft = viewportWidth >= 1100
  const userInitials = getInitials(userEmail)
  const isLimitReached = isFreePlan(userPlan) && !canContinueChat(userPlan, freeMessagesUsed)

  // ── Init effects ──────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return
      if (data.user?.email) setUserEmail(data.user.email)
      const plan = (data.user?.user_metadata?.plan as PlanKey) ?? 'free'
      setUserPlan(plan)
      setPlanLoaded(true)
      // Sync plan (and language) into evolution profile
      setEvolutionProfile((prev) => {
        const updated = { ...(prev ?? {}), plan }
        saveEvolutionProfile(updated)
        return updated
      })
    })
    return () => { mounted = false }
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

  useEffect(() => {
    setMicroReadings(loadMicroReadings())
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRACTITIONER_USAGE_KEY)
      if (stored === 'personal' || stored === 'client') {
        setPractitionerUsage(stored)
      }
    } catch { /* noop */ }
  }, [])

  useEffect(() => {
    const profile = loadEvolutionProfile()
    if (profile) setEvolutionProfile(profile)
  }, [])

  useEffect(() => {
    try {
      const storedReadings = localStorage.getItem(STORAGE_KEYS.readings)
      const storedProjects = localStorage.getItem(STORAGE_KEYS.projects)
      if (storedReadings) {
        const parsed = JSON.parse(storedReadings)
        if (Array.isArray(parsed)) setReadings(parsed.filter(isValidReading))
      }
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects)
        if (Array.isArray(parsed)) setProjects(parsed.filter(isValidProject))
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

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true)
      // Auto-dismiss after 6 s
      const t = setTimeout(() => setPaymentSuccess(false), 6000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  /** Sync free plan usage counter */
  useEffect(() => {
    if (!isFreePlan(userPlan)) return
    try {
      const firstMsgRaw = localStorage.getItem(FREE_USAGE_FIRST_MSG_KEY)
      if (firstMsgRaw) {
        const firstMsgTime = new Date(firstMsgRaw).getTime()
        const resetAt = new Date(firstMsgTime + 24 * 60 * 60 * 1000)
        if (Date.now() >= resetAt.getTime()) {
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

  // ── Auto-trigger micro-readings ───────────────────────────────────────────

  useEffect(() => {
    if (
      step !== 'micro_profile_pending' &&
      step !== 'micro_year_pending' &&
      step !== 'micro_month_pending'
    ) return

    // Avoid double-triggering the same step
    if (microTriggerRef.current === step) return
    microTriggerRef.current = step

    const requestType: RequestType =
      step === 'micro_profile_pending' ? 'micro_profile' :
      step === 'micro_year_pending'    ? 'micro_year'    :
      'micro_month'

    void triggerMicroReading(requestType)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const handleBirthDataChange = useCallback((next: BirthData) => {
    setBirthData(next)
    try { localStorage.setItem(STORAGE_KEYS.birthData, JSON.stringify(next)) } catch { /* noop */ }
  }, [])

  const handleBirthDataSave = useCallback((next: BirthData) => {
    handleBirthDataChange(next)
    // Reset micro-readings so they regenerate for the new profile
    const reset = loadMicroReadings()
    setMicroReadings({ ...reset, profileKey: null })
    microTriggerRef.current = null
    // Sync firstName to evolution profile so the AI always knows the user's name
    if (next.firstName) {
      setEvolutionProfile((prev) => {
        const updated = { ...(prev ?? {}), firstName: next.firstName }
        saveEvolutionProfile(updated)
        return updated
      })
    }
  }, [handleBirthDataChange])

  const handlePractitionerUsageSelect = useCallback((usage: PractitionerUsage) => {
    setPractitionerUsage(usage)
    try { localStorage.setItem(PRACTITIONER_USAGE_KEY, usage ?? '') } catch { /* noop */ }
  }, [])

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
      const lastAssistant = [...conversation].reverse().find((m) => m.role === 'assistant')
      const firstUser = conversation.find((m) => m.role === 'user')
      if (!lastAssistant || !firstUser) return

      const reading: Reading = {
        id: `${Date.now()}`,
        title: makeReadingTitle(firstUser.content),
        science:
          mode === 'essentiel' ? 'Mode Essentiel' :
          mode === 'premium'   ? 'Mode Premium' :
          'Mode Praticien',
        date: new Date().toISOString(),
        preview: lastAssistant.content.slice(0, 220),
      }
      persistReadings([reading, ...readings].slice(0, 80))
    },
    [mode, persistReadings, readings]
  )

  // ── Micro-reading auto-call ───────────────────────────────────────────────

  async function triggerMicroReading(requestType: RequestType) {
    if (isTyping) return
    setIsTyping(true)

    // Show a loading placeholder in the chat
    const loadingId = `${Date.now()}-micro-loading`
    setMessages((prev) => {
      const base = prev[0]?.content === '__welcome__' ? [] : prev
      return [
        ...base,
        {
          id: loadingId,
          role: 'assistant' as const,
          content: '__loading_micro__',
          created_at: new Date().toISOString(),
        },
      ]
    })

    const historyMsgs: ChatMessage[] = []

    const payload = buildChatPayload({
      requestType,
      plan: userPlan,
      birthData,
      practitionerUsage,
      chatLanguage,
      conversationId,
      messages: historyMsgs,
    })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      const reply = typeof data?.reply === 'string' ? data.reply : ''

      setMessages((prev) => {
        const without = prev.filter((m) => m.id !== loadingId)
        if (!reply) return without
        return [
          ...without,
          {
            id: `${Date.now()}-micro`,
            role: 'assistant' as const,
            content: reply,
            created_at: new Date().toISOString(),
          },
        ]
      })

      if (data?.conversationId) setConversationId(data.conversationId)

      // Mark the reading as done and allow the next step
      setMicroReadings((prev) => {
        let next: MicroReadings
        if (requestType === 'micro_profile') next = markProfileDone(prev, birthData)
        else if (requestType === 'micro_year')    next = markYearDone(prev)
        else                                       next = markMonthDone(prev)
        microTriggerRef.current = null
        return next
      })
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId))
      microTriggerRef.current = null
    } finally {
      setIsTyping(false)
    }
  }

  // ── Normal chat send ──────────────────────────────────────────────────────

  const handleSend = useCallback(
    async (provided?: string) => {
      const baseContent = (provided ?? input).trim()
      const attachNote = attachedFile ? `\n\n[Pièce jointe : ${attachedFile.name}]` : ''
      const content = baseContent + attachNote
      if (!content.trim() || isTyping) return
      if (step !== 'conversation_ready') return
      if (!canContinueChat(userPlan, freeMessagesUsed)) return

      // ── Couche 2 : domain guard ─────────────────────────────────────────
      const routeResult = routeUserQuery(baseContent)
      if (routeResult.decision !== 'allowed') {
        const baseMessages = isWelcome ? [] : messages
        const userMsg: Msg = {
          id: `${Date.now()}-user`,
          role: 'user',
          content,
          created_at: new Date().toISOString(),
        }
        setMessages([
          ...baseMessages,
          userMsg,
          {
            id: `${Date.now()}-guard`,
            role: 'assistant',
            content: routeResult.message,
            created_at: new Date().toISOString(),
          },
        ])
        setInput('')
        setAttachedFile(null)
        return
      }
      // ────────────────────────────────────────────────────────────────────

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
        setTimeout(() => {
          const final = [...nextConversation, assistantMessage]
          setMessages(final)
          setIsTyping(false)
          saveReading(final)
        }, 180)
        return
      }

      const historyMsgs: ChatMessage[] = nextConversation.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const payload = buildChatPayload({
        requestType: 'chat',
        plan: userPlan,
        birthData,
        practitionerUsage,
        chatLanguage,
        conversationId,
        messages: historyMsgs,
        evolutionProfile,
      })

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        // Session expired — redirect to auth
        if (response.status === 401) {
          window.location.href = '/auth?reason=session_expired'
          return
        }

        const data = await response.json()
        const reply = typeof data?.reply === 'string' ? data.reply : 'Une erreur est survenue.'

        const assistantMessage: Msg = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: reply,
          created_at: new Date().toISOString(),
        }

        const final = [...nextConversation, assistantMessage]
        setMessages(final)
        setIsTyping(false)
        cacheRef.current.set(content, reply)
        setConversationId(data?.conversationId ?? null)
        saveReading(final)

        // Persist updated evolution profile returned by the server
        if (data?.updatedEvolutionProfile) {
          setEvolutionProfile(data.updatedEvolutionProfile)
          saveEvolutionProfile(data.updatedEvolutionProfile)
        }

        if (isFreePlan(userPlan)) {
          const next = freeMessagesUsed + 1
          setFreeMessagesUsed(next)
          try {
            localStorage.setItem(FREE_USAGE_STORAGE_KEY, String(next))
            if (!localStorage.getItem(FREE_USAGE_FIRST_MSG_KEY)) {
              localStorage.setItem(FREE_USAGE_FIRST_MSG_KEY, new Date().toISOString())
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
            content: "Je n'ai pas pu terminer la lecture pour le moment. Réessaie dans quelques instants.",
            created_at: new Date().toISOString(),
          },
        ])
        setIsTyping(false)
      }
    },
    [
      attachedFile, birthData, chatLanguage, conversationId, evolutionProfile,
      freeMessagesUsed, input, isTyping, isWelcome,
      messages, mode, practitionerUsage, saveReading, step, userPlan,
    ]
  )

  const handleNewReading = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setConversationId(null)
    setInput('')
    microTriggerRef.current = null
  }, [])

  const handleCreateProject = useCallback(() => {
    const name = window.prompt('Nom du projet')?.trim()
    if (!name) return
    persistProjects([...projects, { id: `${Date.now()}`, name, collapsed: false }])
  }, [persistProjects, projects])

  const handleAssignReadingToProject = useCallback(
    (readingId: string, projectId: string) => {
      persistReadings(readings.map((r) => r.id === readingId ? { ...r, projectId } : r))
    },
    [persistReadings, readings]
  )

  const handleOpenReading = useCallback((reading: Reading) => {
    setMessages([{
      id: `reading-${reading.id}`,
      role: 'assistant',
      content: `Lecture sauvegardée\n\n${reading.preview}`,
      created_at: reading.date,
    }])
    setShowLeft(false)
  }, [])

  // ── Shared sub-components ─────────────────────────────────────────────────

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

  const mobileOverlay = (isWelcome ? showLeft : (!desktopLeft && showLeft)) ? (
    <div className="hx-chat-overlay" onClick={() => setShowLeft(false)} role="presentation">
      <aside
        className="hx-chat-mobile-sheet hx-chat-mobile-sheet-left hx-chat-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {sidebar}
      </aside>
    </div>
  ) : null

  /** Bootstrap overlay content (shown before conversation_ready) */
  const bootstrapOverlay = (() => {
    if (step === 'loading') return null

    if (step === 'birthdata_missing') {
      return (
        <div className="hx-bootstrap-overlay">
          <BirthDataInlineForm
            data={birthData}
            onSave={handleBirthDataSave}
          />
        </div>
      )
    }

    if (step === 'practitioner_usage_needed') {
      return (
        <div className="hx-bootstrap-overlay">
          <PractitionerUsageStep onSelect={handlePractitionerUsageSelect} />
        </div>
      )
    }

    return null
  })()

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
    highlightBirth: isWelcome && !isBirthDataComplete(birthData),
    disabled: step !== 'conversation_ready' || isLimitReached,
  }

  // ── WELCOME SCREEN ────────────────────────────────────────────────────────
  if (isWelcome && step !== 'conversation_ready') {
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
              <button type="button" className="hx-icon-btn" onClick={() => setShowLeft(true)} aria-label="Historique">
                <IconMenu />
              </button>
            </div>
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

              <p className="hx-welcome-subtitle">{t('chat.welcomeSubtitle')}</p>

              <div className="hx-welcome-input">
                {bootstrapOverlay ?? (
                  isLimitReached
                    ? <PaywallBanner plan={userPlan} resetAt={freeResetAt} />
                    : <Composer {...composerProps} />
                )}
              </div>
            </div>
          </div>

          <footer className="hx-welcome-footer">{t('chat.disclaimer')}</footer>
        </div>
      </div>
    )
  }

  // ── WELCOME → transition to conversation after bootstrap ──────────────────
  if (isWelcome && step === 'conversation_ready') {
    return (
      <div className="hx-chat-page">
        <PremiumBackground />
        {mobileOverlay}

        <div className="hx-welcome-screen">
          <header className="hx-welcome-nav">
            <div className="hx-welcome-nav-brand">
              <button type="button" className="hx-icon-btn" onClick={() => setShowLeft(true)} aria-label="Historique">
                <IconMenu />
              </button>
            </div>
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
              <p className="hx-welcome-subtitle">{t('chat.welcomeSubtitle')}</p>
              <div className="hx-welcome-input">
                {isLimitReached
                  ? <PaywallBanner plan={userPlan} resetAt={freeResetAt} />
                  : <Composer {...composerProps} />
                }
              </div>
            </div>
          </div>
          <footer className="hx-welcome-footer">{t('chat.disclaimer')}</footer>
        </div>
      </div>
    )
  }

  // ── CONVERSATION SCREEN ───────────────────────────────────────────────────
  return (
    <div className="hx-chat-page">
      <PremiumBackground />
      {paymentSuccess && (
        <div className="hx-payment-success-banner" role="status">
          <span>✦</span>
          <span>Paiement confirmé — votre abonnement est activé.</span>
          <button type="button" onClick={() => setPaymentSuccess(false)} aria-label="Fermer">✕</button>
        </div>
      )}
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
          <aside className="hx-app-sidebar">{sidebar}</aside>
        )}

        <main className="hx-app-main">
          <div className="hx-app-topbar">
            <div className="hx-app-topbar-left">
              {!desktopLeft && (
                <button type="button" className="hx-icon-btn" onClick={() => setShowLeft(true)} aria-label="Menu">
                  <IconMenu />
                </button>
              )}
            </div>
            <LanguageSwitcher variant="flag" className="hx-nav-lang" />
          </div>

          <div className="hx-app-feed hx-scroll-soft">
            <div className="hx-app-feed-inner">
              <MessageList messages={messages} isTyping={isTyping} />
            </div>
          </div>

          <div className="hx-app-bottom">
            <div className="hx-app-composer-wrap">
              {bootstrapOverlay ?? (
                isLimitReached
                  ? <PaywallBanner plan={userPlan} resetAt={freeResetAt} />
                  : <Composer {...composerProps} />
              )}
              {!isLimitReached && !bootstrapOverlay && (
                <p className="hx-app-disclaimer">{t('chat.disclaimer')}</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
