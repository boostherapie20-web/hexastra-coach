'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()

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
          <button onClick={() => router.push('/login')} style={s.navCta}>Connexion</button>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section style={s.hero}>
        {/* Left — texte */}
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
            <a href="#comment" style={s.heroBtnSecondary}>Comment ça marche</a>
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

        {/* Right — MOCKUP CHAT */}
        <div style={s.mockup}>
          <div style={s.mockupBar}>
            <div style={s.mockupDots}>
              <span style={{ ...s.mockupDot, background: '#ff5f57' }} />
              <span style={{ ...s.mockupDot, background: '#febc2e' }} />
              <span style={{ ...s.mockupDot, background: '#28c840' }} />
            </div>
            <div style={s.mockupTitle}>Votre analyse · HexAstra</div>
          </div>
          <div style={s.mockupBody}>
            {/* Message IA */}
            <div style={s.mockupMsgRow}>
              <div style={s.mockupAv}>
                <Image src="/logo/hexastra.png" alt="HA" width={24} height={24} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={s.mockupBubAI}>
                <p style={s.mockupTxt}>Bonjour 👋 Je suis HexAstra.</p>
                <p style={{ ...s.mockupTxt, marginTop: '4px' }}>Cliquez sur <span style={s.mockupEm}>« Démarrer une lecture »</span> pour commencer votre analyse personnalisée.</p>
              </div>
            </div>
            {/* Message user */}
            <div style={{ ...s.mockupMsgRow, justifyContent: 'flex-end' }}>
              <div style={s.mockupBubU}>
                <p style={s.mockupTxt}>Analyse personnalisée · Naissance le 15/11/1989 à Lyon</p>
              </div>
            </div>
            {/* Réponse IA */}
            <div style={s.mockupMsgRow}>
              <div style={s.mockupAv}>
                <Image src="/logo/hexastra.png" alt="HA" width={24} height={24} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={s.mockupBubAI}>
                <p style={s.mockupTxt}>Votre thème révèle une nature profonde, en quête de sens et d'authenticité...</p>
                <div style={s.mockupPremBtn}>Débloquer ma lecture complète — 19 EUR →</div>
              </div>
            </div>
            {/* Typing dots */}
            <div style={s.mockupMsgRow}>
              <div style={s.mockupAv}>
                <Image src="/logo/hexastra.png" alt="HA" width={24} height={24} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div style={{ ...s.mockupBubAI, padding: '10px 14px' }}>
                <div style={s.mockupDotRow}>
                  {[0,1,2].map(i => <span key={i} style={{ ...s.typingDot, animationDelay: `${i*0.18}s` }} />)}
                </div>
              </div>
            </div>
            {/* Composer */}
            <div style={s.mockupComposer}>
              <span style={s.mockupPlaceholder}>Posez votre question…</span>
              <div style={s.mockupSendBtn}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>
          {/* Glow derrière le mockup */}
          <div style={s.mockupGlow} />
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
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
                  </svg>
                ),
                n: '01',
                title: 'Entrez vos informations',
                desc: 'Date, heure et ville de naissance permettent à HexAstra de créer votre profil personnel précis.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    <path d="M12 2a7 7 0 017 7" strokeDasharray="3 2"/>
                  </svg>
                ),
                n: '02',
                title: 'Choisissez votre thème',
                desc: 'Relations, décisions importantes, projets de vie ou blocages à surmonter.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                  </svg>
                ),
                n: '03',
                title: 'Recevez votre analyse',
                desc: 'Une lecture claire avec des conseils concrets adaptés à votre situation actuelle.',
              },
            ].map((step, i) => (
              <div key={i} style={s.stepCard}>
                <div style={s.stepIconRow}>
                  <div style={s.stepIconWrap}>{step.icon}</div>
                  <div style={s.stepNum}>{step.n}</div>
                </div>
                <h3 style={s.stepTitle}>{step.title}</h3>
                <p style={s.stepDesc}>{step.desc}</p>
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
          <a href="/login" style={s.footerLink}>Connexion</a>
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

  nav: { position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', borderBottom: '1px solid var(--b1)', background: 'rgba(44,31,26,0.7)', backdropFilter: 'blur(20px)' },
  navLogo: { display: 'flex', alignItems: 'center', gap: '11px', textDecoration: 'none' },
  navLogoImg: { width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(31,175,140,0.5))', borderRadius: '50%' },
  navLogoTxt: { fontFamily: 'var(--f-display)', fontSize: '20px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--chrome)' },
  navAccent: { color: 'var(--emerald)' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '28px' },
  navLink: { fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.12em', color: 'var(--tx3)', textDecoration: 'none', textTransform: 'uppercase' },
  navCta: { padding: '9px 20px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(31,175,140,0.28)' },

  // Hero
  hero: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 48px 80px', minHeight: '88vh', gap: '48px', flexWrap: 'wrap' as const },
  heroInner: { maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 380px' },
  heroTag: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  heroTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(40px,4.5vw,66px)', lineHeight: 1.05, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  heroEm: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 'clamp(40px,4.5vw,66px)', color: 'var(--emerald)', textTransform: 'none', letterSpacing: '0.02em' },
  heroSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', lineHeight: 1.8, color: 'var(--tx2)', maxWidth: '440px' },
  heroCtas: { display: 'flex', gap: '14px', flexWrap: 'wrap' as const },
  heroBtnPrimary: { padding: '14px 28px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 28px rgba(31,175,140,0.3)' },
  heroBtnSecondary: { padding: '14px 24px', background: 'transparent', border: '1px solid var(--b2)', color: 'var(--tx2)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '4px', textDecoration: 'none', display: 'flex', alignItems: 'center' },
  heroTrust: { display: 'flex', alignItems: 'center', gap: '12px' },
  trustAvatars: { display: 'flex', alignItems: 'center' },
  trustAv: { width: '28px', height: '28px', borderRadius: '50%', background: 'var(--lift)', border: '2px solid var(--pitch)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--emerald)', flexShrink: 0 },
  trustTxt: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', letterSpacing: '0.08em' },

  // ── MOCKUP CHAT ─────────────────────────────────────────
  mockup: { flex: '1 1 340px', maxWidth: '420px', position: 'relative', zIndex: 1 },
  mockupBar: { background: 'var(--lift)', borderRadius: '12px 12px 0 0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--b1)' },
  mockupDots: { display: 'flex', gap: '5px' },
  mockupDot: { width: '8px', height: '8px', borderRadius: '50%' },
  mockupTitle: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--tx3)', textTransform: 'uppercase', flex: 1, textAlign: 'center' as const },
  mockupBody: { background: 'var(--panel)', border: '1px solid var(--b2)', borderTop: 'none', borderRadius: '0 0 12px 12px', padding: '16px 14px', display: 'flex', flexDirection: 'column' as const, gap: '10px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' },
  mockupMsgRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  mockupAv: { width: '24px', height: '24px', minWidth: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(31,175,140,0.3)', flexShrink: 0 },
  mockupBubAI: { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b1)', borderRadius: '10px', borderBottomLeftRadius: '2px', padding: '9px 12px', maxWidth: '82%' },
  mockupBubU: { background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.1)', borderRadius: '10px', borderBottomRightRadius: '2px', padding: '9px 12px', maxWidth: '82%' },
  mockupTxt: { fontFamily: 'var(--f-ui)', fontSize: '11.5px', lineHeight: 1.6, color: 'var(--tx2)', margin: 0 },
  mockupEm: { color: 'var(--emerald)', fontWeight: 500 },
  mockupPremBtn: { marginTop: '8px', background: 'rgba(31,175,140,0.08)', border: '1px solid rgba(31,175,140,0.25)', borderRadius: '4px', padding: '7px 10px', fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.08em', color: 'var(--emerald)', textTransform: 'uppercase' as const },
  mockupDotRow: { display: 'flex', gap: '4px', alignItems: 'center' },
  typingDot: { width: '4px', height: '4px', borderRadius: '50%', background: 'var(--tx3)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },
  mockupComposer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)', borderRadius: '8px', padding: '8px 12px', marginTop: '4px' },
  mockupPlaceholder: { fontFamily: 'var(--f-ui)', fontSize: '11.5px', color: 'var(--tx3)' },
  mockupSendBtn: { width: '26px', height: '26px', background: 'var(--emerald)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--void)', flexShrink: 0 },
  mockupGlow: { position: 'absolute', inset: '-20%', zIndex: -1, background: 'radial-gradient(ellipse 70% 70% at 50% 50%,rgba(31,175,140,0.08),transparent)', pointerEvents: 'none', borderRadius: '50%' },

  // Steps avec icônes
  section: { position: 'relative', zIndex: 1, padding: '80px 48px' },
  sectionInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  sectionTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  sectionSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--tx2)', lineHeight: 1.75, maxWidth: '520px' },
  sectionCta: { alignSelf: 'flex-start' as const, padding: '13px 26px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 22px rgba(31,175,140,0.28)' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' },
  stepCard: { background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '14px', transition: 'border-color 0.2s' },
  stepIconRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepIconWrap: { width: '48px', height: '48px', background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontFamily: 'var(--f-display)', fontSize: '42px', color: 'rgba(31,175,140,0.15)', lineHeight: 1, letterSpacing: '0.04em' },
  stepTitle: { fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  stepDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.75, color: 'var(--tx2)', margin: 0 },

  useCases: { display: 'flex', flexDirection: 'column', gap: '8px' },
  useCard: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', background: 'rgba(31,175,140,0.05)', border: '1px solid rgba(31,175,140,0.1)', borderRadius: '8px' },
  useIcon: { fontSize: '16px', color: 'var(--emerald)', flexShrink: 0, width: '20px', textAlign: 'center' as const },
  useLabel: { fontFamily: 'var(--f-ui)', fontSize: '15px', color: 'var(--tx2)' },

  ctaSection: { position: 'relative', zIndex: 1, padding: '100px 48px', textAlign: 'center' as const, overflow: 'hidden' },
  ctaGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(31,175,140,0.08),transparent)', pointerEvents: 'none' },
  ctaInner: { position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  ctaTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  ctaTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  ctaDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '17px', color: 'var(--tx2)', lineHeight: 1.75 },
  ctaBtn: { padding: '16px 36px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 36px rgba(31,175,140,0.35)' },

  footer: { borderTop: '1px solid var(--b1)', background: 'var(--void)', padding: '28px 48px' },
  footerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  footerLogoTxt: { fontFamily: 'var(--f-display)', fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--chrome)' },
  footerTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--tx3)', textTransform: 'uppercase' },
  footerLink: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--tx3)', textDecoration: 'none', textTransform: 'uppercase' },
}
