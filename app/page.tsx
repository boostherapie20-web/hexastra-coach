'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />
      <div style={s.scanWrap}><div style={s.scanLine} /></div>

      {/* ── NAV ─────────────────────────────────────────── */}
      <nav style={s.nav}>
        <a href="/" style={s.navLogo} aria-label="HexAstra">
          <Image src="/logo/hexastra.png" alt="HexAstra" width={40} height={40} style={s.navLogoImg} priority />
          <span style={s.navLogoTxt}>Hex<span style={s.navAccent}>Astra</span></span>
        </a>
        <div style={s.navLinks}>
          <a href="#comment" style={s.navLink}>Comment ça marche</a>
          <a href="#pourqui" style={s.navLink}>Pour qui</a>
          <button onClick={() => router.push('/login')} style={s.navCta}>
            Connexion
          </button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>// Intelligence personnelle · IA</div>
          <h1 style={s.heroTitle}>
            Comprenez votre<br />
            <em style={s.heroEm}>moment de vie</em><br />
            en quelques minutes
          </h1>
          <p style={s.heroSub}>
            HexAstra analyse votre situation et vous donne des clés concrètes
            pour vos relations, vos décisions et votre évolution personnelle.
          </p>
          <div style={s.heroCtas}>
            <button onClick={() => router.push('/login')} style={s.heroBtnPrimary}>
              Commencer ma lecture
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
            <a href="#comment" style={s.heroBtnSecondary}>
              Comment ça marche
            </a>
          </div>
          <div style={s.heroTrust}>
            <div style={s.trustAvatars}>
              {['S','M','L','A','R'].map((l, i) => (
                <div key={i} style={{ ...s.trustAv, marginLeft: i > 0 ? '-8px' : 0 }}>{l}</div>
              ))}
            </div>
            <span style={s.trustTxt}>+2 400 analyses réalisées · 4.9/5</span>
          </div>
        </div>
        <div style={s.heroOrb}>
          <div style={s.orbGlow} />
          <div style={s.orbRing1} />
          <div style={s.orbRing2} />
          <Image src="/logo/hexastra.png" alt="" width={120} height={120} style={s.orbLogo} />
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ───────────────────────────── */}
      <section id="comment" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionTag}>// 01 — Processus</div>
          <h2 style={s.sectionTitle}>Comment ça marche</h2>
          <p style={s.sectionSub}>Trois étapes simples pour obtenir votre analyse personnalisée.</p>

          <div style={s.steps}>
            {[
              {
                n: '01',
                title: 'Entrez vos informations',
                desc: 'Date, heure et lieu de naissance permettent à HexAstra de créer votre profil personnel précis.',
              },
              {
                n: '02',
                title: 'Choisissez votre thème',
                desc: 'Relations, décisions importantes, projets de vie ou blocages à surmonter.',
              },
              {
                n: '03',
                title: 'Recevez votre analyse',
                desc: 'Une lecture claire avec des conseils concrets adaptés à votre situation actuelle.',
              },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={s.stepNum}>{step.n}</div>
                <div>
                  <h3 style={s.stepTitle}>{step.title}</h3>
                  <p style={s.stepDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => router.push('/login')} style={s.sectionCta}>
            Lancer mon analyse →
          </button>
        </div>
      </section>

      {/* ── POUR QUI ────────────────────────────────────── */}
      <section id="pourqui" style={{ ...s.section, background: 'var(--panel)' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionTag}>// 02 — Usage</div>
          <h2 style={s.sectionTitle}>HexAstra est utile si vous souhaitez :</h2>

          <div style={s.useCases}>
            {[
              { icon: '◎', label: 'Comprendre une période de vie' },
              { icon: '◈', label: 'Prendre une décision importante' },
              { icon: '◉', label: 'Éclaircir une relation' },
              { icon: '◇', label: 'Retrouver votre direction' },
              { icon: '◆', label: 'Mieux comprendre vos cycles personnels' },
            ].map((u, i) => (
              <div key={i} style={s.useCard}>
                <span style={s.useIcon}>{u.icon}</span>
                <span style={s.useLabel}>{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────── */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <div style={s.ctaInner}>
          <div style={s.ctaTag}>// Votre lecture vous attend</div>
          <h2 style={s.ctaTitle}>COMMENCEZ MAINTENANT</h2>
          <p style={s.ctaDesc}>Quelques minutes suffisent pour obtenir une analyse personnalisée.</p>
          <button onClick={() => router.push('/login')} style={s.ctaBtn}>
            Commencer ma lecture
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <a href="/" style={s.footerLogo}>
            <Image src="/logo/hexastra.png" alt="HexAstra" width={24} height={24} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 5px rgba(31,175,140,0.4))' }} />
            <span style={s.footerLogoTxt}>Hex<span style={{ color: 'var(--emerald)' }}>Astra</span></span>
          </a>
          <p style={s.footerTxt}>© 2026 HexAstra · Analyse personnelle par IA</p>
          <div style={s.footerLinks}>
            <a href="/login" style={s.footerLink}>Connexion</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  root: { minHeight: '100vh', background: 'var(--pitch)', color: 'var(--tx1)', fontFamily: 'var(--f-ui)', overflowX: 'hidden' },
  bgGrid: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(232,232,240,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,232,240,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse 100% 80% at 50% 0%,black,transparent)' } as React.CSSProperties,
  bgGlow: { position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 40% at 50% 0%,rgba(31,175,140,0.07),transparent)' },
  scanWrap: { position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' },
  scanLine: { position: 'absolute', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(31,175,140,0.18),transparent)', animation: 'scanLine 18s linear infinite' },

  // Nav
  nav: { position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid var(--b1)', background: 'rgba(44,31,26,0.7)', backdropFilter: 'blur(20px)' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '11px', textDecoration: 'none' },
  navLogoImg: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(31,175,140,0.5))', borderRadius: '50%' },
  navLogoTxt: { fontFamily: 'var(--f-display)', fontSize: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--chrome)' },
  navAccent: { color: 'var(--emerald)' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '28px' },
  navLink: { fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--tx3)', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s' },
  navCta: { padding: '9px 20px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(31,175,140,0.28)' },

  // Hero
  hero: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '100px 48px 90px', minHeight: '90vh', gap: '48px' },
  heroInner: { maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' },
  heroTag: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  heroTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(44px,5vw,72px)', lineHeight: 1.05, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  heroEm: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 'clamp(44px,5vw,72px)', color: 'var(--emerald)', textTransform: 'none', letterSpacing: '0.02em' },
  heroSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '17px', lineHeight: 1.8, color: 'var(--tx2)', maxWidth: '480px' },
  heroCtas: { display: 'flex', gap: '14px', flexWrap: 'wrap' as const },
  heroBtnPrimary: { padding: '14px 28px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 28px rgba(31,175,140,0.3)' },
  heroBtnSecondary: { padding: '14px 24px', background: 'transparent', border: '1px solid var(--b2)', color: 'var(--tx2)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center' },
  heroTrust: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' },
  trustAvatars: { display: 'flex', alignItems: 'center' },
  trustAv: { width: '28px', height: '28px', borderRadius: '50%', background: 'var(--lift)', border: '2px solid var(--pitch)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--emerald)', flexShrink: 0 },
  trustTxt: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', letterSpacing: '0.08em' },

  // Hero orb
  heroOrb: { width: '340px', height: '340px', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  orbGlow: { position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(31,175,140,0.12) 0%, transparent 70%)' },
  orbRing1: { position: 'absolute', inset: '10%', borderRadius: '50%', border: '1px solid rgba(31,175,140,0.15)', animation: 'spin 24s linear infinite' },
  orbRing2: { position: 'absolute', inset: '24%', borderRadius: '50%', border: '1px solid rgba(31,175,140,0.1)', animation: 'spinR 16s linear infinite' },
  orbLogo: { width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 28px rgba(31,175,140,0.4))', position: 'relative', zIndex: 1, borderRadius: '50%', animation: 'breathe 4s ease-in-out infinite' },

  // Sections
  section: { position: 'relative', zIndex: 1, padding: '80px 48px' },
  sectionInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  sectionTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  sectionSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--tx2)', lineHeight: 1.75, maxWidth: '520px' },
  sectionCta: { alignSelf: 'flex-start' as const, padding: '13px 26px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 22px rgba(31,175,140,0.28)' },

  // Steps
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' },
  stepCard: { background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' },
  stepNum: { fontFamily: 'var(--f-display)', fontSize: '52px', color: 'rgba(31,175,140,0.2)', lineHeight: 1, letterSpacing: '0.04em' },
  stepTitle: { fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  stepDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.75, color: 'var(--tx2)', margin: 0 },

  // Use cases
  useCases: { display: 'flex', flexDirection: 'column', gap: '8px' },
  useCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'rgba(31,175,140,0.05)', border: '1px solid rgba(31,175,140,0.1)', borderRadius: '8px', transition: 'background 0.2s' },
  useIcon: { fontSize: '16px', color: 'var(--emerald)', flexShrink: 0, width: '20px', textAlign: 'center' as const },
  useLabel: { fontFamily: 'var(--f-ui)', fontSize: '15px', color: 'var(--tx2)' },

  // CTA section
  ctaSection: { position: 'relative', zIndex: 1, padding: '100px 48px', textAlign: 'center' as const, overflow: 'hidden' },
  ctaGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(31,175,140,0.08),transparent)', pointerEvents: 'none' },
  ctaInner: { position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  ctaTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  ctaTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  ctaDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '17px', color: 'var(--tx2)', lineHeight: 1.75 },
  ctaBtn: { padding: '16px 36px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 36px rgba(31,175,140,0.35)' },

  // Footer
  footer: { borderTop: '1px solid var(--b1)', background: 'var(--void)', padding: '28px 48px' },
  footerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  footerLogoTxt: { fontFamily: 'var(--f-display)', fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--chrome)' },
  footerTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--tx3)', textTransform: 'uppercase' },
  footerLinks: { display: 'flex', gap: '20px' },
  footerLink: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--tx3)', textDecoration: 'none', textTransform: 'uppercase' },
}
