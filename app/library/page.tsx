'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Reading = {
  id: string
  created_at: string
  reading_type: 'free' | 'premium'
  reading_text: string | null
  birth_date_iso: string
}

export default function LibraryPage() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.from('readings').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setReadings(data || []); setLoading(false) })
  }, [])

  const download = async (readingId: string, type: 'pdf' | 'audio') => {
    const { data } = await supabase.from('file_refs')
      .select('id').eq('reading_id', readingId).eq('file_type', type).single()
    if (data) window.open(`/api/download/${data.id}`)
    else alert('Fichier non disponible.')
  }

  return (
    <div style={s.root}>
      <div style={s.bgGlow} />

      <aside style={s.sidebar}>
        <div style={s.sbTop}>
          <a href="/" style={s.sbLogoLink} aria-label="HexAstra — Accueil">
            <Image src="/logo/hexastra.png" alt="HexAstra" width={32} height={32} style={s.sbLogoImg} />
          </a>
          <div style={s.sbName}>Hex<span style={s.sbAccent}>Astra</span></div>
        </div>
        <div style={s.sbSecLabel}>Navigation</div>
        <nav style={s.nav}>
          <button style={s.navItem} onClick={() => router.push('/chat')}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Votre analyse
          </button>
          <button style={{ ...s.navItem, ...s.navActive }}>
            <svg style={s.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            Mes lectures
          </button>
        </nav>
      </aside>

      <main style={s.main}>
        <header style={s.header}>
          <div>
            <div style={s.headerTag}>// Bibliothèque</div>
            <h1 style={s.headerTitle}>MES LECTURES</h1>
            <p style={s.headerDesc}>Retrouvez ici toutes vos analyses HexAstra. Relisez-les, téléchargez le PDF ou écoutez la version audio.</p>
          </div>
          <button onClick={() => router.push('/chat')} style={s.newBtn}>
            + Démarrer une lecture
          </button>
        </header>

        <div style={s.content}>
          {loading ? (
            <div style={s.center}><span style={s.spinner} /></div>
          ) : readings.length === 0 ? (
            <div style={s.center}>
              <div style={s.emptyIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(31,175,140,0.3)" strokeWidth="1.2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <p style={s.emptyTxt}>Aucune analyse pour l'instant.</p>
              <p style={s.emptySubTxt}>Démarrez votre première lecture pour obtenir une analyse personnalisée.</p>
              <button onClick={() => router.push('/chat')} style={s.startBtn}>
                Commencer ma lecture →
              </button>
            </div>
          ) : (
            <div style={s.grid}>
              {readings.map(r => (
                <div key={r.id} style={s.card} onClick={() => router.push(`/reading/${r.id}`)}>
                  <div style={s.cardTop}>
                    <div style={s.cardDate}>
                      {new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <span style={{
                      ...s.badge,
                      background: r.reading_type === 'premium' ? 'rgba(31,175,140,0.08)' : 'rgba(255,255,255,0.04)',
                      color: r.reading_type === 'premium' ? 'var(--emerald)' : 'var(--tx3)',
                      borderColor: r.reading_type === 'premium' ? 'rgba(31,175,140,0.25)' : 'var(--b2)',
                    }}>
                      {r.reading_type === 'premium' ? '◆ Complète' : 'Aperçu'}
                    </span>
                  </div>

                  <p style={s.cardBirth}>
                    Naissance · {new Date(r.birth_date_iso).toLocaleDateString('fr-FR')}
                  </p>

                  {r.reading_text && (
                    <p style={s.excerpt}>{r.reading_text.slice(0, 150)}…</p>
                  )}

                  {r.reading_type === 'premium' && (
                    <div style={s.dlRow} onClick={e => e.stopPropagation()}>
                      <button onClick={() => download(r.id, 'pdf')} style={s.dlBtn}>
                        ↓ Télécharger PDF
                      </button>
                      <button onClick={() => download(r.id, 'audio')} style={{ ...s.dlBtn, ...s.dlAudio }}>
                        ↓ Écouter Audio
                      </button>
                    </div>
                  )}

                  {r.reading_type === 'free' && (
                    <button
                      onClick={e => { e.stopPropagation(); router.push(`/reading/${r.id}`) }}
                      style={s.upgradeBtn}
                    >
                      Débloquer la lecture complète — 19 EUR →
                    </button>
                  )}

                  <div style={s.cardArrow}>→</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--deep)', position: 'relative' },
  bgGlow: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 40% at 70% 50%,rgba(31,175,140,0.035),transparent)' },
  sidebar: { width: '216px', minWidth: '216px', height: '100vh', background: 'var(--pitch)', borderRight: '1px solid var(--b1)', display: 'flex', flexDirection: 'column', zIndex: 10 },
  sbTop: { padding: '18px 16px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--b1)' },
  sbLogoLink: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  sbLogoImg: { width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(31,175,140,0.5))', borderRadius: '50%' },
  sbName: { fontFamily: 'var(--f-display)', fontSize: '16px', letterSpacing: '0.1em', color: 'var(--chrome)', textTransform: 'uppercase' },
  sbAccent: { color: 'var(--emerald)' },
  sbSecLabel: { padding: '16px 16px 6px', fontFamily: 'var(--f-mono)', fontSize: '8.5px', letterSpacing: '0.16em', color: 'var(--tx3)', textTransform: 'uppercase' },
  nav: { display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 8px', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '6px', fontFamily: 'var(--f-ui)', fontSize: '12.5px', color: 'var(--tx3)', transition: 'all 0.18s', textAlign: 'left' as const, background: 'transparent', border: 'none', cursor: 'pointer', width: '100%' },
  navActive: { color: 'var(--emerald)', background: 'rgba(31,175,140,0.07)', borderLeft: '2px solid var(--emerald)' },
  navIcon: { width: '13px', height: '13px', opacity: 0.6, flexShrink: 0 } as React.CSSProperties,
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 10 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid var(--b1)', background: 'rgba(10,10,16,0.7)', backdropFilter: 'blur(20px)', flexShrink: 0 },
  headerTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '5px' },
  headerTitle: { fontFamily: 'var(--f-display)', fontSize: '24px', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--chrome)', marginBottom: '6px' },
  headerDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.6, maxWidth: '460px' },
  newBtn: { background: 'rgba(31,175,140,0.08)', border: '1px solid rgba(31,175,140,0.25)', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.1em', padding: '8px 16px', borderRadius: '4px', whiteSpace: 'nowrap' as const, cursor: 'pointer', marginTop: '4px', flexShrink: 0 },
  content: { flex: 1, overflowY: 'auto' as const, padding: '28px' },
  center: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', height: '360px', gap: '16px' },
  emptyIcon: { opacity: 0.5, animation: 'breathe 3s ease-in-out infinite' },
  emptyTxt: { fontFamily: 'var(--f-display)', fontSize: '20px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--chrome)' },
  emptySubTxt: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', color: 'var(--tx2)', textAlign: 'center' as const, maxWidth: '320px', lineHeight: 1.65 },
  startBtn: { background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.12em', padding: '12px 24px', borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(31,175,140,0.25)' },
  spinner: { display: 'inline-block', width: '26px', height: '26px', border: '2px solid var(--b2)', borderTop: '2px solid var(--emerald)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '10px' },
  card: { background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '22px', cursor: 'pointer', display: 'flex', flexDirection: 'column' as const, gap: '10px', transition: 'border-color 0.2s, transform 0.2s', position: 'relative' as const, overflow: 'hidden' as const },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontFamily: 'var(--f-mono)', fontSize: '10.5px', color: 'var(--tx3)', letterSpacing: '0.06em' },
  badge: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.1em', padding: '3px 10px', borderRadius: '100px', border: '1px solid', textTransform: 'uppercase' as const },
  cardBirth: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', color: 'var(--tx3)', letterSpacing: '0.06em' },
  excerpt: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', lineHeight: 1.75, color: 'var(--tx2)' },
  dlRow: { display: 'flex', gap: '8px', marginTop: '4px' },
  dlBtn: { flex: 1, background: 'rgba(31,175,140,0.06)', border: '1px solid rgba(31,175,140,0.12)', borderRadius: '4px', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', padding: '8px', textAlign: 'center' as const, textTransform: 'uppercase' as const, cursor: 'pointer' },
  dlAudio: { background: 'rgba(0,212,255,0.05)', borderColor: 'rgba(0,212,255,0.14)', color: '#00d4ff' },
  upgradeBtn: { background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.2)', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.08em', borderRadius: '4px', padding: '9px 14px', textAlign: 'center' as const, cursor: 'pointer', display: 'block', width: '100%' },
  cardArrow: { position: 'absolute' as const, top: '22px', right: '22px', fontFamily: 'var(--f-mono)', fontSize: '14px', color: 'var(--tx3)', opacity: 0.4 },
}
