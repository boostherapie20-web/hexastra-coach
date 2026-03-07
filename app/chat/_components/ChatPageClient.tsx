'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ChatShell from './ChatShell'
import ChatHeader from './ChatHeader'
import Composer from './Composer'
import CosmicBackground from './CosmicBackground'
import LeftSidebar from './LeftSidebar'
import MessageList from './MessageList'
import RightPanel from './RightPanel'
import WelcomeHero from './WelcomeHero'
import {
  DS,
  STORAGE_KEYS,
  cardStyle,
  makeReadingTitle,
  type Mode,
  type Msg,
  type Project,
  type Reading,
} from '../_lib/chat'

const WELCOME_MESSAGE: Msg = {
  id: 'welcome',
  role: 'assistant',
  content: '__welcome__',
  created_at: new Date().toISOString(),
}

export default function ChatPageClient() {
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [messages, setMessages] = useState<Msg[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<Mode>('essentiel')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [readings, setReadings] = useState<Reading[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1600)
  const [userEmail, setUserEmail] = useState('')
  const cacheRef = useRef<Map<string, string>>(new Map())
  const hasPrefilled = useRef(false)

  const isWelcome = useMemo(
    () => messages.length === 1 && messages[0]?.content === '__welcome__',
    [messages],
  )

  const desktopLeft = viewportWidth >= 1180
  const desktopRight = viewportWidth >= 1480

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
  }, [supabase])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onResize = () => setViewportWidth(window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (viewportWidth < 1480) return
    setRightCollapsed(viewportWidth < 1640)
  }, [viewportWidth])

  useEffect(() => {
    try {
      const storedReadings = localStorage.getItem(STORAGE_KEYS.readings)
      const storedProjects = localStorage.getItem(STORAGE_KEYS.projects)
      if (storedReadings) setReadings(JSON.parse(storedReadings))
      if (storedProjects) setProjects(JSON.parse(storedProjects))
    } catch {
      // ignore invalid local storage
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (!q || hasPrefilled.current) return
    hasPrefilled.current = true
    setInput(q)
  }, [searchParams])

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
      const lastAssistant = [...conversation].reverse().find((item) => item.role === 'assistant')
      const firstUser = conversation.find((item) => item.role === 'user')
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
        preview: lastAssistant.content.slice(0, 120),
      }

      persistReadings([reading, ...readings].slice(0, 80))
    },
    [mode, persistReadings, readings],
  )

  const handleNewChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
    setIsTyping(false)
    setConversationId(null)
    setShowLeft(false)
    setShowRight(false)
  }, [])

  const handleCreateProject = useCallback(() => {
    const name = window.prompt('Nom du nouveau projet')?.trim()
    if (!name) return
    const nextProject: Project = { id: `${Date.now()}`, name, collapsed: false }
    persistProjects([...projects, nextProject])
  }, [persistProjects, projects])

  const handleOpenReading = useCallback((reading: Reading) => {
    setMessages([
      {
        id: `reading-${reading.id}`,
        role: 'assistant',
        created_at: reading.date,
        content: `Lecture : ${reading.title}\n\n${reading.preview}`,
      },
    ])
    setShowLeft(false)
    setShowRight(false)
  }, [])

  const handleSend = useCallback(
    async (provided?: string) => {
      const content = (provided ?? input).trim()
      if (!content) return

      const nextUserMessage: Msg = {
        id: `${Date.now()}`,
        role: 'user',
        content,
        created_at: new Date().toISOString(),
      }

      const baseMessages = isWelcome ? [] : messages
      const nextConversation = [...baseMessages, nextUserMessage]

      setMessages(nextConversation)
      setInput('')
      setIsTyping(true)
      setShowLeft(false)
      setShowRight(false)

      if (cacheRef.current.has(content)) {
        const cachedReply = cacheRef.current.get(content)!
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
        }, 220)

        return
      }

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextConversation.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            mode,
            conversationId,
          }),
        })

        const data = await response.json()

        if (data?.conversationId) setConversationId(data.conversationId)
        const reply = data?.reply || 'Une erreur est survenue.'

        if (content.length < 220) {
          cacheRef.current.set(content, reply)
        }

        const assistantMessage: Msg = {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: reply,
          created_at: new Date().toISOString(),
        }

        const finalConversation = [...nextConversation, assistantMessage]
        setMessages(finalConversation)
        setIsTyping(false)
        saveReading(finalConversation)
      } catch (error) {
        console.error('Chat send error:', error)

        const fallbackMessage: Msg = {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content: 'Erreur de connexion. Réessaie dans un instant.',
          created_at: new Date().toISOString(),
        }

        setMessages([...nextConversation, fallbackMessage])
        setIsTyping(false)
      }
    },
    [conversationId, input, isWelcome, messages, mode, saveReading],
  )

  const left = (
    <LeftSidebar
      projects={projects}
      readings={readings}
      onNewChat={handleNewChat}
      onCreateProject={handleCreateProject}
      onOpenReading={handleOpenReading}
    />
  )

  const right = (
    <RightPanel
      mode={mode}
      readings={readings}
      collapsed={rightCollapsed}
      onToggleCollapse={() => setRightCollapsed((value) => !value)}
      onPrompt={(value) => void handleSend(value)}
      onOpenReading={handleOpenReading}
    />
  )

  return (
    <>
      <CosmicBackground />

      <ChatShell
        left={left}
        right={right}
        showLeft={showLeft}
        showRight={showRight}
        onCloseLeft={() => setShowLeft(false)}
        onCloseRight={() => setShowRight(false)}
        desktopLeft={desktopLeft}
        desktopRight={desktopRight}
        header={
          <ChatHeader
            mode={mode}
            onModeChange={setMode}
            onOpenLeft={() => setShowLeft(true)}
            onOpenRight={() => setShowRight(true)}
            desktopLeft={desktopLeft}
            desktopRight={desktopRight}
          />
        }
        body={
          <div style={{ maxWidth: isWelcome ? 1280 : 1080, margin: '0 auto', minHeight: '100%' }}>
            {isWelcome ? (
              <WelcomeHero onPrompt={(value) => void handleSend(value)} />
            ) : (
              <MessageList messages={messages} isTyping={isTyping} />
            )}

            {!isWelcome && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                <div
                  style={cardStyle({
                    maxWidth: 920,
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 999,
                    boxShadow: '0 14px 34px rgba(0,0,0,0.18)',
                    background: 'rgba(255,255,255,0.025)',
                  })}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9,
                        color: 'rgba(212,165,116,0.35)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        border: '1px solid rgba(212,165,116,0.10)',
                        padding: '4px 10px',
                        borderRadius: 999,
                        fontFamily: DS.monoFont,
                      }}
                    >
                      {mode}
                    </div>

                    <p
                      style={{
                        flex: 1,
                        margin: 0,
                        textAlign: 'center',
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.24)',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                      }}
                    >
                      HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.
                    </p>

                    <div style={{ fontSize: 11, color: DS.textFaint }}>
                      {userEmail || 'Session locale'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        }

        composer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Composer
              value={input}
              onChange={setInput}
              onSend={() => void handleSend()}
              onQuickPrompt={(value) => void handleSend(value)}
              showQuickPrompts={!isWelcome}
            />
        
            <div
              style={{
                textAlign: 'center',
                fontSize: 12,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.26)',
                fontStyle: 'italic',
                paddingBottom: 2,
              }}
            >
              HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.
            </div>
          </div>
        }

      <style jsx global>{`
        @media (max-width: 1100px) {
          .hx-welcome-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 860px) {
          .hx-welcome-points {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  )
}
