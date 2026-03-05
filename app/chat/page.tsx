'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

type Mode = 'libre' | 'praticien'

type BirthData = {
  date: string
  time: string
  place: string
}

function HexLogo({ size = 28 }: { size?: number; color?: string }) {
  return (
    <img
      src="/logo/hexastra-logo-transparent.png"
      alt="HexAstra"
      style={{ width: size, height: size, display: 'block', objectFit: 'contain' }}
    />
  )
}

const CHIPS_DEFAULT = [
  'Je me sens bloqué en ce moment',
  'Décision importante à prendre',
  'Relation confuse',
  'Direction de vie',
]

function makeWelcome(mode: Mode): Message {
  return {
    id: '0',
    role: 'assistant',
    content: mode === 'praticien'
      ? 'Bienvenue dans le mode Praticien.\n\nPour analyser le profil d\'un client, partagez sa date de naissance, heure et lieu — ou décrivez sa situation.'
      : 'Bienvenue. Dis-moi ce que tu veux éclaircir aujourd\'hui.\n\nSi tu veux une analyse personnalisée, clique sur "Nouvelle analyse" et entre tes données de naissance.',
    created_at: new Date().toISOString(),
  }
}

// ── Birth Modal ──────────────────────────────────────────────────────────────
function BirthModal({ onSubmit, onClose }: {
  onSubmit: (d: BirthData) => void
  onClose: () => void
}) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('12:00')
  const [place, setPlace] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!date) { setError('La date de naissance est requise.'); return }
    if (!place.trim()) { setError('Le lieu de naissance est requis.'); return }
    onSubmit({ date, time, place })
  }

  return (
    <div style={m.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={m.modal}>
        <div style={m.hdr}>
          <div>
            <div style={m.tag}>// Nouvelle analyse</div>
            <h2 style={m.title}>DONNÉES DE NAISSANCE</h2>
          </div>
          <button onClick={onClose} style={m.closeBtn}>✕</button>
        </div>
        <p style={m.sub}>Ces informations permettent de calculer ton thème natal et ton profil Human Design avec précision.</p>
        <div style={m.divider} />
        <div style={m.fields}>
          <div style={m.field}>
            <label style={m.label}>Date de naissance *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={m.input} />
          </div>
          <div style={m.field}>
            <label style={m.label}>Heure de naissance</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={m.input} />
            <span style={m.hint}>Si inconnue, laisse 12:00</span>
          </div>
          <div style={m.field}>
            <label style={m.label}>Lieu de naissance *</label>
            <input
              type="text"
              placeholder="Paris, France"
              value={place}
              onChange={e => setPlace(e.target.value)}
              style={m.input}
            />
          </div>
        </div>
        {error && <p style={m.err}>{error}</p>}
        <button onClick={submit} style={m.btn}>
          Lancer l'analyse
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>
        <p style={m.note}>Tes données ne sont jamais partagées · Analyse locale uniquement</p>
      </div>
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('libre')
  const [messages, setMessages] = useState<Message[]>([makeWelcome('libre')])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [chips, setChips] = useState<string[]>(CHIPS_DEFAULT)
  const [stage, setStage] = useState(0)
  const [showBirth, setShowBirth] = useState(false)
  const [birthData, setBirthData] = useState<BirthData | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (taRef.current) {
      taRef.current.style.height = 'auto'
      taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  // Mode change resets conversation
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setMessages([makeWelcome(newMode)])
    setStage(0)
    setChips(CHIPS_DEFAULT)
    setThreadId(null)
  }

  const handleNewAnalysis = () => {
    setShowBirth(true)
  }

  const handleBirthSubmit = (data: BirthData) => {
    setBirthData(data)
    setShowBirth(false)
    const msg = `Je veux une analyse personnalisée. Né(e) le ${data.date} à ${data.time}, à ${data.place}.`
    send(msg, data)
  }

  const send = useCallback(async (text: string, birth?: BirthData) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    }

    const newMsgs = [...messages, userMsg]
    setMessages(newMsgs)
    setInput('')
    setLoading(true)
    setStage(s => Math.min(s + 1, 3))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          threadId,
          mode,
          birthData: birth || birthData || null,
        }),
      })
      const data = await res.json()

      if (data.threadId) setThreadId(data.threadId)
      if (data.chips?.length) setChips(data.chips)
      if (data.needsBirthData) setShowBirth(true)

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.reply ?? '…',
        created_at: new Date().toISOString(),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Erreur de connexion. Réessayez dans un instant.',
        created_at: new Date().toISOString(),
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading, threadId, mode, birthData])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const STAGES = ['Exploration', 'Clarification', 'Synthèse', "Plan d'action"]

  return (
    <div style={{ display: 'flex', height: '100dvh', background: '#0E0B08', overflow: 'hidden', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{CHAT_CSS}</style>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sb-top">
          <a href="/" className="sb-logo">
            <HexLogo size={80} />
            <div className="sb-logo-text">
              <span className="sb-name">HexAstra</span>
              <em className="sb-sub">Coach</em>
            </div>
          </a>
        </div>

        <nav className="sb-nav">
          <div className="sb-nav-label">Navigation</div>
          <a href="/" className="sb-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Accueil
          </a>
          <button className="sb-item sb-item-on">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Chat
          </button>
          <button className="sb-item" onClick={() => router.push('/login')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Se connecter
          </button>
        </nav>

        <div className="sb-stages">
          <div className="sb-stage-label">Progression</div>
          {STAGES.map((s, i) => (
            <div key={i} className={`sb-stage${i <= stage ? ' sb-stage-on' : ''}`}>
              <span className="sb-stage-dot" />
              {s}
            </div>
          ))}
        </div>

        {birthData && (
          <div className="sb-birth">
            <div className="sb-birth-label">Profil actif</div>
            <div className="sb-birth-val">{birthData.date}</div>
            <div className="sb-birth-val">{birthData.time} · {birthData.place}</div>
          </div>
        )}

        <div className="sb-bottom">
          <a href="/#pricing" className="sb-upgrade">✦ Passer à Premium</a>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="chat-main">

        {/* Header */}
        <header className="chat-header">
          <div className="chat-header-left">
            <div className="chat-title">HexAstra Coach</div>
            <div className="chat-online"><span className="online-dot" />En ligne</div>
          </div>
          <div className="chat-header-right">
            <button className="new-analysis-btn" onClick={handleNewAnalysis}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Nouvelle analyse
            </button>
            <div className="mode-toggle">
              <button onClick={() => handleModeChange('libre')} className={`mode-btn${mode === 'libre' ? ' mode-on' : ''}`}>Libre</button>
              <button onClick={() => handleModeChange('praticien')} className={`mode-btn${mode === 'praticien' ? ' mode-on' : ''}`}>Praticien</button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="chat-msgs">
          {messages.map((msg, i) => (
            <div key={msg.id} className={`msg-row ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`}
              style={{ animationDelay: `${i * 0.03}s` }}>
              {msg.role === 'assistant' && (
                <div className="msg-av"><HexLogo size={28} /></div>
              )}
              <div className="msg-bubble">
                {msg.content.split('\n').map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                ))}
                <span className="msg-time">
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row msg-ai">
              <div className="msg-av"><HexLogo size={28} /></div>
              <div className="msg-bubble msg-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Chips */}
        <div className="chat-chips">
          {chips.map((c, i) => (
            <button key={i} className="chip" onClick={() => send(c)}>{c}</button>
          ))}
          <button className="chip chip-birth" onClick={handleNewAnalysis}>
            ✦ Analyse personnalisée
          </button>
        </div>

        {/* Composer */}
        <div className="chat-composer">
          <div className="composer-inner">
            <textarea
              ref={taRef}
              className="composer-ta"
              placeholder="Écris ta question… (décision, relation, direction, blocage)"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              rows={1}
            />
            <button
              className="composer-send"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="composer-micro">Analyse conversationnelle claire · Aucun conseil médical ou thérapeutique</div>
        </div>
      </main>

      {showBirth && (
        <BirthModal
          onSubmit={handleBirthSubmit}
          onClose={() => setShowBirth(false)}
        />
      )}
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const CHAT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
a{text-decoration:none;color:inherit}
button{border:none;cursor:pointer;background:none}

/* SIDEBAR */
.sidebar{width:220px;min-width:220px;height:100dvh;background:#14100C;border-right:1px solid rgba(198,163,95,0.18);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.sb-top{padding:20px 16px;border-bottom:1px solid rgba(198,163,95,0.12)}
.sb-logo{display:flex;align-items:center;gap:10px}
.sb-logo-text{display:flex;flex-direction:column;gap:1px}
.sb-name{font-family:'Playfair Display',serif;font-size:17px;font-weight:500;color:#F3EFEA;line-height:1.1}
.sb-sub{font-family:'Playfair Display',serif;font-size:13px;font-style:italic;color:#C6A35F;line-height:1.1}
.sb-nav{padding:16px 8px;flex:1}
.sb-nav-label{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(243,239,234,0.35);padding:0 8px 8px}
.sb-item{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;font-weight:400;color:rgba(243,239,234,0.55);transition:all .2s;text-align:left}
.sb-item:hover{background:rgba(255,255,255,0.04);color:rgba(243,239,234,0.85)}
.sb-item-on{color:#C6A35F!important;background:rgba(198,163,95,0.08)!important;border-left:2px solid #C6A35F}
.sb-stages{padding:14px 16px;border-top:1px solid rgba(198,163,95,0.1)}
.sb-stage-label{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:rgba(243,239,234,0.35);margin-bottom:10px}
.sb-stage{display:flex;align-items:center;gap:8px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;color:rgba(243,239,234,0.28);padding:4px 0;transition:color .4s}
.sb-stage-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.5}
.sb-stage-on{color:#C6A35F}
.sb-stage-on .sb-stage-dot{opacity:1;box-shadow:0 0 4px #C6A35F}
.sb-birth{padding:10px 16px;border-top:1px solid rgba(198,163,95,0.1)}
.sb-birth-label{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:#C6A35F;margin-bottom:5px}
.sb-birth-val{font-family:'DM Mono',monospace;font-size:10px;color:rgba(243,239,234,0.55);line-height:1.6}
.sb-bottom{padding:14px;border-top:1px solid rgba(198,163,95,0.12)}
.sb-upgrade{display:flex;align-items:center;justify-content:center;padding:9px;background:rgba(198,163,95,0.08);border:1px solid rgba(198,163,95,0.22);border-radius:8px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:#C6A35F;transition:all .2s}
.sb-upgrade:hover{background:rgba(198,163,95,0.15)}

/* MAIN */
.chat-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.chat-header{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid rgba(198,163,95,0.15);background:rgba(14,11,8,0.85);backdrop-filter:blur(16px);flex-shrink:0;gap:12px}
.chat-header-left{display:flex;align-items:center;gap:12px}
.chat-header-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
.chat-title{font-family:'Playfair Display',serif;font-size:17px;font-weight:500;color:#F3EFEA}
.chat-online{display:flex;align-items:center;gap:5px;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;color:rgba(243,239,234,0.45);text-transform:uppercase}
.online-dot{width:5px;height:5px;border-radius:50%;background:#5db87a;animation:pulse 2.5s ease infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.new-analysis-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:rgba(198,163,95,0.1);border:1px solid rgba(198,163,95,0.3);border-radius:20px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.08em;color:#C6A35F;transition:all .2s;white-space:nowrap}
.new-analysis-btn:hover{background:rgba(198,163,95,0.2)}
.mode-toggle{display:flex;background:rgba(255,255,255,0.05);border:1px solid rgba(198,163,95,0.18);border-radius:6px;overflow:hidden}
.mode-btn{padding:6px 14px;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.1em;color:rgba(243,239,234,0.45);transition:all .2s}
.mode-on{background:rgba(198,163,95,0.12)!important;color:#C6A35F!important}

/* MESSAGES */
.chat-msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth}
.chat-msgs::-webkit-scrollbar{width:2px}
.chat-msgs::-webkit-scrollbar-thumb{background:rgba(198,163,95,0.2);border-radius:2px}
.msg-row{display:flex;align-items:flex-end;gap:10px;animation:fadeUp .32s cubic-bezier(0.16,1,0.3,1) both}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.msg-user{flex-direction:row-reverse}
.msg-av{width:38px;height:38px;border-radius:50%;border:1px solid rgba(198,163,95,0.25);background:rgba(198,163,95,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.msg-bubble{font-family:'Inter',sans-serif;font-size:14px;font-weight:300;line-height:1.75;padding:12px 16px;border-radius:16px;max-width:min(68ch,75%);position:relative}
.msg-ai .msg-bubble{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:rgba(243,239,234,0.82);border-radius:16px 16px 16px 4px}
.msg-user .msg-bubble{background:rgba(198,163,95,0.12);border:1px solid rgba(198,163,95,0.22);color:#F3EFEA;border-radius:16px 16px 4px 16px}
.msg-time{display:block;font-family:'DM Mono',monospace;font-size:9px;color:rgba(243,239,234,0.3);margin-top:6px;text-align:right}
.msg-typing{display:flex!important;align-items:center;gap:5px;padding:14px 16px!important;min-width:54px}
.msg-typing span{width:6px;height:6px;border-radius:50%;background:#C6A35F;animation:dots 1.2s ease infinite;flex-shrink:0}
.msg-typing span:nth-child(2){animation-delay:.18s}
.msg-typing span:nth-child(3){animation-delay:.36s}
@keyframes dots{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}

/* CHIPS */
.chat-chips{display:flex;flex-wrap:wrap;gap:7px;padding:10px 24px;border-top:1px solid rgba(255,255,255,0.05)}
.chip{font-family:'Inter',sans-serif;font-size:12px;font-weight:400;color:rgba(184,157,150,0.9);background:rgba(184,157,150,0.07);border:1px solid rgba(184,157,150,0.2);border-radius:50px;padding:5px 14px;transition:all .2s;white-space:nowrap}
.chip:hover{background:rgba(184,157,150,0.16);border-color:rgba(184,157,150,0.38);color:#F3EFEA}
.chip-birth{color:#C6A35F;background:rgba(198,163,95,0.07);border-color:rgba(198,163,95,0.25)}
.chip-birth:hover{background:rgba(198,163,95,0.16);border-color:rgba(198,163,95,0.45)}

/* COMPOSER */
.chat-composer{padding:12px 20px 18px;border-top:1px solid rgba(198,163,95,0.18);background:rgba(14,11,8,0.7);backdrop-filter:blur(12px);flex-shrink:0}
.composer-inner{display:flex;align-items:flex-end;gap:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(198,163,95,0.2);border-radius:14px;padding:12px 14px;transition:border-color .2s}
.composer-inner:focus-within{border-color:rgba(198,163,95,0.4)}
.composer-ta{flex:1;background:transparent;border:none;color:#F3EFEA;font-family:'Inter',sans-serif;font-size:14px;font-weight:300;line-height:1.55;resize:none;min-height:22px;max-height:120px;overflow-y:auto}
.composer-ta::placeholder{color:rgba(243,239,234,0.35)}
.composer-ta:focus{outline:none}
.composer-send{width:36px;height:36px;border-radius:50%;background:#C6A35F;color:#0E0B08;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 4px 14px rgba(198,163,95,0.28)}
.composer-send:hover:not(:disabled){background:#d4b26e;transform:scale(1.06)}
.composer-send:disabled{opacity:.35;cursor:not-allowed}
.composer-micro{font-family:'DM Mono',monospace;font-size:9px;color:rgba(243,239,234,0.3);text-align:center;letter-spacing:.08em;margin-top:8px}

/* MOBILE */
@media(max-width:700px){
  .sidebar{display:none}
  .chat-header{padding:12px 16px}
  .chat-title{font-size:14px}
  .new-analysis-btn span{display:none}
  .chat-msgs{padding:16px}
  .chat-chips{padding:8px 14px}
  .chat-composer{padding:10px 14px 16px}
}
`

// ── Modal Styles ──────────────────────────────────────────────────────────────
const m: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
    backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 100, padding: '24px',
  },
  modal: {
    background: '#1A1510', border: '1px solid rgba(198,163,95,0.25)',
    borderRadius: '16px', padding: '36px 32px',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
    display: 'flex', flexDirection: 'column', gap: '18px',
    animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both',
  },
  hdr: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  tag: { fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '.18em', color: '#C6A35F', textTransform: 'uppercase', marginBottom: '6px' },
  title: { fontFamily: "'Playfair Display',serif", fontSize: '26px', letterSpacing: '.05em', textTransform: 'uppercase', color: '#F3EFEA' },
  closeBtn: { fontFamily: "'DM Mono',monospace", fontSize: '14px', color: 'rgba(243,239,234,0.4)', padding: '4px 8px', background: 'transparent', border: 'none', marginTop: '-2px' },
  sub: { fontFamily: "'Playfair Display',serif", fontStyle: 'italic', fontSize: '14px', color: 'rgba(243,239,234,0.6)', lineHeight: 1.7 },
  divider: { height: '1px', background: 'rgba(198,163,95,0.15)' },
  fields: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontFamily: "'DM Mono',monospace", fontSize: '9px', letterSpacing: '.14em', color: 'rgba(243,239,234,0.4)', textTransform: 'uppercase' },
  hint: { fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(243,239,234,0.25)', letterSpacing: '.06em' },
  input: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(198,163,95,0.2)',
    borderRadius: '6px', padding: '10px 13px',
    color: '#F3EFEA', fontSize: '14px', fontFamily: "'Inter',sans-serif",
    outline: 'none',
  },
  err: { fontFamily: "'DM Mono',monospace", fontSize: '11px', color: '#ff8080' },
  btn: {
    padding: '14px 20px', background: '#C6A35F', color: '#0E0B08',
    fontFamily: "'DM Mono',monospace", fontSize: '11px', letterSpacing: '.14em',
    textTransform: 'uppercase', fontWeight: 600, borderRadius: '6px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    boxShadow: '0 8px 28px rgba(198,163,95,0.25)', border: 'none',
  },
  note: { fontFamily: "'DM Mono',monospace", fontSize: '9px', color: 'rgba(243,239,234,0.25)', textAlign: 'center', letterSpacing: '.06em' },
}
