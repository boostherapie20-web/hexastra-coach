'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true); setError(''); setMessage('')
    const supabase = createClient()

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect.')
      else { router.push('/chat'); router.refresh() }
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/chat` },
      })
      if (error) setError(error.message)
      else setMessage('Vérifiez votre boîte mail pour confirmer votre compte.')
    }
    setLoading(false)
  }

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />
      <div style={s.scanWrap}><div style={s.scanLine} /></div>

      <div style={s.card}>
        {/* Logo cliquable → accueil */}
        <a href="/" style={s.logoRow} aria-label="HexAstra — Accueil">
          <Image
            src="/logo/hexastra.png"
            alt="HexAstra"
            width={44}
            height={44}
            style={s.logoImg}
            priority
          />
          <div>
            <div style={s.logoName}>Hex<span style={s.logoAccent}>Astra</span></div>
            <div style={s.logoSub}>Analyse personnelle · IA</div>
          </div>
        </a>

        <div style={s.divider} />

        <div>
          <div style={s.stepLabel}>
            {mode === 'login' ? '// Connexion' : '// Créer mon compte'}
          </div>
          <h1 style={s.title}>
            {mode === 'login' ? 'BON RETOUR' : 'COMMENCER'}
          </h1>
          <p style={s.subtitle}>
            {mode === 'login'
              ? 'Accédez à votre espace et vos analyses.'
              : 'Gratuit · Sans carte bancaire requise.'}
          </p>
        </div>

        <div style={s.fields}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="votre@email.com" style={s.input}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mot de passe</label>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••••" style={s.input}
            />
          </div>
        </div>

        {error   && <div style={s.errBox}>{error}</div>}
        {message && <div style={s.sucBox}>{message}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{ ...s.btn, opacity: loading || !email || !password ? 0.45 : 1 }}
        >
          {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
          {!loading && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage('') }}
          style={s.switchBtn}
        >
          {mode === 'login'
            ? "Pas encore de compte ? Créer mon compte gratuitement"
            : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--pitch)', padding: '24px', position: 'relative', overflow: 'hidden',
  },
  bgGrid: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    backgroundImage: 'linear-gradient(rgba(232,232,240,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,232,240,0.025) 1px,transparent 1px)',
    backgroundSize: '64px 64px',
    maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)',
  } as React.CSSProperties,
  bgGlow: {
    position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(31,175,140,0.06),transparent)',
  },
  scanWrap: { position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: '1px',
    background: 'linear-gradient(90deg,transparent,rgba(31,175,140,0.2),transparent)',
    animation: 'scanLine 14s linear infinite',
  },
  card: {
    position: 'relative', zIndex: 1,
    background: 'var(--panel)', border: '1px solid var(--b2)',
    borderRadius: '16px', padding: '40px 36px',
    width: '100%', maxWidth: '400px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset',
    display: 'flex', flexDirection: 'column', gap: '24px',
    animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
  },
  logoRow: {
    display: 'flex', alignItems: 'center', gap: '13px',
    textDecoration: 'none',
  },
  logoImg: {
    width: '44px', height: '44px', objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(31,175,140,0.5))',
    flexShrink: 0,
    borderRadius: '50%',
  },
  logoName: {
    fontFamily: 'var(--f-display)', fontSize: '20px', letterSpacing: '0.1em',
    color: 'var(--chrome)', lineHeight: 1,
  },
  logoAccent: { color: 'var(--emerald)' },
  logoSub: {
    fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.16em',
    color: 'var(--tx3)', textTransform: 'uppercase', marginTop: '4px',
  },
  divider: { height: '1px', background: 'var(--b1)' },
  stepLabel: {
    fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em',
    color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '8px',
  },
  title: {
    fontFamily: 'var(--f-display)', fontSize: '36px', letterSpacing: '0.05em',
    textTransform: 'uppercase', color: 'var(--chrome)', lineHeight: 1, marginBottom: '8px',
  },
  subtitle: {
    fontFamily: 'var(--f-serif)', fontStyle: 'italic',
    fontSize: '14px', color: 'var(--tx2)', lineHeight: 1.6,
  },
  fields: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em',
    color: 'var(--tx3)', textTransform: 'uppercase',
  },
  input: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)',
    borderRadius: '6px', padding: '11px 14px',
    color: 'var(--tx1)', fontSize: '14px', width: '100%',
    transition: 'border-color 0.2s',
  },
  errBox: {
    fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#ff8080',
    padding: '10px 14px', background: 'rgba(255,60,60,0.07)',
    border: '1px solid rgba(255,60,60,0.18)', borderRadius: '6px',
  },
  sucBox: {
    fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#80ffaa',
    padding: '10px 14px', background: 'rgba(60,255,100,0.07)',
    border: '1px solid rgba(60,255,100,0.18)', borderRadius: '6px',
  },
  btn: {
    padding: '14px 20px', background: 'var(--emerald)', color: 'var(--void)',
    fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em',
    textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    transition: 'all 0.2s', boxShadow: '0 8px 28px rgba(31,175,140,0.25)',
    border: 'none', cursor: 'pointer', width: '100%',
  },
  switchBtn: {
    fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.06em',
    color: 'var(--tx3)', textAlign: 'center' as const, padding: '4px 0',
    background: 'transparent', border: 'none', cursor: 'pointer',
    textDecoration: 'underline',
  },
}
