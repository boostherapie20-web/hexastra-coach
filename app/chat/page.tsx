'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
type Msg = { id: string; role: 'user'|'assistant'; content: string; created_at: string; showPremium?: boolean; cached?: boolean }
type Mode = 'essentiel'|'premium'|'praticien'
type View = 'chat'|'profile'|'abonnements'|'projets'
type Step = 1|2|3|4
type Project = { id: string; name: string; readingIds: string[]; collapsed: boolean }
type Reading = { id: string; title: string; science: string; date: string; preview: string; projectId?: string }
type ProfileData = { firstName: string; lastName?: string; date: string; time: string; place: string; country: string; timezone: string; lat?: number; lon?: number }
type ClientData = ProfileData & { email?: string; phone?: string; notes?: string }

// ═══════════════════════════════════════════════════════════════
// COUNTRIES — Ultra-complete by continent
// ═══════════════════════════════════════════════════════════════
const COUNTRIES_BY_CONTINENT: Record<string, string[]> = {
  'Europe': ['Albanie','Allemagne','Andorre','Autriche','Belgique','Biélorussie','Bosnie-Herzégovine','Bulgarie','Chypre','Croatie','Danemark','Espagne','Estonie','Finlande','France','Grèce','Hongrie','Irlande','Islande','Italie','Kosovo','Lettonie','Liechtenstein','Lituanie','Luxembourg','Macédoine du Nord','Malte','Moldavie','Monaco','Monténégro','Norvège','Pays-Bas','Pologne','Portugal','République Tchèque','Roumanie','Royaume-Uni','Russie','Saint-Marin','Serbie','Slovaquie','Slovénie','Suède','Suisse','Ukraine','Vatican'],
  'Afrique': ['Afrique du Sud','Algérie','Angola','Bénin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroun','Centrafrique','Comores','Congo','Côte d\'Ivoire','Djibouti','Égypte','Érythrée','Éthiopie','Gabon','Gambie','Ghana','Guinée','Guinée-Bissau','Guinée équatoriale','Kenya','Lesotho','Liberia','Libye','Madagascar','Malawi','Mali','Maroc','Maurice','Mauritanie','Mozambique','Namibie','Niger','Nigeria','Ouganda','Rwanda','São Tomé-et-Príncipe','Sénégal','Seychelles','Sierra Leone','Somalie','Soudan','Soudan du Sud','Swaziland','Tanzanie','Tchad','Togo','Tunisie','Zambie','Zimbabwe'],
  'Amériques — Nord et Central': ['Belize','Canada','Costa Rica','Cuba','États-Unis','Guatemala','Honduras','Mexique','Nicaragua','Panama','Québec (Province)','Salvador'],
  'Caraïbes — Archipel': ['Anguilla','Antigua-et-Barbuda','Aruba','Bahamas','Barbade','Bonaire','Curaçao','Dominique','Grenade','Guadeloupe','Haïti','Îles Caïmans','Îles Turques-et-Caïques','Îles Vierges américaines','Îles Vierges britanniques','Jamaïque','Martinique','Montserrat','Porto Rico','République dominicaine','Saba','Saint-Barthélemy','Saint-Kitts-et-Nevis','Saint-Martin','Saint-Vincent-et-les-Grenadines','Sainte-Lucie','Sint Maarten','Trinité-et-Tobago'],
  'Amériques — Sud': ['Argentine','Bolivie','Brésil','Chili','Colombie','Équateur','Guyane','Guyane française','Paraguay','Pérou','Suriname','Uruguay','Venezuela'],
  'Asie — Moyen-Orient': ['Arabie Saoudite','Bahreïn','Émirats Arabes Unis','Irak','Iran','Israël','Jordanie','Koweït','Liban','Oman','Palestine','Qatar','Syrie','Turquie','Yémen'],
  'Asie — Centre et Sud': ['Afghanistan','Bangladesh','Bhoutan','Inde','Kazakhstan','Kirghizistan','Maldives','Népal','Ouzbékistan','Pakistan','Sri Lanka','Tadjikistan','Turkménistan'],
  'Asie — Est et Sud-Est': ['Birmanie (Myanmar)','Brunei','Cambodge','Chine','Corée du Nord','Corée du Sud','Indonésie','Japon','Laos','Malaisie','Mongolie','Philippines','Singapour','Taïwan','Thaïlande','Timor-Leste','Viêt Nam'],
  'Océanie': ['Australie','Fidji','Îles Cook','Îles Marshall','Îles Salomon','Kiribati','Micronésie','Nauru','Nouvelle-Calédonie','Nouvelle-Zélande','Palaos','Papouasie-Nouvelle-Guinée','Polynésie française','Samoa','Tonga','Tuvalu','Vanuatu'],
}
const ALL_COUNTRIES = Object.values(COUNTRIES_BY_CONTINENT).flat().sort((a,b)=>a.localeCompare(b,'fr'))

// ═══════════════════════════════════════════════════════════════
// TIMEZONES
// ═══════════════════════════════════════════════════════════════
const TIMEZONES = [
  { v:'auto', l:'Fuseau horaire automatique' },
  { v:'UTC', l:'00:00 GMT / TU' },
  { v:'Atlantic/Azores', l:'w01:00 Afrique Occ.' },
  { v:'America/Noronha', l:'w02:00 Mid Atlantic T.' },
  { v:'America/Sao_Paulo', l:'w03:00 BRZ2 / ADT' },
  { v:'America/St_Johns', l:'w03:30 Terre-Neuve' },
  { v:'America/New_York', l:'w04:00 AST / EDT' },
  { v:'America/Chicago', l:'w05:00 HNE / CDT' },
  { v:'America/Denver', l:'w06:00 CST / MDT' },
  { v:'America/Los_Angeles', l:'w07:00 MST / PDT' },
  { v:'America/Anchorage', l:'w08:00 PST' },
  { v:'America/Adak', l:'w09:00 AHDT / YST' },
  { v:'Pacific/Honolulu', l:'w10:00 AHST' },
  { v:'Pacific/Midway', l:'w11:00 Heure de Bering' },
  { v:'Europe/London', l:'e01:00 CET / BST' },
  { v:'Europe/Paris', l:'e01:00 CET / CEST (Paris)' },
  { v:'Europe/Helsinki', l:'e02:00 EET / CEST' },
  { v:'Europe/Moscow', l:'e03:00 Zone Rus. 3' },
  { v:'Asia/Dubai', l:'e04:00 Zone Rus. 4' },
  { v:'Asia/Karachi', l:'e05:00 Pakistan' },
  { v:'Asia/Kolkata', l:'e05:30 Inde' },
  { v:'Asia/Dhaka', l:'e06:00 Bangladesh' },
  { v:'Asia/Bangkok', l:'e07:00 Indochine' },
  { v:'Asia/Shanghai', l:'e08:00 Chine' },
  { v:'Asia/Tokyo', l:'e09:00 Japon' },
  { v:'Australia/Sydney', l:'e10:00 Australie Est' },
  { v:'Pacific/Auckland', l:'e12:00 Nouvelle-Zélande' },
]

// ═══════════════════════════════════════════════════════════════
// MENUS
// ═══════════════════════════════════════════════════════════════
const MENU_ESSENTIEL = [
  { id:'1', sym:'✦', label:'NeuroKua™', sub:'État intérieur & énergie' },
  { id:'2', sym:'◈', label:'Énergie du moment', sub:'Tendance du jour' },
  { id:'3', sym:'♡', label:'Amour / Relations', sub:'Dynamiques affectives' },
  { id:'4', sym:'◆', label:'Travail / Argent', sub:'Choix pro & stabilité' },
  { id:'5', sym:'◉', label:'Bien-être', sub:'Apaise & recentre' },
  { id:'6', sym:'⊕', label:'Décision', sub:'Clarté & choix' },
  { id:'7', sym:'◎', label:'Vision mois', sub:'Anticipe & timing' },
  { id:'8', sym:'✧', label:'Lecture générale', sub:'Synthèse complète' },
  { id:'9', sym:'⬡', label:'Par science', sub:'Angle spécifique' },
]
const MENU_PREMIUM = [
  ...MENU_ESSENTIEL,
  { id:'P1', sym:'❋', label:'Fusion KS™', sub:'Synthèse totale' },
  { id:'P2', sym:'⬢', label:'Astrolex™', sub:'Astrologie précise' },
]
const MENU_PRATICIEN = [
  { id:'A1', sym:'✦', label:'NeuroKua™', sub:'Diagnostic état interne' },
  { id:'A2', sym:'◈', label:'Relationnel™', sub:'Dynamiques & leviers' },
  { id:'A3', sym:'◆', label:'Professionnel™', sub:'Positionnement & risques' },
  { id:'A4', sym:'◎', label:'Cycle à venir™', sub:'Phase & timing' },
  { id:'A5', sym:'⊕', label:'Décision précise™', sub:'Comparatif A/B' },
  { id:'A6', sym:'✧', label:'Lecture générale™', sub:'Synthèse multidim.' },
  { id:'B1', sym:'⬡', label:'Astrolex™', sub:'Astrologie' },
  { id:'B2', sym:'◉', label:'Porteum™', sub:'Numérologie' },
  { id:'B3', sym:'⊗', label:'TriangleNumeris™', sub:'Triangle' },
  { id:'B4', sym:'⊛', label:'Ennéagramme™', sub:'Types' },
  { id:'B5', sym:'⬢', label:'Kua™', sub:'Feng Shui' },
  { id:'B6', sym:'❋', label:'Fusion KS™', sub:'Synthèse totale' },
]

// ═══════════════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════════════
function Stars() {
  const s = useRef(Array.from({length:50},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*100,sz:Math.random()*1.4+0.3,d:Math.random()*4}))).current
  return <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0}}>{s.map(st=><div key={st.id} style={{position:'absolute',left:`${st.x}%`,top:`${st.y}%`,width:st.sz,height:st.sz,borderRadius:'50%',background:'rgba(255,255,255,0.5)',animation:`pulse ${2+st.d}s ease-in-out ${st.d}s infinite`}}/>)}</div>
}

// ═══════════════════════════════════════════════════════════════
// CITY AUTOCOMPLETE
// ═══════════════════════════════════════════════════════════════
function CityInput({ value, onChange, placeholder }: { value:string; onChange:(v:string,lat?:number,lon?:number)=>void; placeholder?:string }) {
  const [sugg,setSugg] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [loading,setLoading] = useState(false)
  const tmr = useRef<any>(null)
  const search = useCallback(async(q:string)=>{
    if(q.length<2){setSugg([]);setOpen(false);return}
    setLoading(true)
    try{ const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=7&addressdetails=1&accept-language=fr`); const d=await r.json(); setSugg(d); setOpen(d.length>0) }catch{}
    setLoading(false)
  },[])
  const pick=(item:any)=>{
    const name=item.display_name.split(',').slice(0,2).join(',').trim()
    onChange(name,parseFloat(item.lat),parseFloat(item.lon)); setSugg([]); setOpen(false)
  }
  return (
    <div style={{position:'relative'}}>
      <div style={{position:'relative'}}>
        <input value={value} onChange={e=>{onChange(e.target.value);clearTimeout(tmr.current);tmr.current=setTimeout(()=>search(e.target.value),320)}}
          placeholder={placeholder||'Rechercher une ville...'} style={fm.inp}
          onFocus={()=>sugg.length>0&&setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),200)}/>
        {loading&&<div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',width:10,height:10,border:'1.5px solid var(--ab2)',borderTop:'1.5px solid var(--amber)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>}
      </div>
      {open&&sugg.length>0&&(
        <div style={{position:'absolute',top:'calc(100% + 2px)',left:0,right:0,zIndex:500,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:7,overflow:'hidden',boxShadow:'0 12px 40px rgba(0,0,0,0.8)',maxHeight:220,overflowY:'auto'}}>
          {sugg.map((s,i)=>(
            <button key={i} onMouseDown={()=>pick(s)} style={{display:'block',width:'100%',padding:'8px 12px',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
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
// SHARED FORM FIELDS
// ═══════════════════════════════════════════════════════════════
function Req(){return <span style={{color:'var(--amber)'}}>*</span>}
function Spin(){return <div style={{width:9,height:9,border:'1.5px solid var(--amber)',borderTop:'1.5px solid transparent',borderRadius:'50%',animation:'spin 0.8s linear infinite',display:'inline-block'}}/>}

function CountrySelect({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{position:'relative'}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...fm.inp,paddingRight:28,appearance:'none' as any,cursor:'pointer'}}>
        {Object.entries(COUNTRIES_BY_CONTINENT).map(([continent,countries])=>(
          <optgroup key={continent} label={`── ${continent} ──`}>
            {countries.map(c=><option key={c} value={c}>{c}</option>)}
          </optgroup>
        ))}
      </select>
      <div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--tx3)',fontSize:10}}>▾</div>
    </div>
  )
}

function TimezoneSelect({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  return (
    <div style={{position:'relative'}}>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{...fm.inp,paddingRight:28,appearance:'none' as any,cursor:'pointer'}}>
        {TIMEZONES.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
      </select>
      <div style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--tx3)',fontSize:10}}>▾</div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// BIRTH MODAL — Profil Personnel
// ═══════════════════════════════════════════════════════════════
function BirthModal({ existing, onSubmit, onClose }: { existing?:any; onSubmit:(d:any)=>void; onClose:()=>void }) {
  const [firstName,setFirstName] = useState(existing?.firstName||'')
  const [lastName,setLastName]   = useState(existing?.lastName||'')
  const [date,setDate]           = useState(existing?.date||'')
  const [time,setTime]           = useState(existing?.time!=='inconnue'?existing?.time||'':'')
  const [noTime,setNoTime]       = useState(existing?.time==='inconnue')
  const [city,setCity]           = useState(existing?.place||'')
  const [cityLat,setCityLat]     = useState<number|undefined>(existing?.lat)
  const [cityLon,setCityLon]     = useState<number|undefined>(existing?.lon)
  const [country,setCountry]     = useState(existing?.country||'France')
  const [tz,setTz]               = useState(existing?.timezone||'auto')
  const [gpsLoad,setGpsLoad]     = useState(false)
  const [err,setErr]             = useState('')

  const gps=()=>{
    if(!navigator.geolocation){setErr('Géolocalisation non disponible');return}
    setGpsLoad(true)
    navigator.geolocation.getCurrentPosition(async pos=>{
      const {latitude:lat,longitude:lon}=pos.coords; setCityLat(lat); setCityLon(lon)
      try{ const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`); const d=await r.json(); if(d.address?.city||d.address?.town)setCity(d.address.city||d.address.town||''); if(d.address?.country)setCountry(d.address.country) }catch{}
      setGpsLoad(false)
    },()=>{setErr('Position non disponible');setGpsLoad(false)})
  }

  const submit=()=>{
    if(!firstName.trim()){setErr('Le prénom est requis.');return}
    if(!date){setErr('La date est requise.');return}
    if(!noTime&&!time){setErr("Indique l'heure ou coche « heure inconnue ».");return}
    if(!city.trim()){setErr('La ville est requise.');return}
    onSubmit({firstName,lastName,name:`${firstName} ${lastName}`.trim(),date,time:noTime?'inconnue':time,place:city,country,lat:cityLat,lon:cityLon,timezone:tz})
  }

  return (
    <div style={fm.overlay}>
      <div style={fm.modal}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><div style={fm.tag}>// Profil personnel</div><h2 style={fm.title}>Données de naissance</h2></div>
          <button style={fm.close} onClick={onClose}>✕</button>
        </div>
        <p style={fm.sub}>Ces données restent en mémoire pour personnaliser chaque lecture automatiquement.</p>
        <div style={{height:1,background:'var(--b1)'}}/>
        <div style={{display:'flex',gap:10}}>
          <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Prénom <Req/></label><input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Prénom" style={fm.inp}/></div>
          <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Nom de famille</label><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Optionnel" style={fm.inp}/></div>
        </div>
        <div style={fm.field}><label style={fm.lbl}>Date de naissance <Req/></label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={fm.inp}/></div>
        <div style={fm.field}>
          <label style={fm.lbl}>Heure de naissance</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...fm.inp,opacity:noTime?0.4:1}}/>
          <label style={{display:'flex',alignItems:'center',gap:7,marginTop:5,cursor:'pointer'}}>
            <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:'var(--amber)'}}/>
            <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'}}>Heure inconnue (lecture probabiliste)</span>
          </label>
        </div>
        <div style={fm.field}><label style={fm.lbl}>Fuseau horaire / Heure d'été</label><TimezoneSelect value={tz} onChange={setTz}/></div>
        <div style={fm.field}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
            <label style={fm.lbl}>Ville de naissance <Req/></label>
            <button onClick={gps} disabled={gpsLoad} style={{display:'flex',alignItems:'center',gap:4,fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--amber)',cursor:'pointer',background:'none',border:'none'}}>
              {gpsLoad?<Spin/>:<span>⊕</span>} {gpsLoad?'Localisation...':'Ma position GPS'}
            </button>
          </div>
          <CityInput value={city} onChange={(v,lat,lon)=>{setCity(v);if(lat!==undefined){setCityLat(lat);setCityLon(lon)}}} placeholder="Rechercher la ville de naissance..."/>
          {cityLat&&<div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--tx3)',marginTop:3}}>📍 {cityLat.toFixed(4)}, {cityLon?.toFixed(4)}</div>}
        </div>
        <div style={fm.field}><label style={fm.lbl}>Pays de naissance <Req/></label><CountrySelect value={country} onChange={setCountry}/></div>
        {err&&<p style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#ff6060'}}>{err}</p>}
        <button onClick={submit} style={fm.btn}>Enregistrer & lancer ma lecture <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg></button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// CLIENT MODAL — Profil Client (Praticien)
// ═══════════════════════════════════════════════════════════════
function ClientModal({ onSubmit, onClose }: { onSubmit:(d:ClientData)=>void; onClose:()=>void }) {
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
    if(!firstName.trim()){setErr('Le prénom est requis.');return}
    if(!date){setErr('La date est requise.');return}
    if(!city.trim()){setErr('La ville est requise.');return}
    onSubmit({firstName,lastName,name:`${firstName} ${lastName}`.trim(),email,phone,date,time:noTime?'inconnue':time,place:city,country,lat:cityLat,lon:cityLon,timezone:tz,notes})
  }
  return (
    <div style={fm.overlay}>
      <div style={{...fm.modal,maxWidth:480,borderColor:'rgba(255,140,0,0.3)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div><div style={{...fm.tag,color:'#00d4ff'}}>// Mode Praticien</div><h2 style={fm.title}>Profil Client</h2></div>
          <button style={fm.close} onClick={onClose}>✕</button>
        </div>
        <p style={fm.sub}>Créez le profil d'un client pour générer une lecture personnalisée.</p>
        <div style={{height:1,background:'var(--b1)'}}/>
        <div style={{background:'rgba(0,212,255,0.04)',border:'1px solid rgba(0,212,255,0.12)',borderRadius:6,padding:'8px 12px',marginBottom:2}}>
          <div style={{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.12em',color:'#00d4ff',textTransform:'uppercase',marginBottom:6}}>Identité client</div>
          <div style={{display:'flex',gap:10,marginBottom:8}}>
            <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Prénom <Req/></label><input value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder="Prénom" style={fm.inp}/></div>
            <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Nom</label><input value={lastName} onChange={e=>setLastName(e.target.value)} placeholder="Nom" style={fm.inp}/></div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@email.com" style={fm.inp}/></div>
            <div style={{...fm.field,flex:1}}><label style={fm.lbl}>Téléphone</label><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+33..." style={fm.inp}/></div>
          </div>
        </div>
        <div style={{background:'rgba(255,140,0,0.03)',border:'1px solid var(--ab1)',borderRadius:6,padding:'8px 12px',marginBottom:2}}>
          <div style={{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.12em',color:'var(--amber)',textTransform:'uppercase',marginBottom:6}}>Données de naissance</div>
          <div style={fm.field}><label style={fm.lbl}>Date <Req/></label><input type="date" value={date} onChange={e=>setDate(e.target.value)} style={fm.inp}/></div>
          <div style={fm.field}>
            <label style={fm.lbl}>Heure</label>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} disabled={noTime} style={{...fm.inp,opacity:noTime?0.4:1}}/>
            <label style={{display:'flex',alignItems:'center',gap:7,marginTop:5,cursor:'pointer'}}>
              <input type="checkbox" checked={noTime} onChange={e=>setNoTime(e.target.checked)} style={{accentColor:'var(--amber)'}}/>
              <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)'}}>Heure inconnue</span>
            </label>
          </div>
          <div style={fm.field}><label style={fm.lbl}>Fuseau horaire</label><TimezoneSelect value={tz} onChange={setTz}/></div>
          <div style={fm.field}><label style={fm.lbl}>Ville de naissance <Req/></label><CityInput value={city} onChange={(v,lat,lon)=>{setCity(v);if(lat!==undefined){setCityLat(lat);setCityLon(lon)}}} placeholder="Ville de naissance du client..."/></div>
          <div style={fm.field}><label style={fm.lbl}>Pays <Req/></label><CountrySelect value={country} onChange={setCountry}/></div>
        </div>
        <div style={fm.field}><label style={fm.lbl}>Notes praticien</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Observations, contexte, demandes spécifiques..." rows={3} style={{...fm.inp,resize:'none'}}/></div>
        {err&&<p style={{fontFamily:'var(--f-mono)',fontSize:10,color:'#ff6060'}}>{err}</p>}
        <button onClick={submit} style={{...fm.btn,background:'rgba(0,212,255,0.15)',border:'1px solid rgba(0,212,255,0.4)',color:'#00d4ff',boxShadow:'0 5px 20px rgba(0,212,255,0.1)'}}>
          Générer la lecture client
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SEARCH MODAL
// ═══════════════════════════════════════════════════════════════
function SearchModal({ readings, onClose, onSelect }: { readings:Reading[]; onClose:()=>void; onSelect:(r:Reading)=>void }) {
  const [q,setQ] = useState('')
  const iRef = useRef<HTMLInputElement>(null)
  useEffect(()=>{ setTimeout(()=>iRef.current?.focus(),50) },[])
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now()-86400000).toDateString()
  const filtered = q ? readings.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())||r.science.toLowerCase().includes(q.toLowerCase())) : readings
  const grpToday = filtered.filter(r=>new Date(r.date).toDateString()===today)
  const grpYest  = filtered.filter(r=>new Date(r.date).toDateString()===yesterday)
  const grpOlder = filtered.filter(r=>new Date(r.date).toDateString()!==today&&new Date(r.date).toDateString()!==yesterday)
  const groups = q ? [{ label:'Résultats', items:filtered }] : [{ label:"Aujourd'hui", items:grpToday }, { label:'Hier', items:grpYest }, { label:'Plus ancien', items:grpOlder }]
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'60px 20px 20px'}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:560,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:12,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.8)',animation:'fadeUp 0.25s var(--expo) both'}}>
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderBottom:'1px solid var(--b1)'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input ref={iRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher des lectures..." style={{flex:1,background:'transparent',border:'none',color:'var(--tx1)',fontSize:14,fontFamily:'var(--f-ui)',outline:'none'}}/>
          <button onClick={onClose} style={{fontFamily:'var(--f-mono)',fontSize:12,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}}>✕</button>
        </div>
        <div style={{maxHeight:420,overflowY:'auto'}}>
          {groups.map(g=>g.items.length>0&&(
            <div key={g.label}>
              <div style={{padding:'10px 16px 4px',fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.12em',color:'var(--tx3)',textTransform:'uppercase'}}>{g.label}</div>
              {g.items.map(r=>(
                <button key={r.id} onClick={()=>{onSelect(r);onClose()}} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 16px',textAlign:'left',borderBottom:'1px solid rgba(255,255,255,0.03)',cursor:'pointer',background:'transparent',border:'none',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <div style={{width:28,height:28,borderRadius:5,background:'rgba(255,140,0,0.08)',border:'1px solid var(--ab1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:10,color:'var(--amber)'}}>◈</span></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:'var(--f-ui)',fontSize:13,color:'var(--tx1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                    <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',marginTop:1}}>{r.science} · {new Date(r.date).toLocaleDateString('fr-FR')}</div>
                  </div>
                </button>
              ))}
            </div>
          ))}
          {filtered.length===0&&<div style={{padding:32,textAlign:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucune lecture trouvée</div>}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SHARE MODAL
// ═══════════════════════════════════════════════════════════════
function ShareModal({ messages, onClose }: { messages:Msg[]; onClose:()=>void }) {
  const [selected,setSelected] = useState<Set<string>>(new Set())
  const [copied,setCopied] = useState(false)
  const aiMsgs = messages.filter(m=>m.role==='assistant'&&m.content.length>30)
  const toggle=(id:string)=>setSelected(prev=>{ const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n })
  const share=async()=>{
    const text = aiMsgs.filter(m=>selected.has(m.id)).map(m=>`✦ HexAstra Coach\n${m.content}`).join('\n\n---\n\n')
    const full = `${text}\n\n— hexastra.fr`
    if(navigator.share){ try{ await navigator.share({title:'Lecture HexAstra Coach',text:full,url:'https://hexastra.fr'}); onClose() }catch{} }
    else{ await navigator.clipboard.writeText(full); setCopied(true); setTimeout(()=>setCopied(false),2500) }
  }
  return (
    <div style={{position:'fixed',inset:0,zIndex:400,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.82)',backdropFilter:'blur(10px)'}} onClick={onClose}/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:480,background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:12,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.8)',animation:'fadeUp 0.25s var(--expo) both'}}>
        <div style={{padding:'16px 18px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div><div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:3}}>// Partager une lecture</div>
          <div style={{fontFamily:'var(--f-display)',fontSize:16,color:'var(--chrome)',textTransform:'uppercase',letterSpacing:'0.06em'}}>Sélectionner</div></div>
          <button onClick={onClose} style={{color:'var(--tx3)',fontSize:13,cursor:'pointer',background:'none',border:'none'}}>✕</button>
        </div>
        <div style={{padding:'8px 18px',borderBottom:'1px solid var(--b1)',display:'flex',gap:10'}}>
          <button onClick={()=>setSelected(new Set(aiMsgs.map(m=>m.id)))} style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',cursor:'pointer',background:'none',border:'none',letterSpacing:'0.08em',textTransform:'uppercase'}}>Tout sélect.</button>
          <button onClick={()=>setSelected(new Set())} style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none',letterSpacing:'0.08em',textTransform:'uppercase'}}>Effacer</button>
        </div>
        <div style={{maxHeight:300,overflowY:'auto'}}>
          {aiMsgs.map(m=>(
            <label key={m.id} style={{display:'flex',alignItems:'flex-start',gap:10,padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.03)',cursor:'pointer'}}>
              <input type="checkbox" checked={selected.has(m.id)} onChange={()=>toggle(m.id)} style={{accentColor:'var(--amber)',marginTop:3,flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:'var(--f-ui)',fontSize:12.5,color:'var(--tx2)',lineHeight:1.5,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical' as any}}>{m.content}</div>
              </div>
            </label>
          ))}
          {aiMsgs.length===0&&<div style={{padding:24,textAlign:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucune lecture à partager</div>}
        </div>
        <div style={{padding:'14px 18px'}}>
          <button onClick={share} disabled={selected.size===0} style={{width:'100%',padding:'11px',background:selected.size>0?'var(--amber)':'rgba(255,255,255,0.05)',color:selected.size>0?'var(--void)':'var(--tx3)',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:5,cursor:selected.size>0?'pointer':'default',border:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
            {copied?'✓ Copié — hexastra.fr':`Partager ${selected.size>0?`${selected.size} lecture${selected.size>1?'s':''}`:'(sélectionne)'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROFILE USER MENU
// ═══════════════════════════════════════════════════════════════
function ProfileMenu({ userEmail, mode, onLogout, onClose }: { userEmail:string; mode:Mode; onLogout:()=>void; onClose:()=>void }) {
  const initial = userEmail[0]?.toUpperCase()||'U'
  return (
    <div style={{position:'absolute',bottom:'calc(100% + 8px)',left:0,right:0,zIndex:300,background:'var(--lift)',border:'1px solid var(--b2)',borderRadius:10,overflow:'hidden',boxShadow:'0 -12px 40px rgba(0,0,0,0.7)',animation:'fadeUp 0.2s var(--expo) both'}}>
      <div style={{padding:'12px 14px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,140,0,0.15)',border:'1px solid var(--ab2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:11,color:'var(--amber)',flexShrink:0}}>{initial}</div>
        <div style={{minWidth:0}}>
          <div style={{fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx1)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail}</div>
          <div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)',textTransform:'capitalize'}}>{mode}</div>
        </div>
      </div>
      {[
        { icon:'↑', label:'Passer au forfait supérieur', action:()=>{} },
        { icon:'◈', label:'Personnalisation', action:()=>{} },
        { icon:'⚙', label:'Paramètres', action:()=>{} },
        { icon:'?', label:'Aide', action:()=>{} },
        { icon:'→', label:'Se déconnecter', action:onLogout },
      ].map((item,i)=>(
        <button key={i} onClick={()=>{item.action();onClose()}} style={{display:'flex',alignItems:'center',gap:10,width:'100%',padding:'9px 14px',textAlign:'left',borderBottom:i<4?'1px solid rgba(255,255,255,0.04)':'none',fontFamily:'var(--f-ui)',fontSize:13,color:item.label==='Se déconnecter'?'var(--tx3)':'var(--tx2)',cursor:'pointer',background:'transparent',border:'none',borderBottom:i<4?'1px solid rgba(255,255,255,0.04)':'none',transition:'background 0.15s'}}>
          <span style={{width:18,textAlign:'center',fontSize:12,color:'var(--amber)',flexShrink:0}}>{item.icon}</span>
          {item.label}
          {item.label==='Aide'&&<span style={{marginLeft:'auto',fontSize:10,color:'var(--tx3)'}}>›</span>}
        </button>
      ))}
      <div style={{padding:'10px 14px',borderTop:'1px solid var(--b1)',display:'flex',alignItems:'center',gap:8}}>
        <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(255,140,0,0.12)',border:'1px solid var(--ab1)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--amber)'}}>{initial}</div>
        <div><div style={{fontFamily:'var(--f-ui)',fontSize:11,color:'var(--tx2)'}}>{userEmail.split('@')[0]}</div><div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--tx3)',textTransform:'capitalize'}}>{mode}</div></div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LEFT SIDEBAR
// ═══════════════════════════════════════════════════════════════
function LeftSidebar({ view, setView, userEmail, mode, currentStep, stepLabels, projects, readings, onNewProject, onRenameProject, onDeleteProject, onOpenReading, onAddToProject, onSearch, onLogout, dragId }: any) {
  const [showProfileMenu,setShowProfileMenu] = useState(false)
  const [editingPId,setEditingPId] = useState<string|null>(null)
  const [editName,setEditName] = useState('')
  const [newProjInput,setNewProjInput] = useState(false)
  const [newProjName,setNewProjName] = useState('')
  const [dropTarget,setDropTarget] = useState<string|null>(null)
  const MAX_VISIBLE = 5
  const recentProjects = [...projects].reverse().slice(0,MAX_VISIBLE)

  const createProject=()=>{
    if(newProjName.trim()){ onNewProject(newProjName.trim()); setNewProjInput(false); setNewProjName('') }
  }

  const handleDrop=(e:React.DragEvent,pId:string)=>{ e.preventDefault(); if(dragId)onAddToProject(dragId,pId); setDropTarget(null) }

  return (
    <aside style={{width:210,minWidth:210,height:'100vh',background:'var(--pitch)',borderRight:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden',position:'relative'}}>
      {/* Logo HexAstra */}
      <div style={{padding:'12px 14px',borderBottom:'1px solid var(--b1)',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <img src="/logo/hexastra-logo-transparent.png" alt="HexAstra" style={{height:26,objectFit:'contain'}}
          onError={e=>{(e.currentTarget as HTMLImageElement).style.display='none'}}/>
        <div style={{width:18,height:18,background:'var(--amber)',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',boxShadow:'0 0 10px rgba(255,140,0,0.4)',flexShrink:0,animation:'amberPop 4s ease-in-out infinite'}}/>
        <span style={{fontFamily:'var(--f-display)',fontSize:14,letterSpacing:'0.1em',color:'var(--chrome)',textTransform:'uppercase'}}>Hex<span style={{color:'var(--amber)'}}>Astra</span></span>
      </div>

      {/* Nouvelle lecture button */}
      <button onClick={()=>setView('chat')} style={{margin:'8px 10px 4px',padding:'7px 12px',display:'flex',alignItems:'center',gap:6,background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',color:'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.1em',borderRadius:5,textTransform:'uppercase',cursor:'pointer',flexShrink:0}}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Nouvelle lecture
      </button>

      <div style={{height:1,background:'var(--b1)',margin:'4px 0 2px',flexShrink:0}}/>

      {/* NAV */}
      <div style={{padding:'3px 14px 2px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase',flexShrink:0}}>Navigation</div>
      <nav style={{display:'flex',flexDirection:'column',gap:1,padding:'0 8px',flexShrink:0}}>
        {[
          {v:'chat', sym:'◈', label:'Coach IA'},
          {v:'search_action', sym:'⊕', label:'Recherche'},
          {v:'projets', sym:'✦', label:'Vos projets'},
          {v:'profile', sym:'⬡', label:'Données personnelles'},
          {v:'abonnements', sym:'★', label:'Abonnements'},
        ].map(item=>(
          <button key={item.v} onClick={()=>item.v==='search_action'?onSearch():setView(item.v as View)}
            style={{display:'flex',alignItems:'center',gap:8,padding:'7px 9px',borderRadius:5,fontFamily:'var(--f-ui)',fontSize:11.5,color:view===item.v?'var(--amber)':'var(--tx3)',background:view===item.v?'rgba(255,140,0,0.06)':'transparent',borderLeft:view===item.v?'2px solid var(--amber)':'2px solid transparent',borderRight:'none',borderTop:'none',borderBottom:'none',transition:'all 0.18s',textAlign:'left' as const,cursor:'pointer',width:'100%'}}>
            <span style={{fontSize:11,flexShrink:0,opacity:0.7}}>{item.sym}</span>{item.label}
          </button>
        ))}
      </nav>

      <div style={{height:1,background:'var(--b1)',margin:'6px 0 2px',flexShrink:0}}/>

      {/* PROJETS */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'3px 14px 2px',flexShrink:0}}>
        <div style={{fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase'}}>Projets</div>
        <button onClick={()=>setNewProjInput(true)} style={{fontFamily:'var(--f-mono)',fontSize:13,color:'var(--amber)',cursor:'pointer',opacity:0.8,background:'transparent',border:'none',lineHeight:1}}>＋</button>
      </div>

      {newProjInput&&(
        <div style={{padding:'0 10px 6px',display:'flex',gap:5,flexShrink:0}}>
          <input autoFocus value={newProjName} onChange={e=>setNewProjName(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')createProject();if(e.key==='Escape'){setNewProjInput(false);setNewProjName('')}}}
            placeholder="Nom du projet..." style={{flex:1,background:'rgba(255,255,255,0.06)',border:'1px solid var(--ab1)',borderRadius:4,padding:'5px 8px',color:'var(--tx1)',fontSize:11,fontFamily:'var(--f-ui)',outline:'none'}}/>
          <button onClick={createProject} style={{background:'var(--amber)',color:'var(--void)',borderRadius:4,padding:'5px 8px',fontFamily:'var(--f-mono)',fontSize:9,cursor:'pointer',border:'none'}}>OK</button>
        </div>
      )}

      <div style={{overflowY:'auto',maxHeight:160,padding:'0 8px 4px',flexShrink:0}}>
        {recentProjects.map(p=>{
          const pR = readings.filter((r:Reading)=>r.projectId===p.id)
          const isDrop = dropTarget===p.id
          return (
            <div key={p.id} onDragOver={e=>{e.preventDefault();setDropTarget(p.id)}} onDragLeave={()=>setDropTarget(null)} onDrop={e=>handleDrop(e,p.id)}
              style={{marginBottom:1,borderRadius:5,border:`1px solid ${isDrop?'var(--amber)':'transparent'}`,background:isDrop?'rgba(255,140,0,0.05)':'transparent',transition:'all 0.2s'}}>
              <div style={{display:'flex',alignItems:'center',gap:5,padding:'5px 6px'}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--tx3)" strokeWidth="2" style={{flexShrink:0}}><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                {editingPId===p.id?(
                  <input autoFocus value={editName} onChange={e=>setEditName(e.target.value)}
                    onBlur={()=>{onRenameProject(p.id,editName);setEditingPId(null)}}
                    onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditingPId(null)}}}
                    style={{flex:1,background:'transparent',border:'none',borderBottom:'1px solid var(--amber)',color:'var(--amber)',fontSize:11,fontFamily:'var(--f-ui)',outline:'none'}}/>
                ):(
                  <span style={{flex:1,fontFamily:'var(--f-ui)',fontSize:11,color:'var(--tx2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',cursor:'pointer'}} onDoubleClick={()=>{setEditingPId(p.id);setEditName(p.name)}}>{p.name}</span>
                )}
                <span style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--tx3)',flexShrink:0}}>{pR.length}</span>
              </div>
              {isDrop&&<div style={{padding:'4px 22px',fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)'}}>Déposer ici ↓</div>}
            </div>
          )
        })}
        {projects.length===0&&!newProjInput&&<div style={{padding:'6px 6px',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',textAlign:'center' as const}}>Crée un projet</div>}
      </div>

      <div style={{flex:1}}/>

      <div style={{height:1,background:'var(--b1)',flexShrink:0}}/>

      {/* PROGRESSION */}
      <div style={{padding:'3px 14px 2px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--tx3)',textTransform:'uppercase',flexShrink:0}}>// Progression</div>
      <div style={{padding:'2px 10px 8px',flexShrink:0}}>
        {stepLabels.map(({step:n,label,desc}:any,i:number)=>{
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
              <div style={{paddingBottom:8,flex:1}}>
                <div style={{fontFamily:'var(--f-mono)',fontSize:9,letterSpacing:'0.04em',color:done||active?'var(--tx1)':'var(--tx3)',transition:'color 0.3s'}}>{label}</div>
                {active&&<div style={{fontFamily:'var(--f-ui)',fontSize:8.5,color:'var(--tx3)',lineHeight:1.5,marginTop:1}}>{desc}</div>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{height:1,background:'var(--b1)',flexShrink:0}}/>

      {/* Profile button */}
      <div style={{padding:'8px 10px',position:'relative',flexShrink:0}}>
        <button onClick={()=>setShowProfileMenu(o=>!o)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'6px 8px',borderRadius:7,background:'rgba(255,255,255,0.03)',border:'1px solid var(--b1)',cursor:'pointer',transition:'all 0.2s'}}>
          <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(255,140,0,0.15)',border:'1px solid var(--ab2)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--f-mono)',fontSize:10,color:'var(--amber)',flexShrink:0}}>{userEmail[0]?.toUpperCase()||'U'}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:'var(--f-ui)',fontSize:11,color:'var(--tx2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{userEmail.split('@')[0]}</div>
            <div style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',textTransform:'capitalize'}}>{mode}</div>
          </div>
          <span style={{fontSize:9,color:'var(--tx3)'}}>{showProfileMenu?'▾':'▴'}</span>
        </button>
        {showProfileMenu&&<ProfileMenu userEmail={userEmail} mode={mode} onLogout={onLogout} onClose={()=>setShowProfileMenu(false)}/>}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════
// RIGHT SIDEBAR
// ═══════════════════════════════════════════════════════════════
function RightSidebar({ mode, readings, projects, onSend, onOpenReading, onAddToProject, dragId, setDragId }: any) {
  const [lectOpen,setLectOpen] = useState(true)
  const menu = mode==='praticien' ? MENU_PRATICIEN : mode==='premium' ? MENU_PREMIUM : MENU_ESSENTIEL
  const freeR = readings.filter((r:Reading)=>!r.projectId)
  return (
    <aside style={{width:178,minWidth:178,height:'100vh',background:'var(--pitch)',borderLeft:'1px solid var(--b1)',display:'flex',flexDirection:'column',zIndex:10,overflow:'hidden'}}>
      <div style={{padding:'11px 11px 7px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',borderBottom:'1px solid var(--b1)',flexShrink:0}}>
        {mode==='essentiel'?'// Mode Essentiel':mode==='premium'?'// Mode Premium':'// Mode Praticien'}
      </div>
      {/* Vos lectures */}
      <div style={{flexShrink:0}}>
        <button style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'6px 10px 3px',width:'100%',textAlign:'left',cursor:'pointer',background:'transparent',border:'none'}} onClick={()=>setLectOpen(o=>!o)}>
          <span style={{fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.14em',color:'var(--tx3)',textTransform:'uppercase'}}>Vos lectures</span>
          <span style={{fontSize:8,color:'var(--tx3)',transition:'transform 0.2s',display:'inline-block',transform:lectOpen?'rotate(0)':'rotate(-90deg)'}}>▾</span>
        </button>
        {lectOpen&&(
          <div style={{maxHeight:140,overflowY:'auto',padding:'0 6px 4px'}}>
            {freeR.length===0?<div style={{padding:'6px 4px',fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx3)',textAlign:'center' as const}}>Aucune lecture</div>
            :freeR.map((r:Reading)=>(
              <div key={r.id} draggable onDragStart={()=>setDragId(r.id)} onDragEnd={()=>setDragId(null)}
                style={{display:'flex',alignItems:'center',gap:6,padding:'5px 7px',borderRadius:4,marginBottom:1,cursor:'grab',background:dragId===r.id?'rgba(255,140,0,0.06)':'transparent'}}
                onClick={()=>onOpenReading(r)}>
                <span style={{fontSize:8.5,color:'var(--amber)',flexShrink:0}}>◈</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx2)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.title}</div>
                  <div style={{fontFamily:'var(--f-ui)',fontSize:7.5,color:'var(--tx3)',marginTop:0.5}}>{r.science}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{height:1,background:'var(--b1)',flexShrink:0}}/>
      {/* Nos catégories */}
      <div style={{flex:1,overflowY:'auto',padding:'4px 6px'}}>
        <div style={{padding:'5px 4px 3px',fontFamily:'var(--f-mono)',fontSize:7.5,letterSpacing:'0.14em',color:'var(--tx3)',textTransform:'uppercase'}}>Nos catégories</div>
        {menu.map((item:any)=>(
          <button key={item.id} onClick={()=>onSend(`${item.label} — ${item.sub}`)}
            style={{display:'flex',alignItems:'center',gap:7,width:'100%',padding:'5px 7px',borderRadius:4,textAlign:'left' as const,marginBottom:1,cursor:'pointer',background:'transparent',border:'none',transition:'background 0.15s'}}>
            <span style={{fontSize:10,flexShrink:0,color:'var(--amber)',opacity:0.7}}>{item.sym}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontFamily:'var(--f-mono)',fontSize:8.5,color:'var(--tx2)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.label}</div>
              <div style={{fontFamily:'var(--f-ui)',fontSize:7.5,color:'var(--tx3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',marginTop:0.5}}>{item.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

// ═══════════════════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════════════════
function Tooltip({ children, label }: { children:React.ReactNode; label:string }) {
  const [show,setShow] = useState(false)
  return (
    <div style={{position:'relative',display:'inline-flex'}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
      {children}
      {show&&<div style={{position:'absolute',bottom:'calc(100% + 6px)',left:'50%',transform:'translateX(-50%)',background:'var(--lift)',border:'1px solid var(--b2)',borderRadius:5,padding:'4px 9px',fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx1)',whiteSpace:'nowrap',pointerEvents:'none',zIndex:100,boxShadow:'0 4px 16px rgba(0,0,0,0.5)',letterSpacing:'0.04em'}}>{label}</div>}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// WAVEFORM ICON
// ═══════════════════════════════════════════════════════════════
function WaveformIcon({ active }: { active:boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      {[{x:1,h:4},{x:4,h:8},{x:7,h:14},{x:10,h:10},{x:13,h:6},{x:16,h:3}].map((b,i)=>(
        <rect key={i} x={b.x} y={(14-b.h)/2} width="1.5" height={b.h} rx="0.75"
          fill={active?'var(--amber)':'var(--tx3)'}
          style={{animation:active?`waveBar 0.8s ease-in-out ${i*0.1}s infinite alternate`:'none'}}/>
      ))}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════
// MAIN CHAT PAGE
// ═══════════════════════════════════════════════════════════════
export default function ChatPage() {
  const [messages,  setMessages]  = useState<Msg[]>([{ id:'0', role:'assistant', created_at:new Date().toISOString(), content:'Bienvenue.\nJe suis HexAstra Coach.\n\nChoisis ta langue / Choose your language :\nFrançais / English' }])
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

  const stepLabels = [
    { step:1 as Step, label:mode==='essentiel'?'Mode Essentiel actif':mode==='premium'?'Mode Premium actif':'Mode Praticien actif', desc:'Langue + mode configuré' },
    { step:2 as Step, label:profile?`${profile.firstName||'Profil'} · ${profile.place||''}`: 'Données naissance', desc:'Date · Heure · Lieu · Pays' },
    { step:3 as Step, label:'Microlectures', desc:'Profil · Année · Mois générés' },
    { step:4 as Step, label:'Exploration active', desc:`${messages.length-1} msg · ${readings.length} lecture${readings.length>1?'s':''}` },
  ]

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{ if(data.user)setUserEmail(data.user.email||'') })
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

  const newProject=useCallback((name:string)=>{
    const p:Project={id:Date.now().toString(),name,readingIds:[],collapsed:false}
    const np=[...projects,p]; setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np))
  },[projects])
  const renameProject=useCallback((id:string,name:string)=>{ const np=projects.map(p=>p.id===id?{...p,name}:p); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np)) },[projects])
  const deleteProject=useCallback((id:string)=>{ const np=projects.filter(p=>p.id!==id); setProjects(np); localStorage.setItem('hx_projects',JSON.stringify(np)) },[projects])
  const addToProject=useCallback((rId:string,pId:string)=>{ const nr=readings.map(r=>r.id===rId?{...r,projectId:pId}:r); setReadings(nr); localStorage.setItem('hx_readings',JSON.stringify(nr)) },[readings])
  const openReading=useCallback((r:Reading)=>{ setMessages([{id:'0',role:'assistant',created_at:r.date,content:`📖 ${r.title}\n\n${r.preview}...`}]); setView('chat') },[])

  // File attach
  const handleFile=useCallback((files:FileList|null)=>{
    if(!files||!files[0])return
    const file=files[0]
    const reader=new FileReader()
    reader.onload=()=>{ send(`[Fichier joint : ${file.name}]\n${file.type.startsWith('text')?reader.result as string:'[Contenu binaire]'}`) }
    if(file.type.startsWith('text')||file.type==='application/json') reader.readAsText(file)
    else send(`[Fichier joint : ${file.name} — ${(file.size/1024).toFixed(1)} Ko]`)
  },[])

  // Audio
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

  // Send
  const send=useCallback(async(text?:string,birthData?:any)=>{
    const content=text||input.trim(); if(!content&&!birthData)return
    const userMsg:Msg={id:Date.now().toString(),role:'user',created_at:new Date().toISOString(),
      content:birthData?`Données de naissance : ${birthData.firstName} ${birthData.lastName||''} · ${birthData.date} · ${birthData.time||'inconnue'} · ${birthData.place}, ${birthData.country}`:content}
    const newMsgs=[...messages,userMsg]; setMessages(newMsgs); setInput(''); setIsTyping(true)
    const cnt=msgCount+1; setMsgCount(cnt); bump(newMsgs.length)
    if(!birthData&&replyCache.current.has(content)){
      setTimeout(()=>{setIsTyping(false);setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:replyCache.current.get(content)!,created_at:new Date().toISOString(),cached:true}])},300); return
    }
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:newMsgs.map(m=>({role:m.role,content:m.content})),mode,birthData:birthData||null,conversationId:convId})})
      const data=await res.json(); if(data.conversationId)setConvId(data.conversationId)
      const reply=data.reply||'Une erreur est survenue.'
      if(!birthData&&content.length<200)replyCache.current.set(content,reply)
      setIsTyping(false)
      const aiMsg:Msg={id:Date.now().toString(),role:'assistant',content:reply,created_at:new Date().toISOString()}
      const finalMsgs=[...newMsgs,aiMsg]; setMessages(finalMsgs); bump(finalMsgs.length); saveReading(finalMsgs)
      if(birthData){setProfile(birthData);localStorage.setItem('hx_profile',JSON.stringify(birthData));setStep(s=>s<2?2:s)}
      if(data.needsBirthData)setTimeout(()=>setShowBirth(true),600)
    }catch{
      setIsTyping(false)
      setMessages(p=>[...p,{id:Date.now().toString(),role:'assistant',content:'Erreur de connexion. Réessaie.',created_at:new Date().toISOString()}])
    }
  },[input,messages,mode,convId,msgCount,bump,saveReading])

  const switchMode=(m:Mode)=>{
    if((m==='premium'||m==='praticien')&&mode==='essentiel'){setView('abonnements');return}
    setMode(m)
  }

  if(view==='profile') return <ProfileViewPage profile={profile} onEdit={()=>{setView('chat');setTimeout(()=>setShowBirth(true),100)}} onBack={()=>setView('chat')}/>
  if(view==='abonnements') return <AbonnementsPage onBack={()=>setView('chat')} userEmail={userEmail} onSuccess={(m:Mode)=>{setMode(m);setView('chat')}}/>
  if(view==='projets') return <ProjetsPage projects={projects} readings={readings} onBack={()=>setView('chat')} onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject} onOpenReading={openReading}/>

  const modeLabel = mode==='essentiel'?'Essentiel':mode==='premium'?'Premium':'Praticien'

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'var(--deep)',position:'relative'}}>
      <Stars/>
      <LeftSidebar view={view} setView={setView} userEmail={userEmail} mode={mode} currentStep={step} stepLabels={stepLabels}
        projects={projects} readings={readings} onNewProject={newProject} onRenameProject={renameProject} onDeleteProject={deleteProject}
        onOpenReading={openReading} onAddToProject={addToProject} onSearch={()=>setShowSearch(true)}
        onLogout={async()=>{await supabase.auth.signOut();router.push('/login')}} dragId={dragId}/>

      <main style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',zIndex:10,minWidth:0}}>
        {/* Top bar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 14px',borderBottom:'1px solid var(--b1)',background:'rgba(10,10,16,0.75)',backdropFilter:'blur(20px)',flexShrink:0}}>
          {/* Mode pill — Premium / Praticien */}
          <div style={{display:'flex',background:'rgba(255,255,255,0.03)',border:'1px solid var(--b2)',borderRadius:7,overflow:'hidden'}}>
            {(['essentiel','premium','praticien'] as Mode[]).map(m=>(
              <button key={m} onClick={()=>switchMode(m)} style={{padding:'5px 12px',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.1em',color:mode===m?'var(--amber)':'var(--tx3)',background:mode===m?'rgba(255,140,0,0.1)':'transparent',transition:'all 0.2s',cursor:'pointer',border:'none',display:'flex',alignItems:'center',gap:4,textTransform:'capitalize'}}>
                {m}{(m==='premium'||m==='praticien')&&mode==='essentiel'&&<span style={{fontSize:8}}>🔒</span>}
              </button>
            ))}
          </div>
          {/* Share */}
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
                <span style={{display:'block',fontFamily:'var(--f-mono)',fontSize:7.5,color:'var(--tx3)',marginTop:4,textAlign:'right' as const}}>{new Date(msg.created_at).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            </div>
          ))}
          {isTyping&&(
            <div style={{display:'flex',alignItems:'flex-end',gap:9}}>
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
        <div style={{padding:'6px 14px 10px',borderTop:'1px solid var(--b1)',background:'rgba(5,5,8,0.65)',backdropFilter:'blur(14px)',flexShrink:0}}>
          {/* Title */}
          <div style={{textAlign:'center',fontFamily:'var(--f-display)',fontSize:11,letterSpacing:'0.18em',color:'var(--amber)',textTransform:'uppercase',marginBottom:5,opacity:0.9}}>HexAstra t'aide à y voir plus clair</div>

          {/* Input box */}
          <div style={{display:'flex',alignItems:'flex-end',gap:6,background:'rgba(255,255,255,0.025)',border:'1px solid var(--b2)',borderRadius:9,padding:'7px 9px'}}>
            {/* Données naissance */}
            <Tooltip label="Données de naissance">
              <button style={{width:28,height:28,flexShrink:0,borderRadius:5,background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={()=>mode==='praticien'?setShowClient(true):setShowBirth(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              </button>
            </Tooltip>

            {/* File attach — épingle */}
            <Tooltip label="Ajouter des fichiers">
              <button style={{width:28,height:28,flexShrink:0,borderRadius:5,background:'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}} onClick={()=>fileRef.current?.click()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              </button>
            </Tooltip>
            <input ref={fileRef} type="file" accept="image/*,.pdf,.txt,.doc,.docx" style={{display:'none'}} onChange={e=>handleFile(e.target.files)}/>

            {/* Textarea */}
            <textarea ref={taRef} value={input} onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Parle-moi de ta situation ou pose ta question…" rows={1}
              style={{flex:1,background:'transparent',border:'none',color:'var(--tx1)',fontSize:13,lineHeight:'1.55',minHeight:20,maxHeight:96,overflowY:'auto',padding:'4px 0',resize:'none',fontFamily:'var(--f-ui)',outline:'none'}}/>

            {/* Waveform mic */}
            <Tooltip label="Message vocal">
              <button style={{width:28,height:28,flexShrink:0,borderRadius:5,background:isRec?'rgba(255,140,0,0.18)':'rgba(255,140,0,0.06)',border:'1px solid var(--ab1)',color:'var(--amber)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',animation:isRec?'recPulse 1s ease-in-out infinite':'none'}} onClick={toggleRec}>
                <WaveformIcon active={isRec}/>
              </button>
            </Tooltip>
          </div>

          {/* Footer */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:5,padding:'0 2px',gap:8}}>
            <div style={{fontFamily:'var(--f-mono)',fontSize:7,color:'rgba(255,140,0,0.5)',letterSpacing:'0.1em',textTransform:'uppercase',flexShrink:0,border:'1px solid rgba(255,140,0,0.15)',padding:'2px 7px',borderRadius:3}}>{modeLabel}</div>
            <span style={{fontFamily:'var(--f-ui)',fontSize:7.5,color:'var(--tx3)',textAlign:'center',flex:1,lineHeight:1.5}}>HexAstra Coach est un outil d'exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.</span>
            <button style={{fontFamily:'var(--f-mono)',fontSize:8,color:'var(--amber)',letterSpacing:'0.1em',flexShrink:0,cursor:'pointer',background:'transparent',border:'none'}} onClick={()=>setView('abonnements')}>✦ Premium</button>
          </div>
        </div>
      </main>

      <RightSidebar mode={mode} readings={readings} projects={projects} onSend={t=>send(t)}
        onOpenReading={openReading} onAddToProject={addToProject} dragId={dragId} setDragId={setDragId}/>

      {showBirth&&<BirthModal existing={profile} onClose={()=>setShowBirth(false)} onSubmit={d=>{setShowBirth(false);send(undefined,d)}}/>}
      {showClient&&<ClientModal onClose={()=>setShowClient(false)} onSubmit={d=>{setShowClient(false);send(undefined,d)}}/>}
      {showSearch&&<SearchModal readings={readings} onClose={()=>setShowSearch(false)} onSelect={r=>{openReading(r);setShowSearch(false)}}/>}
      {showShare&&<ShareModal messages={messages} onClose={()=>setShowShare(false)}/>}

      <style>{`
        @keyframes recPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,140,0,0.4)}50%{box-shadow:0 0 0 6px rgba(255,140,0,0)}}
        @keyframes waveBar{0%{transform:scaleY(0.4)}100%{transform:scaleY(1)}}
        *{box-sizing:border-box;margin:0;padding:0}
        button{cursor:pointer;background:none;color:inherit}
        input,textarea,select{font-family:inherit;outline:none}
        textarea{resize:none}
        ::-webkit-scrollbar{width:2px}
        ::-webkit-scrollbar-thumb{background:var(--ab1)}
        select option{background:var(--panel);color:var(--tx1)}
        optgroup{color:var(--amber);font-style:normal}
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// SIMPLE FULL-PAGE VIEWS
// ═══════════════════════════════════════════════════════════════
function ProfileViewPage({ profile, onEdit, onBack }: any) {
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}><Stars/>
      <div style={{width:'100%',maxWidth:700,padding:'0 24px 48px',flex:1,display:'flex',flexDirection:'column',position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:24}}>
          <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={onBack}>← Retour</button>
          <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--chrome)'}}>Données personnelles</div>
          <button style={{fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'5px 12px',borderRadius:4,letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}} onClick={onEdit}>Modifier</button>
        </div>
        {!profile?(<div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14}}><div style={{fontSize:48,color:'var(--amber)',opacity:0.25}}>⬡</div><p style={{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)'}}>Aucun profil enregistré.</p><button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--amber)',background:'rgba(255,140,0,0.07)',border:'1px solid var(--ab1)',padding:'9px 18px',borderRadius:5,cursor:'pointer',letterSpacing:'0.1em',textTransform:'uppercase'}} onClick={onEdit}>Saisir mes données</button></div>
        ):[['Prénom',profile.firstName],['Nom',profile.lastName],['Date',profile.date],['Heure',profile.time],['Ville',profile.place],['Pays',profile.country],['Fuseau',profile.timezone]].map(([l,v])=>v&&(
          <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'9px 13px',background:'rgba(255,255,255,0.02)',borderRadius:5,border:'1px solid var(--b1)',marginBottom:7}}>
            <span style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{l}</span>
            <span style={{fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx1)'}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjetsPage({ projects, readings, onBack, onNewProject, onRenameProject, onDeleteProject, onOpenReading }: any) {
  const [editing,setEditing] = useState<string|null>(null)
  const [editName,setEditName] = useState('')
  const [newName,setNewName] = useState('')
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}><Stars/>
      <div style={{width:'100%',maxWidth:640,padding:'0 24px 48px',flex:1,position:'relative',zIndex:1}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 0',borderBottom:'1px solid var(--b1)',marginBottom:20}}>
          <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={onBack}>← Retour</button>
          <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--chrome)'}}>Vos projets</div>
          <div/>
        </div>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&newName.trim()){onNewProject(newName.trim());setNewName('')}}} placeholder="Nom du nouveau projet..." style={{flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid var(--b2)',borderRadius:6,padding:'9px 12px',color:'var(--tx1)',fontSize:13,fontFamily:'var(--f-ui)',outline:'none'}}/>
          <button onClick={()=>{if(newName.trim()){onNewProject(newName.trim());setNewName('')}}} style={{padding:'9px 16px',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.1em',textTransform:'uppercase',borderRadius:5,border:'none',cursor:'pointer'}}>Créer</button>
        </div>
        {projects.map((p:Project)=>{
          const pR=readings.filter((r:Reading)=>r.projectId===p.id)
          return (
            <div key={p.id} style={{background:'rgba(255,255,255,0.02)',border:'1px solid var(--b1)',borderRadius:8,padding:'14px 16px',marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8"><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                {editing===p.id?<input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} onBlur={()=>{onRenameProject(p.id,editName);setEditing(null)}} onKeyDown={e=>{if(e.key==='Enter'){onRenameProject(p.id,editName);setEditing(null)}}} style={{flex:1,background:'transparent',border:'none',borderBottom:'1px solid var(--amber)',color:'var(--amber)',fontSize:14,fontFamily:'var(--f-ui)',outline:'none'}}/>
                :<span style={{flex:1,fontFamily:'var(--f-ui)',fontSize:14,color:'var(--tx1)',cursor:'pointer'}} onDoubleClick={()=>{setEditing(p.id);setEditName(p.name)}}>{p.name}</span>}
                <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={()=>{setEditing(p.id);setEditName(p.name)}}>✎</button>
                <button style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)',cursor:'pointer',background:'none',border:'none'}} onClick={()=>onDeleteProject(p.id)}>✕</button>
              </div>
              {pR.map((r:Reading)=><button key={r.id} onClick={()=>{onOpenReading(r);onBack()}} style={{display:'flex',alignItems:'center',gap:6,width:'100%',padding:'5px 6px',textAlign:'left' as const,cursor:'pointer',background:'transparent',border:'none',marginBottom:2}}><span style={{fontSize:9,color:'var(--amber)'}}>◈</span><span style={{fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)'}}>{r.title}</span></button>)}
              {pR.length===0&&<div style={{fontFamily:'var(--f-mono)',fontSize:9,color:'var(--tx3)',paddingLeft:20}}>Glisse des lectures ici depuis la barre de droite</div>}
            </div>
          )
        })}
        {projects.length===0&&<div style={{textAlign:'center',padding:40,fontFamily:'var(--f-mono)',fontSize:11,color:'var(--tx3)',lineHeight:1.8}}>Aucun projet encore.<br/>Crée-en un ci-dessus.</div>}
      </div>
    </div>
  )
}

function AbonnementsPage({ onBack, userEmail, onSuccess }: any) {
  const [loading,setLoading]=useState<string|null>(null)
  const checkout=async(key:string,m:Mode)=>{ setLoading(key); try{ const r=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({priceKey:key})}); const d=await r.json(); if(d.url)window.location.href=d.url; else onSuccess(m) }finally{setLoading(null)} }
  const plans=[
    {key:'essentiel',mode:'essentiel' as Mode,badge:'GRATUIT',name:'Essentiel',price:'0',period:'',features:['9 sciences disponibles','Lectures illimitées (basiques)','Sauvegarde locale'],accent:false},
    {key:'premium',mode:'premium' as Mode,badge:'PREMIUM',name:'Premium',price:'29',period:'/mois',features:['11 sciences complètes','Audio IA (ElevenLabs)','PDF haute qualité','Historique cloud'],accent:true},
    {key:'praticien',mode:'praticien' as Mode,badge:'PRATICIEN',name:'Praticien',price:'89',period:'/mois',features:['Mode cabinet complet','Profils clients illimités','Rapports exportables','12 sciences avancées','Support prioritaire'],accent:false},
  ]
  return (
    <div style={{minHeight:'100vh',background:'var(--deep)',display:'flex',flexDirection:'column',alignItems:'center',position:'relative',zIndex:10}}><Stars/>
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
        <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
          {plans.map(p=>(
            <div key={p.key} style={{background:'var(--pitch)',border:`1px solid ${p.accent?'var(--ab2)':'var(--b2)'}`,borderRadius:14,padding:'24px 20px',flex:'1 1 240px',maxWidth:300,display:'flex',flexDirection:'column',gap:10,position:'relative',boxShadow:p.accent?'0 0 30px rgba(255,140,0,0.06)':'none'}}>
              {p.accent&&<div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:8.5,letterSpacing:'0.12em',padding:'3px 12px',borderRadius:20,whiteSpace:'nowrap'}}>✦ Le plus choisi</div>}
              <div style={{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase'}}>{p.badge}</div>
              <div style={{fontFamily:'var(--f-display)',fontSize:20,letterSpacing:'0.06em',color:'var(--chrome)',textTransform:'uppercase'}}>{p.name}</div>
              <div style={{display:'flex',alignItems:'baseline',gap:2}}>
                {p.price!=='0'&&<span style={{fontFamily:'var(--f-mono)',fontSize:16,color:'var(--tx2)'}}>€</span>}
                <span style={{fontFamily:'var(--f-display)',fontSize:42,color:'var(--chrome)',lineHeight:1}}>{p.price==='0'?'Gratuit':p.price}</span>
                {p.period&&<span style={{fontFamily:'var(--f-mono)',fontSize:10,color:'var(--tx3)'}}>{p.period}</span>}
              </div>
              <div style={{height:1,background:'var(--b1)'}}/>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:7,flex:1}}>
                {p.features.map(f=><li key={f} style={{display:'flex',alignItems:'center',gap:8,fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)'}}><span style={{color:'var(--amber)'}}>✓</span>{f}</li>)}
              </ul>
              <button onClick={()=>checkout(p.key,p.mode)} disabled={loading===p.key}
                style={{padding:'11px 16px',width:'100%',background:p.accent?'var(--amber)':p.key==='essentiel'?'rgba(255,255,255,0.05)':'rgba(255,140,0,0.07)',border:`1px solid ${p.accent?'var(--amber)':p.key==='essentiel'?'var(--b2)':'var(--ab1)'}`,color:p.accent?'var(--void)':p.key==='essentiel'?'var(--tx3)':'var(--amber)',fontFamily:'var(--f-mono)',fontSize:9.5,letterSpacing:'0.12em',textTransform:'uppercase',borderRadius:5,cursor:'pointer',marginTop:'auto',boxShadow:p.accent?'0 4px 20px rgba(255,140,0,0.2)':'none'}}>
                {loading===p.key?'...':(p.key==='essentiel'?'Mode actuel':p.accent?'Commencer Premium':'Accès Praticien')}
              </button>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 0',fontFamily:'var(--f-mono)',fontSize:9.5,color:'var(--tx3)'}}>Paiement sécurisé Stripe · Annulation à tout moment · hexastra.fr</div>
      </div>
    </div>
  )
}

// ─── Form styles ───────────────────────────────────────────────
const fm: Record<string,React.CSSProperties> = {
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.92)',backdropFilter:'blur(16px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:20},
  modal:{background:'var(--panel)',border:'1px solid var(--b2)',borderRadius:14,padding:'22px 20px',width:'100%',maxWidth:430,display:'flex',flexDirection:'column',gap:11,animation:'fadeUp 0.3s var(--expo) both',boxShadow:'0 40px 100px rgba(0,0,0,0.8)',maxHeight:'92vh',overflowY:'auto'},
  tag:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.2em',color:'var(--amber)',textTransform:'uppercase',marginBottom:4},
  title:{fontFamily:'var(--f-display)',fontSize:22,letterSpacing:'0.05em',textTransform:'uppercase',color:'var(--chrome)'},
  close:{fontFamily:'var(--f-mono)',fontSize:13,color:'var(--tx3)',padding:'4px 6px',cursor:'pointer',background:'none',border:'none'},
  sub:{fontFamily:'var(--f-ui)',fontSize:12,color:'var(--tx2)',lineHeight:1.6,fontStyle:'italic'},
  field:{display:'flex',flexDirection:'column'},
  lbl:{fontFamily:'var(--f-mono)',fontSize:8,letterSpacing:'0.15em',color:'var(--tx3)',textTransform:'uppercase',marginBottom:4},
  inp:{background:'rgba(255,255,255,0.04)',border:'1px solid var(--b2)',borderRadius:6,padding:'9px 11px',color:'var(--tx1)',fontSize:13,width:'100%',fontFamily:'var(--f-ui)'},
  btn:{padding:'12px 18px',background:'var(--amber)',color:'var(--void)',fontFamily:'var(--f-mono)',fontSize:10,letterSpacing:'0.14em',textTransform:'uppercase',fontWeight:600,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 5px 20px rgba(255,140,0,0.2)',cursor:'pointer',border:'none',marginTop:4},
}
