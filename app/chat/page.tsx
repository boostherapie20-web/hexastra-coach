'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
type Msg = { id: string; role: 'user'|'assistant'; content: string; created_at: string; showPremium?: boolean; cached?: boolean }
type Mode = 'libre'|'praticien'
type View = 'chat'|'profile'|'premium'|'nouveau'
type Step = 1|2|3|4
type Project = { id: string; name: string; readingIds: string[]; collapsed: boolean }
type Reading = { id: string; title: string; science: string; date: string; preview: string; projectId?: string }

// ═══════════════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════════════
const TIMEZONES = [
  { v:'auto',               l:'Fuseau horaire automatique' },
  { v:'UTC',                l:'00:00 GMT / TU' },
  { v:'Atlantic/Azores',    l:'w01:00 Afrique Occ.' },
  { v:'America/Noronha',    l:'w02:00 Mid Atlantic T.' },
  { v:'America/Sao_Paulo',  l:'w03:00 BRZ2 / ADT' },
  { v:'America/St_Johns',   l:'w03:30 Terre-Neuve' },
  { v:'America/New_York',   l:'w04:00 AST / EDT' },
  { v:'America/Chicago',    l:'w05:00 HNE / CDT' },
  { v:'America/Denver',     l:'w06:00 CST / MDT' },
  { v:'America/Los_Angeles',l:'w07:00 MST / PDT' },
  { v:'America/Anchorage',  l:'w08:00 PST' },
  { v:'America/Adak',       l:'w09:00 AHDT / YST' },
  { v:'Pacific/Honolulu',   l:'w10:00 AHST' },
  { v:'Pacific/Midway',     l:'w11:00 Heure de Bering' },
  { v:'Europe/London',      l:'e01:00 CET / BST' },
  { v:'Europe/Paris',       l:'e01:00 CET / CEST (Paris)' },
  { v:'Europe/Helsinki',    l:'e02:00 EET / CEST' },
  { v:'Europe/Moscow',      l:'e03:00 Zone Rus. 3' },
  { v:'Asia/Dubai',         l:'e04:00 Zone Rus. 4' },
  { v:'Asia/Karachi',       l:'e05:00 Pakistan' },
  { v:'Asia/Kolkata',       l:'e05:30 Inde' },
  { v:'Asia/Dhaka',         l:'e06:00 Bangladesh' },
  { v:'Asia/Bangkok',       l:'e07:00 Indochine' },
  { v:'Asia/Shanghai',      l:'e08:00 Chine' },
  { v:'Asia/Tokyo',         l:'e09:00 Japon' },
  { v:'Australia/Sydney',   l:'e10:00 Australie Est' },
  { v:'Pacific/Auckland',   l:'e12:00 Nouvelle-Zélande' },
]

const COUNTRIES = ['Afghanistan','Afrique du Sud','Albanie','Algérie','Allemagne','Andorre','Angola',
  'Arabie Saoudite','Argentine','Arménie','Australie','Autriche','Azerbaïdjan','Belgique','Bénin',
  'Bolivie','Bosnie','Brésil','Bulgarie','Burkina Faso','Cambodge','Cameroun','Canada','Chili',
  'Chine','Chypre','Colombie','Congo','Corée du Sud','Costa Rica',"Côte d'Ivoire",'Croatie','Cuba',
  'Danemark','Égypte','Émirats Arabes','Équateur','Espagne','Estonie','États-Unis','Éthiopie',
  'Finlande','France','Gabon','Ghana','Grèce','Guatemala','Guinée','Haïti','Honduras','Hongrie',
  'Inde','Indonésie','Irak','Iran','Irlande','Islande','Israël','Italie','Jamaïque','Japon',
  'Jordanie','Kazakhstan','Kenya','Koweït','Laos','Lettonie','Liban','Libye','Lituanie',
  'Luxembourg','Madagascar','Malaisie','Mali','Malte','Maroc','Mauritanie','Mexique','Monaco',
  'Mongolie','Maroc','Myanmar','Namibie','Népal','Nicaragua','Niger','Nigeria','Norvège',
  'Nouvelle-Zélande','Oman','Ouganda','Pakistan','Palestine','Panama','Paraguay','Pays-Bas',
  'Pérou','Philippines','Pologne','Portugal','Qatar','République Tchèque','Roumanie',
  'Royaume-Uni','Russie','Rwanda','Sénégal','Serbie','Singapour','Slovaquie','Slovénie',
  'Somalie','Soudan','Sri Lanka','Suède','Suisse','Syrie','Taïwan','Tanzanie','Thaïlande',
  'Togo','Tunisie','Turquie','Ukraine','Uruguay','Venezuela','Vietnam','Yémen','Zimbabwe',
]

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

// ═══════════════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════════════
function Stars() {
  const s = useRef(Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*1.4+0.3,d:Math.random()*4}))).current
  return <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>{s.map(st=><div key={st.id} style={{position:'absolute',left:`${st.x}%`,top:`${st.y}%`,width:st.sz,height:st.sz,borderRadius:'50%',background:'rgba(255,255,255,0.5)',animation:`pulse ${2+st.d}s ease-in-out ${st.d}s infinite`}}/>)}</div>
}

// ═══════════════════════════════════════════════════════════════
// CITY AUTOCOMPLETE (Nominatim)
// ═══════════════════════════════════════════════════════════════
function CityInput({ value, onChange, placeholder }: { value: string; onChange: (v:string, lat?:number, lon?:number) => void; placeholder?: string }) {
  const [sugg, setSugg] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const tmr = useRef<any>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setSugg([]); setOpen(false); return }
    setLoading(true)
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1&accept-language=fr`)
      const d = await r.json()
      setSugg(d); setOpen(d.length > 0)
    } catch {}
    setLoading(false)
  }, [])

  const pick = (item: any) => {
    const parts = item.display_name.split(',')
    const name = parts.slice(0,2).join(',').trim()
    onChange(name, parseFloat(item.lat), parseFloat(item.lon))
    setSugg([]); setOpen(false)
  }

  return (
    <div style={{position:'relative'}}>
      <div style={{position:'relative'}}>
        <input value={value} onChange={e=>{onChange(e.target.value); clearTimeout(tmr.current); tmr.current=setTimeout(()=>search(e.target.value),320)}}
          placeholder={placeholder||'Rechercher une ville...'} style={fm.inp}
          onFocus={()=>sugg.length>0&&setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)}/>
        {loading&&<div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',width:10,height:10,border:'1.5px solid var(--ab2)',borderTop:'1.5px solid var(--amber)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>}
      </div>
      {open&&sugg.length>0&&(
        <div style={{position:'absolute',top:'calc(100% + 2px)',left:0,right:0,zIndex:400,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:7,overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,0.7)',maxHeight:220,overflowY:'auto'}}>
          {sugg.map((s,i)=>(
            <button key={i} onMouseDown={()=>pick(s)} style={{display:'block',width:'100%',padding:'8px 12px',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background 0.12s',cursor:'pointer'}}>
              <div style={{fontFamily:'var(--f-ui)',fontSize:13,color:'var(--tx1)'}}>{s.display_name.split(',').slice(0,2).join(', ')}</div>
              <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',marginTop:1}}>{s.display_name.split(',').slice(2,4).join(',').trim()} · {parseFloat(s.lat).toFixed(3)}, {parseFloat(s.lon).toFixed(3)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BIRTH MODAL
// ═══════════════════════════════════════════════════════════════
function BirthModal({ existing, onSubmit, onClose }: { existing?: any; onSubmit: (d:any)=>void; onClose: ()=>void }) {
  const [firstName, setFirstName] = useState(existing?.firstName||'')
  const [lastName,  setLastName]  = useState(existing?.lastName||'')
  const [date,      setDate]      = useState(existing?.date||'')
  const [time,      setTime]      = useState(existing?.time!=='inconnue'?existing?.time||'':'')
  const [noTime,    setNoTime]    = useState(existing?.time==='inconnue')
  const [city,      setCity]      = useState(existing?.place||'')
  const [cityLat,   setCityLat]   = useState<number|undefined>(existing?.lat)
  const [cityLon,   setCityLon]   = useState<number|undefined>(existing?.lon)
  const [country,   setCountry]   = useState(existing?.country||'France')
  const [tz,        setTz]        = useState(existing?.timezone||'auto')
  const [gpsLoad,   setGpsLoad]   = useState(false)
  const [err,       setErr]       = useState('')

  const gps = () => {
    if(!navigator.geolocation){setErr('Géolocalisation non disponible');return}
    setGpsLoad(true)
    navigator.geolocation.getCurrentPosition(async pos=>{
      const {latitude:lat,longitude:lon}=pos.coords
      setCityLat(lat); setCityLon(lon)
      try{
        const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`)
        const d=await r.json()
        if(d.address?.city||d.address?.town) setCity(d.address.city||d.address.town||'')
        if(d.address?.country) setCountry(d.address.country)
      }catch{}
      setGpsLoad(false)
    },()=>{setErr('Position non disponible');setGpsLoad(false)})
  }

  const submit = () => {
    if(!firstName.trim()){setErr('Le prénom est requis.');return}
    if(!date){setErr('La date de naissance est requise.');return}
    if(!noTime&&!time){setErr("Indique l'heure ou coche « heure inconnue ».");return}
    if(!city.trim()){setErr('La ville de naissance est requise.');return}
    if(!country.trim()){setErr('Le pays de naissance est requis.');return}
    onSubmit({firstName,lastName,name:`${firstName} ${lastName}`.trim(),date,time:noTime?'inconnue':time,place:city,country,lat:cityLat,lon:cityLon,timezone:tz})
  }

  return (
    <div style={fm.overlay}>
      <div style={fm.modal}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={fm.tag}>// Profil personnel</div>
            <h2 style={fm.title}>Données de naissance</h2>
          </div>
          <button style={fm.close} onClick={onClose}>✕</button>
        </div>
        <p style={fm.sub}>Ces données restent en mémoire pour personnaliser chaque lecture automatiquement.</p>
        <div style={{height:1,background:'var(--b1)'}}/>

        {/* Prénom + Nom */}
        <div style={{display:'flex',gap:10}}>
          <div style={{...fm.field,flex:1}}>
            <label style={fm.lbl}>Prénom <Req/></label>
            <input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Prénom" style={fm.inp}/>
          </div>
          <div style={{...fm.field,flex:1}}>
            <label style={fm.lbl}>Nom de famille</label>
            <input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Optionnel" style={fm.inp}/>
          </div>
        </div>

        {/* Date */}
        <div style={fm.field}>
          <label style={fm.lbl}>Date de naissance <Req/></label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={fm.inp}/>
        </div>

        {/* Heure */}
        <div style={fm.field}>
          <label style={fm.lbl}>Heure de naissance</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...fm.inp,opacity:noTime?0.4:1}}/>
          <label style={{display:'flex',alignItems:'center',gap:7,marginTop:5,cursor:'pointer'}}>
            <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:'var(--amber)'}}/>
            <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'}}>Heure inconnue (lecture probabiliste)</span>
          </label>
        </div>

        {/* Fuseau */}
        <div style={fm.field}>
          <label style={fm.lbl}>Fuseau horaire / Heure d'été</label>
          <div style={{position:'relative'}}>
            <select value={tz} onChange={e=>setTz(e.target.value)} style={{...fm.inp,paddingRight:28,appearance:'none' as any,cursor:'pointer'}}>
              {TIMEZONES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
            <div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--tx3)',fontSize:10}}>▾</div>
          </div>
        </div>

        {/* Ville avec GPS */}
        <div style={fm.field}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
            <label style={fm.lbl}>Ville de naissance <Req/></label>
            <button onClick={gps} disabled={gpsLoad} style={{display:'flex',alignItems:'center',gap:4,fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--amber)',cursor:'pointer'}}>
              {gpsLoad?<Spin/>:<span>⊕</span>}
              {gpsLoad?'Localisation...':'Ma position GPS'}
            </button>
          </div>
          <CityInput value={city} onChange={(v,lat,lon)=>{setCity(v);if(lat!==undefined){setCityLat(lat);setCityLon(lon)}}} placeholder="Rechercher la ville de naissance..."/>
          {cityLat&&<div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--tx3)',marginTop:3}}>📍 {cityLat.toFixed(4)}, {cityLon?.toFixed(4)}</div>}
        </div>

        {/* Pays */}
        <div style={fm.field}>
          <label style={fm.lbl}>Pays de naissance <Req/></label>
          <div style={{position:'relative'}}>
            <select value={country} onChange={e=>setCountry(e.target.value)} style={{...fm.inp,paddingRight:28,appearance:'none' as any,cursor:'pointer'}}>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--tx3)',fontSize:10}}>▾</div>
          </div>
        </div>

        {err&&<p style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#ff6060',marginTop:-4}}>{err}</p>}

        <button onClick={submit} style={fm.btn}>
          Enregistrer & lancer ma lecture
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}

function Req() { return <span style={{color:'var(--amber)'}}>*</span> }
function Spin() { return <div style={{width:8,height:8,border:'1.5px solid var(--amber)',borderTop:'1.5px solid transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}}/> }

const fm: Record<string,React.CSSProperties> = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20},
  modal:{background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:14,padding:'22px 20px',width:'100%',maxWidth:430,display:'flex',flexDirection:'column',gap:11,animation:'fadeUp 0.3s var(--expo) both',boxShadow:'0 40px 100px rgba(0,0,0,0.8)',maxHeight:'92vh',overflowY:'auto'},
  tag:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',marginBottom:4},
  title:{fontFamily:'var(--f-display)',fontSize:22,letterSpacing:'0.05em',textTransform:'uppercase',color:'var(--chrome)'},
  close:{fontFamily:'var(--f-mono)',fontSize:13,color:'var(--tx3)',padding:'4px 6px',cursor:'pointer'},
  sub:{fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)',lineHeight:1.6,fontStyle:'italic'},
  field:{display:'flex',flexDirection:'column'},
  lbl:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.15em',color:'var(--tx3)',textTransform:'uppercase',marginBottom:4},
  inp:{background:'rgba(255,255,255,0.04)',border:'1px solid var(--b2)',borderRadius:6,padding:'9px 11px',color:'var(--tx1)',fontSize:13,width:'100%',fontFamily:'var(--f-ui)'},
  btn:{padding:'12px 18px',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 5px 20px rgba(255,140,0,0.2)',cursor:'pointer',border:'none',marginTop:4},
}

// ═══════════════════════════════════════════════════════════════
// SEARCH MODAL
// ═══════════════════════════════════════════════════════════════
function SearchModal({ readings, onClose, onSelect }: { readings: Reading[]; onClose: ()=>void; onSelect: (r:Reading)=>void }) {
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(()=>{ setTimeout(()=>inputRef.current?.focus(),50) },[])

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now()-86400000).toDateString()

  const filtered = q
    ? readings.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())||r.science.toLowerCase().includes(q.toLowerCase())||r.preview.toLowerCase().includes(q.toLowerCase()))
    : readings

  const todayR    = filtered.filter(r=>new Date(r.date).toDateString()===today)
  const yesterdayR= filtered.filter(r=>new Date(r.date).toDateString()===yesterday)
  const olderR    = filtered.filter(r=>new Date(r.date).toDateString()!==today&&new Date(r.date).toDateString()!==yesterday)

  const groups = q ? [{ label:'Résultats', items: filtered }] : [
    { label:'Aujourd\'hui',  items: todayR },
    { label:'Hier',          items: yesterdayR },
    ...(q ? [{ label:'Plus ancien', items: olderR }] : []),
  ]

  return (
    <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'60px 20px 20px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:560,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:12,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.8)',animation:'fadeUp 0.25s var(--expo) both'}}>
        {/* Search bar */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderBottom:'1px solid var(--b1)'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Rechercher des lectures..."
            style={{flex:1,background:'transparent',border:'none',color:'var(--tx1)',fontSize:14,fontFamily:'var(--f-ui)'}}/>
          <button onClick={onClose} style={{fontFamily:'var(--f-mono)',fontSize:12,color:'var(--tx3)',cursor:'pointer'}}>✕</button>
        </div>
        {/* Results */}
        <div style={{maxHeight:420,overflowY:'auto'}}>
          {groups.map(g=>g.items.length>0&&(
            <div key={g.label}>
              <div style={{padding:'10px 16px 4px',fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.12em',color:'var(--tx3)',textTransform:'uppercase'}}>{g.label}</div>
              {g.items.map(r=>(
                <button key={r.id} onClick={()=>{onSelect(r);onClose()}}
                  style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 16px',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.03)',transition:'background 0.15s',cursor:'pointer'}}>
                  <div style={{width:28,height:28,borderRadius:5,background:'rgba(255,140,0,0.08)',border:'1px solid var(--ab1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{fontSize:10,color:'var(--amber)'}}>◈</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:'var(--f-ui)',fontSize:13,color:'var(--tx1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                    <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',marginTop:1}}>{r.science} · {new Date(r.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',flexShrink:0}}>{new Date(r.date).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div>
                </button>
              ))}
            </div>
          ))}
          {filtered.length===0&&(
            <div style={{padding:'32px',textAlign:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucune lecture trouvée</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SHARE MODAL
// ═══════════════════════════════════════════════════════════════
function ShareModal({ messages, onClose }: { messages: Msg[]; onClose: ()=>void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)

  const aiMsgs = messages.filter(m=>m.role==='assistant'&&m.content.length>30)

  const toggle = (id: string) => setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  const selectAll = () => setSelected(new Set(aiMsgs.map(m=>m.id)))
  const clear = () => setSelected(new Set())

  const share = async () => {
    const text = messages
      .filter(m=>selected.has(m.id)||(m.role==='user'&&messages.findIndex(x=>x.id===m.id)<messages.findIndex(x=>selected.has(x.id))+1))
      .map(m=>`[${m.role==='user'?'Vous':'HexAstra Coach'}]\n${m.content}`)
      .join('\n\n---\n\n')
    const shareText = `✦ Lecture HexAstra Coach\n\n${text}\n\n— hexastra.com`
    if(navigator.share) { try { await navigator.share({title:'Lecture HexAstra',text:shareText}); onClose() } catch {} }
    else { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(10px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:480,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:12,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.8)',animation:'fadeUp 0.25s var(--expo) both'}}>
        <div style={{padding:'16px 18px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:3}}>// Partager</div>
            <div style={{fontFamily:'var(--f-display)',fontSize:16,color:'var(--chrome)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Sélectionner les lectures</div>
          </div>
          <button onClick={onClose} style={{color:'var(--tx3)',fontSize:13,fontFamily:'var(--f-mono)',cursor:'pointer'}}>✕</button>
        </div>
        <div style={{padding:'10px 18px',borderBottom:'1px solid var(--b1)',display:'flex',gap:10}}>
          <button onClick={selectAll} style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',letterSpacing:'0.08em',cursor:'pointer',textTransform:'uppercase'}}>Tout sélect.</button>
          <button onClick={clear} style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',letterSpacing:'0.08em',cursor:'pointer',textTransform:'uppercase'}}>Effacer</button>
        </div>
        <div style={{maxHeight:300,overflowY:'auto'}}>
          {aiMsgs.map(m=>(
            <label key={m.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.03)',cursor:'pointer'}}>
              <input type="checkbox" checked={selected.has(m.id)} onChange={()=>toggle(m.id)} style={{accentColor:'var(--amber)',marginTop:3,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'var(--f-ui)',fontSize:12.5,color:'var(--tx2)',lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any}}>{m.content}</div>
                <div style={{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx3)',marginTop:3}}>{new Date(m.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            </label>
          ))}
          {aiMsgs.length===0&&<div style={{padding:24,textAlign:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucune lecture à partager</div>}
        </div>
        <div style={{padding:'14px 18px'}}>
          <button onClick={share} disabled={selected.size===0}
            style={{width:'100%',padding:'11px',background:selected.size>0?'var(--amber)':'rgba(255,255,255,0.05)',color:selected.size>0?'var(--void)':'var(--tx3)',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:5,cursor:selected.size>0?'pointer':'default',transition:'all 0.2s',border:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {copied?'✓ Copié dans le presse-papier':`${selected.size>0?`Partager ${selected.size} lecture${selected.size>1?'s':''}`:'Sélectionner des lectures'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// RIGHT SIDEBAR — Vos Lectures + Sciences
// ═══════════════════════════════════════════════════════════════
function RightSidebar({ mode, readings, projects, onSend, onOpenReading, onAddToProject, dragId, setDragId }: {
  mode: Mode; readings: Reading[]; projects: Project[]; onSend: (t:string)=>void;
  onOpenReading: (r:Reading)=>void; onAddToProject: (rId:string, pId:string)=>void;
  dragId: string|null; setDragId: (id:string|null)=>void;
}) {
  const [lecturesOpen, setLecturesOpen] = useState(true)
  const [dropTarget, setDropTarget] = useState<string|null>(null)
  const menu = mode==='libre' ? MENU_LIBRE : MENU_PRATICIEN
  const freeReadings = readings.filter(r=>!r.projectId)

  return (
    <aside style={rb.wrap}>
      {/* Mode label */}
      <div style={rb.modeLabel}>{mode==='libre'?'// Mode Libre':'// Mode Praticien'}</div>

      {/* VOS LECTURES */}
      <div style={rb.section}>
        <button style={rb.sectionHdr} onClick={()=>setLecturesOpen(o=>!o)}>
          <span style={rb.sectionTitle}>Vos lectures</span>
          <span style={{fontSize:9,color:'var(--tx3)',transition:'transform 0.2s',display:'inline-block',transform:lecturesOpen?'rotate(0)':'rotate(-90deg)'}}>▾</span>
        </button>
        {lecturesOpen&&(
          <div style={{paddingBottom:4}}>
            {freeReadings.length===0?(
              <div style={{padding:'8px 10px',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',textAlign:'center' as const}}>Aucune lecture</div>
            ):freeReadings.map(r=>(
              <div key={r.id}
                draggable onDragStart={()=>setDragId(r.id)} onDragEnd={()=>setDragId(null)}
                style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:5,marginBottom:1,cursor:'grab',background:dragId===r.id?'rgba(255,140,0,0.06)':'transparent',transition:'background 0.15s'}}
                onClick={()=>onOpenReading(r)}>
                <span style={{fontSize:9,color:'var(--amber)',flexShrink:0}}>◈</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                  <div style={{fontFamily:'var(--f-ui)',fontSize:8,color:'var(--tx3)',marginTop:1}}>{r.science}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={rb.divider}/>

      {/* NOS CATÉGORIES (Sciences) */}
      <div style={rb.section}>
        <div style={{...rb.sectionHdr,cursor:'default' as const}}>
          <span style={rb.sectionTitle}>Nos catégories</span>
        </div>
        <div style={{paddingBottom:4}}>
          {menu.map(item=>(
            <button key={item.id} style={rb.item} onClick={()=>onSend(`${item.label} — ${item.sub}`)}>
              <span style={rb.sym}>{item.sym}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={rb.name}>{item.label}</div>
                <div style={rb.sub}>{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

const rb: Record<string,React.CSSProperties> = {
  wrap:{width:175,minWidth:175,height:'100vh',background:'var(--pitch)',borderLeft:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'},
  modeLabel:{padding:'12px 11px 7px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',borderBottom:'1px solid var(--b1)',flexShrink:0},
  section:{flexShrink:0},
  sectionHdr:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 11px 4px',width:'100%',textAlign:'left' as const,cursor:'pointer',background:'transparent',border:'none'},
  sectionTitle:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.14em',color:'var(--tx3)',textTransform:'uppercase'},
  divider:{height:1,background:'var(--b1)',margin:'4px 0'},
  item:{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'6px 8px',borderRadius:5,textAlign:'left' as const,transition:'background 0.15s',marginBottom:1,cursor:'pointer',background:'transparent',border:'none'},
  sym:{fontSize:10,flexShrink:0,color:'var(--amber)',opacity:0.7},
  name:{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx2)',letterSpacing:'0.04em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
  sub:{fontFamily:'var(--f-ui)',fontSize:8,color:'var(--tx3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:1},
}

// ═══════════════════════════════════════════════════════════════
// LEFT SIDEBAR
// ═══════════════════════════════════════════════════════════════
const STEPS_DEF: { step: Step; label: string; desc: string }[] = [
  { step:1, label:'Langue & Mode',     desc:'Choix langue + Libre ou Praticien' },
  { step:2, label:'Données naissance', desc:'Date · Heure · Lieu · Pays' },
  { step:3, label:'Microlectures',     desc:'Profil · Année · Mois générés' },
  { step:4, label:'Exploration',       desc:'Menu · Thèmes · Sciences' },
]

function LeftSidebar({
  view, setView, mode, isPremium, userEmail, currentStep, stepLabels,
  projects, readings, onNewProject, onRenameProject, onDeleteProject,
  onOpenReading, onAddReadingToProject, onSearch, onLogout, dragId,
}: {
  view: View; setView: (v:View)=>void; mode: Mode; isPremium: boolean; userEmail: string;
  currentStep: Step; stepLabels: typeof STEPS_DEF;
  projects: Project[]; readings: Reading[];
  onNewProject: ()=>void; onRenameProject: (id:string,name:string)=>void;
  onDeleteProject: (id:string)=>void; onOpenReading: (r:Reading)=>void;
  onAddReadingToProject: (rId:string,pId:string)=>void; onSearch: ()=>void;
  onLogout: ()=>void; dragId: string|null;
}) {
  const [editingProject, setEditingProject] = useState<string|null>(null)
  const [editName, setEditName] = useState('')
  const [dropTarget, setDropTarget] = useState<string|null>(null)
  const [newProjInput, setNewProjInput] = useState(false)
  const [newProjName, setNewProjName] = useState('')

  const handleDrop = (e: React.DragEvent, pId: string) => {
    e.preventDefault()
    if(dragId) { onAddReadingToProject(dragId, pId) }
    setDropTarget(null)
  }

  const createProject = () => {
    if(newProjName.trim()) { onNewProject(); setNewProjInput(false); setNewProjName('') }
  }

  return (
    <aside style={sb.wrap}>
      {/* Logo */}
      <div style={sb.logo}>
        <img src="/logo/hexastra-logo-transparent.png" alt="HexAstra" style={{height:28,objectFit:'contain',display:'block'}}
          onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none';const next=e.currentTarget.nextElementSibling as HTMLElement;if(next)next.style.display='flex'}}/>
        <div style={{display:'none',alignItems:'center',gap:8}}>
          <div style={{width:20,height:20,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',boxShadow:'0 0 10px rgba(255,140,0,0.4)',animation:'amberPop 4s ease-in-out infinite',flexShrink:0}}/>
          <span style={{fontFamily:'var(--f-display)',fontSize:15,letterSpacing:'0.1em',color:'var(--chrome)',textTransform:'uppercase'}}>Hex<span style={{color:'var(--amber)'}}>Astra</span></span>
        </div>
      </div>

      {/* Nouvelle lecture */}
      <button style={sb.newBtn} onClick={()=>setView('chat')}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Nouvelle lecture
      </button>

      <div style={sb.div}/>

      {/* NAV */}
      <div style={sb.sec}>Navigation</div>
      <nav style={sb.nav}>
        <NavItem active={view==='chat'} sym="◈" label="Chat IA" onClick={()=>setView('chat')}/>
        <NavItem active={view==='nouveau'} sym="✦" label="Nouveau projet" onClick={()=>setView('nouveau')}/>
        <NavItem active={false} sym="⊕" label="Recherche" onClick={onSearch}/>
        <NavItem active={view==='profile'} sym="⬡" label="Données personnelles" onClick={()=>setView('profile')}/>
        <NavItem active={view==='premium'} sym="★" label="Premium" onClick={()=>setView('premium')}/>
      </nav>

      <div style={sb.div}/>

      {/* PROJETS */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 14px 3px'}}>
        <div style={sb.sec2}>Projets</div>
        <button onClick={()=>setNewProjInput(true)} style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--amber)',cursor:'pointer',opacity:0.8,padding:'2px 4px',background:'transparent',border:'none'}}>＋</button>
      </div>

      {newProjInput&&(
        <div style={{padding:'0 10px 6px',display:'flex',gap:6}}>
          <input autoFocus value={newProjName} onChange={e=>setNewProjName(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')createProject();if(e.key==='Escape'){setNewProjInput(false);setNewProjName('')}}}
            placeholder="Nom du projet..." style={{flex:1,background:'rgba(255,255,255,0.06)',border:'1px solid var(--ab1)',borderRadius:4,padding:'5px 8px',color:'var(--tx1)',fontSize:11,fontFamily:'var(--f-ui)'}}/>
          <button onClick={createProject} style={{background:'var(--amber)',color:'var(--void)',borderRadius:4,padding:'5px 8px',fontFamily:'var(--f-mono)',fontSize:9,cursor:'pointer',border:'none'}}>OK</button>
        </div>
      )}

      <div style={{flex:1,overflowY:'auto',minHeight:0,padding:'0 8px 4px'}}>
        {projects.map(p=>{
          const pReadings = readings.filter(r=>r.projectId===p.id)
          const isEditing = editingProject===p.id
          const isDrop = dropTarget===p.id
          return (
            <div key={p.id}
              onDragOver={e=>{e.preventDefault();setDropTarget(p.id)}}
              onDragLeave={()=>setDropTarget(null)}
              onDrop={e=>handleDrop(e,p.id)}
              style={{marginBottom:2,borderRadius:5,border:`1px solid ${isDrop?'var(--amber)':'transparent'}`,background:isDrop?'rgba(255,140,0,0.05)':'transparent',transition:'all 0.2s'}}>
              {/* Project header */}
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 6px',cursor:'pointer'}} onClick={()=>{}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2"><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                {isEditing?(
                  <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                    onBlur={()=>{onRenameProject(p.id,editName);setEditingProject(null)}}
                    onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditingProject(null)}}}
                    style={{flex:1,background:'transparent',border:'none',color:'var(--amber)',fontSize:11,fontFamily:'var(--f-ui)'}}/>
                ):(
                  <span style={{flex:1,fontFamily:'var(--f-ui)',fontSize:11,color:'var(--tx2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}
                    onDoubleClick={()=>{setEditingProject(p.id);setEditName(p.name)}}>{p.name}</span>
                )}
                <span style={{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx3)',flexShrink:0}}>{pReadings.length}</span>
              </div>
              {/* Project readings */}
              {pReadings.map(r=>(
                <button key={r.id} onClick={()=>onOpenReading(r)}
                  style={{display:'flex',alignItems:'center',gap:6,width:'100%',padding:'4px 6px 4px 22px',textAlign:'left' as const,cursor:'pointer',background:'transparent',border:'none'}}>
                  <span style={{fontSize:8,color:'var(--amber)',opacity:0.6}}>◈</span>
                  <span style={{fontFamily:'var(--f-ui)',fontSize:10.5,color:'var(--tx3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1}}>{r.title}</span>
                </button>
              ))}
              {isDrop&&<div style={{padding:'6px 22px',fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--amber)'}}>Déposer ici</div>}
            </div>
          )
        })}
        {projects.length===0&&(
          <div style={{padding:'10px 6px',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',textAlign:'center' as const,lineHeight:1.6}}>
            Crée un projet<br/>pour organiser tes lectures
          </div>
        )}
      </div>

      <div style={sb.div}/>

      {/* PROGRESSION — en bas */}
      <div style={sb.sec}>// Progression</div>
      <div style={{padding:'2px 10px 8px',flexShrink:0}}>
        {stepLabels.map(({step:n,label,desc},i)=>{
          const done=currentStep>n, active=currentStep===n
          return (
            <div key={n} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                <div style={{width:13,height:13,borderRadius:'50%',border:`1.5px solid ${done||active?'var(--amber)':'var(--b2)'}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',marginTop:1,background:done?'var(--amber)':'transparent',boxShadow:active?'0 0 8px rgba(255,140,0,0.45)':'none'}}>
                  {done&&<span style={{fontSize:7,color:'var(--void)'}}>✓</span>}
                  {active&&<div style={{width:4,height:4,borderRadius:'50%',background:'var(--amber)'}}/>}
                </div>
                {i<3&&<div style={{width:'1.5px',height:14,borderRadius:1,margin:'2px 0',background:done?'rgba(255,140,0,0.3)':'var(--b1)'}}/>}
              </div>
              <div style={{paddingBottom:10,flex:1}}>
                <div style={{fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.05em',color:done||active?'var(--tx1)':'var(--tx3)',transition:'color 0.3s'}}>{label}</div>
                {active&&<div style={{fontFamily:'var(--f-ui)',fontSize:9,color:'var(--tx3)',lineHeight:1.5,marginTop:2}}>{desc}</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={sb.div}/>

      {/* User */}
      <div style={{padding:'10px',display:'flex',flexDirection:'column',gap:7,flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'var(--lift)',border:'1px solid var(--b2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx2)',flexShrink:0}}>{userEmail[0]?.toUpperCase()||'U'}</div>
          <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail}</div>
        </div>
        <button style={{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx3)',textAlign:'left' as const,textDecoration:'underline',background:'transparent',border:'none',cursor:'pointer'}} onClick={onLogout}>Déconnexion</button>
      </div>
    </aside>
  )
}

function NavItem({ active, sym, label, onClick }: { active:boolean; sym:string; label:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:5,fontFamily:'var(--f-ui)',fontSize:11.5,color:active?'var(--amber)':'var(--tx3)',background:active?'rgba(255,140,0,0.06)':'transparent',borderLeft:active?'2px solid var(--amber)':'2px solid transparent',borderRight:'none',borderTop:'none',borderBottom:'none',transition:'all 0.18s',textAlign:'left' as const,cursor:'pointer',width:'100%'}}>
      <span style={{fontSize:11,flexShrink:0,opacity:0.7}}>{sym}</span>
      {label}
    </button>
  )
}

const sb: Record<string,React.CSSProperties> = {
  wrap:{width:210,minWidth:210,height:'100vh',background:'var(--pitch)',borderRight:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'},
  logo:{padding:'14px 14px 10px',borderBottom:'1px solid var(--b1)',minHeight:52,display:'flex',alignItems:'center'},
  newBtn:{margin:'10px 10px 2px',padding:'7px 12px',display:'flex',alignItems:'center',gap:6,background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.1em',borderRadius:5,textTransform:'uppercase',cursor:'pointer'},
  div:{height:1,background:'var(--b1)',margin:'6px 0 2px',flexShrink:0},
  sec:{padding:'4px 14px 3px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase',flexShrink:0},
  sec2:{fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase'},
  nav:{display:'flex',flexDirection:'column',gap:1,padding:'0 8px',flexShrink:0},
}

// ═══════════════════════════════════════════════════════════════
// MAIN CHAT PAGE
// ═══════════════════════════════════════════════════════════════
export default function ChatPage() {
  const [messages,   setMessages]   = useState<Msg[]>([{ id:'0', role:'assistant', created_at:new Date().toISOString(), content:'Bienvenue.\nJe suis HexAstra Coach.\n\nChoisis ta langue / Choose your language :\nFrançais / English' }])
  const [input,      setInput]      = useState('')
  const [isTyping,   setIsTyping]   = useState(false)
  const [mode,       setMode]       = useState<Mode>('libre')
  const [isPremium,  setIsPremium]  = useState(false)
  const [view,       setView]       = useState<View>('chat')
  const [step,       setStep]       = useState<Step>(1)
  const [showBirth,  setShowBirth]  = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showShare,  setShowShare]  = useState(false)
  const [convId,     setConvId]     = useState<string|null>(null)
  const [msgCount,   setMsgCount]   = useState(0)
  const [userEmail,  setUserEmail]  = useState('')
  const [profile,    setProfile]    = useState<any>(null)
  const [isRec,      setIsRec]      = useState(false)
  const [mediaRec,   setMediaRec]   = useState<MediaRecorder|null>(null)
  const [dragId,     setDragId]     = useState<string|null>(null)
  const [projects,   setProjects]   = useState<Project[]>([])
  const [readings,   setReadings]   = useState<Reading[]>([])
  const replyCache = useRef(new Map<string,string>())
  const endRef = useRef<HTMLDivElement>(null)
  const taRef  = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Adaptive step labels based on user choices
  const stepLabels = [
    { step:1 as Step, label: mode==='libre'?'Mode Libre actif':'Mode Praticien actif', desc:`Langue + mode ${mode} configuré` },
    { step:2 as Step, label: profile?`${profile.firstName||'Profil'} · ${profile.place||''}`: 'Données naissance', desc:'Date · Heure · Lieu · Pays' },
    { step:3 as Step, label:'Microlectures', desc:'Profil · Année · Mois générés' },
    { step:4 as Step, label:'Exploration active', desc:`${messages.length-1} message${messages.length>2?'s':''} · ${readings.length} lecture${readings.length>1?'s':''}` },
  ]

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ if(data.user) setUserEmail(data.user.email||'') })
    const sp = localStorage.getItem('hx_profile')
    if(sp) { setProfile(JSON.parse(sp)); setStep(s=>s<2?2:s) }
    const sr = localStorage.getItem('hx_readings')
    if(sr) setReadings(JSON.parse(sr))
    const spr = localStorage.getItem('hx_projects')
    if(spr) setProjects(JSON.parse(spr))
  },[])

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages,isTyping])
  useEffect(()=>{
    if(taRef.current){ taRef.current.style.height='auto'; taRef.current.style.height=Math.min(taRef.current.scrollHeight,96)+'px' }
  },[input])

  const bump = useCallback((len:number)=>{
    if(len>=2) setStep(s=>s<2?2:s)
    if(len>=5) setStep(s=>s<3?3:s)
    if(len>=8) setStep(s=>s<4?4:s)
  },[])

  const saveReading = useCallback((msgs: Msg[]) => {
    const ai = msgs.filter(m=>m.role==='assistant').pop()
    if(!ai||ai.id==='0') return
    const r: Reading = {
      id: Date.now().toString(), title: msgs.find(m=>m.role==='user')?.content.slice(0,40)||'Lecture',
      science: mode==='libre'?'Mode Libre':'Mode Praticien', date: new Date().toISOString(),
      preview: ai.content.slice(0,80),
    }
    const newR = [r, ...readings.slice(0,49)]
    setReadings(newR)
    localStorage.setItem('hx_readings', JSON.stringify(newR))
  },[readings, mode])

  // Projects
  const newProject = useCallback(()=>{
    const p: Project = { id:Date.now().toString(), name:`Projet ${projects.length+1}`, readingIds:[], collapsed:false }
    const np=[...projects,p]; setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np))
  },[projects])

  const renameProject = useCallback((id:string, name:string)=>{
    const np=projects.map(p=>p.id===id?{...p,name}:p); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np))
  },[projects])

  const deleteProject = useCallback((id:string)=>{
    const np=projects.filter(p=>p.id!==id); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np))
  },[projects])

  const addToProject = useCallback((rId:string, pId:string)=>{
    const nr=readings.map(r=>r.id===rId?{...r,projectId:pId}:r); setReadings(nr); localStorage.setItem('hx_readings',JSON.stringify(nr))
  },[readings])

  const openReading = useCallback((r:Reading)=>{
    setMessages([{ id:'0', role:'assistant', created_at:r.date, content:`📖 Lecture retrouvée — ${r.title}\n\n${r.preview}...` }])
    setView('chat')
  },[])

  // Audio recording
  const toggleRec = useCallback(async()=>{
    if(isRec&&mediaRec){ mediaRec.stop(); setIsRec(false); return }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true})
      const rec=new MediaRecorder(stream); const chunks:BlobPart[]=[]
      rec.ondataavailable=e=>chunks.push(e.data)
      rec.onstop=async()=>{
        const blob=new Blob(chunks,{type:'audio/webm'}); const form=new FormData()
        form.append('file',blob,'audio.webm'); form.append('model','whisper-1'); form.append('language','fr')
        try{ const r=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',body:form,headers:{Authorization:`Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY||''}`}}); const d=await r.json(); if(d.text)setInput(d.text) }catch{}
        stream.getTracks().forEach(t=>t.stop())
      }
      rec.start(); setMediaRec(rec); setIsRec(true)
    }catch{ alert('Micro non disponible') }
  },[isRec,mediaRec])

  // Send message
  const send = useCallback(async(text?:string, birthData?:any)=>{
    const content=text||input.trim()
    if(!content&&!birthData) return
    const userMsg:Msg={ id:Date.now().toString(), role:'user', created_at:new Date().toISOString(),
      content:birthData?`Données de naissance : ${birthData.firstName} ${birthData.lastName||''} · ${birthData.date} · ${birthData.time||'inconnue'} · ${birthData.place}, ${birthData.country} · TZ: ${birthData.timezone}`:content }
    const newMsgs=[...messages,userMsg]
    setMessages(newMsgs); setInput(''); setIsTyping(true)
    const cnt=msgCount+1; setMsgCount(cnt); bump(newMsgs.length)
    if(!birthData&&replyCache.current.has(content)){
      setTimeout(()=>{ setIsTyping(false); setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:replyCache.current.get(content)!,created_at:new Date().toISOString(),cached:true}]) },300); return
    }
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs.map(m=>({role:m.role,content:m.content})),mode,birthData:birthData||null,conversationId:convId})})
      const data=await res.json()
      if(data.conversationId)setConvId(data.conversationId)
      const reply=data.reply||'Une erreur est survenue.'
      if(!birthData&&content.length<200)replyCache.current.set(content,reply)
      setIsTyping(false)
      const aiMsg:Msg={id:Date.now().toString(),role:'assistant',content:reply,created_at:new Date().toISOString(),showPremium:!isPremium&&cnt>=3&&cnt%4===3}
      const finalMsgs=[...newMsgs,aiMsg]
      setMessages(finalMsgs); bump(finalMsgs.length)
      saveReading(finalMsgs)
      if(birthData){ const p={...birthData}; setProfile(p); localStorage.setItem('hx_profile',JSON.stringify(p)); setStep(s=>s<2?2:s) }
      if(data.needsBirthData)setTimeout(()=>setShowBirth(true),600)
    }catch{
      setIsTyping(false)
      setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:'Erreur de connexion. Réessaie dans un instant.',created_at:new Date().toISOString()}])
    }
  },[input,messages,mode,convId,msgCount,isPremium,bump,saveReading])

  const switchMode=(m:Mode)=>{ if(m==='praticien'&&!isPremium){setView('premium');return}; setMode(m) }

  // ── Sub views ─────────────────────────────────────────────────
  if(view==='profile') return <ProfileView profile={profile} onEdit={()=>{setView('chat');setTimeout(()=>setShowBirth(true),100)}} onBack={()=>setView('chat')}/>
  if(view==='premium') return <PremiumView onBack={()=>setView('chat')} userEmail={userEmail} onSuccess={()=>{setIsPremium(true);setView('chat')}}/>
  if(view==='nouveau') return <NouveauView projects={projects} onBack={()=>setView('chat')} onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject}/>

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'var(--deep)',position:'relative'}}>
      <Stars/>

      <LeftSidebar
        view={view} setView={setView} mode={mode} isPremium={isPremium} userEmail={userEmail}
        currentStep={step} stepLabels={stepLabels}
        projects={projects} readings={readings}
        onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject}
        onOpenReading={openReading} onAddReadingToProject={addToProject}
        onSearch={()=>setShowSearch(true)} onLogout={async()=>{await supabase.auth.signOut();router.push('/login')}}
        dragId={dragId}
      />

      {/* MAIN */}
      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',zIndex:10,minWidth:0}}>
        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 16px',borderBottom:'1px solid var(--b1)',background:'rgba(10,10,16,0.7)',backdropFilter:'blur(20px)',flexShrink:0}}>
          <div style={{display:'flex',background:'rgba(255,255,255,0.03)',border:'1px solid var(--b2)',borderRadius:6,overflow:'hidden'}}>
            <button style={{padding:'6px 14px',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.1em',color:mode==='libre'?'var(--amber)':'var(--tx3)',background:mode==='libre'?'rgba(255,140,0,0.1)':'transparent',transition:'all 0.2s',cursor:'pointer',border:'none'}} onClick={()=>switchMode('libre')}>Libre</button>
            <button style={{padding:'6px 14px',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.1em',color:mode==='praticien'?'var(--amber)':'var(--tx3)',background:mode==='praticien'?'rgba(255,140,0,0.1)':'transparent',transition:'all 0.2s',cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:5}} onClick={()=>switchMode('praticien')}>
              Praticien{!isPremium&&<span style={{fontSize:8}}>🔒</span>}
            </button>
          </div>
          <button style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:5,background:'rgba(255,255,255,0.03)',border:'1px solid var(--b1)',color:'var(--tx3)',cursor:'pointer'}} onClick={()=>setShowShare(true)} title="Partager une lecture">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div style={{flex:1,overflowY:'auto',padding:'14px 18px',display:'flex',flexDirection:'column',gap:10}}>
          {messages.map((msg,i)=>(
            <div key={msg.id} style={{display:'flex',alignItems:'flex-end',gap:9,justifyContent:msg.role==='user'?'flex-end':'flex-start',animation:'fadeUp 0.3s var(--expo) both',animationDelay:`${Math.min(i,5)*0.03}s`}}>
              {msg.role==='assistant'&&(
                <div style={{width:26,height:26,minWidth:26,position:'relative',flexShrink:0,marginBottom:2}}>
                  <div style={{position:'absolute',inset:0,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}/>
                  <span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:5.5,fontWeight:600,color:'var(--void)'}}>HA</span>
                </div>
              )}
              <div style={{maxWidth:'72%',borderRadius:11,padding:'10px 13px',position:'relative',...(msg.role==='user'?{background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',borderBottomRightRadius:2}:{background:'rgba(255,255,255,0.025)',border:'1px solid var(--b1)',borderBottomLeftRadius:2})}}>
                <p style={{fontFamily:'var(--f-ui)',fontSize:13.5,lineHeight:1.72,color:'var(--tx2)',whiteSpace:'pre-wrap',margin:0}}>{msg.content}</p>
                {msg.cached&&<span style={{fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',marginTop:3,opacity:0.5,display:'block'}}>⚡ cache</span>}
                {msg.showPremium&&<button style={{display:'block',marginTop:10,width:'100%',background:'rgba(255,140,0,0.05)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.08em',padding:'9px 11px',borderRadius:5,textTransform:'uppercase',cursor:'pointer',textAlign:'left' as const}} onClick={()=>setView('premium')}>✦ Passer à Premium — PDF · Audio · Lectures illimitées →</button>}
                <span style={{display:'block',fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',marginTop:4,textAlign:'right' as const}}>{new Date(msg.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          {isTyping&&(
            <div style={{display:'flex',alignItems:'flex-end',gap:9,justifyContent:'flex-start'}}>
              <div style={{width:26,height:26,minWidth:26,position:'relative',flexShrink:0}}>
                <div style={{position:'absolute',inset:0,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}/>
                <span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:5.5,fontWeight:600,color:'var(--void)'}}>HA</span>
              </div>
              <div style={{background:'rgba(255,255,255,0.025)',border:'1px solid var(--b1)',borderRadius:11,borderBottomLeftRadius:2,padding:'13px 16px',display:'flex',gap:5,alignItems:'center'}}>
                {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'var(--tx3)',display:'inline-block',animation:'blink 1.4s ease-in-out infinite',animationDelay:`${i*0.18}s`}}/>)}
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>

        {/* Composer */}
        <div style={{padding:'7px 14px 12px',borderTop:'1px solid var(--b1)',background:'rgba(5,5,8,0.6)',backdropFilter:'blur(14px)',flexShrink:0}}>
          <div style={{textAlign:'center',fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.24em',color:'var(--tx3)',textTransform:'uppercase',marginBottom:6}}>Analyse personnalisée</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:7,background:'rgba(255,255,255,0.025)',border:'1px solid var(--b2)',borderRadius:9,padding:'7px 9px'}}>
            <button style={{width:26,height:26,flexShrink:0,borderRadius:5,background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={()=>setShowBirth(true)} title="Données de naissance">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </button>
            <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Pose ta question à HexAstra..." rows={1}
              style={{flex:1,background:'transparent',border:'none',color:'var(--tx1)',fontSize:13,lineHeight:'1.55',minHeight:19,maxHeight:96,overflowY:'auto',padding:'3px 0',resize:'none',fontFamily:'var(--f-ui)'}}/>
            <button style={{width:26,height:26,flexShrink:0,borderRadius:5,background:isRec?'rgba(255,140,0,0.15)':'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',animation:isRec?'recPulse 1s ease-in-out infinite':'none'}} onClick={toggleRec} title={isRec?'Arrêter':'Audio'}>
              {isRec?<svg width="12" height="12" viewBox="0 0 24 24" fill="var(--amber)"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/></svg>}
            </button>
            <button onClick={()=>send()} disabled={!input.trim()||isTyping}
              style={{width:28,height:28,flexShrink:0,background:'var(--amber)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--void)',transition:'all 0.2s',boxShadow:'0 3px 10px rgba(255,140,0,0.22)',cursor:'pointer',border:'none',opacity:!input.trim()||isTyping?0.25:1}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:5,padding:'0 2px',gap:8}}>
            <span style={{fontFamily:'var(--f-mono)',fontSize:7,color:'var(--tx3)',flexShrink:0}}>Entrée · Shift+Entrée nouvelle ligne</span>
            <span style={{fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',textAlign:'center',flex:1}}>HexAstra ne remplace pas un avis médical, juridique ou financier.</span>
            <button style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',letterSpacing:'0.1em',flexShrink:0,cursor:'pointer',background:'transparent',border:'none'}} onClick={()=>setView('premium')}>✦ Premium</button>
          </div>
        </div>
      </main>

      <RightSidebar mode={mode} readings={readings} projects={projects} onSend={t=>send(t)}
        onOpenReading={openReading} onAddToProject={addToProject} dragId={dragId} setDragId={setDragId}/>

      {showBirth&&<BirthModal existing={profile} onClose={()=>setShowBirth(false)} onSubmit={d=>{setShowBirth(false);send(undefined,d)}}/>}
      {showSearch&&<SearchModal readings={readings} onClose={()=>setShowSearch(false)} onSelect={r=>{openReading(r);setShowSearch(false)}}/>}
      {showShare&&<ShareModal messages={messages} onClose={()=>setShowShare(false)}/>}

      <style>{`
        @keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,140,0,0.4)}50%{box-shadow:0 0 0 6px rgba(255,140,0,0)}}
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;background:none;color:inherit}
        input,textarea,select{font-family:inherit;outline:none}
        textarea{resize:none}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:var(--ab1)}
        select option{background:var(--panel);color:var(--tx1)}
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROFILE VIEW
// ═══════════════════════════════════════════════════════════════
function ProfileView({ profile, onEdit, onBack }: { profile:any; onEdit:()=>void; onBack:()=>void }) {
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}>
      <Stars/>
      <div style={{width:'100%',maxWidth:700,padding:'0 24px 48px',flex:1,display:'flex',flexDirection:'column',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:24}}>
          <button style={{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',letterSpacing:'0.1em',cursor:'pointer',background:'none',border:'none'}} onClick={onBack}>← Retour</button>
          <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--chrome)'}}>Données personnelles</div>
          <button style={{fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'5px 12px',borderRadius:4,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}} onClick={onEdit}>Modifier</button>
        </div>
        {!profile?(
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}>
            <div style={{fontSize:48,color:'var(--amber)',opacity:0.25}}>⬡</div>
            <p style={{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucun profil enregistré.</p>
            <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'9px 18px',borderRadius:5,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase'}} onClick={onEdit}>Saisir mes données</button>
          </div>
        ):(
          <>
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.18em',color:'var(--amber)',textTransform:'uppercase',marginBottom:12}}>// Informations</div>
              {[['Prénom',profile.firstName],['Nom',profile.lastName],['Date',profile.date],['Heure',profile.time],['Ville',profile.place],['Pays',profile.country],['Fuseau',profile.timezone]].map(([l,v])=>v&&(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',background:'rgba(255,255,255,0.02)',borderRadius:5,border:'1px solid var(--b1)',marginBottom:7}}>
                  <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{l}</span>
                  <span style={{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx1)'}}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// NOUVEAU PROJET VIEW
// ═══════════════════════════════════════════════════════════════
function NouveauView({ projects, onBack, onNewProject, onRenameProject, onDeleteProject }: { projects:Project[]; onBack:()=>void; onNewProject:()=>void; onRenameProject:(id:string,name:string)=>void; onDeleteProject:(id:string)=>void }) {
  const [editing, setEditing] = useState<string|null>(null)
  const [editName, setEditName] = useState('')
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}>
      <Stars/>
      <div style={{width:'100%',maxWidth:600,padding:'0 24px 48px',flex:1,position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:24}}>
          <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',letterSpacing:'0.1em',cursor:'pointer',background:'none',border:'none'}} onClick={onBack}>← Retour</button>
          <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--chrome)'}}>Projets</div>
          <button style={{fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'5px 14px',borderRadius:4,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}} onClick={onNewProject}>＋ Nouveau</button>
        </div>
        <div style={{fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.18em',color:'var(--amber)',textTransform:'uppercase',marginBottom:12}}>// Vos projets</div>
        {projects.length===0&&(
          <div style={{textAlign:'center',padding:'40px',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)',lineHeight:1.8}}>
            Crée un projet pour organiser tes lectures.<br/>
            <span style={{color:'var(--amber)'}}>Glisse-dépose</span> les lectures depuis la barre de droite.
          </div>
        )}
        {projects.map(p=>(
          <div key={p.id} style={{background:'rgba(255,255,255,0.02)',border:'1px solid var(--b1)',borderRadius:8,padding:'14px 16px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8"><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              {editing===p.id?(
                <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                  onBlur={()=>{onRenameProject(p.id,editName);setEditing(null)}}
                  onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditing(null)}}}
                  style={{flex:1,background:'transparent',border:'none',borderBottom:'1px solid var(--amber)',color:'var(--amber)',fontSize:14,fontFamily:'var(--f-ui)'}}/>
              ):(
                <span style={{flex:1,fontFamily:'var(--f-ui)',fontSize:14,color:'var(--tx1)',cursor:'pointer'}} onDoubleClick={()=>{setEditing(p.id);setEditName(p.name)}}>{p.name}</span>
              )}
              <button style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={()=>{setEditing(p.id);setEditName(p.name)}}>✎</button>
              <button style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={()=>onDeleteProject(p.id)}>✕</button>
            </div>
            <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',letterSpacing:'0.06em'}}>{p.readingIds.length} lecture{p.readingIds.length!==1?'s':''} · Double-clic pour renommer</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PREMIUM VIEW
// ═══════════════════════════════════════════════════════════════
function PremiumView({ onBack, userEmail, onSuccess }: { onBack:()=>void; userEmail:string; onSuccess:()=>void }) {
  const [loading,setLoading]=useState<string|null>(null)
  const checkout=async(key:string)=>{ setLoading(key); try{ const r=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceKey:key})}); const d=await r.json(); if(d.url)window.location.href=d.url }finally{setLoading(null)} }
  const plans=[
    {key:'lecture_unique',badge:'ESSENTIEL',name:'Lecture Unique',price:'19',period:'/lecture',features:['PDF complet','Thème natal + HD','Numérologie + Kua','Immédiat'],accent:false},
    {key:'premium_mensuel',badge:'POPULAIRE',name:'Premium',price:'29',period:'/mois',features:['Lectures illimitées','Audio IA ElevenLabs','Mode Praticien','12 sciences','PDF haute qualité','Historique'],accent:true},
    {key:'cabinet',badge:'PRO',name:'Cabinet',price:'89',period:'/mois',features:['Tout Premium +','Analyses clients','Rapports export','Support dédié'],accent:false},
  ]
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}>
      <Stars/>
      <div style={{width:'100%',maxWidth:960,padding:'0 24px 48px',flex:1,display:'flex',flexDirection:'column',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:16}}>
          <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={onBack}>← Retour au chat</button>
          <div style={{fontFamily:'var(--f-display)',fontSize:20,textTransform:'uppercase',color:'var(--chrome)',letterSpacing:'0.08em'}}>Abonnements</div>
          <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'}}>{userEmail}</span>
        </div>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.2em',color:'var(--amber)',marginBottom:10}}>// ACCÈS COMPLET HEXASTRA</div>
          <h1 style={{fontFamily:'var(--f-display)',fontSize:'clamp(26px,4vw,44px)',color:'var(--chrome)',textTransform:'uppercase',letterSpacing:'0.04em',lineHeight:1.1}}>Lectures précises.<br/><span style={{color:'var(--amber)'}}>Swiss Ephemeris.</span></h1>
        </div>
        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center',flex:1,alignContent:'flex-start'}}>
          {plans.map(p=>(
            <div key={p.key} style={{background:'var(--pitch)',border:`1px solid ${p.accent?'var(--ab2)':'var(--b2)'}`,borderRadius:14,padding:'24px 20px',flex:'1 1 240px',maxWidth:300,display:'flex',flexDirection:'column',gap:10,position:'relative',boxShadow:p.accent?'0 0 30px rgba(255,140,0,0.06)':'none'}}>
              {p.accent&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.12em',padding:'3px 12px',borderRadius:20,whiteSpace:'nowrap'}}>✦ Le plus choisi</div>}
              <div style={{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase'}}>{p.badge}</div>
              <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.06em',color:'var(--chrome)',textTransform:'uppercase'}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                <span style={{fontFamily:'var(--f-mono)',fontSize:16,color:'var(--tx2)'}}>€</span>
                <span style={{fontFamily:'var(--f-display)',fontSize:42,color:'var(--chrome)',lineHeight:1}}>{p.price}</span>
                <span style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)'}}>{p.period}</span>
              </div>
              <div style={{height:1,background:'var(--b1)'}}/>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:7,flex:1}}>
                {p.features.map(f=><li key={f} style={{display:'flex',alignItems:'center',gap:8,fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)'}}><span style={{color:'var(--amber)'}}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>checkout(p.key)} disabled={loading===p.key}
                style={{padding:'11px 16px',width:'100%',background:p.accent?'var(--amber)':'rgba(255,140,0,0.07)',border:`1px solid ${p.accent?'var(--amber)':'var(--ab1)'}`,color:p.accent?'var(--void)':'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:5,cursor:'pointer',marginTop:'auto',boxShadow:p.accent?'0 4px 20px rgba(255,140,0,0.2)':'none'}}>
                {loading===p.key?'...':(p.accent?'Commencer Premium':p.key==='lecture_unique'?'Obtenir ma lecture':'Accès Cabinet')}
              </button>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 0',fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--tx3)'}}>Paiement sécurisé Stripe · Annulation à tout moment</div>
      </div>
    </div>
  )
}
