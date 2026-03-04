'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  showPremium?: boolean
}

type JobStatus = 'pending' | 'processing' | 'done' | 'error' | null

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0', role: 'assistant',
    content: "Bienvenue dans votre espace HexAstra.\n\nPosez votre question ou choisissez un thème pour commencer votre lecture.\n\nPour une analyse personnalisée complète, cliquez sur « Démarrer une lecture » et renseignez vos données de naissance.",
    created_at: new Date().toISOString(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [jobStatus, setJobStatus] = useState<JobStatus>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showBirthModal, setShowBirthModal] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email || '')
    })
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  useEffect(() => {
    if (!jobId || jobStatus === 'done' || jobStatus === 'error') return
    const interval = setInterval(async () => {
      const { data } = await supabase.from('job_status').select('status,reading_id').eq('id', jobId).single()
      if (data) {
        setJobStatus(data.status)
        if (data.status === 'done' || data.status === 'error') {
          clearInterval(interval); setIsTyping(false)
        }
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [jobId, jobStatus])

  const handleSend = useCallback(async (birthData?: { birthDateISO: string; lat: number; lon: number }) => {
    const text = input.trim()
    if (!text && !birthData) return

    const userContent = birthData
      ? `Analyse personnalisée · Naissance le ${new Date(birthData.birthDateISO).toLocaleDateString('fr-FR')} · ${birthData.lat}, ${birthData.lon}`
      : text

    setMessages(prev => [...prev, {
      id: Date.now().toString(), role: 'user',
      content: userContent, created_at: new Date().toISOString(),
    }])
    setInput(''); setIsTyping(true); setJobStatus('pending')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userContent, conversationId, birthData: birthData || null }),
      })
      const data = await res.json()
      if (data.jobId) setJobId(data.jobId)
      if (data.conversationId) setConversationId(data.conversationId)

      setTimeout(() => {
        setIsTyping(false); setJobStatus('done')
        setMessages(prev => [...prev, {
          id: Date.now().toString(), role: 'assistant',
          content: birthData
            ? "Votre analyse est en cours de génération à partir de vos données de naissance.\n\nVotre profil révèle une nature profondément introspective, en quête de sens au-delà des apparences. Votre architecture intérieure indique un être conçu pour répondre plutôt qu'initier — une sagesse que notre culture valorise peu, mais qui est une force réelle quand elle est comprise.\n\nSouhaitez-vous approfondir avec une analyse complète PDF + audio ?"
            : "Je vous entends. Pour une analyse personnalisée complète, cliquez sur « Démarrer une lecture » et renseignez vos données de naissance.\n\nJe peux aussi répondre à vos questions sur votre situation actuelle, vos relations ou vos décisions.",
          created_at: new Date().toISOString(),
          showPremium: !!birthData,
        }])
      }, 3000)
    } catch {
      setIsTyping(false); setJobStatus('error')
    }
  }, [input, conversationId])

  const handleLogout = async () => {
    await supabase.auth.signOut(); router.push('/login')
  }

  return (
    <div style={s.root}>
      <div style={s.bgGlow} />

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sbTop}>
          <a href="/" style={s.sbLogoLink} aria-label="HexAstra — Accueil">
            <Image
              src="/logo/hexastra.png"
              alt="HexAstra"
              width={32}
              height={32}
              style={s.sbLogoImg}
            />
          </a>
          <div style={s.sbName}>Hex<span style={s.sbAccent}>Astra</span></div>
        </div>

        <div style={s.sbSectionLabel}>Navigation</div>
        <nav style={s.nav}>
          <button style={{ ...s.navItem, ...s.navActive }}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Votre analyse
          </button>
          <button style={s.navItem} onClick={() => router.push('/library')}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Mes lectures
          </button>
        </nav>

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
        <header style={s.header}>
          <div>
            <h1 style={s.headerTitle}>Votre analyse</h1>
            {jobStatus && jobStatus !== 'done' && (
              <div style={s.statusRow}>
                <span style={s.spinner} />
                <span style={s.statusTxt}>
                  {jobStatus === 'pending' ? 'En attente...' : 'Analyse en cours...'}
                </span>
              </div>
            )}
          </div>
          <button onClick={() => setShowBirthModal(true)} style={s.newBtn}>
            + Démarrer une lecture
          </button>
        </header>

        <div style={s.msgs}>
          {messages.map((msg, i) => (
            <div key={msg.id} style={{
              ...s.msgRow,
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
              animationDelay: `${i * 0.04}s`,
            }}>
              {msg.role === 'assistant' && (
                <div style={s.av}>
                  <Image src="/logo/hexastra.png" alt="HexAstra" width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
              )}
              <div style={{ ...s.bub, ...(msg.role === 'user' ? s.bubU : s.bubAI) }}>
                <p style={s.bubTxt}>{msg.content}</p>
                {msg.showPremium && (
                  <button
                    onClick={() => fetch('/api/stripe/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ priceKey: 'premium_reading' }),
                    }).then(r => r.json()).then(d => d.url && window.open(d.url))}
                    style={s.premBtn}
                  >
                    Débloquer ma lecture complète — 19 EUR →
                  </button>
                )}
                <span style={s.time}>{new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={{ ...s.msgRow, justifyContent: 'flex-start' }}>
              <div style={s.av}>
                <Image src="/logo/hexastra.png" alt="HexAstra" width={32} height={32} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={{ ...s.bub, ...s.bubAI, padding: '14px 16px' }}>
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

        <div style={s.composer}>
          <div style={s.compInner}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Posez votre question… (Entrée pour envoyer)"
              rows={1} style={s.ta}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{ ...s.sendBtn, opacity: !input.trim() || isTyping ? 0.35 : 1 }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {showBirthModal && (
        <BirthModal
          onSubmit={data => { setShowBirthModal(false); handleSend(data) }}
          onClose={() => setShowBirthModal(false)}
        />
      )}
    </div>
  )
}

function BirthModal({ onSubmit, onClose }: { onSubmit: (d: any) => void; onClose: () => void }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!date || !time || !lat || !lon) { setError('Tous les champs sont requis.'); return }
    const latN = parseFloat(lat), lonN = parseFloat(lon)
    if (isNaN(latN) || latN < -90 || latN > 90) { setError('Latitude invalide.'); return }
    if (isNaN(lonN) || lonN < -180 || lonN > 180) { setError('Longitude invalide.'); return }
    onSubmit({ birthDateISO: `${date}T${time}:00Z`, lat: latN, lon: lonN, city })
  }

  return (
    <div style={m.overlay}>
      <div style={m.modal}>
        <div style={m.hdr}>
          <div>
            <div style={m.stepLbl}>// Étape 1 sur 3</div>
            <h2 style={m.title}>VOS INFORMATIONS</h2>
            <p style={m.hdrSub}>Date, heure et lieu de naissance permettent à HexAstra de créer votre profil.</p>
          </div>
          <button onClick={onClose} style={m.closeBtn}>✕</button>
        </div>

        <div style={m.divider} />

        <div style={m.fields}>
          <div style={m.field}>
            <label style={m.label}>Date de naissance</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={m.input} />
          </div>
          <div style={m.row2}>
            <div style={m.field}>
              <label style={m.label}>Heure (UTC)</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={m.input} />
            </div>
            <div style={m.field}>
              <label style={m.label}>Fuseau horaire</label>
              <input type="text" placeholder="Europe/Paris" style={m.input} />
            </div>
          </div>
          <div style={m.row2}>
            <div style={m.field}>
              <label style={m.label}>Latitude</label>
              <input type="number" placeholder="48.8566" value={lat} onChange={e => setLat(e.target.value)} style={m.input} step="0.0001" />
            </div>
            <div style={m.field}>
              <label style={m.label}>Longitude</label>
              <input type="number" placeholder="2.3522" value={lon} onChange={e => setLon(e.target.value)} style={m.input} step="0.0001" />
            </div>
          </div>
          <div style={m.field}>
            <label style={m.label}>Ville (optionnel)</label>
            <input type="text" placeholder="Paris, France" value={city} onChange={e => setCity(e.target.value)} style={m.input} />
          </div>
        </div>

        {error && <p style={m.err}>{error}</p>}

        <button onClick={submit} style={m.btn}>
          Lancer mon analyse
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--deep)', position: 'relative' },
  bgGlow: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 50% 50% at 25% 50%,rgba(31,175,140,0.04),transparent)' },
  sidebar: { width: '216px', minWidth: '216px', height: '100vh', background: 'var(--pitch)', borderRight: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', zIndex: 10, overflow: 'hidden' },
  sbTop: { padding: '18px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--b1)' },
  sbLogoLink: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  sbLogoImg: { width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(31,175,140,0.5))', borderRadius: '50%' },
  sbName: { fontFamily: 'var(--f-display)', fontSize: '16px', letterSpacing: '0.1em', color: 'var(--chrome)', textTransform: 'uppercase' },
  sbAccent: { color: 'var(--emerald)' },
  sbSectionLabel: { padding: '16px 16px 6px', fontFamily: 'var(--f-mono)', fontSize: '8.5px', letterSpacing: '0.16em', color: 'var(--tx3)', textTransform: 'uppercase' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '6px', fontFamily: 'var(--f-ui)', fontSize: '12.5px', color: 'var(--tx3)', transition: 'all 0.18s', textAlign: 'left' as const, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%' },
  navActive: { color: 'var(--emerald)', background: 'rgba(31,175,140,0.07)', borderLeft: '2px solid var(--emerald)' },
  navIcon: { width: '13px', height: '13px', opacity: 0.6, flexShrink: 0 } as React.CSSProperties,
  sbBottom: { padding: '14px', borderTop: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', gap: '10px' },
  userRow: { display: 'flex', alignItems: 'center', gap: '9px' },
  userAv: { width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: 'var(--lift)', border: '1px solid var(--b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx2)' },
  userEmail: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  logoutBtn: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)', textAlign: 'left' as const, padding: '3px 0', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10 },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid var(--b1)', background: 'rgba(10,10,16,0.7)', backdropFilter: 'blur(20px)', flexShrink: 0 },
  headerTitle: { fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--chrome)' },
  statusRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' },
  spinner: { display: 'inline-block', width: '8px', height: '8px', border: '1.5px solid rgba(31,175,140,0.25)', borderTop: '1.5px solid var(--emerald)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  statusTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)', letterSpacing: '0.08em' },
  newBtn: { background: 'rgba(31,175,140,0.08)', border: '1px solid rgba(31,175,140,0.25)', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.1em', padding: '8px 16px', borderRadius: '4px', whiteSpace: 'nowrap' as const, cursor: 'pointer', transition: 'all 0.2s' },
  msgs: { flex: 1, overflowY: 'auto' as const, padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '14px' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '10px' },
  av: { width: '32px', height: '32px', minWidth: '32px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(31,175,140,0.35)', boxShadow: '0 0 12px rgba(31,175,140,0.25)', marginBottom: '2px' },
  bub: { maxWidth: '68%', borderRadius: '12px', padding: '12px 15px', position: 'relative' as const },
  bubU: { background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.1)', borderBottomRightRadius: '2px' },
  bubAI: { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b1)', borderBottomLeftRadius: '2px' },
  bubTxt: { fontFamily: 'var(--f-ui)', fontSize: '13.5px', lineHeight: 1.72, color: 'var(--tx2)', whiteSpace: 'pre-wrap' as const },
  premBtn: { display: 'block', marginTop: '12px', width: '100%', background: 'rgba(31,175,140,0.08)', border: '1px solid rgba(31,175,140,0.25)', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.1em', padding: '10px 14px', borderRadius: '4px', textTransform: 'uppercase' as const, cursor: 'pointer' },
  time: { display: 'block', fontFamily: 'var(--f-mono)', fontSize: '8.5px', color: 'var(--tx3)', marginTop: '5px', textAlign: 'right' as const },
  dots: { display: 'flex', gap: '5px', alignItems: 'center' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--tx3)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },
  composer: { padding: '12px 20px 18px', borderTop: '1px solid var(--b1)', background: 'rgba(5,5,8,0.5)', backdropFilter: 'blur(12px)', flexShrink: 0 },
  compInner: { display: 'flex', alignItems: 'flex-end', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '11px 14px' },
  ta: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--tx1)', fontSize: '13.5px', lineHeight: '1.55', minHeight: '22px', maxHeight: '120px', overflowY: 'auto' as const, resize: 'none' as const, fontFamily: 'var(--f-ui)' },
  sendBtn: { width: '32px', height: '32px', flexShrink: 0, background: 'var(--emerald)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--void)', boxShadow: '0 4px 14px rgba(31,175,140,0.3)', transition: 'all 0.2s', border: 'none', cursor: 'pointer' },
}

const m: Record<string, React.CSSProperties> = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' },
  modal: { background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '440px', boxShadow: '0 40px 100px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '18px', animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both' },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepLbl: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '6px' },
  title: { fontFamily: 'var(--f-display)', fontSize: '26px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', marginBottom: '6px' },
  hdrSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.6 },
  closeBtn: { fontFamily: 'var(--f-mono)', fontSize: '14px', color: 'var(--tx3)', padding: '4px 8px', background: 'transparent', border: 'none', cursor: 'pointer', marginTop: '-2px' },
  divider: { height: '1px', background: 'var(--b1)' },
  fields: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--tx3)', textTransform: 'uppercase' },
  input: { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)', borderRadius: '6px', padding: '10px 13px', color: 'var(--tx1)', fontSize: '13.5px', width: '100%', outline: 'none', transition: 'border-color 0.2s', fontFamily: 'var(--f-ui)' },
  err: { fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#ff8080' },
  btn: { padding: '14px 20px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 28px rgba(31,175,140,0.25)', border: 'none', cursor: 'pointer' },
}
