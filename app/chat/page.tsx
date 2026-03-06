'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────
type Message = {
  id: string; role: 'user' | 'assistant'; content: string
  created_at: string; showPremium?: boolean; cached?: boolean
}
type Mode = 'libre' | 'praticien'
type View = 'chat' | 'profile' | 'recent' | 'search' | 'premium' | 'nouveau'
type Step = 1 | 2 | 3 | 4

// ─────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────
const MENU_LIBRE = [
  { id:'1', sym:'✦', label:'NeuroKua™',        sub:'État intérieur & énergie' },
  { id:'2', sym:'◈', label:'Énergie du moment', sub:'Tendance du jour' },
  { id:'3', sym:'♡', label:'Amour / Relations', sub:'Dynamiques affectives' },
  { id:'4', sym:'◆', label:'Travail / Argent',  sub:'Choix pro & stabilité' },
  { id:'5', sym:'◉', label:'Bien-être',         sub:'Apaise & recentre' },
  { id:'6', sym:'⊕', label:'Décision',          sub:'Clarté & choix' },
  { id:'7', sym:'◎', label:'Vision mois',       sub:'Anticipe & timing' },
  { id:'8', sym:'✧', label:'Lecture générale',  sub:'Synthèse complète' },
  { id:'9', sym:'⬡', label:'Par science',       sub:'Angle spécifique' },
]

const MENU_PRATICIEN = [
  { id:'A1', sym:'✦', label:'NeuroKua™',         sub:'Diagnostic état interne' },
  { id:'A2', sym:'◈', label:'Relationnel™',       sub:'Dynamiques & leviers' },
  { id:'A3', sym:'◆', label:'Professionnel™',     sub:'Positionnement & risques' },
  { id:'A4', sym:'◎', label:'Cycle à venir™',     sub:'Phase & timing' },
  { id:'A5', sym:'⊕', label:'Décision précise™',  sub:'Comparatif A/B' },
  { id:'A6', sym:'✧', label:'Lecture générale™',  sub:'Synthèse multidim.' },
  { id:'B1', sym:'⬡', label:'Astrolex™',          sub:'Astrologie' },
  { id:'B2', sym:'◉', label:'Porteum™',           sub:'Numérologie' },
  { id:'B3', sym:'⊗', label:'TriangleNumeris™',   sub:'Triangle' },
  { id:'B4', sym:'⊛', label:'Ennéagramme™',       sub:'Types' },
  { id:'B5', sym:'⬢', label:'Kua™',               sub:'Feng Shui' },
  { id:'B6', sym:'❋', label:'Fusion KS™',         sub:'Synthèse totale' },
]

const STEPS: { step: Step; label: string; desc: string }[] = [
  { step:1, label:'Langue & Mode',      desc:'Choix langue + Libre ou Praticien' },
  { step:2, label:'Données naissance',  desc:'Date · Heure · Lieu' },
  { step:3, label:'Microlectures',      desc:'Profil · Année · Mois' },
  { step:4, label:'Exploration',        desc:'Menu · Thèmes · Sciences' },
]

// ─────────────────────────────────────────────────────────────────
// STAR FIELD
// ─────────────────────────────────────────────────────────────────
function Stars() {
  const stars = useRef(
    Array.from({ length: 55 }, (_, i) => ({
      id: i, x: Math.random()*100, y: Math.random()*100,
      s: Math.random()*1.4+0.3, d: Math.random()*4,
    }))
  ).current
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
          width:s.s, height:s.s, borderRadius:'50%',
          background:'rgba(255,255,255,0.55)',
          animation:`pulse ${2+s.d}s ease-in-out ${s.d}s infinite`,
        }}/>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CONSTELLATION SVG
// ─────────────────────────────────────────────────────────────────
function Constellation({ data }: { data: Record<string,string> }) {
  const nodes = [
    { id:'sun',   label:'Soleil',         x:50, y:12, col:'#ff8c00' },
    { id:'moon',  label:'Lune',           x:22, y:32, col:'#00d4ff' },
    { id:'asc',   label:'Ascendant',      x:78, y:32, col:'#9b59b6' },
    { id:'hd',    label:'HD Type',        x:50, y:52, col:'#2ecc71' },
    { id:'kua',   label:'Kua',            x:18, y:68, col:'#e74c3c' },
    { id:'lp',    label:'Chemin de vie',  x:82, y:68, col:'#f39c12' },
    { id:'ennea', label:'Ennéagramme',    x:50, y:84, col:'#1abc9c' },
  ]
  const edges=[['sun','moon'],['sun','asc'],['sun','hd'],['moon','hd'],['asc','hd'],['hd','kua'],['hd','lp'],['kua','ennea'],['lp','ennea']]
  return (
    <svg viewBox="0 0 100 100" style={{ width:'100%', maxWidth:'380px', display:'block', margin:'0 auto' }}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,140,0,0.04)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#bg)"/>
      {edges.map(([a,b])=>{
        const na=nodes.find(n=>n.id===a)!, nb=nodes.find(n=>n.id===b)!
        return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="rgba(255,140,0,0.18)" strokeWidth="0.35" strokeDasharray="1.2,1.2"/>
      })}
      {nodes.map(n=>(
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="4" fill={n.col} fillOpacity="0.12"/>
          <circle cx={n.x} cy={n.y} r="2" fill={n.col}/>
          <text x={n.x} y={n.y-5.5} textAnchor="middle" fontSize="3" fill="rgba(255,255,255,0.45)" fontFamily="monospace">{n.label}</text>
          <text x={n.x} y={n.y+8} textAnchor="middle" fontSize="3.8" fill={n.col} fontFamily="monospace" fontWeight="bold">{data[n.id]||'—'}</text>
        </g>
      ))}
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{
    id:'0', role:'assistant', created_at: new Date().toISOString(),
    content:'Bienvenue.\nJe suis HexAstra Coach.\n\nChoisis ta langue / Choose your language :\nFrançais / English',
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<Mode>('libre')
  const [isPremium, setIsPremium] = useState(false)
  const [view, setView] = useState<View>('chat')
  const [step, setStep] = useState<Step>(1)
  const [showBirth, setShowBirth] = useState(false)
  const [conversationId, setConversationId] = useState<string|null>(null)
  const [msgCount, setMsgCount] = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isRec, setIsRec] = useState(false)
  const [mediaRec, setMediaRec] = useState<MediaRecorder|null>(null)
  const replyCache = useRef(new Map<string,string>())
  const endRef = useRef<HTMLDivElement>(null)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ if(data.user) setUserEmail(data.user.email||'') })
    const saved = typeof window !== 'undefined' ? localStorage.getItem('hx_profile') : null
    if(saved) setUserProfile(JSON.parse(saved))
  },[])

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages,isTyping])

  useEffect(()=>{
    if(taRef.current){
      taRef.current.style.height='auto'
      taRef.current.style.height=Math.min(taRef.current.scrollHeight,96)+'px'
    }
  },[input])

  const bump = useCallback((len:number)=>{
    if(len>=2) setStep(s=>s<2?2:s)
    if(len>=5) setStep(s=>s<3?3:s)
    if(len>=8) setStep(s=>s<4?4:s)
  },[])

  // ── Audio ──────────────────────────────────────────────────────
  const toggleRec = useCallback(async()=>{
    if(isRec && mediaRec){ mediaRec.stop(); setIsRec(false); return }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true})
      const rec = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      rec.ondataavailable = e => chunks.push(e.data)
      rec.onstop = async()=>{
        const blob = new Blob(chunks,{type:'audio/webm'})
        const form = new FormData()
        form.append('file', blob, 'audio.webm')
        form.append('model','whisper-1')
        form.append('language','fr')
        try{
          const r = await fetch('https://api.openai.com/v1/audio/transcriptions',{
            method:'POST', body:form,
            headers:{ Authorization:`Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY||''}` },
          })
          const d = await r.json()
          if(d.text) setInput(d.text)
        }catch{ console.error('whisper error') }
        stream.getTracks().forEach(t=>t.stop())
      }
      rec.start(); setMediaRec(rec); setIsRec(true)
    }catch{ alert('Micro non disponible') }
  },[isRec,mediaRec])

  // ── Send ───────────────────────────────────────────────────────
  const send = useCallback(async(text?:string, birthData?:any)=>{
    const content = text||input.trim()
    if(!content && !birthData) return

    const userMsg:Message = {
      id: Date.now().toString(), role:'user', created_at:new Date().toISOString(),
      content: birthData
        ? `Données de naissance : ${birthData.name||''} · ${birthData.date} · ${birthData.time||'inconnue'} · ${birthData.place||`${birthData.lat??''},${birthData.lon??''}`}`
        : content,
    }
    const newMsgs=[...messages,userMsg]
    setMessages(newMsgs); setInput(''); setIsTyping(true)
    const cnt=msgCount+1; setMsgCount(cnt); bump(newMsgs.length)

    if(!birthData && replyCache.current.has(content)){
      setTimeout(()=>{
        setIsTyping(false)
        setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:replyCache.current.get(content)!,created_at:new Date().toISOString(),cached:true}])
      },300); return
    }

    try{
      const res = await fetch('/api/chat',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:newMsgs.map(m=>({role:m.role,content:m.content})), mode, birthData:birthData||null, conversationId }),
      })
      const data = await res.json()
      if(data.conversationId) setConversationId(data.conversationId)
      const reply = data.reply||'Une erreur est survenue.'
      if(!birthData && content.length<200) replyCache.current.set(content,reply)
      setIsTyping(false)
      setMessages(p=>[...p,{
        id:Date.now().toString(), role:'assistant', content:reply, created_at:new Date().toISOString(),
        showPremium:!isPremium && cnt>=3 && cnt%4===3,
      }])
      bump(newMsgs.length+1)
      if(birthData){
        const profile={...birthData,email:userEmail}
        setUserProfile(profile)
        localStorage.setItem('hx_profile',JSON.stringify(profile))
      }
      if(data.needsBirthData) setTimeout(()=>setShowBirth(true),600)
    }catch{
      setIsTyping(false)
      setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:'Erreur de connexion. Réessaie dans un instant.',created_at:new Date().toISOString()}])
    }
  },[input,messages,mode,conversationId,msgCount,isPremium,userEmail,bump])

  const switchMode=(m:Mode)=>{
    if(m==='praticien'&&!isPremium){setView('premium');return}
    setMode(m)
  }

  const share=()=>{
    if(navigator.share) navigator.share({title:'HexAstra Coach',url:window.location.href})
    else navigator.clipboard.writeText(window.location.href).then(()=>alert('Lien copié'))
  }

  // ── Sub-views ──────────────────────────────────────────────────
  if(view==='profile') return <ProfileView profile={userProfile} onEdit={()=>{setShowBirth(true);setView('chat')}} onBack={()=>setView('chat')}/>
  if(view==='recent')  return <RecentView onBack={()=>setView('chat')} onSelect={t=>{setView('chat');send(t)}}/>
  if(view==='search')  return <SearchView onBack={()=>setView('chat')} onSelect={t=>{setView('chat');send(t)}}/>
  if(view==='premium') return <PremiumView onBack={()=>setView('chat')} userEmail={userEmail} onSuccess={()=>{setIsPremium(true);setView('chat')}}/>
  if(view==='nouveau') return <NouveauView onBack={()=>setView('chat')} onStart={(t)=>{setView('chat');setTimeout(()=>setShowBirth(true),200)}}/>

  const menu = mode==='libre' ? MENU_LIBRE : MENU_PRATICIEN

  return (
    <div style={s.root}>
      <Stars/>

      {/* ════ LEFT SIDEBAR ════ */}
      <aside style={s.sb}>

        {/* Logo */}
        <div style={s.sbLogo}>
          <img
            src="/logo/hexastra-logo-transparent.png"
            alt="HexAstra"
            style={{ height:30, objectFit:'contain', display:'block' }}
            onError={e=>{
              const t=e.currentTarget
              t.style.display='none'
              const fallback=t.nextElementSibling as HTMLElement
              if(fallback) fallback.style.display='flex'
            }}
          />
          <div style={{display:'none',alignItems:'center',gap:8}}>
            <div style={s.hexIcon}/>
            <span style={s.sbName}>Hex<span style={{color:'var(--amber)'}}>Astra</span></span>
          </div>
        </div>

        {/* Nouvelle lecture */}
        <button style={s.newReadBtn} onClick={()=>setShowBirth(true)}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nouvelle lecture
        </button>

        <div style={s.sbDiv}/>

        {/* Nav items */}
        <div style={s.sbSection}>Navigation</div>
        <nav style={s.nav}>
          {([
            {v:'chat',    sym:'◈', label:'Chat IA'},
            {v:'nouveau', sym:'✦', label:'Nouveau projet'},
            {v:'profile', sym:'⬡', label:'Données personnelles'},
            {v:'recent',  sym:'◎', label:'Récent'},
            {v:'search',  sym:'⊕', label:'Recherche'},
            {v:'premium', sym:'★', label:'Premium'},
          ] as {v:View,sym:string,label:string}[]).map(item=>(
            <button key={item.v} style={{...s.navItem,...(view===item.v?s.navOn:{})}} onClick={()=>setView(item.v)}>
              <span style={s.navSym}>{item.sym}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={s.sbDiv}/>

        {/* Progression */}
        <div style={s.sbSection}>// Progression</div>
        <div style={s.stepList}>
          {STEPS.map(({step:n,label,desc},i)=>{
            const done=step>n, active=step===n
            return (
              <div key={n} style={s.stepRow}>
                <div style={s.stepCol}>
                  <div style={{
                    ...s.dot,
                    borderColor: done||active?'var(--amber)':'var(--b2)',
                    background: done?'var(--amber)':'transparent',
                    boxShadow: active?'0 0 8px rgba(255,140,0,0.45)':'none',
                  }}>
                    {done && <span style={{fontSize:7,color:'var(--void)'}}>✓</span>}
                    {active && <div style={s.dotCore}/>}
                  </div>
                  {i<3 && <div style={{...s.dotLine,background:done?'rgba(255,140,0,0.3)':'var(--b1)'}}/>}
                </div>
                <div style={s.stepText}>
                  <div style={{...s.stepLabel,color:done||active?'var(--tx1)':'var(--tx3)'}}>{label}</div>
                  {active && <div style={s.stepDesc}>{desc}</div>}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{flex:1}}/>

        {/* User */}
        <div style={s.sbFoot}>
          <div style={s.userRow}>
            <div style={s.userAv}>{userEmail[0]?.toUpperCase()||'U'}</div>
            <div style={s.userMail}>{userEmail}</div>
          </div>
          <button style={s.logoutBtn} onClick={async()=>{await supabase.auth.signOut();router.push('/login')}}>Déconnexion</button>
        </div>
      </aside>

      {/* ════ MAIN CHAT ════ */}
      <main style={s.main}>

        {/* Top bar */}
        <div style={s.topBar}>
          <div style={s.modePill}>
            <button style={{...s.modeBtn,...(mode==='libre'?s.modeOn:{})}} onClick={()=>switchMode('libre')}>Libre</button>
            <button style={{...s.modeBtn,...(mode==='praticien'?s.modeOn:{}),position:'relative'}} onClick={()=>switchMode('praticien')}>
              Praticien
              {!isPremium&&<span style={s.lock}>🔒</span>}
            </button>
          </div>
          <button style={s.shareBtn} onClick={share} title="Partager">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div style={s.msgs}>
          {messages.map((msg,i)=>(
            <div key={msg.id} style={{...s.row,justifyContent:msg.role==='user'?'flex-end':'flex-start',animation:'fadeUp 0.3s var(--expo) both',animationDelay:`${i*0.03}s`}}>
              {msg.role==='assistant' && (
                <div style={s.av}>
                  <div style={s.avHex}/>
                  <span style={s.avTxt}>HA</span>
                </div>
              )}
              <div style={{...s.bub,...(msg.role==='user'?s.bubU:s.bubA)}}>
                <p style={s.bubTxt}>{msg.content}</p>
                {msg.cached&&<span style={s.cached}>⚡ cache</span>}
                {msg.showPremium&&(
                  <button style={s.premBubBtn} onClick={()=>setView('premium')}>
                    ✦ Passer à Premium — PDF · Audio · Lectures illimitées →
                  </button>
                )}
                <span style={s.time}>{new Date(msg.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          {isTyping&&(
            <div style={{...s.row,justifyContent:'flex-start'}}>
              <div style={s.av}><div style={s.avHex}/><span style={s.avTxt}>HA</span></div>
              <div style={{...s.bub,...s.bubA,padding:'13px 16px'}}>
                <div style={s.dots}>{[0,1,2].map(i=><span key={i} style={{...s.dot2,animationDelay:`${i*0.18}s`}}/>)}</div>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Composer */}
        <div style={s.composer}>
          <div style={s.compLabel}>Analyse personnalisée</div>
          <div style={s.compBox}>
            {/* Birth icon */}
            <button style={s.compIco} onClick={()=>setShowBirth(true)} title="Données de naissance">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </button>
            {/* Textarea */}
            <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Pose ta question à HexAstra..." rows={1} style={s.ta}/>
            {/* Mic */}
            <button style={{...s.compIco,...(isRec?s.recOn:{})}} onClick={toggleRec} title={isRec?'Arrêter':'Audio'}>
              {isRec
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--amber)"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/>
                  </svg>
              }
            </button>
            {/* Send */}
            <button style={{...s.sendBtn,opacity:!input.trim()||isTyping?0.25:1}} onClick={()=>send()} disabled={!input.trim()||isTyping}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          {/* Footer */}
          <div style={s.compFoot}>
            <span style={s.hint}>Entrée · Shift+Entrée nouvelle ligne</span>
            <span style={s.disclaimer}>HexAstra ne remplace pas un avis médical, juridique ou financier.</span>
            <button style={s.premHint} onClick={()=>setView('premium')}>✦ Premium</button>
          </div>
        </div>
      </main>

      {/* ════ RIGHT SIDEBAR: SCIENCES ════ */}
      <aside style={s.rb}>
        <div style={s.rbTitle}>{mode==='libre'?'// Mode Libre':'// Mode Praticien'}</div>
        <div style={s.rbList}>
          {menu.map(item=>(
            <button key={item.id} style={s.rbItem} onClick={()=>send(`${item.label} — ${item.sub}`)}>
              <span style={s.rbSym}>{item.sym}</span>
              <div style={s.rbInfo}>
                <div style={s.rbName}>{item.label}</div>
                <div style={s.rbSub}>{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Birth Modal */}
      {showBirth && (
        <BirthModal existing={userProfile} onClose={()=>setShowBirth(false)}
          onSubmit={d=>{setShowBirth(false);send(undefined,d)}}/>
      )}

      <style>{`
        @keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,140,0,0.4)}50%{box-shadow:0 0 0 6px rgba(255,140,0,0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;border:none;background:none;color:inherit}
        input,textarea{font-family:inherit;outline:none}
        textarea{resize:none}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:var(--ab1)}
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PROFILE VIEW
// ─────────────────────────────────────────────────────────────────
function ProfileView({profile,onEdit,onBack}:{profile:any;onEdit:()=>void;onBack:()=>void}){
  return(
    <div style={v.root}>
      <Stars/>
      <div style={v.inner}>
        <div style={v.hdr}>
          <button style={v.back} onClick={onBack}>← Retour</button>
          <div style={v.title}>Données personnelles</div>
          <button style={v.editBtn} onClick={onEdit}>Modifier</button>
        </div>
        {!profile?(
          <div style={v.empty}>
            <div style={{fontSize:48,color:'var(--amber)',opacity:0.25,marginBottom:16}}>⬡</div>
            <p style={v.emptyTxt}>Aucun profil enregistré.</p>
            <button style={v.emptyBtn} onClick={onEdit}>Saisir mes données</button>
          </div>
        ):(
          <>
            <div style={v.section}>
              <div style={v.secLabel}>// Constellation personnelle</div>
              <div style={v.constellationBox}>
                <Constellation data={{
                  sun:profile.sunSign||'—', moon:profile.moonSign||'—',
                  asc:profile.ascendant||'—', hd:profile.hdType||'—',
                  kua:profile.kua||'—', lp:profile.lifePath||'—', ennea:profile.enneagram||'—'
                }}/>
              </div>
            </div>
            <div style={v.section}>
              <div style={v.secLabel}>// Informations de base</div>
              {[['Prénom',profile.name],['Date',profile.date],['Heure',profile.time],['Lieu',profile.place]].map(([l,val])=>(
                <div key={l} style={v.infoRow}>
                  <span style={v.infoLbl}>{l}</span>
                  <span style={v.infoVal}>{val||'—'}</span>
                </div>
              ))}
            </div>
            {profile.hdType&&(
              <div style={v.section}>
                <div style={v.secLabel}>// Human Design</div>
                {[['Type',profile.hdType],['Autorité',profile.hdAuthority],['Profil',profile.hdProfile]].map(([l,val])=>(
                  <div key={l} style={v.infoRow}>
                    <span style={v.infoLbl}>{l}</span>
                    <span style={{...v.infoVal,color:'var(--amber)'}}>{val||'—'}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// RECENT VIEW
// ─────────────────────────────────────────────────────────────────
function RecentView({onBack,onSelect}:{onBack:()=>void;onSelect:(t:string)=>void}){
  const mock=[
    {id:'r1',title:'Lecture générale',date:'Hier',sci:'Fusion KS™'},
    {id:'r2',title:'Travail / Décision',date:'Il y a 3j',sci:'NeuroKua™'},
    {id:'r3',title:'Amour / Relations',date:'Il y a 5j',sci:'Astrolex™'},
  ]
  return(
    <div style={v.root}>
      <Stars/>
      <div style={v.inner}>
        <div style={v.hdr}>
          <button style={v.back} onClick={onBack}>← Retour</button>
          <div style={v.title}>Lectures récentes</div>
          <div/>
        </div>
        <div style={v.section}>
          <div style={v.secLabel}>// Historique</div>
          {mock.map(r=>(
            <button key={r.id} style={v.card} onClick={()=>onSelect(r.title)}>
              <div style={{flex:1}}>
                <div style={v.cardTitle}>{r.title}</div>
                <div style={v.cardSci}>{r.sci}</div>
              </div>
              <div style={v.cardDate}>{r.date}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// SEARCH VIEW
// ─────────────────────────────────────────────────────────────────
function SearchView({onBack,onSelect}:{onBack:()=>void;onSelect:(t:string)=>void}){
  const [q,setQ]=useState('')
  const all=[
    {id:'r1',title:'Lecture générale',sci:'Fusion KS™'},
    {id:'r2',title:'Travail / Décision',sci:'NeuroKua™'},
    {id:'r3',title:'Amour / Relations',sci:'Astrolex™'},
  ]
  const res=q?all.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())||r.sci.toLowerCase().includes(q.toLowerCase())):all
  return(
    <div style={v.root}>
      <Stars/>
      <div style={v.inner}>
        <div style={v.hdr}>
          <button style={v.back} onClick={onBack}>← Retour</button>
          <div style={v.title}>Recherche</div>
          <div/>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Chercher une lecture..." autoFocus
          style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid var(--b2)',borderRadius:8,padding:'11px 14px',color:'var(--tx1)',fontSize:14,marginBottom:16}}/>
        {res.map(r=>(
          <button key={r.id} style={v.card} onClick={()=>onSelect(r.title)}>
            <div style={{flex:1}}>
              <div style={v.cardTitle}>{r.title}</div>
              <div style={v.cardSci}>{r.sci}</div>
            </div>
          </button>
        ))}
        {q&&!res.length&&<div style={{textAlign:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)',marginTop:24}}>Aucun résultat</div>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// NOUVEAU PROJET VIEW
// ─────────────────────────────────────────────────────────────────
function NouveauView({onBack,onStart}:{onBack:()=>void;onStart:(t:string)=>void}){
  const types=[
    {id:'perso',label:'Lecture personnelle',desc:'Analyse de ta situation actuelle',sym:'✦'},
    {id:'pro',label:'Analyse professionnelle',desc:'Décision, positionnement, stratégie',sym:'◆'},
    {id:'relation',label:'Dynamique relationnelle',desc:'Couple, famille, collaboration',sym:'♡'},
    {id:'cycle',label:'Cycle à venir',desc:'Anticiper la phase suivante',sym:'◎'},
  ]
  return(
    <div style={v.root}>
      <Stars/>
      <div style={v.inner}>
        <div style={v.hdr}>
          <button style={v.back} onClick={onBack}>← Retour</button>
          <div style={v.title}>Nouveau projet</div>
          <div/>
        </div>
        <div style={v.section}>
          <div style={v.secLabel}>// Choisir le type de lecture</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {types.map(t=>(
              <button key={t.id} style={v.typeCard} onClick={()=>onStart(t.label)}>
                <div style={{fontSize:22,color:'var(--amber)',marginBottom:8}}>{t.sym}</div>
                <div style={{fontFamily:'var(--f-display)',fontSize:14,color:'var(--chrome)',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>{t.label}</div>
                <div style={{fontFamily:'var(--f-ui)',fontSize:11,color:'var(--tx3)',lineHeight:1.5}}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// PREMIUM VIEW
// ─────────────────────────────────────────────────────────────────
function PremiumView({onBack,userEmail,onSuccess}:{onBack:()=>void;userEmail:string;onSuccess:()=>void}){
  const [loading,setLoading]=useState<string|null>(null)
  const checkout=async(key:string)=>{
    setLoading(key)
    try{
      const r=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceKey:key})})
      const d=await r.json()
      if(d.url) window.location.href=d.url
    }finally{setLoading(null)}
  }
  const plans=[
    {key:'lecture_unique',badge:'ESSENTIEL',name:'Lecture Unique',price:'19',period:'/lecture',features:['PDF complet','Thème natal + HD','Numérologie + Kua','Immédiat'],accent:false},
    {key:'premium_mensuel',badge:'POPULAIRE',name:'Premium',price:'29',period:'/mois',features:['Lectures illimitées','Audio IA ElevenLabs','Mode Praticien','12 sciences','PDF haute qualité','Historique'],accent:true},
    {key:'cabinet',badge:'PRO',name:'Cabinet',price:'89',period:'/mois',features:['Tout Premium +','Analyses clients','Rapports export','Support dédié'],accent:false},
  ]
  return(
    <div style={v.root}>
      <Stars/>
      <div style={{...v.inner,maxWidth:1000}}>
        <div style={v.hdr}>
          <button style={v.back} onClick={onBack}>← Retour au chat</button>
          <div style={v.title}>Abonnements</div>
          <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'}}>{userEmail}</span>
        </div>
        <div style={{textAlign:'center',padding:'24px 0 32px'}}>
          <div style={{fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.2em',color:'var(--amber)',marginBottom:12}}>// ACCÈS COMPLET HEXASTRA</div>
          <h1 style={{fontFamily:'var(--f-display)',fontSize:'clamp(28px,4vw,46px)',color:'var(--chrome)',textTransform:'uppercase',letterSpacing:'0.04em',lineHeight:1.1}}>
            Lectures précises.<br/><span style={{color:'var(--amber)'}}>Swiss Ephemeris.</span>
          </h1>
        </div>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
          {plans.map(p=>(
            <div key={p.key} style={{...pl.card,...(p.accent?pl.accent:{}),flex:'1 1 240px',maxWidth:300,position:'relative'}}>
              {p.accent&&<div style={pl.pop}>✦ Le plus choisi</div>}
              <div style={pl.badge}>{p.badge}</div>
              <div style={pl.name}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                <span style={{fontFamily:'var(--f-mono)',fontSize:16,color:'var(--tx2)'}}>€</span>
                <span style={{fontFamily:'var(--f-display)',fontSize:42,color:'var(--chrome)',lineHeight:1}}>{p.price}</span>
                <span style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)'}}>{p.period}</span>
              </div>
              <div style={{height:1,background:'var(--b1)',margin:'8px 0'}}/>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:7,flex:1}}>
                {p.features.map(f=><li key={f} style={{display:'flex',alignItems:'center',gap:8,fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)'}}><span style={{color:'var(--amber)'}}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>checkout(p.key)} disabled={loading===p.key}
                style={{...pl.cta,...(p.accent?pl.ctaAccent:{}),marginTop:16}}>
                {loading===p.key?'...':p.accent?'Commencer Premium':p.key==='lecture_unique'?'Obtenir ma lecture':'Accès Cabinet'}
              </button>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 0',fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--tx3)'}}>
          Paiement sécurisé Stripe · Annulation à tout moment
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// BIRTH MODAL
// ─────────────────────────────────────────────────────────────────
function BirthModal({existing,onSubmit,onClose}:{existing?:any;onSubmit:(d:any)=>void;onClose:()=>void}){
  const [name,setName]=useState(existing?.name||'')
  const [date,setDate]=useState(existing?.date||'')
  const [time,setTime]=useState(existing?.time&&existing.time!=='inconnue'?existing.time:'')
  const [noTime,setNoTime]=useState(existing?.time==='inconnue')
  const [city,setCity]=useState(existing?.place||'')
  const [lat,setLat]=useState(existing?.lat?.toString()||'')
  const [lon,setLon]=useState(existing?.lon?.toString()||'')
  const [err,setErr]=useState('')

  const submit=()=>{
    if(!date){setErr('La date est requise.');return}
    if(!noTime&&!time){setErr("Indique l'heure ou coche « heure inconnue ».");return}
    onSubmit({name,date,time:noTime?'inconnue':time,place:city,lat:lat?parseFloat(lat):undefined,lon:lon?parseFloat(lon):undefined})
  }

  return(
    <div style={bm.overlay}>
      <div style={bm.modal}>
        <div style={bm.hdr}>
          <div>
            <div style={bm.tag}>// Profil personnel</div>
            <h2 style={bm.title}>Données de naissance</h2>
          </div>
          <button style={bm.close} onClick={onClose}>✕</button>
        </div>
        <p style={bm.sub}>Ces données restent en mémoire pour personnaliser chaque lecture automatiquement.</p>
        <div style={{height:1,background:'var(--b1)'}}/>
        <div style={bm.fields}>
          <div style={bm.field}>
            <label style={bm.lbl}>Prénom</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ton prénom" style={bm.inp}/>
          </div>
          <div style={bm.field}>
            <label style={bm.lbl}>Date de naissance</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={bm.inp}/>
          </div>
          <div style={bm.field}>
            <label style={bm.lbl}>Heure de naissance</label>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...bm.inp,opacity:noTime?0.4:1}}/>
            <label style={{display:'flex',alignItems:'center',gap:7,marginTop:5,cursor:'pointer'}}>
              <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:'var(--amber)'}}/>
              <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',letterSpacing:'0.06em'}}>Heure inconnue (lecture probabiliste)</span>
            </label>
          </div>
          <div style={bm.field}>
            <label style={bm.lbl}>Ville de naissance</label>
            <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Paris, France" style={bm.inp}/>
          </div>
          <div style={{display:'flex',gap:10}}>
            {[['Latitude','48.8566',lat,setLat],['Longitude','2.3522',lon,setLon]].map(([l,ph,val,set])=>(
              <div key={l as string} style={{...bm.field,flex:1}}>
                <label style={bm.lbl}>{l as string} <span style={{color:'var(--tx3)'}}>(opt.)</span></label>
                <input type="number" value={val as string} onChange={e=>(set as any)(e.target.value)} placeholder={ph as string} style={bm.inp} step="0.0001"/>
              </div>
            ))}
          </div>
        </div>
        {err&&<p style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#ff8080'}}>{err}</p>}
        <button onClick={submit} style={bm.btn}>
          Enregistrer & lancer ma lecture
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────
const s: Record<string,React.CSSProperties> = {
  root:{display:'flex',height:'100vh',overflow:'hidden',background:'var(--deep)',position:'relative'},

  // Left sidebar
  sb:{width:210,minWidth:210,height:'100vh',background:'var(--pitch)',borderRight:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'},
  sbLogo:{padding:'14px 14px 10px',borderBottom:'1px solid var(--b1)',minHeight:52,display:'flex',alignItems:'center'},
  hexIcon:{width:20,height:20,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',boxShadow:'0 0 10px rgba(255,140,0,0.4)',animation:'amberPop 4s ease-in-out infinite',flexShrink:0},
  sbName:{fontFamily:'var(--f-display)',fontSize:15,letterSpacing:'0.1em',color:'var(--chrome)',textTransform:'uppercase'},
  newReadBtn:{margin:'10px 10px 2px',padding:'7px 12px',display:'flex',alignItems:'center',gap:6,background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.1em',borderRadius:5,textTransform:'uppercase',transition:'all 0.2s'},
  sbDiv:{height:1,background:'var(--b1)',margin:'8px 0 2px'},
  sbSection:{padding:'4px 14px 3px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase'},
  nav:{display:'flex',flexDirection:'column',gap:1,padding:'0 8px'},
  navItem:{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:5,fontFamily:'var(--f-ui)',fontSize:11.5,color:'var(--tx3)',transition:'all 0.18s',textAlign:'left',cursor:'pointer'},
  navOn:{color:'var(--amber)',background:'rgba(255,140,0,0.06)',borderLeft:'2px solid var(--amber)'},
  navSym:{fontSize:11,flexShrink:0,opacity:0.7},

  // Steps
  stepList:{padding:'2px 10px',display:'flex',flexDirection:'column'},
  stepRow:{display:'flex',gap:8,alignItems:'flex-start'},
  stepCol:{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0},
  dot:{width:13,height:13,borderRadius:'50%',border:'1.5px solid',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',marginTop:1},
  dotCore:{width:4,height:4,borderRadius:'50%',background:'var(--amber)'},
  dotLine:{width:'1.5px',height:14,borderRadius:1,margin:'2px 0'},
  stepText:{paddingBottom:10,flex:1},
  stepLabel:{fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.05em',transition:'color 0.3s'},
  stepDesc:{fontFamily:'var(--f-ui)',fontSize:9,color:'var(--tx3)',lineHeight:1.5,marginTop:2},

  sbFoot:{padding:'10px',borderTop:'1px solid var(--b1)',display:'flex',flexDirection:'column',gap:7},
  userRow:{display:'flex',alignItems:'center',gap:8},
  userAv:{width:24,height:24,borderRadius:'50%',flexShrink:0,background:'var(--lift)',border:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx2)'},
  userMail:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'},
  logoutBtn:{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx3)',textAlign:'left',padding:'2px 0',textDecoration:'underline'},

  // Main
  main:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',zIndex:10,minWidth:0},
  topBar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 16px',borderBottom:'1px solid var(--b1)',background:'rgba(10,10,16,0.7)',backdropFilter:'blur(20px)',flexShrink:0},
  modePill:{display:'flex',background:'rgba(255,255,255,0.03)',border:'1px solid var(--b2)',borderRadius:6,overflow:'hidden'},
  modeBtn:{padding:'6px 14px',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.1em',color:'var(--tx3)',transition:'all 0.2s',display:'flex',alignItems:'center',gap:5},
  modeOn:{background:'rgba(255,140,0,0.1)',color:'var(--amber)'},
  lock:{fontSize:8,opacity:0.7},
  shareBtn:{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:5,background:'rgba(255,255,255,0.03)',border:'1px solid var(--b1)',color:'var(--tx3)',transition:'all 0.2s'},

  msgs:{flex:1,overflowY:'auto',padding:'14px 18px',display:'flex',flexDirection:'column',gap:10},
  row:{display:'flex',alignItems:'flex-end',gap:9},
  av:{width:26,height:26,minWidth:26,position:'relative',flexShrink:0,marginBottom:2},
  avHex:{position:'absolute',inset:0,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'},
  avTxt:{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:5.5,fontWeight:600,color:'var(--void)'},
  bub:{maxWidth:'72%',borderRadius:11,padding:'10px 13px',position:'relative'},
  bubU:{background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',borderBottomRightRadius:2,color:'var(--tx1)'},
  bubA:{background:'rgba(255,255,255,0.025)',border:'1px solid var(--b1)',borderBottomLeftRadius:2},
  bubTxt:{fontFamily:'var(--f-ui)',fontSize:13.5,lineHeight:1.72,color:'var(--tx2)',whiteSpace:'pre-wrap',margin:0},
  cached:{display:'inline-block',fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',marginTop:3,opacity:0.5},
  premBubBtn:{display:'block',marginTop:10,width:'100%',background:'rgba(255,140,0,0.05)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.08em',padding:'9px 11px',borderRadius:5,textTransform:'uppercase',textAlign:'left'},
  time:{display:'block',fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',marginTop:4,textAlign:'right'},
  dots:{display:'flex',gap:5,alignItems:'center'},
  dot2:{width:4,height:4,borderRadius:'50%',background:'var(--tx3)',display:'inline-block',animation:'blink 1.4s ease-in-out infinite'},

  // Composer
  composer:{padding:'7px 14px 12px',borderTop:'1px solid var(--b1)',background:'rgba(5,5,8,0.6)',backdropFilter:'blur(14px)',flexShrink:0},
  compLabel:{textAlign:'center',fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.24em',color:'var(--tx3)',textTransform:'uppercase',marginBottom:6},
  compBox:{display:'flex',alignItems:'flex-end',gap:7,background:'rgba(255,255,255,0.025)',border:'1px solid var(--b2)',borderRadius:9,padding:'7px 9px'},
  compIco:{width:26,height:26,flexShrink:0,borderRadius:5,background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.2s'},
  recOn:{background:'rgba(255,140,0,0.15)',animation:'recPulse 1s ease-in-out infinite'},
  ta:{flex:1,background:'transparent',border:'none',color:'var(--tx1)',fontSize:13,lineHeight:'1.55',minHeight:19,maxHeight:96,overflowY:'auto',padding:'3px 0'},
  sendBtn:{width:28,height:28,flexShrink:0,background:'var(--amber)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--void)',transition:'all 0.2s',boxShadow:'0 3px 10px rgba(255,140,0,0.22)'},
  compFoot:{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:5,padding:'0 2px',gap:8},
  hint:{fontFamily:'var(--f-mono)',fontSize:7,color:'var(--tx3)',flexShrink:0,letterSpacing:'0.04em'},
  disclaimer:{fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',textAlign:'center',flex:1,letterSpacing:'0.03em'},
  premHint:{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',letterSpacing:'0.1em',flexShrink:0},

  // Right sidebar
  rb:{width:172,minWidth:172,height:'100vh',background:'var(--pitch)',borderLeft:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'},
  rbTitle:{padding:'14px 12px 8px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',borderBottom:'1px solid var(--b1)',flexShrink:0},
  rbList:{flex:1,overflowY:'auto',padding:'4px 6px'},
  rbItem:{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'7px 8px',borderRadius:5,textAlign:'left',transition:'all 0.18s',marginBottom:1},
  rbSym:{fontSize:11,flexShrink:0,color:'var(--amber)',opacity:0.7},
  rbInfo:{flex:1,minWidth:0},
  rbName:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx2)',letterSpacing:'0.04em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
  rbSub:{fontFamily:'var(--f-ui)',fontSize:8,color:'var(--tx3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:1},
}

// Sub-view shared styles
const v: Record<string,React.CSSProperties> = {
  root:{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10},
  inner:{width:'100%',maxWidth:860,padding:'0 24px 48px',flex:1,display:'flex',flexDirection:'column'},
  hdr:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:24,flexShrink:0},
  back:{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',letterSpacing:'0.1em'},
  title:{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--chrome)'},
  editBtn:{fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'5px 12px',borderRadius:4,letterSpacing:'0.1em',textTransform:'uppercase'},
  empty:{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14},
  emptyTxt:{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)',letterSpacing:'0.08em'},
  emptyBtn:{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'9px 18px',borderRadius:5,letterSpacing:'0.1em',textTransform:'uppercase'},
  section:{marginBottom:24},
  secLabel:{fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.18em',color:'var(--amber)',textTransform:'uppercase',marginBottom:12},
  constellationBox:{background:'rgba(255,255,255,0.02)',border:'1px solid var(--b1)',borderRadius:12,padding:20},
  infoRow:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',background:'rgba(255,255,255,0.02)',borderRadius:5,border:'1px solid var(--b1)',marginBottom:7},
  infoLbl:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',letterSpacing:'0.1em',textTransform:'uppercase'},
  infoVal:{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx1)'},
  card:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 15px',background:'rgba(255,255,255,0.02)',border:'1px solid var(--b1)',borderRadius:7,marginBottom:8,textAlign:'left',width:'100%',transition:'border-color 0.2s'},
  cardTitle:{fontFamily:'var(--f-ui)',fontSize:13,color:'var(--tx1)'},
  cardSci:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',marginTop:3,letterSpacing:'0.06em'},
  cardDate:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'},
  typeCard:{padding:'20px',background:'rgba(255,255,255,0.02)',border:'1px solid var(--b1)',borderRadius:10,textAlign:'left',transition:'border-color 0.2s'},
}

// Premium plan styles
const pl: Record<string,React.CSSProperties> = {
  card:{background:'var(--pitch)',border:'1px solid var(--b2)',borderRadius:14,padding:'24px 20px',display:'flex',flexDirection:'column',gap:10},
  accent:{border:'1px solid var(--ab2)',background:'rgba(255,140,0,0.025)',boxShadow:'0 0 30px rgba(255,140,0,0.05)'},
  pop:{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.12em',padding:'3px 12px',borderRadius:20,whiteSpace:'nowrap'},
  badge:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase'},
  name:{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.06em',color:'var(--chrome)',textTransform:'uppercase'},
  cta:{padding:'11px 16px',width:'100%',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:5},
  ctaAccent:{background:'var(--amber)',color:'var(--void)',border:'1px solid var(--amber)',boxShadow:'0 4px 20px rgba(255,140,0,0.2)'},
}

// Birth modal styles
const bm: Record<string,React.CSSProperties> = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20},
  modal:{background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:14,padding:'26px 22px',width:'100%',maxWidth:400,display:'flex',flexDirection:'column',gap:13,animation:'fadeUp 0.3s var(--expo) both',boxShadow:'0 40px 100px rgba(0,0,0,0.8)'},
  hdr:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'},
  tag:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',marginBottom:4},
  title:{fontFamily:'var(--f-display)',fontSize:22,letterSpacing:'0.05em',textTransform:'uppercase',color:'var(--chrome)'},
  close:{fontFamily:'var(--f-mono)',fontSize:13,color:'var(--tx3)',padding:'4px 6px'},
  sub:{fontFamily:'var(--f-ui)',fontSize:12.5,color:'var(--tx2)',lineHeight:1.65,fontStyle:'italic'},
  fields:{display:'flex',flexDirection:'column',gap:11},
  field:{display:'flex',flexDirection:'column',gap:4},
  lbl:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.15em',color:'var(--tx3)',textTransform:'uppercase'},
  inp:{background:'rgba(255,255,255,0.04)',border:'1px solid var(--b2)',borderRadius:6,padding:'9px 11px',color:'var(--tx1)',fontSize:13,width:'100%'},
  btn:{padding:'12px 18px',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 5px 20px rgba(255,140,0,0.2)'},
}
