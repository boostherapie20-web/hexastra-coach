'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  showPremium?: boolean
  cached?: boolean
}

type Step = 1 | 2 | 3 | 4

const STEPS: { step: Step; label: string; desc: string }[] = [
  { step: 1, label: 'Langue & Mode', desc: 'Choix de la langue et activation du mode (Libre ou Praticien)' },
  { step: 2, label: 'Données de naissance', desc: 'Date, heure et lieu pour personnaliser ta lecture' },
  { step: 3, label: 'Microlectures', desc: 'Profil · Année · Mois générés automatiquement' },
  { step: 4, label: 'Exploration', desc: 'Menu, thèmes, sciences et lectures approfondies' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'assistant',
    content: 'Bienvenue.\nJe suis HexAstra Coach.\n\nChoisis ta langue / Choose your language :\nFrançais / English',
    created_at: new Date().toISOString(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showBirthModal, setShowBirthModal] = useState(false)
  const [showPremiumPage, setShowPremiumPage] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [msgCount, setMsgCount] = useState(0)
  const [replyCache, setReplyCache] = useState<Map<string, string>>(new Map())
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '')
    })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-resize textarea
  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 100) + 'px'
    }
  }, [input])

  // Advance step logic
  const advanceStep = useCallback((msgIndex: number) => {
    if (msgIndex >= 2 && currentStep < 2) setCurrentStep(2)
    if (msgIndex >= 4 && currentStep < 3) setCurrentStep(3)
    if (msgIndex >= 6 && currentStep < 4) setCurrentStep(4)
  }, [currentStep])

  const handleSend = useCallback(async (text?: string, birthData?: any) => {
    const content = text || input.trim()
    if (!content && !birthData) return

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: birthData
        ? `Données de naissance : ${birthData.name || ''} · ${birthData.date} · ${birthData.time || 'heure inconnue'} · ${birthData.place || `${birthData.lat}, ${birthData.lon}`}`
        : content,
      created_at: new Date().toISOString(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsTyping(true)
    const newCount = msgCount + 1
    setMsgCount(newCount)
    advanceStep(newMessages.length)

    // Check cache
    const cacheKey = birthData ? JSON.stringify(birthData) : content
    if (replyCache.has(cacheKey) && !birthData) {
      setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: Date.now().toString(), role: 'assistant',
          content: replyCache.get(cacheKey)!,
          created_at: new Date().toISOString(),
          cached: true,
        }])
      }, 400)
      return
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          mode: 'libre',
          birthData: birthData || null,
          conversationId,
        }),
      })
      const data = await res.json()
      if (data.conversationId) setConversationId(data.conversationId)

      const reply = data.reply || 'Une erreur est survenue.'
      setIsTyping(false)

      // Cache simple
      if (!birthData && content.length < 200) {
        setReplyCache(prev => new Map(prev).set(cacheKey, reply))
      }

      // Show premium after 3 free messages
      const showPrem = newCount >= 3 && newCount % 4 === 3

      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
        showPremium: showPrem,
      }])

      advanceStep(newMessages.length + 1)

      // Trigger birth modal if AI asks for birth data
      if (data.needsBirthData) {
        setTimeout(() => setShowBirthModal(true), 800)
      }
    } catch {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: 'Erreur de connexion. Réessaie dans un instant.',
        created_at: new Date().toISOString(),
      }])
    }
  }, [input, messages, conversationId, msgCount, replyCache, advanceStep])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (showPremiumPage) {
    return <PremiumPage onBack={() => setShowPremiumPage(false)} userEmail={userEmail} />
  }

  return (
    <div style={s.root}>
      <div style={s.bgGlow} />

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sbTop}>
          <div style={s.sbHex} />
          <div style={s.sbName}>Hex<span style={s.sbAccent}>Astra</span></div>
        </div>

        <div style={s.sbSectionLabel}>Navigation</div>
        <nav style={s.nav}>
          <button style={{ ...s.navItem, ...s.navActive }}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Chat IA
          </button>
          <button style={s.navItem} onClick={() => router.push('/library')}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            Mes Lectures
          </button>
          <button style={s.navItem} onClick={() => setShowPremiumPage(true)}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Premium
          </button>
        </nav>

        {/* Progression HexAstra — 4 étapes */}
        <div style={s.progressSection}>
          <div style={s.progressLabel}>// Progression</div>
          {STEPS.map(({ step, label, desc }) => {
            const done = currentStep > step
            const active = currentStep === step
            return (
              <div key={step} style={s.stepRow}>
                <div style={{
                  ...s.stepDot,
                  background: done ? 'var(--amber)' : active ? 'transparent' : 'transparent',
                  border: done ? '2px solid var(--amber)' : active ? '2px solid var(--amber)' : '2px solid var(--b2)',
                  boxShadow: active ? '0 0 8px rgba(255,140,0,0.5)' : 'none',
                }}>
                  {done && (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="var(--void)" strokeWidth="3.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  {active && <div style={s.stepDotInner} />}
                </div>
                <div style={s.stepInfo}>
                  <div style={{
                    ...s.stepName,
                    color: done || active ? 'var(--tx1)' : 'var(--tx3)',
                    fontWeight: active ? 500 : 400,
                  }}>{label}</div>
                  {active && <div style={s.stepDesc}>{desc}</div>}
                </div>
                {step < 4 && (
                  <div style={{
                    ...s.stepLine,
                    background: done ? 'var(--amber)' : 'var(--b1)',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        <div style={s.sbBottom}>
          <div style={s.userRow}>
            <div style={s.userAv}>{userEmail[0]?.toUpperCase() || 'U'}</div>
            <div style={s.userEmail}>{userEmail}</div>
          </div>
          <button onClick={handleLogout} style={s.logoutBtn}>Déconnexion</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        {/* Messages */}
        <div style={s.msgs}>
          {messages.map((msg, i) => (
            <div key={msg.id} style={{
              ...s.msgRow,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: `${i * 0.03}s`,
            }}>
              {msg.role === 'assistant' && <div style={s.av}>HA</div>}
              <div style={{ ...s.bub, ...(msg.role === 'user' ? s.bubU : s.bubAI) }}>
                <p style={s.bubTxt}>{msg.content}</p>
                {msg.cached && (
                  <span style={s.cachedBadge}>⚡ Cache</span>
                )}
                {msg.showPremium && (
                  <button onClick={() => setShowPremiumPage(true)} style={s.premBtn}>
                    ✦ Passer à Premium — PDF · Audio · Lectures illimitées →
                  </button>
                )}
                <span style={s.time}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ ...s.msgRow, justifyContent: 'flex-start' }}>
              <div style={s.av}>HA</div>
              <div style={{ ...s.bub, ...s.bubAI, padding: '14px 18px' }}>
                <div style={s.dots}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{ ...s.dot, animationDelay: `${i * 0.18}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div style={s.composerWrap}>
          {/* Titre centré */}
          <div style={s.analyseTitle}>Analyse personnalisée</div>

          <div style={s.compInner}>
            <button
              onClick={() => setShowBirthModal(true)}
              style={s.birthBtn}
              title="Saisir mes données de naissance"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </button>

            <textarea
              ref={taRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
              }}
              placeholder="Pose ta question à HexAstra..."
              rows={1}
              style={s.ta}
            />

            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{ ...s.sendBtn, opacity: !input.trim() || isTyping ? 0.3 : 1 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div style={s.compFooter}>
            <span style={s.compHint}>Entrée pour envoyer · Shift+Entrée pour nouvelle ligne</span>
            <button style={s.premiumHintBtn} onClick={() => setShowPremiumPage(true)}>
              ✦ Premium
            </button>
          </div>
        </div>
      </main>

      {showBirthModal && (
        <BirthModal
          onSubmit={data => { setShowBirthModal(false); handleSend(undefined, data) }}
          onClose={() => setShowBirthModal(false)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PAGE PREMIUM (dédiée, pas de retour landing)
// ─────────────────────────────────────────────────────────────────

function PremiumPage({ onBack, userEmail }: { onBack: () => void; userEmail: string }) {
  const [loading, setLoading] = useState<string | null>(null)

  const checkout = async (priceKey: string) => {
    setLoading(priceKey)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(null)
    }
  }

  const plans = [
    {
      key: 'lecture_unique',
      badge: 'ESSENTIEL',
      name: 'Lecture Unique',
      price: '19',
      desc: 'Une lecture complète PDF personnalisée avec ton thème natal et Human Design.',
      features: ['Lecture PDF complète', 'Thème natal + Human Design', 'Numérologie + Kua', 'Livraison immédiate'],
      cta: 'Obtenir ma lecture',
      accent: false,
    },
    {
      key: 'premium_mensuel',
      badge: 'POPULAIRE',
      name: 'Premium Mensuel',
      price: '29',
      desc: 'Accès illimité aux lectures, audio ElevenLabs, et analyses approfondies.',
      features: ['Lectures illimitées', 'Audio IA (ElevenLabs)', 'PDF haute qualité', 'Toutes les sciences', 'Mode Praticien complet', 'Historique conservé'],
      cta: 'Commencer Premium',
      accent: true,
    },
    {
      key: 'cabinet',
      badge: 'PRO',
      name: 'Cabinet',
      price: '89',
      desc: 'Pour coachs et consultants — analyses clients, rapports exportables.',
      features: ['Tout Premium +', 'Analyses clients illimitées', 'Rapports exportables', 'Mode Cabinet exclusif', 'Support prioritaire'],
      cta: 'Accès Cabinet',
      accent: false,
    },
  ]

  return (
    <div style={pp.root}>
      <div style={pp.bgGlow} />

      {/* Header */}
      <header style={pp.header}>
        <div style={pp.headerLeft}>
          <button onClick={onBack} style={pp.backBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Retour au chat
          </button>
        </div>
        <div style={pp.logo}>
          <div style={pp.logoHex} />
          <span style={pp.logoName}>Hex<span style={{ color: 'var(--amber)' }}>Astra</span></span>
        </div>
        <div style={pp.headerRight}>
          <span style={pp.userBadge}>{userEmail}</span>
        </div>
      </header>

      {/* Hero */}
      <div style={pp.hero}>
        <div style={pp.heroTag}>// ABONNEMENTS & LECTURES</div>
        <h1 style={pp.heroTitle}>Accède à la profondeur<br /><span style={pp.heroAccent}>complète de HexAstra</span></h1>
        <p style={pp.heroSub}>
          Lectures personnalisées par Swiss Ephemeris · Audio IA · Human Design précis · 12 sciences intégrées
        </p>
      </div>

      {/* Plans */}
      <div style={pp.plans}>
        {plans.map(plan => (
          <div key={plan.key} style={{ ...pp.card, ...(plan.accent ? pp.cardAccent : {}) }}>
            {plan.accent && <div style={pp.popularBadge}>✦ Le plus choisi</div>}
            <div style={pp.cardBadge}>{plan.badge}</div>
            <div style={pp.cardName}>{plan.name}</div>
            <div style={pp.cardPrice}>
              <span style={pp.currency}>€</span>
              <span style={pp.amount}>{plan.price}</span>
              <span style={pp.period}>{plan.key === 'lecture_unique' ? '/lecture' : '/mois'}</span>
            </div>
            <p style={pp.cardDesc}>{plan.desc}</p>
            <div style={pp.divider} />
            <ul style={pp.features}>
              {plan.features.map(f => (
                <li key={f} style={pp.feature}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => checkout(plan.key)}
              disabled={loading === plan.key}
              style={{ ...pp.cta, ...(plan.accent ? pp.ctaAccent : {}) }}
            >
              {loading === plan.key ? (
                <span style={pp.ctaLoading}>
                  <span style={pp.ctaSpinner} /> Redirection...
                </span>
              ) : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Garantie */}
      <div style={pp.guarantee}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span style={pp.guaranteeTxt}>Paiement sécurisé Stripe · Satisfaction garantie · Annulation à tout moment</span>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes amberPop { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.75;transform:scale(0.96)} }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// BIRTH MODAL
// ─────────────────────────────────────────────────────────────────

function BirthModal({ onSubmit, onClose }: { onSubmit: (d: any) => void; onClose: () => void }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [timeUnknown, setTimeUnknown] = useState(false)
  const [city, setCity] = useState('')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!date) { setError('La date de naissance est requise.'); return }
    if (!timeUnknown && !time) { setError("Indique l'heure ou coche « heure inconnue »."); return }
    onSubmit({
      name, date, time: timeUnknown ? 'inconnue' : time,
      place: city,
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    })
  }

  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <div style={m.hdr}>
          <div>
            <div style={m.stepLbl}>// Données de naissance</div>
            <h2 style={m.title}>Profil personnel</h2>
          </div>
          <button onClick={onClose} style={m.closeBtn}>✕</button>
        </div>
        <p style={m.sub}>Ces données permettent de calculer ton thème natal, ton Human Design et tes cycles personnels.</p>
        <div style={m.divider} />
        <div style={m.fields}>
          <div style={m.field}>
            <label style={m.label}>Prénom</label>
            <input placeholder="Ton prénom" value={name} onChange={e => setName(e.target.value)} style={m.input} />
          </div>
          <div style={m.field}>
            <label style={m.label}>Date de naissance</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={m.input} />
          </div>
          <div style={m.field}>
            <label style={m.label}>Heure de naissance</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={timeUnknown} style={{ ...m.input, opacity: timeUnknown ? 0.4 : 1 }} />
            <label style={m.checkRow}>
              <input type="checkbox" checked={timeUnknown} onChange={e => setTimeUnknown(e.target.checked)} style={{ accentColor: 'var(--amber)' }} />
              <span style={m.checkTxt}>Heure inconnue (lecture probabiliste)</span>
            </label>
          </div>
          <div style={m.field}>
            <label style={m.label}>Ville de naissance</label>
            <input placeholder="Paris, France" value={city} onChange={e => setCity(e.target.value)} style={m.input} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...m.field, flex: 1 }}>
              <label style={m.label}>Latitude (optionnel)</label>
              <input type="number" placeholder="48.8566" value={lat} onChange={e => setLat(e.target.value)} style={m.input} step="0.0001" />
            </div>
            <div style={{ ...m.field, flex: 1 }}>
              <label style={m.label}>Longitude (optionnel)</label>
              <input type="number" placeholder="2.3522" value={lon} onChange={e => setLon(e.target.value)} style={m.input} step="0.0001" />
            </div>
          </div>
        </div>
        {error && <p style={m.err}>{error}</p>}
        <button onClick={submit} style={m.btn}>
          Lancer ma lecture
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// STYLES — CHAT
// ─────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--deep)', position: 'relative' },
  bgGlow: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 50% 50% at 20% 50%,rgba(255,140,0,0.04),transparent)',
  },
  sidebar: {
    width: '220px', minWidth: '220px', height: '100vh',
    background: 'var(--pitch)', borderRight: '1px solid var(--b1)',
    display: 'flex', flexDirection: 'column', zIndex: 10,
  },
  sbTop: {
    padding: '18px 16px 12px', display: 'flex', alignItems: 'center', gap: '9px',
    borderBottom: '1px solid var(--b1)',
  },
  sbHex: {
    width: '22px', height: '22px', flexShrink: 0, background: 'var(--amber)',
    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
    boxShadow: '0 0 10px rgba(255,140,0,0.4)',
    animation: 'amberPop 4s ease-in-out infinite',
  },
  sbName: { fontFamily: 'var(--f-display)', fontSize: '16px', letterSpacing: '0.1em', color: 'var(--chrome)', textTransform: 'uppercase' },
  sbAccent: { color: 'var(--amber)' },
  sbSectionLabel: { padding: '14px 16px 5px', fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'var(--tx3)', textTransform: 'uppercase' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '6px',
    fontFamily: 'var(--f-ui)', fontSize: '12.5px', color: 'var(--tx3)', transition: 'all 0.18s', textAlign: 'left' as const,
    background: 'transparent', border: 'none', cursor: 'pointer',
  },
  navActive: { color: 'var(--amber)', background: 'rgba(255,140,0,0.07)', borderLeft: '2px solid var(--amber)' },
  navIcon: { width: '13px', height: '13px', opacity: 0.6, flexShrink: 0 },

  // Progression
  progressSection: { padding: '14px 12px 8px', flex: 1 },
  progressLabel: { fontFamily: 'var(--f-mono)', fontSize: '8px', letterSpacing: '0.18em', color: 'var(--tx3)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '4px' },
  stepRow: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '4px', position: 'relative' as const },
  stepDot: {
    width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: '2px', transition: 'all 0.3s',
  },
  stepDotInner: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--amber)' },
  stepLine: {
    position: 'absolute' as const, left: '6px', top: '18px',
    width: '2px', height: '18px', borderRadius: '1px',
  },
  stepInfo: { flex: 1, paddingBottom: '12px' },
  stepName: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.06em', transition: 'color 0.3s' },
  stepDesc: { fontFamily: 'var(--f-ui)', fontSize: '10px', color: 'var(--tx3)', lineHeight: 1.5, marginTop: '3px' },

  sbBottom: { padding: '12px', borderTop: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '8px' },
  userRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  userAv: {
    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
    background: 'var(--lift)', border: '1px solid var(--b2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx2)',
  },
  userEmail: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  logoutBtn: { fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--tx3)', textAlign: 'left' as const, padding: '2px 0', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' },

  // Main
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10 },

  msgs: {
    flex: 1, overflowY: 'auto' as const, padding: '20px 24px',
    display: 'flex', flexDirection: 'column' as const, gap: '12px',
  },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '10px' },
  av: {
    width: '28px', height: '28px', minWidth: '28px',
    background: 'var(--amber)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--f-mono)', fontSize: '6px', fontWeight: 600, color: 'var(--void)',
    marginBottom: '2px', flexShrink: 0,
  },
  bub: { maxWidth: '70%', borderRadius: '12px', padding: '11px 14px', position: 'relative' as const },
  bubU: { background: 'rgba(255,140,0,0.07)', border: '1px solid var(--ab1)', borderBottomRightRadius: '2px', color: 'var(--tx1)' },
  bubAI: { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--b1)', borderBottomLeftRadius: '2px' },
  bubTxt: { fontFamily: 'var(--f-ui)', fontSize: '13.5px', lineHeight: 1.72, color: 'var(--tx2)', whiteSpace: 'pre-wrap' as const, margin: 0 },
  cachedBadge: { display: 'inline-block', fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--tx3)', marginTop: '4px', opacity: 0.6 },
  premBtn: {
    display: 'block', marginTop: '10px', width: '100%',
    background: 'rgba(255,140,0,0.06)', border: '1px solid var(--ab1)',
    color: 'var(--amber)', fontFamily: 'var(--f-mono)', fontSize: '10px',
    letterSpacing: '0.08em', padding: '9px 12px', borderRadius: '5px',
    textTransform: 'uppercase' as const, transition: 'all 0.2s', cursor: 'pointer',
    textAlign: 'left' as const,
  },
  time: { display: 'block', fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--tx3)', marginTop: '5px', textAlign: 'right' as const },
  dots: { display: 'flex', gap: '5px', alignItems: 'center' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--tx3)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },

  // Composer
  composerWrap: {
    padding: '10px 20px 16px', borderTop: '1px solid var(--b1)',
    background: 'rgba(5,5,8,0.6)', backdropFilter: 'blur(16px)', flexShrink: 0,
  },
  analyseTitle: {
    textAlign: 'center' as const, fontFamily: 'var(--f-mono)', fontSize: '9.5px',
    letterSpacing: '0.2em', color: 'var(--tx3)', textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  compInner: {
    display: 'flex', alignItems: 'flex-end', gap: '8px',
    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--b2)',
    borderRadius: '10px', padding: '8px 10px', transition: 'border-color 0.2s',
  },
  birthBtn: {
    width: '28px', height: '28px', flexShrink: 0, borderRadius: '6px',
    background: 'rgba(255,140,0,0.07)', border: '1px solid var(--ab1)',
    color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.2s',
  },
  ta: {
    flex: 1, background: 'transparent', border: 'none',
    color: 'var(--tx1)', fontSize: '13px', lineHeight: '1.55',
    minHeight: '20px', maxHeight: '100px', overflowY: 'auto' as const,
    resize: 'none' as const, padding: '2px 0',
  },
  sendBtn: {
    width: '30px', height: '30px', flexShrink: 0,
    background: 'var(--amber)', borderRadius: '7px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'var(--void)', transition: 'all 0.2s',
    boxShadow: '0 3px 12px rgba(255,140,0,0.25)', cursor: 'pointer',
  },
  compFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: '6px', padding: '0 2px',
  },
  compHint: { fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--tx3)', letterSpacing: '0.06em' },
  premiumHintBtn: {
    fontFamily: 'var(--f-mono)', fontSize: '8.5px', color: 'var(--amber)',
    background: 'transparent', border: 'none', cursor: 'pointer',
    letterSpacing: '0.1em', opacity: 0.8,
  },
}

// ─────────────────────────────────────────────────────────────────
// STYLES — PREMIUM PAGE
// ─────────────────────────────────────────────────────────────────

const pp: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh', background: 'var(--deep)', position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '0 24px 60px',
  },
  bgGlow: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 40% at 50% 20%,rgba(255,140,0,0.05),transparent)',
  },
  header: {
    width: '100%', maxWidth: '1100px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', padding: '20px 0', zIndex: 10,
    borderBottom: '1px solid var(--b1)', marginBottom: '0',
  },
  headerLeft: { flex: 1 },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.1em',
    color: 'var(--tx3)', background: 'transparent', border: 'none',
    cursor: 'pointer', transition: 'color 0.2s',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '9px' },
  logoHex: {
    width: '20px', height: '20px',
    background: 'var(--amber)', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
    boxShadow: '0 0 10px rgba(255,140,0,0.4)',
  },
  logoName: { fontFamily: 'var(--f-display)', fontSize: '16px', letterSpacing: '0.1em', color: 'var(--chrome)', textTransform: 'uppercase' },
  headerRight: { flex: 1, display: 'flex', justifyContent: 'flex-end' },
  userBadge: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)' },

  hero: {
    textAlign: 'center' as const, padding: '60px 0 48px', zIndex: 10,
    maxWidth: '680px', animation: 'fadeUp 0.5s ease both',
  },
  heroTag: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '18px' },
  heroTitle: {
    fontFamily: 'var(--f-display)', fontSize: 'clamp(32px,5vw,56px)',
    letterSpacing: '0.04em', textTransform: 'uppercase',
    color: 'var(--chrome)', lineHeight: 1.1, marginBottom: '18px',
  },
  heroAccent: { color: 'var(--amber)' },
  heroSub: { fontFamily: 'var(--f-ui)', fontSize: '15px', color: 'var(--tx2)', lineHeight: 1.7 },

  plans: {
    display: 'flex', gap: '20px', zIndex: 10, flexWrap: 'wrap' as const,
    justifyContent: 'center', width: '100%', maxWidth: '1100px',
    animation: 'fadeUp 0.6s ease 0.1s both',
  },
  card: {
    flex: '1 1 280px', maxWidth: '340px',
    background: 'var(--pitch)', border: '1px solid var(--b2)',
    borderRadius: '16px', padding: '32px 28px',
    display: 'flex', flexDirection: 'column', gap: '14px',
    position: 'relative' as const, transition: 'border-color 0.2s',
  },
  cardAccent: {
    border: '1px solid var(--ab2)',
    background: 'rgba(255,140,0,0.03)',
    boxShadow: '0 0 40px rgba(255,140,0,0.06)',
  },
  popularBadge: {
    position: 'absolute' as const, top: '-13px', left: '50%', transform: 'translateX(-50%)',
    background: 'var(--amber)', color: 'var(--void)',
    fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em',
    padding: '4px 14px', borderRadius: '20px', whiteSpace: 'nowrap' as const,
  },
  cardBadge: {
    fontFamily: 'var(--f-mono)', fontSize: '8.5px', letterSpacing: '0.2em',
    color: 'var(--amber)', textTransform: 'uppercase',
  },
  cardName: { fontFamily: 'var(--f-display)', fontSize: '22px', letterSpacing: '0.06em', color: 'var(--chrome)', textTransform: 'uppercase' },
  cardPrice: { display: 'flex', alignItems: 'baseline', gap: '3px' },
  currency: { fontFamily: 'var(--f-mono)', fontSize: '18px', color: 'var(--tx2)' },
  amount: { fontFamily: 'var(--f-display)', fontSize: '48px', color: 'var(--chrome)', lineHeight: 1 },
  period: { fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--tx3)' },
  cardDesc: { fontFamily: 'var(--f-ui)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.65 },
  divider: { height: '1px', background: 'var(--b1)' },
  features: { display: 'flex', flexDirection: 'column', gap: '9px', listStyle: 'none', padding: 0, flex: 1 },
  feature: {
    display: 'flex', alignItems: 'center', gap: '9px',
    fontFamily: 'var(--f-ui)', fontSize: '12.5px', color: 'var(--tx2)',
  },
  cta: {
    padding: '13px 20px', width: '100%',
    background: 'rgba(255,140,0,0.07)', border: '1px solid var(--ab1)',
    color: 'var(--amber)', fontFamily: 'var(--f-mono)', fontSize: '10.5px',
    letterSpacing: '0.14em', textTransform: 'uppercase', borderRadius: '6px',
    transition: 'all 0.2s', cursor: 'pointer', marginTop: 'auto',
  },
  ctaAccent: {
    background: 'var(--amber)', color: 'var(--void)', border: '1px solid var(--amber)',
    boxShadow: '0 6px 24px rgba(255,140,0,0.25)',
  },
  ctaLoading: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  ctaSpinner: {
    display: 'inline-block', width: '10px', height: '10px',
    border: '2px solid rgba(0,0,0,0.2)', borderTop: '2px solid currentColor',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },

  guarantee: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginTop: '40px', zIndex: 10,
    padding: '14px 22px', borderRadius: '8px',
    border: '1px solid var(--b1)', background: 'rgba(255,255,255,0.02)',
  },
  guaranteeTxt: { fontFamily: 'var(--f-mono)', fontSize: '10.5px', color: 'var(--tx3)', letterSpacing: '0.06em' },
}

// ─────────────────────────────────────────────────────────────────
// STYLES — BIRTH MODAL
// ─────────────────────────────────────────────────────────────────

const m: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
    backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 100, padding: '24px',
  },
  modal: {
    background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '16px',
    padding: '32px 28px', width: '100%', maxWidth: '420px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
    display: 'flex', flexDirection: 'column', gap: '16px',
    animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
  },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepLbl: { fontFamily: 'var(--f-mono)', fontSize: '8.5px', letterSpacing: '0.18em', color: 'var(--amber)', textTransform: 'uppercase', marginBottom: '5px' },
  title: { fontFamily: 'var(--f-display)', fontSize: '24px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)' },
  closeBtn: { fontFamily: 'var(--f-mono)', fontSize: '14px', color: 'var(--tx3)', padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer' },
  sub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.7 },
  divider: { height: '1px', background: 'var(--b1)' },
  fields: { display: 'flex', flexDirection: 'column', gap: '12px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontFamily: 'var(--f-mono)', fontSize: '8.5px', letterSpacing: '0.14em', color: 'var(--tx3)', textTransform: 'uppercase' },
  input: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)',
    borderRadius: '6px', padding: '9px 12px', color: 'var(--tx1)', fontSize: '13px', width: '100%',
  },
  checkRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', cursor: 'pointer' },
  checkTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)', letterSpacing: '0.06em' },
  err: { fontFamily: 'var(--f-mono)', fontSize: '10.5px', color: '#ff8080' },
  btn: {
    padding: '13px 20px', background: 'var(--amber)', color: 'var(--void)',
    fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.14em',
    textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 6px 24px rgba(255,140,0,0.22)', cursor: 'pointer',
  },
}
