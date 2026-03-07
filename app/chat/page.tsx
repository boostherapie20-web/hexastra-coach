'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type Msg     = { id:string; role:'user'|'assistant'; content:string; created_at:string; cached?:boolean }
type Mode    = 'essentiel'|'premium'|'praticien'
type View    = 'chat'|'profile'|'abonnements'|'projets'
type Step    = 1|2|3|4
type Project = { id:string; name:string; readingIds:string[]; collapsed:boolean }
type Reading = { id:string; title:string; science:string; date:string; preview:string; projectId?:string }
type VisualBrainState = 'IDLE'|'TYPING'|'ANALYZING'|'RESPONDING'
/* ═══════════════════════════════════════════════════════════════
   DS TOKENS — single source of truth, mirrors globals.css
═══════════════════════════════════════════════════════════════ */
const DS = {
  // Backgrounds
  bg0:    '#0f0a07',
  bg1:    '#1b1410',
  bgCard: 'rgba(20,14,10,0.75)',
  bgInput:'rgba(255,255,255,0.03)',
  // Accents
  amber:  '#d4a574',
  bronze: '#8c6239',
  // Text
  tx1:    '#f5f1ea',
  tx2:    '#cbb9a4',
  tx3:    'rgba(203,185,164,0.45)',
  // Borders
  border: 'rgba(255,255,255,0.06)',
  borderW:'rgba(212,165,116,0.16)',
  glow:   'rgba(212,165,116,0.15)',
  // Typography — Sora for titles, Inter for everything else
  fontTitle: "'Sora', system-ui, sans-serif",
  fontBody:  "'Inter', system-ui, sans-serif",
  fontMono:  "'SF Mono', 'Fira Code', ui-monospace, monospace",
  // Helpers
  gradBtn:'linear-gradient(135deg,#d4a574,#8c6239)',
  shadowCard:'0 30px 120px rgba(0,0,0,0.5)',
  shadowBtn: '0 10px 30px rgba(212,165,116,0.25)',
  // Gradient title style (applied inline where needed)
  gradTitle: {
    fontFamily: "'Sora', system-ui, sans-serif" as const,
    fontWeight: 600,
    letterSpacing: '0.04em',
    lineHeight: 1.15,
    background: 'linear-gradient(90deg, #f5f1ea 0%, #e9dcc7 38%, #d4a574 68%, #f5f1ea 100%)',
    WebkitBackgroundClip: 'text' as const,
    WebkitTextFillColor: 'transparent' as const,
    backgroundClip: 'text' as const,
    filter: 'drop-shadow(0 0 18px rgba(212,165,116,0.18))',
  } as React.CSSProperties,
}

/* ═══════════════════════════════════════════════════════════════
   DATA — Countries / Timezones / Menus
═══════════════════════════════════════════════════════════════ */
const COUNTRIES_BY_CONTINENT: Record<string,string[]> = {
  'Europe':['Albanie','Allemagne','Andorre','Autriche','Belgique','Biélorussie','Bosnie-Herzégovine','Bulgarie','Chypre','Croatie','Danemark','Espagne','Estonie','Finlande','France','Grèce','Hongrie','Irlande','Islande','Italie','Kosovo','Lettonie','Liechtenstein','Lituanie','Luxembourg','Macédoine du Nord','Malte','Moldavie','Monaco','Monténégro','Norvège','Pays-Bas','Pologne','Portugal','République Tchèque','Roumanie','Royaume-Uni','Russie','Saint-Marin','Serbie','Slovaquie','Slovénie','Suède','Suisse','Ukraine','Vatican'],
  'Afrique':['Afrique du Sud','Algérie','Angola','Bénin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroun','Centrafrique','Comores','Congo','Côte d\'Ivoire','Djibouti','Égypte','Érythrée','Éthiopie','Gabon','Gambie','Ghana','Guinée','Guinée-Bissau','Guinée équatoriale','Kenya','Lesotho','Liberia','Libye','Madagascar','Malawi','Mali','Maroc','Maurice','Mauritanie','Mozambique','Namibie','Niger','Nigeria','Ouganda','Rwanda','São Tomé-et-Príncipe','Sénégal','Seychelles','Sierra Leone','Somalie','Soudan','Soudan du Sud','Swaziland','Tanzanie','Tchad','Togo','Tunisie','Zambie','Zimbabwe'],
  'Amériques — Nord':['Belize','Canada','Costa Rica','Cuba','États-Unis','Guatemala','Honduras','Mexique','Nicaragua','Panama','Salvador'],
  'Caraïbes':['Anguilla','Antigua-et-Barbuda','Aruba','Bahamas','Barbade','Bonaire','Curaçao','Dominique','Grenade','Guadeloupe','Haïti','Îles Caïmans','Îles Turques-et-Caïques','Îles Vierges américaines','Îles Vierges britanniques','Jamaïque','Martinique','Montserrat','Porto Rico','République dominicaine','Saba','Saint-Barthélemy','Saint-Kitts-et-Nevis','Saint-Martin','Saint-Vincent-et-les-Grenadines','Sainte-Lucie','Sint Maarten','Trinité-et-Tobago'],
  'Amériques — Sud':['Argentine','Bolivie','Brésil','Chili','Colombie','Équateur','Guyane','Guyane française','Paraguay','Pérou','Suriname','Uruguay','Venezuela'],
  'Asie — Moyen-Orient':['Arabie Saoudite','Bahreïn','Émirats Arabes Unis','Irak','Iran','Israël','Jordanie','Koweït','Liban','Oman','Palestine','Qatar','Syrie','Turquie','Yémen'],
  'Asie — Sud':['Afghanistan','Bangladesh','Bhoutan','Inde','Kazakhstan','Kirghizistan','Maldives','Népal','Ouzbékistan','Pakistan','Sri Lanka','Tadjikistan','Turkménistan'],
  'Asie — Est':['Birmanie','Brunei','Cambodge','Chine','Corée du Nord','Corée du Sud','Indonésie','Japon','Laos','Malaisie','Mongolie','Philippines','Singapour','Taïwan','Thaïlande','Timor-Leste','Viêt Nam'],
  'Océanie':['Australie','Fidji','Îles Cook','Îles Marshall','Îles Salomon','Kiribati','Micronésie','Nauru','Nouvelle-Calédonie','Nouvelle-Zélande','Palaos','Papouasie-Nouvelle-Guinée','Polynésie française','Samoa','Tonga','Tuvalu','Vanuatu'],
}

const TIMEZONES = [
  {v:'auto',l:'Fuseau horaire automatique'},{v:'UTC',l:'UTC+00 — GMT'},{v:'Europe/London',l:'UTC+01 — Londres'},
  {v:'Europe/Paris',l:'UTC+01 — Paris / Madrid'},{v:'Europe/Helsinki',l:'UTC+02 — Helsinki'},
  {v:'Europe/Moscow',l:'UTC+03 — Moscou'},{v:'Asia/Dubai',l:'UTC+04 — Dubaï'},
  {v:'Asia/Karachi',l:'UTC+05 — Karachi'},{v:'Asia/Kolkata',l:'UTC+05:30 — Mumbai'},
  {v:'Asia/Dhaka',l:'UTC+06 — Dhaka'},{v:'Asia/Bangkok',l:'UTC+07 — Bangkok'},
  {v:'Asia/Shanghai',l:'UTC+08 — Pékin / HK'},{v:'Asia/Tokyo',l:'UTC+09 — Tokyo'},
  {v:'Australia/Sydney',l:'UTC+10 — Sydney'},{v:'Pacific/Auckland',l:'UTC+12 — Auckland'},
  {v:'Atlantic/Azores',l:'UTC-01 — Açores'},{v:'America/Noronha',l:'UTC-02 — Mid-Atlantique'},
  {v:'America/Sao_Paulo',l:'UTC-03 — Brasília'},{v:'America/New_York',l:'UTC-04 — New York'},
  {v:'America/Chicago',l:'UTC-05 — Chicago'},{v:'America/Denver',l:'UTC-06 — Denver'},
  {v:'America/Los_Angeles',l:'UTC-07 — Los Angeles'},{v:'America/Anchorage',l:'UTC-08 — Alaska'},
  {v:'Pacific/Honolulu',l:'UTC-10 — Honolulu'},
]

const MENU_ESSENTIEL = [
  {id:'1',sym:'✦',label:'NeuroKua™',sub:'État intérieur & énergie'},
  {id:'2',sym:'◈',label:'Énergie du moment',sub:'Tendance du jour'},
  {id:'3',sym:'♡',label:'Amour / Relations',sub:'Dynamiques affectives'},
  {id:'4',sym:'◆',label:'Travail / Argent',sub:'Choix pro & stabilité'},
  {id:'5',sym:'◉',label:'Bien-être',sub:'Apaise & recentre'},
  {id:'6',sym:'⊕',label:'Décision',sub:'Clarté & choix'},
  {id:'7',sym:'◎',label:'Vision mois',sub:'Anticipe & timing'},
  {id:'8',sym:'✧',label:'Lecture générale',sub:'Synthèse complète'},
  {id:'9',sym:'⬡',label:'Par science',sub:'Angle spécifique'},
]
const MENU_PREMIUM = [...MENU_ESSENTIEL,
  {id:'P1',sym:'❋',label:'Fusion KS™',sub:'Synthèse totale'},
  {id:'P2',sym:'⬢',label:'Astrolex™',sub:'Astrologie précise'},
]
const MENU_PRATICIEN = [
  {id:'A1',sym:'✦',label:'NeuroKua™',sub:'Diagnostic état interne'},
  {id:'A2',sym:'◈',label:'Relationnel™',sub:'Dynamiques & leviers'},
  {id:'A3',sym:'◆',label:'Professionnel™',sub:'Positionnement & risques'},
  {id:'A4',sym:'◎',label:'Cycle à venir™',sub:'Phase & timing'},
  {id:'A5',sym:'⊕',label:'Décision précise™',sub:'Comparatif A/B'},
  {id:'A6',sym:'✧',label:'Lecture générale™',sub:'Synthèse multidim.'},
  {id:'B1',sym:'⬡',label:'Astrolex™',sub:'Astrologie'},
  {id:'B2',sym:'◉',label:'Porteum™',sub:'Numérologie'},
  {id:'B3',sym:'⊗',label:'TriangleNumeris™',sub:'Triangle'},
  {id:'B4',sym:'⊛',label:'Ennéagramme™',sub:'Types'},
  {id:'B5',sym:'⬢',label:'Kua™',sub:'Feng Shui'},
  {id:'B6',sym:'❋',label:'Fusion KS™',sub:'Synthèse totale'},
]

/* ═══════════════════════════════════════════════════════════════
   COSMIC BACKGROUND — 3-layer system
═══════════════════════════════════════════════════════════════ */
ligne 123 | function CosmicBackground({ state, reducedMotion }: { state:VisualBrainState; reducedMotion:boolean }) {
ligne 124 |   const geometryOpacity = state==='TYPING' ? 0.06 : 0.035
ligne 125 |   const starsOpacity = state==='ANALYZING' ? 0.68 : state==='TYPING' ? 0.62 : 0.55
ligne 126 |   const rotateDuration = state==='ANALYZING' ? 80 : 200
ligne 127 |   const haloOpacity = state==='TYPING' ? 0.26 : 0.2
ligne 128 | 
ligne 129 |   return (
ligne 130 |     <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}} aria-hidden="true">
ligne 131 |       {/* L1 — star field */}
ligne 132 |       <div
ligne 133 |         className="hx-stars"
ligne 134 |         style={{
ligne 135 |           position:'absolute',
ligne 136 |           inset:0,
ligne 137 |           opacity:starsOpacity,
ligne 138 |           transition:'opacity 0.8s ease',
ligne 139 |           animation:reducedMotion?'none':undefined,
ligne 140 |           willChange:'opacity, transform'
ligne 141 |         }}
ligne 142 |       />
ligne 143 |       {/* L2 — warm ambient radial */}
ligne 144 |       <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 32% 22%, rgba(212,165,116,0.07) 0%, transparent 55%), radial-gradient(ellipse at 72% 76%, rgba(140,98,57,0.04) 0%, transparent 45%)'}}/>
ligne 145 |       {/* L3 — sacred halo */}
ligne 146 |       <div
ligne 147 |         className={`hx-sacred-halo ${state==='ANALYZING'?'hx-halo-analyzing':state==='RESPONDING'?'hx-halo-responding':''}`}
ligne 148 |         style={{
ligne 149 |           position:'absolute',
ligne 150 |           left:'50%',
ligne 151 |           top:'50%',
ligne 152 |           transform:'translate(-50%,-50%)',
ligne 153 |           width:'min(1100px,86vw)',
ligne 154 |           height:'min(1100px,86vw)',
ligne 155 |           borderRadius:'9999px',
ligne 156 |           background:'radial-gradient(circle, rgba(212,165,116,0.13) 0%, rgba(212,165,116,0.05) 32%, transparent 68%)',
ligne 157 |           filter:'blur(110px)',
ligne 158 |           opacity:haloOpacity,
ligne 159 |           transition:'opacity 0.8s ease',
ligne 160 |           animation:reducedMotion?'none':undefined,
ligne 161 |           willChange:'opacity, transform'
ligne 162 |         }}
ligne 163 |       />
ligne 164 |       {/* L4 — sacred geometry */}
ligne 165 |       <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}}>
ligne 166 |         <div
ligne 167 |           className="hx-sacred-geometry"
ligne 168 |           style={{
ligne 169 |             position:'relative',
ligne 170 |             left:0,
ligne 171 |             top:0,
ligne 172 |             width:'min(860px,78vw)',
ligne 173 |             filter:'blur(0.9px)',
ligne 174 |             opacity:geometryOpacity,
ligne 175 |             transition:'opacity 0.8s ease',
ligne 176 |             animation:reducedMotion?'none':`hxRotate ${rotateDuration}s linear infinite, hxBreath 20s ease-in-out infinite`,
ligne 177 |             willChange:'transform, opacity'
ligne 178 |           }}
ligne 179 |         >
ligne 180 |           <img src="/hexastra-sacred-geometry.png" alt="" aria-hidden="true" draggable={false} style={{width:'100%',height:'auto',display:'block'}}/>
ligne 181 |         </div>
ligne 182 |       </div>
ligne 183 |     </div>
ligne 184 |   )
ligne 185 | }

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM PRIMITIVES
═══════════════════════════════════════════════════════════════ */

// Card
function Card({ children, style, hover=true }: { children:React.ReactNode; style?:React.CSSProperties; hover?:boolean }) {
  const [hovered,setHovered] = useState(false)
  return (
    <div
      onMouseEnter={()=>hover&&setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{background:DS.bgCard,backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)',borderRadius:24,border:`1px solid ${hovered?'rgba(212,165,116,0.1)':DS.border}`,boxShadow:hovered?`${DS.shadowCard}, 0 0 60px rgba(212,165,116,0.06)`:DS.shadowCard,transition:'border-color 0.35s ease,box-shadow 0.35s ease',...style}}>
      {children}
    </div>
  )
}

// Button primary
function BtnPrimary({ children, onClick, disabled, style }: { children:React.ReactNode; onClick?:()=>void; disabled?:boolean; style?:React.CSSProperties }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,padding:'13px 28px',borderRadius:12,background:disabled?'rgba(255,255,255,0.06)':DS.gradBtn,color:disabled?DS.tx3:'#fff',fontSize:14,fontWeight:500,letterSpacing:'0.01em',border:'none',cursor:disabled?'not-allowed':'pointer',transition:'all 0.25s ease',transform:hov&&!disabled?'translateY(-2px)':'none',boxShadow:hov&&!disabled?DS.shadowBtn:'none',fontFamily:DS.fontBody,...style}}>
      {children}
    </button>
  )
}

// Button ghost
function BtnGhost({ children, onClick, active, style }: { children:React.ReactNode; onClick?:()=>void; active?:boolean; style?:React.CSSProperties }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,padding:'10px 20px',borderRadius:10,background:active?'rgba(212,165,116,0.1)':hov?'rgba(212,165,116,0.06)':'rgba(255,255,255,0.03)',color:active?DS.amber:hov?DS.tx2:DS.tx3,border:`1px solid ${active?DS.borderW:hov?DS.borderW:DS.border}`,fontSize:13,fontWeight:400,cursor:'pointer',transition:'all 0.2s ease',fontFamily:DS.fontBody,...style}}>
      {children}
    </button>
  )
}

// Nav item
function NavItem({ icon, label, active, onClick }: { icon:string; label:string; active:boolean; onClick:()=>void }) {
  const [hov,setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',width:'100%',textAlign:'left' as const,borderRadius:8,fontSize:13,fontWeight:400,color:active?DS.amber:hov?DS.tx2:DS.tx3,background:active?'rgba(212,165,116,0.07)':hov?'rgba(255,255,255,0.03)':'transparent',borderLeft:`2px solid ${active?DS.amber:'transparent'}`,borderRight:'none',borderTop:'none',borderBottom:'none',cursor:'pointer',transition:'all 0.18s ease',fontFamily:DS.fontBody}}>
      <span style={{width:16,textAlign:'center' as const,fontSize:13,flexShrink:0,opacity:active?1:0.6}}>{icon}</span>
      {label}
    </button>
  )
}

// Label
function Label({ children }: { children:React.ReactNode }) {
  return <div style={{fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:DS.tx3,fontFamily:DS.fontMono,marginBottom:6}}>{children}</div>
}

// Divider
function Divider({ style }: { style?:React.CSSProperties }) {
  return <div style={{height:1,background:DS.border,...style}}/>
}

// Icon button
function IconBtn({ children, onClick, tooltip, active }: { children:React.ReactNode; onClick?:()=>void; tooltip?:string; active?:boolean }) {
  const [hov,setHov] = useState(false)
  return (
    <div style={{position:'relative',display:'inline-flex'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <button onClick={onClick}
        style={{width:32,height:32,borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${active||hov?DS.borderW:DS.border}`,background:active?'rgba(212,165,116,0.15)':hov?'rgba(212,165,116,0.08)':'rgba(255,255,255,0.03)',color:active||hov?DS.amber:DS.tx3,cursor:'pointer',transition:'all 0.2s ease',animation:active?'recPulse 1s ease-in-out infinite':'none'}}>
        {children}
      </button>
      {hov&&tooltip&&(
        <div style={{position:'absolute',bottom:'calc(100% + 7px)',left:'50%',transform:'translateX(-50%)',background:'rgba(20,14,10,0.97)',border:`1px solid ${DS.borderW}`,borderRadius:6,padding:'4px 10px',fontSize:11,color:DS.tx2,whiteSpace:'nowrap',pointerEvents:'none',zIndex:200,boxShadow:'0 8px 24px rgba(0,0,0,0.5)',fontFamily:DS.fontMono,letterSpacing:'0.04em'}}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CITY AUTOCOMPLETE
═══════════════════════════════════════════════════════════════ */
function CityInput({ value, onChange, placeholder }: { value:string; onChange:(v:string,lat?:number,lon?:number)=>void; placeholder?:string }) {
  const [sugg,setSugg]       = useState<any[]>([])
  const [open,setOpen]       = useState(false)
  const [loading,setLoading] = useState(false)
  const tmr = useRef<any>(null)
  const search = useCallback(async(q:string)=>{
    if(q.length<2){setSugg([]);setOpen(false);return}
    setLoading(true)
    try{ const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1&accept-language=fr`); const d=await r.json(); setSugg(d); setOpen(d.length>0) }catch{}
    setLoading(false)
  },[])
  const pick=(item:any)=>{ const name=item.display_name.split(',').slice(0,2).join(', ').trim(); onChange(name,parseFloat(item.lat),parseFloat(item.lon)); setSugg([]); setOpen(false) }
  return (
    <div style={{position:'relative'}}>
      <div style={{position:'relative'}}>
        <input value={value} onChange={e=>{onChange(e.target.value);clearTimeout(tmr.current);tmr.current=setTimeout(()=>search(e.target.value),320)}}
          placeholder={placeholder||'Rechercher une ville...'} style={fmInp}
          onFocus={()=>sugg.length>0&&setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)}/>
        {loading&&<div style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',width:10,height:10,border:`1.5px solid ${DS.amber}`,borderTop:'1.5px solid transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>}
      </div>
      {open&&sugg.length>0&&(
        <div style={{position:'absolute',top:'calc(100% + 4px)',left:0,right:0,zIndex:500,background:'rgba(20,14,10,0.98)',border:`1px solid ${DS.borderW}`,borderRadius:12,overflow:'hidden',boxShadow:'0 16px 48px rgba(0,0,0,0.8)',maxHeight:220,overflowY:'auto'}}>
          {sugg.map((s,i)=>(
            <button key={i} onMouseDown={()=>pick(s)} style={{display:'block',width:'100%',padding:'9px 14px',textAlign:'left' as const,borderBottom:`1px solid ${DS.border}`,cursor:'pointer',background:'transparent',border:'none',borderBottom:`1px solid ${DS.border}`,transition:'background 0.15s'}}>
              <div style={{fontSize:13,color:DS.tx1,fontFamily:DS.fontBody}}>{s.display_name.split(',').slice(0,2).join(', ')}</div>
              <div style={{fontSize:10,color:DS.tx3,marginTop:2,fontFamily:DS.fontMono}}>{parseFloat(s.lat).toFixed(3)}, {parseFloat(s.lon).toFixed(3)}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FORM HELPERS
═══════════════════════════════════════════════════════════════ */
const fmInp: React.CSSProperties = {
  width:'100%',background:'rgba(255,255,255,0.04)',border:`1px solid ${DS.border}`,borderRadius:10,
  padding:'10px 14px',color:DS.tx1,fontSize:14,fontFamily:DS.fontBody,outline:'none',
  transition:'border-color 0.2s, box-shadow 0.2s',
}

function FormInput({ label, req, children }: { label:string; req?:boolean; children:React.ReactNode }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      <label style={{fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:DS.tx3,fontFamily:DS.fontMono}}>
        {label}{req&&<span style={{color:DS.amber,marginLeft:3}}>*</span>}
      </label>
      {children}
    </div>
  )
}

function CountrySelect({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{position:'relative'}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...fmInp,paddingRight:32,appearance:'none' as any,cursor:'pointer'}}>
        {Object.entries(COUNTRIES_BY_CONTINENT).map(([c,countries])=>(
          <optgroup key={c} label={`── ${c} ──`}>{countries.map(n=><option key={n} value={n}>{n}</option>)}</optgroup>
        ))}
      </select>
      <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:DS.tx3,fontSize:10}}>▾</span>
    </div>
  )
}

function TimezoneSelect({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{position:'relative'}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...fmInp,paddingRight:32,appearance:'none' as any,cursor:'pointer'}}>
        {TIMEZONES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
      </select>
      <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:DS.tx3,fontSize:10}}>▾</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BIRTH MODAL
═══════════════════════════════════════════════════════════════ */
function BirthModal({ existing, onSubmit, onClose }: { existing?:any; onSubmit:(d:any)=>void; onClose:()=>void }) {
  const [firstName,setFirstName]   = useState(existing?.firstName||'')
  const [lastName,setLastName]     = useState(existing?.lastName||'')
  const [date,setDate]             = useState(existing?.date||'')
  const [time,setTime]             = useState(existing?.time!=='inconnue'?existing?.time||'':'')
  const [noTime,setNoTime]         = useState(existing?.time==='inconnue')
  const [city,setCity]             = useState(existing?.place||'')
  const [cityLat,setCityLat]       = useState<number|undefined>(existing?.lat)
  const [cityLon,setCityLon]       = useState<number|undefined>(existing?.lon)
  const [country,setCountry]       = useState(existing?.country||'France')
  const [tz,setTz]                 = useState(existing?.timezone||'auto')
  const [gpsLoad,setGpsLoad]       = useState(false)
  const [err,setErr]               = useState('')

  const gps=()=>{
    if(!navigator.geolocation){setErr('Géolocalisation non disponible');return}
    setGpsLoad(true)
    navigator.geolocation.getCurrentPosition(async pos=>{
      const {latitude:lat,longitude:lon}=pos.coords; setCityLat(lat); setCityLon(lon)
      try{ const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`); const d=await r.json(); if(d.address?.city||d.address?.town)setCity(d.address.city||d.address.town); if(d.address?.country)setCountry(d.address.country) }catch{}
      setGpsLoad(false)
    },()=>{setErr('Position non disponible');setGpsLoad(false)})
  }
  const submit=()=>{
    if(!firstName.trim()){setErr('Le prénom est requis');return}
    if(!date){setErr('La date est requise');return}
    if(!noTime&&!time){setErr("Indique l'heure ou coche « heure inconnue »");return}
    if(!city.trim()){setErr('La ville est requise');return}
    onSubmit({firstName,lastName,name:`${firstName} ${lastName}`.trim(),date,time:noTime?'inconnue':time,place:city,country,lat:cityLat,lon:cityLon,timezone:tz})
  }

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:20}}>
      <Card style={{width:'100%',maxWidth:440,padding:'28px 26px',maxHeight:'92vh',overflowY:'auto',animation:'slideUp 0.35s ease both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div>
            <Label>// Profil personnel</Label>
            <h2 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.01em',color:DS.tx1,fontFamily:DS.fontTitle}}>Données de naissance</h2>
            <p style={{fontSize:13,color:DS.tx3,marginTop:6,lineHeight:1.6,fontStyle:'italic'}}>Ces données personnalisent chaque lecture automatiquement.</p>
          </div>
          <button onClick={onClose} style={{color:DS.tx3,fontSize:16,cursor:'pointer',background:'none',border:'none',padding:'4px 8px',borderRadius:6,lineHeight:1}}>✕</button>
        </div>
        <Divider style={{marginBottom:20}}/>

        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <FormInput label="Prénom" req><input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Prénom" style={fmInp}/></FormInput>
            <FormInput label="Nom de famille"><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Optionnel" style={fmInp}/></FormInput>
          </div>
          <FormInput label="Date de naissance" req><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={fmInp}/></FormInput>
          <FormInput label="Heure de naissance">
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...fmInp,opacity:noTime?0.35:1}}/>
            <label style={{display:'flex',alignItems:'center',gap:8,marginTop:6,cursor:'pointer',fontSize:12,color:DS.tx3}}>
              <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:DS.amber}}/>
              Heure inconnue (lecture probabiliste)
            </label>
          </FormInput>
          <FormInput label="Fuseau horaire"><TimezoneSelect value={tz} onChange={setTz}/></FormInput>
          <FormInput label="Ville de naissance" req>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
              <span/>
              <button onClick={gps} disabled={gpsLoad} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,color:DS.amber,cursor:'pointer',background:'none',border:'none',fontFamily:DS.fontMono}}>
                {gpsLoad?<span style={{width:8,height:8,border:`1.5px solid ${DS.amber}`,borderTop:'1.5px solid transparent',borderRadius:'50%',display:'inline-block',animation:'spin 0.8s linear infinite'}}/>:<span>⊕</span>}
                {gpsLoad?'Localisation...':'Ma position GPS'}
              </button>
            </div>
            <CityInput value={city} onChange={(v,lat,lon)=>{setCity(v);if(lat!==undefined){setCityLat(lat);setCityLon(lon)}}} placeholder="Rechercher la ville de naissance..."/>
            {cityLat&&<p style={{fontSize:10,color:DS.tx3,marginTop:4,fontFamily:DS.fontMono}}>📍 {cityLat.toFixed(4)}, {cityLon?.toFixed(4)}</p>}
          </FormInput>
          <FormInput label="Pays de naissance" req><CountrySelect value={country} onChange={setCountry}/></FormInput>
        </div>

        {err&&<p style={{fontSize:12,color:'#ff7070',marginTop:12,padding:'8px 12px',background:'rgba(255,80,80,0.06)',borderRadius:8,border:'1px solid rgba(255,80,80,0.15)'}}>{err}</p>}
        <BtnPrimary onClick={submit} style={{width:'100%',marginTop:18}}>
          Enregistrer & lancer ma lecture
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </BtnPrimary>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CLIENT MODAL
═══════════════════════════════════════════════════════════════ */
function ClientModal({ onSubmit, onClose }: { onSubmit:(d:any)=>void; onClose:()=>void }) {
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName]   = useState('')
  const [email,setEmail]         = useState('')
  const [phone,setPhone]         = useState('')
  const [date,setDate]           = useState('')
  const [time,setTime]           = useState('')
  const [noTime,setNoTime]       = useState(false)
  const [city,setCity]           = useState('')
  const [cityLat,setCityLat]     = useState<number|undefined>()
  const [cityLon,setCityLon]     = useState<number|undefined>()
  const [country,setCountry]     = useState('France')
  const [tz,setTz]               = useState('auto')
  const [notes,setNotes]         = useState('')
  const [err,setErr]             = useState('')
  const submit=()=>{
    if(!firstName.trim()||!date||!city.trim()){setErr('Prénom, date et ville sont requis');return}
    onSubmit({firstName,lastName,name:`${firstName} ${lastName}`.trim(),email,phone,date,time:noTime?'inconnue':time,place:city,country,lat:cityLat,lon:cityLon,timezone:tz,notes})
  }
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',backdropFilter:'blur(18px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300,padding:20}}>
      <Card style={{width:'100%',maxWidth:460,padding:'28px 26px',maxHeight:'92vh',overflowY:'auto',animation:'slideUp 0.35s ease both',border:'1px solid rgba(0,200,255,0.12)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div>
            <Label>// Mode Praticien</Label>
            <h2 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.01em',color:DS.tx1,fontFamily:DS.fontTitle}}>Profil Client</h2>
          </div>
          <button onClick={onClose} style={{color:DS.tx3,fontSize:16,cursor:'pointer',background:'none',border:'none',padding:'4px 8px'}}>✕</button>
        </div>
        <Divider style={{marginBottom:20}}/>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{padding:'12px 14px',background:'rgba(0,200,255,0.03)',border:'1px solid rgba(0,200,255,0.1)',borderRadius:12,marginBottom:4}}>
            <Label>Identité client</Label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
              <FormInput label="Prénom" req><input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Prénom" style={fmInp}/></FormInput>
              <FormInput label="Nom"><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Nom" style={fmInp}/></FormInput>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <FormInput label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@..." style={fmInp}/></FormInput>
              <FormInput label="Téléphone"><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+33..." style={fmInp}/></FormInput>
            </div>
          </div>
          <div style={{padding:'12px 14px',background:'rgba(212,165,116,0.03)',border:`1px solid ${DS.borderW}`,borderRadius:12}}>
            <Label>Données de naissance</Label>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <FormInput label="Date" req><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={fmInp}/></FormInput>
              <FormInput label="Heure">
                <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...fmInp,opacity:noTime?0.35:1}}/>
                <label style={{display:'flex',alignItems:'center',gap:7,marginTop:5,cursor:'pointer',fontSize:11,color:DS.tx3}}>
                  <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:DS.amber}}/>Heure inconnue
                </label>
              </FormInput>
              <FormInput label="Fuseau"><TimezoneSelect value={tz} onChange={setTz}/></FormInput>
              <FormInput label="Ville" req><CityInput value={city} onChange={(v,lat,lon)=>{setCity(v);if(lat!==undefined){setCityLat(lat);setCityLon(lon)}}} placeholder="Ville de naissance du client..."/></FormInput>
              <FormInput label="Pays" req><CountrySelect value={country} onChange={setCountry}/></FormInput>
            </div>
          </div>
          <FormInput label="Notes praticien">
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Observations, contexte..." rows={3} style={{...fmInp,padding:'10px 14px',resize:'none'}}/>
          </FormInput>
        </div>
        {err&&<p style={{fontSize:12,color:'#ff7070',marginTop:12}}>{err}</p>}
        <button onClick={submit} style={{width:'100%',marginTop:18,padding:'13px',background:'rgba(0,200,255,0.12)',border:'1px solid rgba(0,200,255,0.28)',color:'#7de8ff',borderRadius:12,fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:DS.fontBody,display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
          Générer la lecture client →
        </button>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SEARCH MODAL
═══════════════════════════════════════════════════════════════ */
function SearchModal({ readings, onClose, onSelect }: { readings:Reading[]; onClose:()=>void; onSelect:(r:Reading)=>void }) {
  const [q,setQ] = useState('')
  const iRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{ setTimeout(()=>iRef.current?.focus(),60) },[])
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now()-86400000).toDateString()
  const f = q ? readings.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())||r.science.toLowerCase().includes(q.toLowerCase())) : readings
  const groups = q?[{l:'Résultats',items:f}]:[{l:"Aujourd'hui",items:f.filter(r=>new Date(r.date).toDateString()===today)},{l:'Hier',items:f.filter(r=>new Date(r.date).toDateString()===yesterday)},{l:'Plus tôt',items:f.filter(r=>![today,yesterday].includes(new Date(r.date).toDateString()))}]
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'60px 20px 20px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.8)',backdropFilter:'blur(10px)'}} onClick={onClose}/>
      <Card style={{position:'relative',zIndex:1,width:'100%',maxWidth:560,padding:0,overflow:'hidden',animation:'slideUp 0.28s ease both'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:`1px solid ${DS.border}`}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={DS.tx3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input ref={iRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher des lectures..." style={{flex:1,background:'transparent',border:'none',color:DS.tx1,fontSize:14,fontFamily:DS.fontBody,outline:'none'}}/>
          <button onClick={onClose} style={{color:DS.tx3,cursor:'pointer',background:'none',border:'none',fontSize:14}}>✕</button>
        </div>
        <div style={{maxHeight:400,overflowY:'auto'}}>
          {groups.map(g=>g.items.length>0&&(
            <div key={g.l}>
              <div style={{padding:'10px 18px 5px',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase' as const,color:DS.tx3,fontFamily:DS.fontMono}}>{g.l}</div>
              {g.items.map(r=>(
                <button key={r.id} onClick={()=>{onSelect(r);onClose()}} style={{display:'flex',alignItems:'center',gap:12,width:'100%',padding:'10px 18px',textAlign:'left' as const,borderBottom:`1px solid ${DS.border}`,cursor:'pointer',background:'transparent',border:'none',borderBottom:`1px solid ${DS.border}`,transition:'background 0.15s'}}>
                  <div style={{width:30,height:30,borderRadius:8,background:'rgba(212,165,116,0.08)',border:`1px solid ${DS.borderW}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:12,color:DS.amber}}>◈</span></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,color:DS.tx1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:DS.fontBody}}>{r.title}</div>
                    <div style={{fontSize:10,color:DS.amber,marginTop:2,fontFamily:DS.fontMono}}>{r.science} · {new Date(r.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
          {f.length===0&&<div style={{padding:36,textAlign:'center' as const,fontSize:13,color:DS.tx3,fontFamily:DS.fontMono}}>Aucune lecture trouvée</div>}
        </div>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SHARE MODAL
═══════════════════════════════════════════════════════════════ */
function ShareModal({ messages, onClose }: { messages:Msg[]; onClose:()=>void }) {
  const [sel,setSel]     = useState<Set<string>>(new Set())
  const [copied,setCopied] = useState(false)
  const aiMsgs = messages.filter(m=>m.role==='assistant'&&m.content.length>30)
  const toggle=(id:string)=>setSel(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n })
  const share=async()=>{
    const text=aiMsgs.filter(m=>sel.has(m.id)).map(m=>`✦ HexAstra Coach\n${m.content}`).join('\n\n—\n\n')
    const full=`${text}\n\n— hexastra.fr`
    if(navigator.share){try{await navigator.share({title:'Lecture HexAstra Coach',text:full,url:'https://hexastra.fr'});onClose()}catch{}}
    else{await navigator.clipboard.writeText(full);setCopied(true);setTimeout(()=>setCopied(false),2500)}
  }
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(12px)'}} onClick={onClose}/>
      <Card style={{position:'relative',zIndex:1,width:'100%',maxWidth:480,padding:0,overflow:'hidden',animation:'slideUp 0.28s ease both'}}>
        <div style={{padding:'18px 20px',borderBottom:`1px solid ${DS.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><Label>// Partager une lecture</Label><h3 style={{fontSize:17,fontWeight:600,color:DS.tx1,fontFamily:DS.fontTitle}}>Sélectionner</h3></div>
          <button onClick={onClose} style={{color:DS.tx3,cursor:'pointer',background:'none',border:'none',fontSize:14}}>✕</button>
        </div>
        <div style={{padding:'8px 20px 10px',borderBottom:`1px solid ${DS.border}`,display:'flex',gap:12}}>
          <button onClick={()=>setSel(new Set(aiMsgs.map(m=>m.id)))} style={{fontSize:11,color:DS.amber,cursor:'pointer',background:'none',border:'none',fontFamily:DS.fontMono,letterSpacing:'0.08em',textTransform:'uppercase' as const}}>Tout sélect.</button>
          <button onClick={()=>setSel(new Set())} style={{fontSize:11,color:DS.tx3,cursor:'pointer',background:'none',border:'none',fontFamily:DS.fontMono,letterSpacing:'0.08em',textTransform:'uppercase' as const}}>Effacer</button>
        </div>
        <div style={{maxHeight:300,overflowY:'auto'}}>
          {aiMsgs.map(m=>(
            <label key={m.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'11px 20px',borderBottom:`1px solid ${DS.border}`,cursor:'pointer'}}>
              <input type="checkbox" checked={sel.has(m.id)} onChange={()=>toggle(m.id)} style={{accentColor:DS.amber,marginTop:3,flexShrink:0}}/>
              <p style={{fontSize:13,color:DS.tx2,lineHeight:1.6,margin:0,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any,fontFamily:DS.fontBody}}>{m.content}</p>
            </label>
          ))}
          {aiMsgs.length===0&&<div style={{padding:28,textAlign:'center' as const,fontSize:13,color:DS.tx3,fontFamily:DS.fontBody}}>Aucune lecture à partager</div>}
        </div>
        <div style={{padding:'14px 20px'}}>
          <BtnPrimary onClick={share} disabled={sel.size===0} style={{width:'100%'}}>
            {copied?'✓ Copié — hexastra.fr':`Partager ${sel.size>0?`(${sel.size})`:''}`}
          </BtnPrimary>
        </div>
      </Card>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROFILE MENU
═══════════════════════════════════════════════════════════════ */
function ProfileMenu({ userEmail, mode, onLogout, onClose }: { userEmail:string; mode:Mode; onLogout:()=>void; onClose:()=>void }) {
  const init = userEmail[0]?.toUpperCase()||'U'
  const items = [
    {icon:'↑',label:'Passer au forfait supérieur'},
    {icon:'◈',label:'Personnalisation'},
    {icon:'⚙',label:'Paramètres'},
    {icon:'?',label:'Aide',arrow:true},
    {icon:'→',label:'Se déconnecter',danger:true},
  ]
  return (
    <div style={{position:'absolute',bottom:'calc(100% + 8px)',left:0,right:0,zIndex:300,background:'rgba(20,14,10,0.98)',border:`1px solid ${DS.borderW}`,borderRadius:14,overflow:'hidden',boxShadow:'0 -20px 60px rgba(0,0,0,0.7)',animation:'slideUp 0.2s ease both'}}>
      <div style={{padding:'12px 14px',borderBottom:`1px solid ${DS.border}`,display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:30,height:30,borderRadius:'50%',background:'rgba(212,165,116,0.12)',border:`1px solid ${DS.borderW}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:DS.amber,fontFamily:DS.fontMono,flexShrink:0}}>{init}</div>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,color:DS.tx1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:DS.fontBody}}>{userEmail}</div>
          <div style={{fontSize:10,color:DS.amber,textTransform:'capitalize' as const,fontFamily:DS.fontMono}}>{mode}</div>
        </div>
      </div>
      {items.map((item,i)=>(
        <button key={i} onClick={()=>{if(item.label==='Se déconnecter')onLogout();onClose()}}
          style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 14px',textAlign:'left' as const,borderBottom:i<items.length-1?`1px solid ${DS.border}`:'none',fontSize:13,color:item.danger?DS.tx3:DS.tx2,cursor:'pointer',background:'transparent',border:'none',borderBottom:i<items.length-1?`1px solid ${DS.border}`:'none',transition:'background 0.15s',fontFamily:DS.fontBody}}>
          <span style={{width:18,textAlign:'center' as const,fontSize:13,color:item.danger?DS.tx3:DS.amber,flexShrink:0}}>{item.icon}</span>
          {item.label}
          {item.arrow&&<span style={{marginLeft:'auto',fontSize:11,color:DS.tx3}}>›</span>}
        </button>
      ))}
      <div style={{padding:'10px 14px',borderTop:`1px solid ${DS.border}`,display:'flex',alignItems:'center',gap:9}}>
        <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(212,165,116,0.08)',border:`1px solid ${DS.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:DS.amber,flexShrink:0}}>{init}</div>
        <div><div style={{fontSize:12,color:DS.tx2,fontFamily:DS.fontBody}}>{userEmail.split('@')[0]}</div><div style={{fontSize:10,color:DS.tx3,textTransform:'capitalize' as const,fontFamily:DS.fontMono}}>{mode}</div></div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   COMPOSER BOX — focus state wrapper
═══════════════════════════════════════════════════════════════ */
function ComposerBox({ children }: { children:(focused:boolean)=>React.ReactNode }) {
  const [focused,setFocused] = useState(false)
  return (
    <div onFocusCapture={()=>setFocused(true)} onBlurCapture={()=>setFocused(false)}>
      {children(focused)}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WAVEFORM ICON
═══════════════════════════════════════════════════════════════ */
function WaveformIcon({ active }: { active:boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      {[{x:1,h:4},{x:4,h:8},{x:7,h:13},{x:10,h:10},{x:13,h:6},{x:16,h:3}].map((b,i)=>(
        <rect key={i} x={b.x} y={(14-b.h)/2} width="1.5" height={b.h} rx="0.75"
          fill={active?DS.amber:DS.tx3}
          style={{animation:active?`waveBar 0.8s ease-in-out ${i*0.1}s infinite alternate`:'none'}}/>
      ))}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LEFT SIDEBAR
═══════════════════════════════════════════════════════════════ */
function LeftSidebar({ view, setView, userEmail, mode, currentStep, stepLabels, projects, readings, onNewProject, onRenameProject, onDeleteProject, onOpenReading, onAddToProject, onSearch, onLogout, dragId }: any) {
  const [showMenu,setShowMenu]   = useState(false)
  const [editPId,setEditPId]     = useState<string|null>(null)
  const [editName,setEditName]   = useState('')
  const [newInput,setNewInput]   = useState(false)
  const [newName,setNewName]     = useState('')
  const [dropTarget,setDropTarget] = useState<string|null>(null)
  const recentProj = [...projects].reverse().slice(0,5)

  const createProject=()=>{ if(newName.trim()){onNewProject(newName.trim());setNewInput(false);setNewName('')} }

  return (
    <aside style={{width:214,minWidth:214,height:'100vh',background:'rgba(13,8,5,0.92)',backdropFilter:'blur(20px)',borderRight:`1px solid ${DS.border}`,display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden',position:'relative'}}>

      {/* Logo */}
      <div style={{padding:'14px 16px 12px',display:'flex',alignItems:'center',gap:9,borderBottom:`1px solid ${DS.border}`,flexShrink:0}}>
        <img src="/logo/hexastra-logo-transparent.png" alt="HexAstra" style={{height:24,objectFit:'contain'}} onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
        <div style={{width:18,height:18,background:DS.gradBtn,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',flexShrink:0,animation:'amberPop 5s ease-in-out infinite'}}/>
        <span style={{fontSize:14,fontWeight:600,letterSpacing:'0.1em',color:DS.tx1,textTransform:'uppercase' as const,fontFamily:DS.fontTitle}}>Hex<span style={{color:DS.amber}}>Astra</span></span>
      </div>

      {/* New reading */}
      <div style={{padding:'10px 12px 6px',flexShrink:0}}>
        <button onClick={()=>setView('chat')}
          style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'8px 14px',borderRadius:10,background:'rgba(212,165,116,0.07)',border:`1px solid ${DS.borderW}`,color:DS.amber,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all 0.2s ease',fontFamily:DS.fontBody}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nouvelle lecture
        </button>
      </div>

      <Divider/>

      {/* Navigation */}
      <div style={{padding:'8px 10px 4px',flexShrink:0}}>
        <Label>Navigation</Label>
        <nav style={{display:'flex',flexDirection:'column',gap:2}}>
          {[
            {v:'chat',sym:'◈',label:'Coach IA'},
            {v:'search_action',sym:'⊕',label:'Recherche'},
            {v:'projets',sym:'✦',label:'Vos projets'},
            {v:'profile',sym:'⬡',label:'Données personnelles'},
            {v:'abonnements',sym:'★',label:'Abonnements'},
          ].map(item=>(
            <NavItem key={item.v} icon={item.sym} label={item.label}
              active={view===item.v&&item.v!=='search_action'}
              onClick={()=>item.v==='search_action'?onSearch():setView(item.v as View)}/>
          ))}
        </nav>
      </div>

      <Divider style={{marginTop:4}}/>

      {/* Projects */}
      <div style={{padding:'8px 12px 4px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
          <Label>Projets</Label>
          <button onClick={()=>setNewInput(true)} style={{fontSize:16,color:DS.amber,cursor:'pointer',background:'none',border:'none',lineHeight:1,padding:'0 2px'}}>＋</button>
        </div>

        {newInput&&(
          <div style={{display:'flex',gap:6,marginBottom:6}}>
            <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter')createProject();if(e.key==='Escape'){setNewInput(false);setNewName('')}}}
              placeholder="Nom du projet..." style={{flex:1,background:'rgba(255,255,255,0.05)',border:`1px solid ${DS.borderW}`,borderRadius:8,padding:'6px 10px',color:DS.tx1,fontSize:12,fontFamily:DS.fontBody,outline:'none'}}/>
            <button onClick={createProject} style={{background:DS.amber,color:'#0f0a07',borderRadius:7,padding:'5px 10px',fontSize:11,fontWeight:600,cursor:'pointer',border:'none',fontFamily:DS.fontMono}}>OK</button>
          </div>
        )}

        <div style={{maxHeight:150,overflowY:'auto',marginBottom:2}}>
          {recentProj.map((p:Project)=>{
            const pR = readings.filter((r:Reading)=>r.projectId===p.id)
            const isDrop = dropTarget===p.id
            return (
              <div key={p.id}
                onDragOver={e=>{e.preventDefault();setDropTarget(p.id)}}
                onDragLeave={()=>setDropTarget(null)}
                onDrop={e=>{e.preventDefault();if(dragId)onAddToProject(dragId,p.id);setDropTarget(null)}}
                style={{marginBottom:2,borderRadius:8,border:`1px solid ${isDrop?DS.amber:'transparent'}`,background:isDrop?'rgba(212,165,116,0.06)':'transparent',transition:'all 0.18s'}}>
                <div style={{display:'flex',alignItems:'center',gap:6,padding:'5px 6px'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={DS.tx3} strokeWidth="1.8" style={{flexShrink:0}}><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  {editPId===p.id?(
                    <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                      onBlur={()=>{onRenameProject(p.id,editName);setEditPId(null)}}
                      onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditPId(null)}}}
                      style={{flex:1,background:'transparent',border:'none',borderBottom:`1px solid ${DS.amber}`,color:DS.amber,fontSize:12,fontFamily:DS.fontBody,outline:'none'}}/>
                  ):(
                    <span style={{flex:1,fontSize:12,color:DS.tx2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer',fontFamily:DS.fontBody}}
                      onDoubleClick={()=>{setEditPId(p.id);setEditName(p.name)}}>{p.name}</span>
                  )}
                  <span style={{fontSize:9,color:DS.tx3,fontFamily:DS.fontMono,flexShrink:0}}>{pR.length}</span>
                </div>
                {isDrop&&<div style={{padding:'3px 22px 4px',fontSize:10,color:DS.amber,fontFamily:DS.fontMono}}>↓ Déposer</div>}
              </div>
            )
          })}
          {projects.length===0&&!newInput&&<div style={{padding:'6px 6px',fontSize:11,color:DS.tx3,textAlign:'center' as const,fontFamily:DS.fontBody}}>Aucun projet</div>}
        </div>
      </div>

      <div style={{flex:1}}/>
      <Divider/>

      {/* Progression */}
      <div style={{padding:'8px 12px',flexShrink:0}}>
        <Label>// Progression</Label>
        {stepLabels.map(({step:n,label,desc}:any,i:number)=>{
          const done=currentStep>n, active=currentStep===n
          return (
            <div key={n} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                <div style={{width:12,height:12,borderRadius:'50%',border:`1.5px solid ${done||active?DS.amber:DS.border}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.3s',marginTop:1,background:done?DS.amber:'transparent',boxShadow:active?`0 0 8px ${DS.glow}`:'none'}}>
                  {done&&<span style={{fontSize:6.5,color:'#0f0a07'}}>✓</span>}
                  {active&&<div style={{width:4,height:4,borderRadius:'50%',background:DS.amber}}/>}
                </div>
                {i<3&&<div style={{width:1.5,height:14,borderRadius:1,margin:'2px 0',background:done?'rgba(212,165,116,0.3)':DS.border}}/>}
              </div>
              <div style={{paddingBottom:8,flex:1}}>
                <div style={{fontSize:10,color:done||active?DS.tx1:DS.tx3,transition:'color 0.3s',fontFamily:DS.fontBody,fontWeight:done||active?500:400}}>{label}</div>
                {active&&<div style={{fontSize:10,color:DS.tx3,lineHeight:1.5,marginTop:1,fontFamily:DS.fontBody}}>{desc}</div>}
              </div>
            </div>
          )
        })}
      </div>

      <Divider/>

      {/* User */}
      <div style={{padding:'8px 10px',position:'relative',flexShrink:0}}>
        <button onClick={()=>setShowMenu(o=>!o)}
          style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'7px 9px',borderRadius:10,background:showMenu?'rgba(212,165,116,0.07)':'rgba(255,255,255,0.03)',border:`1px solid ${showMenu?DS.borderW:DS.border}`,cursor:'pointer',transition:'all 0.2s ease'}}>
          <div style={{width:26,height:26,borderRadius:'50%',background:'rgba(212,165,116,0.12)',border:`1px solid ${DS.borderW}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:DS.amber,flexShrink:0,fontFamily:DS.fontMono}}>{userEmail[0]?.toUpperCase()||'U'}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:12,color:DS.tx2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:DS.fontBody}}>{userEmail.split('@')[0]}</div>
            <div style={{fontSize:10,color:DS.amber,textTransform:'capitalize' as const,fontFamily:DS.fontMono}}>{mode}</div>
          </div>
          <span style={{fontSize:9,color:DS.tx3}}>{showMenu?'▾':'▴'}</span>
        </button>
        {showMenu&&<ProfileMenu userEmail={userEmail} mode={mode} onLogout={onLogout} onClose={()=>setShowMenu(false)}/>}
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RIGHT SIDEBAR
═══════════════════════════════════════════════════════════════ */
function RightSidebar({ mode, readings, onSend, onOpenReading, dragId, setDragId }: any) {
  const [lectOpen,setLectOpen] = useState(true)
  const menu = mode==='praticien'?MENU_PRATICIEN:mode==='premium'?MENU_PREMIUM:MENU_ESSENTIEL
  const freeR = readings.filter((r:Reading)=>!r.projectId)
  const modeLabel = mode==='essentiel'?'Mode Essentiel':mode==='premium'?'Mode Premium':'Mode Praticien'

  return (
    <aside style={{width:182,minWidth:182,height:'100vh',background:'rgba(13,8,5,0.92)',backdropFilter:'blur(20px)',borderLeft:`1px solid ${DS.border}`,display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'}}>

      {/* Mode header */}
      <div style={{padding:'12px 12px 10px',borderBottom:`1px solid ${DS.border}`,flexShrink:0}}>
        <div style={{fontSize:9,letterSpacing:'0.18em',textTransform:'uppercase' as const,color:DS.amber,fontFamily:DS.fontMono,opacity:0.8}}>{modeLabel}</div>
      </div>

      {/* Vos lectures */}
      <div style={{flexShrink:0}}>
        <button style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px 5px',width:'100%',background:'transparent',border:'none',cursor:'pointer',transition:'all 0.15s'}}
          onClick={()=>setLectOpen(o=>!o)}>
          <Label>Vos lectures</Label>
          <span style={{fontSize:9,color:DS.tx3,transition:'transform 0.2s',display:'inline-block',transform:lectOpen?'rotate(0deg)':'rotate(-90deg)'}}>▾</span>
        </button>
        {lectOpen&&(
          <div style={{maxHeight:130,overflowY:'auto',padding:'0 8px 6px'}}>
            {freeR.length===0
              ?<div style={{padding:'6px 4px',fontSize:11,color:DS.tx3,textAlign:'center' as const,fontFamily:DS.fontBody}}>Aucune lecture</div>
              :freeR.map((r:Reading)=>(
                <div key={r.id} draggable onDragStart={()=>setDragId(r.id)} onDragEnd={()=>setDragId(null)} onClick={()=>onOpenReading(r)}
                  style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:8,marginBottom:2,cursor:'grab',background:dragId===r.id?'rgba(212,165,116,0.07)':'rgba(255,255,255,0.02)',border:`1px solid ${dragId===r.id?DS.borderW:'transparent'}`,transition:'all 0.15s'}}>
                  <span style={{fontSize:9,color:DS.amber,flexShrink:0}}>◈</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11,color:DS.tx2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:DS.fontBody}}>{r.title}</div>
                    <div style={{fontSize:9,color:DS.tx3,marginTop:1,fontFamily:DS.fontMono}}>{r.science}</div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      <Divider/>

      {/* Nos catégories */}
      <div style={{flex:1,overflowY:'auto',padding:'6px 8px'}}>
        <div style={{padding:'6px 4px 4px'}}>
          <Label>Nos catégories</Label>
        </div>
        {menu.map((item:any)=>{
          const [hov,setHov] = useState(false)
          return (
            <button key={item.id} onClick={()=>onSend(`${item.label} — ${item.sub}`)}
              onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
              style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'6px 8px',borderRadius:8,textAlign:'left' as const,marginBottom:2,cursor:'pointer',background:hov?'rgba(212,165,116,0.06)':'transparent',border:`1px solid ${hov?DS.borderW:'transparent'}`,transition:'all 0.15s'}}>
              <span style={{fontSize:11,flexShrink:0,color:DS.amber,opacity:hov?1:0.65}}>{item.sym}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,color:hov?DS.tx1:DS.tx2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontFamily:DS.fontBody,fontWeight:hov?500:400,transition:'color 0.15s'}}>{item.label}</div>
                <div style={{fontSize:9,color:DS.tx3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:1,fontFamily:DS.fontBody}}>{item.sub}</div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CHAT PAGE
═══════════════════════════════════════════════════════════════ */
export default function ChatPage() {
  const [messages,  setMessages]  = useState<Msg[]>([{id:'0',role:'assistant',created_at:new Date().toISOString(),content:'__welcome__'}])
  const [input,     setInput]     = useState('')
  const [isTyping,  setIsTyping]  = useState(false)
  const [mode,      setMode]      = useState<Mode>('essentiel')
  const [view,      setView]      = useState<View>('chat')
  const [step,      setStep]      = useState<Step>(1)
  const [showBirth, setShowBirth] = useState(false)
  const [showClient,setShowClient]= useState(false)
  const [showSearch,setShowSearch]= useState(false)
  const [showShare, setShowShare] = useState(false)
  const [convId,    setConvId]    = useState<string|null>(null)
  const [msgCount,  setMsgCount]  = useState(0)
  const [userEmail, setUserEmail] = useState('')
  const [profile,   setProfile]   = useState<any>(null)
  const [isRec,     setIsRec]     = useState(false)
  const [mediaRec,  setMediaRec]  = useState<MediaRecorder|null>(null)
  const [dragId,    setDragId]    = useState<string|null>(null)
  const [projects,  setProjects]  = useState<Project[]>([])
  const [readings,  setReadings]  = useState<Reading[]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const replyCache = useRef(new Map<string,string>())
  const endRef = useRef<HTMLDivElement>(null)
  const taRef  = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const isWelcome = messages.length===1&&messages[0].id==='0'

  const stepLabels = [
    {step:1 as Step,label:mode==='essentiel'?'Mode Essentiel actif':mode==='premium'?'Mode Premium actif':'Mode Praticien actif',desc:'Langue + mode configuré'},
    {step:2 as Step,label:profile?`${profile.firstName||'Profil'} · ${profile.place||''}`: 'Données naissance',desc:'Date · Heure · Lieu · Pays'},
    {step:3 as Step,label:'Microlectures',desc:'Profil · Année · Mois générés'},
    {step:4 as Step,label:'Exploration active',desc:`${messages.length-1} msg · ${readings.length} lecture${readings.length>1?'s':''}`},
  ]

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{if(data.user)setUserEmail(data.user.email||'')})
    const sp=localStorage.getItem('hx_profile'); if(sp){setProfile(JSON.parse(sp));setStep(s=>s<2?2:s)}
    const sr=localStorage.getItem('hx_readings'); if(sr)setReadings(JSON.parse(sr))
    const spr=localStorage.getItem('hx_projects'); if(spr)setProjects(JSON.parse(spr))
  },[])
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}) },[messages,isTyping])
  useEffect(()=>{ if(taRef.current){taRef.current.style.height='auto';taRef.current.style.height=Math.min(taRef.current.scrollHeight,96)+'px'} },[input])

  const bump=useCallback((len:number)=>{ if(len>=2)setStep(s=>s<2?2:s); if(len>=5)setStep(s=>s<3?3:s); if(len>=8)setStep(s=>s<4?4:s) },[])

  const saveReading=useCallback((msgs:Msg[])=>{
    const ai=msgs.filter(m=>m.role==='assistant').pop(); if(!ai||ai.id==='0')return
    const r:Reading={id:Date.now().toString(),title:msgs.find(m=>m.role==='user')?.content.slice(0,40)||'Lecture',science:mode==='essentiel'?'Mode Essentiel':mode==='premium'?'Mode Premium':'Mode Praticien',date:new Date().toISOString(),preview:ai.content.slice(0,80)}
    const newR=[r,...readings.slice(0,49)]; setReadings(newR); localStorage.setItem('hx_readings',JSON.stringify(newR))
  },[readings,mode])

  const newProject=useCallback((name:string)=>{ const p:Project={id:Date.now().toString(),name,readingIds:[],collapsed:false}; const np=[...projects,p]; setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np)) },[projects])
  const renameProject=useCallback((id:string,name:string)=>{ const np=projects.map(p=>p.id===id?{...p,name}:p); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np)) },[projects])
  const deleteProject=useCallback((id:string)=>{ const np=projects.filter(p=>p.id!==id); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np)) },[projects])
  const addToProject=useCallback((rId:string,pId:string)=>{ const nr=readings.map(r=>r.id===rId?{...r,projectId:pId}:r); setReadings(nr); localStorage.setItem('hx_readings',JSON.stringify(nr)) },[readings])
  const openReading=useCallback((r:Reading)=>{ setMessages([{id:'0',role:'assistant',created_at:r.date,content:`📖 ${r.title}\n\n${r.preview}...`}]); setView('chat') },[])

  const handleFile=useCallback((files:FileList|null)=>{
    if(!files||!files[0])return; const file=files[0]; const reader=new FileReader()
    reader.onload=()=>{ send(`[Fichier joint : ${file.name}]\n${file.type.startsWith('text')?reader.result as string:'[Contenu binaire]'}`) }
    if(file.type.startsWith('text')||file.type==='application/json') reader.readAsText(file)
    else send(`[Fichier joint : ${file.name} — ${(file.size/1024).toFixed(1)} Ko]`)
  },[])

  const toggleRec=useCallback(async()=>{
    if(isRec&&mediaRec){mediaRec.stop();setIsRec(false);return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true}); const rec=new MediaRecorder(stream); const chunks:BlobPart[]=[]
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

const send=useCallback(async(text?:string,birthData?:any)=>{
   const content=text||input.trim(); if(!content&&!birthData)return
   const userMsg:Msg={id:Date.now().toString(),role:'user',created_at:new Date().toISOString(),
      content:birthData?`Données de naissance : ${birthData.firstName} ${birthData.lastName||''} · ${birthData.date} · ${birthData.time||'inconnue'} · ${birthData.place}, ${birthData.country}`:content}
    const base = isWelcome ? [] : messages
    const newMsgs=[...base,userMsg]; setMessages(newMsgs); setInput(''); setIsTyping(true)
   setMsgCount(c=>c+1); bump(newMsgs.length)

   if(!birthData&&replyCache.current.has(content)){
      setTimeout(()=>{
         setIsTyping(false)
         triggerResponding()
         const cachedReply = replyCache.current.get(content)!
         setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:cachedReply,created_at:new Date().toISOString(),cached:true}])
      },300)
      return
   }

   try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs.map(m=>({role:m.role,content:m.content})),mode,birthData:birthData||null,conversationId:convId})})
      const data=await res.json(); if(data.conversationId)setConvId(data.conversationId)
      const reply=data.reply||'Une erreur est survenue.'
      if(!birthData&&content.length<200)replyCache.current.set(content,reply)
      setIsTyping(false)
      triggerResponding()
      const aiMsg:Msg={id:Date.now().toString(),role:'assistant',content:reply,created_at:new Date().toISOString()}
      const finalMsgs=[...newMsgs,aiMsg]; setMessages(finalMsgs); bump(finalMsgs.length); saveReading(finalMsgs)
      if(birthData){setProfile(birthData);localStorage.setItem('hx_profile',JSON.stringify(birthData));setStep(s=>s<2?2:s)}
      if(data.needsBirthData)setTimeout(()=>setShowBirth(true),600)
   }catch{
      setIsTyping(false)
      triggerResponding()
      setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:'Erreur de connexion. Réessaie.',created_at:new Date().toISOString()}])
   }
},[input,messages,isWelcome,mode,convId,bump,saveReading,triggerResponding])

  const switchMode=(m:Mode)=>{ if((m==='premium'||m==='praticien')&&mode==='essentiel'){setView('abonnements');return}; setMode(m) }

  if(view==='profile') return <ProfileViewPage profile={profile} onEdit={()=>{setView('chat');setTimeout(()=>setShowBirth(true),100)}} onBack={()=>setView('chat')}/>
  if(view==='abonnements') return <AbonnementsPage onBack={()=>setView('chat')} userEmail={userEmail} onSuccess={(m:Mode)=>{setMode(m);setView('chat')}}/>
  if(view==='projets') return <ProjetsPage projects={projects} readings={readings} onBack={()=>setView('chat')} onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject} onOpenReading={openReading}/>

  const modeLabel = mode==='essentiel'?'Essentiel':mode==='premium'?'Premium':'Praticien'

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:DS.bg0,position:'relative'}}>
      <CosmicBackground/>

      <LeftSidebar view={view} setView={setView} userEmail={userEmail} mode={mode} currentStep={step} stepLabels={stepLabels}
        projects={projects} readings={readings} onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject}
        onOpenReading={openReading} onAddToProject={addToProject} onSearch={()=>setShowSearch(true)}
        onLogout={async()=>{await supabase.auth.signOut();router.push('/login')}} dragId={dragId}/>

      {/* ── MAIN AREA ── */}
      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',zIndex:10,minWidth:0,position:'relative'}}>

        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 16px',borderBottom:`1px solid ${DS.border}`,background:'rgba(10,6,3,0.8)',backdropFilter:'blur(24px)',flexShrink:0,height:50}}>
          {/* Mode switcher */}
          <div style={{display:'flex',background:'rgba(255,255,255,0.02)',border:`1px solid ${DS.border}`,borderRadius:10,overflow:'hidden',gap:0}}>
            {(['essentiel','premium','praticien'] as Mode[]).map(m=>(
              <button key={m} onClick={()=>switchMode(m)}
                style={{padding:'6px 14px',fontSize:12,fontWeight:mode===m?500:400,color:mode===m?DS.amber:DS.tx3,background:mode===m?'rgba(212,165,116,0.09)':'transparent',cursor:'pointer',border:'none',transition:'all 0.2s ease',display:'flex',alignItems:'center',gap:5,fontFamily:DS.fontBody,textTransform:'capitalize' as const}}>
                {m}
                {(m==='premium'||m==='praticien')&&mode==='essentiel'&&<span style={{fontSize:9,opacity:0.6}}>🔒</span>}
              </button>
            ))}
          </div>

          {/* Share */}
          <IconBtn tooltip="Partager une lecture" onClick={()=>setShowShare(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          </IconBtn>
        </div>

        {/* ── MESSAGES ── */}
        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',position:'relative'}}>

          {/* WELCOME SCREEN */}
          {isWelcome ? (
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 20px',animation:'welcomeFade 0.65s ease both'}}>
              <div style={{width:'100%',maxWidth:600}}>
                <Card style={{padding:'44px 48px',display:'flex',flexDirection:'column',alignItems:'center',gap:22,textAlign:'center',background:'rgba(15,10,7,0.7)'}}>

                  {/* Micro-label */}
                  <div style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase' as const,color:'rgba(212,165,116,0.4)',fontFamily:DS.fontMono}}>
                    Conversation privée · Réponse en quelques secondes
                  </div>

                  {/* Logo */}
                  <div style={{width:48,height:48,background:DS.gradBtn,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',animation:'floatGlow 4s ease-in-out infinite'}}/>

                  {/* Headline */}
                  <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:460}}>
                    <h1 style={{fontSize:'clamp(26px,3.8vw,38px)',lineHeight:1.1,...DS.gradTitle}}>
                      HexAstra Coach
                    </h1>
                    <p style={{fontSize:16,color:'rgba(212,165,116,0.65)',fontWeight:400,fontFamily:DS.fontBody,lineHeight:1.6,letterSpacing:'0.01em'}}>Explore ta situation avec plus de clarté.</p>
                  </div>

                  <p style={{fontSize:14,color:DS.tx3,lineHeight:1.75,fontFamily:DS.fontBody,maxWidth:380}}>
                    Je suis HexAstra.<br/>Choisis ta langue pour commencer.
                  </p>

                  {/* Language buttons */}
                  <div style={{display:'flex',gap:12}}>
                    {[{label:'Français',msg:'Français'},{label:'English',msg:'English'}].map(l=>(
                      <BtnPrimary key={l.label} onClick={()=>send(l.msg)} style={{padding:'12px 32px',fontSize:15}}>
                        {l.label}
                      </BtnPrimary>
                    ))}
                  </div>

                  {/* Quick actions */}
                  <div style={{display:'flex',flexWrap:'wrap',gap:8,justifyContent:'center',marginTop:4}}>
                    {['Comprendre une période de vie','Clarifier une décision','Explorer une dynamique relationnelle','Mieux lire mon moment actuel'].map(q=>(
                      <button key={q} onClick={()=>send(q)}
                        style={{padding:'7px 16px',borderRadius:99,background:'rgba(255,255,255,0.03)',border:`1px solid ${DS.border}`,color:'rgba(203,185,164,0.6)',fontSize:12,cursor:'pointer',transition:'all 0.2s ease',fontFamily:DS.fontBody,letterSpacing:'0.01em'}}>
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Legal */}
                  <p style={{fontSize:11,color:'rgba(255,255,255,0.22)',lineHeight:1.7,fontStyle:'italic',maxWidth:400,fontFamily:DS.fontBody,marginTop:4}}>
                    HexAstra Coach est un outil d'exploration et de réflexion personnelle.<br/>
                    Il ne remplace pas un avis médical, juridique ou financier.
                  </p>
                </Card>
              </div>
            </div>

          ) : (
            /* CONVERSATION */
            <div style={{flex:1,overflowY:'auto',padding:'28px 32px',display:'flex',flexDirection:'column',gap:20,maxWidth:900,width:'100%',margin:'0 auto',boxSizing:'border-box'}}>

              {/* Micro-label */}
              <div style={{textAlign:'center' as const,fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase' as const,color:'rgba(212,165,116,0.25)',fontFamily:DS.fontMono,marginBottom:4}}>
                Conversation privée · Analyse personnelle générée instantanément
              </div>

              {messages.map((msg,i)=>(
                <div key={msg.id} style={{display:'flex',alignItems:'flex-start',gap:14,justifyContent:msg.role==='user'?'flex-end':'flex-start',animation:'fadeUp 0.4s ease both',animationDelay:`${Math.min(i,4)*0.05}s`}}>
                  {msg.role==='assistant'&&(
                    <div style={{width:26,height:26,minWidth:26,flexShrink:0,marginTop:3,opacity:0.85}}>
                      <div style={{width:'100%',height:'100%',background:DS.gradBtn,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}/>
                    </div>
                  )}
                  <div style={{
                    maxWidth:'min(680px,82%)',
                    ...(msg.role==='user'
                      ? {background:'rgba(212,165,116,0.07)',border:`1px solid ${DS.borderW}`,borderRadius:16,borderBottomRightRadius:4,padding:'13px 17px'}
                      : {background:'rgba(20,14,10,0.55)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:18,padding:'18px 22px',transition:'border-color 0.3s ease'}
                    )
                  }}>
                    <p style={{
                      fontSize:16,
                      lineHeight:1.78,
                      letterSpacing:'0.01em',
                      color:msg.role==='user'?'rgba(245,241,234,0.9)':'rgba(245,241,234,0.86)',
                      whiteSpace:'pre-wrap',
                      margin:0,
                      fontFamily:DS.fontBody,
                      fontWeight:400,
                    }}>{msg.content}</p>
                    {msg.cached&&<span style={{fontSize:9,color:DS.tx3,marginTop:5,display:'block',fontFamily:DS.fontMono}}>⚡ cache</span>}
                    <span style={{display:'block',fontSize:9,color:DS.tx3,marginTop:7,textAlign:msg.role==='user'?'right' as const:'left' as const,fontFamily:DS.fontMono,letterSpacing:'0.06em'}}>{new Date(msg.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
                  </div>
                </div>
              ))}

              {isTyping&&(
                <div style={{display:'flex',alignItems:'center',gap:14,animation:'fadeUp 0.3s ease both'}}>
                  <div style={{width:24,height:24,minWidth:24,flexShrink:0,opacity:0.6}}>
                    <div style={{width:'100%',height:'100%',background:DS.gradBtn,clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}/>
                  </div>
                  <div style={{display:'flex',gap:5,padding:'8px 0',alignItems:'center'}}>
                    {[0,1,2].map(i=><span key={i} style={{width:4,height:4,borderRadius:'50%',background:'rgba(212,165,116,0.45)',display:'inline-block',animation:'blink 1.4s ease-in-out infinite',animationDelay:`${i*0.2}s`}}/>)}
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>
          )}
        </div>

        {/* ── COMPOSER ── */}
        <div style={{padding:'10px 24px 14px',borderTop:`1px solid ${DS.border}`,background:'rgba(8,5,2,0.75)',backdropFilter:'blur(24px)',flexShrink:0}}>
          {/* Supra label */}
          <div style={{textAlign:'center' as const,fontSize:10,letterSpacing:'0.22em',textTransform:'uppercase' as const,color:'rgba(212,165,116,0.5)',fontFamily:DS.fontMono,marginBottom:9}}>
            HexAstra t'aide à y voir plus clair
          </div>

          {/* Quick actions — shown after conversation starts */}
          {!isWelcome&&(
            <div style={{display:'flex',gap:7,flexWrap:'wrap',justifyContent:'center',marginBottom:10}}>
              {['Comprendre une situation que je traverse','Clarifier une décision importante','Explorer une période de ma vie','Énergie du moment'].map(q=>(
                <button key={q} onClick={()=>send(q)}
                  style={{padding:'5px 13px',borderRadius:99,background:'rgba(255,255,255,0.025)',border:`1px solid ${DS.border}`,color:'rgba(203,185,164,0.5)',fontSize:12,cursor:'pointer',transition:'all 0.2s ease',fontFamily:DS.fontBody,whiteSpace:'nowrap'}}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <ComposerBox>
            {(focused)=>(
            <div style={{display:'flex',alignItems:'flex-end',gap:8,background:'rgba(255,255,255,0.03)',border:`1px solid ${focused?'rgba(212,165,116,0.38)':'rgba(255,255,255,0.07)'}`,borderRadius:16,padding:'10px 12px',maxWidth:900,margin:'0 auto',transition:'border-color 0.25s ease, box-shadow 0.25s ease',boxShadow:focused?'0 0 0 2px rgba(212,165,116,0.12), 0 0 20px rgba(212,165,116,0.08)':'none'}}>
              {/* Profile btn */}
              <IconBtn tooltip={mode==='praticien'?'Profil client':'Données de naissance'} onClick={()=>mode==='praticien'?setShowClient(true):setShowBirth(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </IconBtn>

              {/* Attach */}
              <IconBtn tooltip="Ajouter des fichiers" onClick={()=>fileRef.current?.click()}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              </IconBtn>
              <input ref={fileRef} type="file" accept="image/*,.pdf,.txt,.doc,.docx" style={{display:'none'}} onChange={e=>handleFile(e.target.files)}/>

              {/* Textarea */}
              <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
                placeholder="Parle-moi de ta situation ou pose ta question…" rows={1}
                style={{flex:1,background:'transparent',border:'none',color:DS.tx1,fontSize:16,lineHeight:'1.7',letterSpacing:'0.01em',minHeight:24,maxHeight:100,overflowY:'auto',padding:'3px 0',resize:'none',fontFamily:DS.fontBody,outline:'none'}}/>

              {/* Vocal */}
              <IconBtn tooltip="Message vocal" onClick={toggleRec} active={isRec}>
                <WaveformIcon active={isRec}/>
              </IconBtn>
            </div>
            )}
          </ComposerBox>

          {/* Footer */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,padding:'0 4px',gap:8,maxWidth:900,margin:'8px auto 0'}}>
            <div style={{fontSize:9,color:'rgba(212,165,116,0.35)',letterSpacing:'0.12em',textTransform:'uppercase' as const,flexShrink:0,border:'1px solid rgba(212,165,116,0.1)',padding:'2px 9px',borderRadius:4,fontFamily:DS.fontMono}}>{modeLabel}</div>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.2)',textAlign:'center' as const,flex:1,lineHeight:1.6,margin:0,fontStyle:'italic',fontFamily:DS.fontBody}}>
              HexAstra Coach est un outil d'exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.
            </p>
            <div style={{width:60,flexShrink:0}}/>
          </div>
        </div>
      </main>

      <RightSidebar mode={mode} readings={readings} onSend={(t:string)=>send(t)} onOpenReading={openReading} dragId={dragId} setDragId={setDragId}/>

      {showBirth&&<BirthModal existing={profile} onClose={()=>setShowBirth(false)} onSubmit={d=>{setShowBirth(false);send(undefined,d)}}/>}
      {showClient&&<ClientModal onClose={()=>setShowClient(false)} onSubmit={d=>{setShowClient(false);send(undefined,d)}}/>}
      {showSearch&&<SearchModal readings={readings} onClose={()=>setShowSearch(false)} onSelect={r=>{openReading(r);setShowSearch(false)}}/>}
      {showShare&&<ShareModal messages={messages.filter(m=>m.id!=='0')} onClose={()=>setShowShare(false)}/>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FULL-PAGE VIEWS — Profile / Projets / Abonnements
═══════════════════════════════════════════════════════════════ */
function PageShell({ children, title, back }: { children:React.ReactNode; title:string; back:()=>void }) {
  return (
    <div style={{minHeight:'100vh',background:DS.bg0,position:'relative'}}>
      <CosmicBackground/>
      <div style={{position:'relative',zIndex:10,maxWidth:820,margin:'0 auto',padding:'0 32px 60px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 0 20px',borderBottom:`1px solid ${DS.border}`,marginBottom:32}}>
          <BtnGhost onClick={back} style={{padding:'7px 14px',fontSize:12}}>← Retour</BtnGhost>
          <h1 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.01em',color:DS.tx1,fontFamily:DS.fontTitle}}>{title}</h1>
          <div style={{width:80}}/>
        </div>
        {children}
      </div>
    </div>
  )
}

function ProfileViewPage({ profile, onEdit, onBack }: any) {
  return (
    <PageShell title="Données personnelles" back={onBack}>
      {!profile?(
        <Card style={{padding:'48px',display:'flex',flexDirection:'column',alignItems:'center',gap:16,textAlign:'center' as const}}>
          <div style={{fontSize:56,opacity:0.15}}>⬡</div>
          <p style={{fontSize:14,color:DS.tx3,fontFamily:DS.fontBody}}>Aucun profil enregistré.</p>
          <BtnPrimary onClick={onEdit}>Saisir mes données</BtnPrimary>
        </Card>
      ):(
        <Card style={{padding:'32px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <Label>Profil actif</Label>
            <BtnGhost onClick={onEdit} style={{padding:'7px 16px',fontSize:12}}>Modifier ✎</BtnGhost>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[['Prénom',profile.firstName],['Nom',profile.lastName],['Date de naissance',profile.date],['Heure',profile.time],['Ville',profile.place],['Pays',profile.country],['Fuseau',profile.timezone]].filter(([,v])=>v).map(([l,v])=>(
              <div key={l as string} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:`1px solid ${DS.border}`}}>
                <span style={{fontSize:11,color:DS.tx3,textTransform:'uppercase' as const,letterSpacing:'0.1em',fontFamily:DS.fontMono}}>{l as string}</span>
                <span style={{fontSize:14,color:DS.tx1,fontWeight:500,fontFamily:DS.fontBody}}>{v as string}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </PageShell>
  )
}

function ProjetsPage({ projects, readings, onBack, onNewProject, onRenameProject, onDeleteProject, onOpenReading }: any) {
  const [editing,setEditing] = useState<string|null>(null)
  const [editName,setEditName] = useState('')
  const [newName,setNewName] = useState('')
  return (
    <PageShell title="Vos projets" back={onBack}>
      <div style={{display:'flex',gap:10,marginBottom:24}}>
        <input value={newName} onChange={e=>setNewName(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&newName.trim()){onNewProject(newName.trim());setNewName('')}}}
          placeholder="Nom du nouveau projet..." style={{flex:1,...fmInp}}/>
        <BtnPrimary onClick={()=>{if(newName.trim()){onNewProject(newName.trim());setNewName('')}}} style={{padding:'10px 20px'}}>Créer</BtnPrimary>
      </div>
      {projects.map((p:Project)=>{
        const pR=readings.filter((r:Reading)=>r.projectId===p.id)
        return (
          <Card key={p.id} style={{padding:'20px 24px',marginBottom:12}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DS.amber} strokeWidth="1.8"><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
              {editing===p.id?(
                <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                  onBlur={()=>{onRenameProject(p.id,editName);setEditing(null)}}
                  onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditing(null)}}}
                  style={{flex:1,...fmInp,padding:'4px 8px',fontSize:14,borderColor:DS.amber}}/>
              ):(
                <span style={{flex:1,fontSize:15,fontWeight:500,color:DS.tx1,cursor:'pointer',fontFamily:DS.fontBody}}
                  onDoubleClick={()=>{setEditing(p.id);setEditName(p.name)}}>{p.name}</span>
              )}
              <BtnGhost onClick={()=>{setEditing(p.id);setEditName(p.name)}} style={{padding:'4px 10px',fontSize:11}}>✎</BtnGhost>
              <BtnGhost onClick={()=>onDeleteProject(p.id)} style={{padding:'4px 10px',fontSize:11,color:DS.tx3}}>✕</BtnGhost>
            </div>
            {pR.map((r:Reading)=>(
              <button key={r.id} onClick={()=>{onOpenReading(r);onBack()}}
                style={{display:'flex',alignItems:'center',gap:9,width:'100%',padding:'7px 8px',textAlign:'left' as const,cursor:'pointer',background:'transparent',border:'none',borderBottom:`1px solid ${DS.border}`,marginBottom:2,transition:'background 0.15s'}}>
                <span style={{fontSize:11,color:DS.amber}}>◈</span>
                <span style={{fontSize:13,color:DS.tx2,fontFamily:DS.fontBody}}>{r.title}</span>
                <span style={{marginLeft:'auto',fontSize:10,color:DS.tx3,fontFamily:DS.fontMono}}>{new Date(r.date).toLocaleDateString('fr-FR')}</span>
              </button>
            ))}
            {pR.length===0&&<p style={{fontSize:12,color:DS.tx3,fontFamily:DS.fontBody,paddingLeft:26}}>Glisse des lectures depuis la barre de droite</p>}
          </Card>
        )
      })}
      {projects.length===0&&(
        <Card style={{padding:'48px',textAlign:'center' as const}}>
          <p style={{fontSize:14,color:DS.tx3,fontFamily:DS.fontBody}}>Aucun projet. Crée-en un ci-dessus.</p>
        </Card>
      )}
    </PageShell>
  )
}

function AbonnementsPage({ onBack, userEmail, onSuccess }: any) {
  const [loading,setLoading]=useState<string|null>(null)
  const checkout=async(key:string,m:Mode)=>{
    setLoading(key)
    try{ const r=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceKey:key})}); const d=await r.json(); if(d.url)window.location.href=d.url; else onSuccess(m) }
    finally{setLoading(null)}
  }
  const plans=[
    {key:'essentiel',mode:'essentiel' as Mode,badge:'GRATUIT',name:'Essentiel',price:'0',period:'',features:['9 sciences disponibles','Lectures illimitées','Sauvegarde locale'],highlight:false},
    {key:'premium',mode:'premium' as Mode,badge:'PREMIUM',name:'Premium',price:'29',period:'/mois',features:['11 sciences complètes','Audio IA (ElevenLabs)','PDF haute qualité','Historique cloud'],highlight:true},
    {key:'praticien',mode:'praticien' as Mode,badge:'PRATICIEN',name:'Praticien',price:'89',period:'/mois',features:['Mode cabinet complet','Profils clients illimités','Rapports exportables','12 sciences avancées','Support prioritaire'],highlight:false},
  ]
  return (
    <div style={{minHeight:'100vh',background:DS.bg0,position:'relative'}}>
      <CosmicBackground/>
      <div style={{position:'relative',zIndex:10,maxWidth:1100,margin:'0 auto',padding:'0 32px 60px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 0 16px',borderBottom:`1px solid ${DS.border}`,marginBottom:40}}>
          <BtnGhost onClick={onBack} style={{padding:'7px 14px',fontSize:12}}>← Retour</BtnGhost>
          <div style={{textAlign:'center' as const}}>
            <Label>// Accès complet HexAstra</Label>
            <h1 style={{fontSize:'clamp(26px,3.5vw,38px)',letterSpacing:'-0.02em',lineHeight:1.15,marginTop:4,...DS.gradTitle}}>
              Lectures précises.<br/><span>Swiss Ephemeris.</span>
            </h1>
          </div>
          <span style={{fontSize:11,color:DS.tx3,fontFamily:DS.fontMono}}>{userEmail}</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
          {plans.map(p=>(
            <Card key={p.key} hover style={{padding:'28px 24px',display:'flex',flexDirection:'column',gap:16,position:'relative',border:p.highlight?`1px solid ${DS.borderW}`:undefined}}>
              {p.highlight&&<div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:DS.gradBtn,color:'#fff',fontSize:10,letterSpacing:'0.14em',padding:'3px 14px',borderRadius:99,whiteSpace:'nowrap',fontFamily:DS.fontMono}}>✦ Le plus choisi</div>}
              <div>
                <div style={{fontSize:9,letterSpacing:'0.2em',color:DS.amber,textTransform:'uppercase' as const,fontFamily:DS.fontMono,marginBottom:6}}>{p.badge}</div>
                <div style={{fontSize:22,fontWeight:600,color:DS.tx1,fontFamily:DS.fontBody}}>{p.name}</div>
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                {p.price!=='0'&&<span style={{fontSize:16,color:DS.tx2,fontFamily:DS.fontBody}}>€</span>}
                <span style={{fontSize:46,fontWeight:600,letterSpacing:'-0.02em',color:DS.tx1,lineHeight:1,fontFamily:DS.fontBody}}>{p.price==='0'?'Gratuit':p.price}</span>
                {p.period&&<span style={{fontSize:12,color:DS.tx3,fontFamily:DS.fontBody}}>{p.period}</span>}
              </div>
              <Divider/>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:8,flex:1}}>
                {p.features.map(f=>(
                  <li key={f} style={{display:'flex',alignItems:'center',gap:9,fontSize:13,color:DS.tx2,fontFamily:DS.fontBody}}>
                    <span style={{color:DS.amber,flexShrink:0}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <BtnPrimary onClick={()=>checkout(p.key,p.mode)} disabled={loading===p.key||p.key==='essentiel'} style={{width:'100%',padding:'12px',fontSize:13,background:p.highlight?DS.gradBtn:p.key==='essentiel'?'rgba(255,255,255,0.04)':undefined}}>
                {loading===p.key?'...':(p.key==='essentiel'?'Mode actuel':p.highlight?'Commencer Premium':'Accès Praticien')}
              </BtnPrimary>
            </Card>
          ))}
        </div>

        <p style={{textAlign:'center' as const,fontSize:12,color:DS.tx3,marginTop:32,fontFamily:DS.fontBody}}>
          Paiement sécurisé Stripe · Annulation à tout moment · hexastra.fr
        </p>
      </div>
    </div>
  )
}
