// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'
type Lang = 'fr' | 'en'

const translations: Record<string, any> = {
  fr: {
    nav: { how: 'Comment ça marche', analysis: 'Ce qu\'on analyse', pricing: 'Tarifs', signIn: 'Connexion', cta: 'Commencer mon analyse' },
    hero: {
      eyebrow: 'Analyse personnelle intelligente',
      title1: 'Comprenez ce que',
      title2: 'vous traversez.',
      title3: 'Découvrez ce qui s\'ouvre devant vous.',
      sub: 'Une analyse intelligente de votre moment de vie, basée sur vos données de naissance.',
      cta: 'Commencer mon analyse',
      trust: '2 400+ analyses réalisées',
      score: '4,9 / 5',
    },
    how: {
      tag: 'Comment ça marche',
      title: 'Trois étapes vers la clarté',
      sub: 'Pas de graphiques complexes. Pas de jargon. Une analyse claire et personnelle.',
      steps: [
        { n: '01', title: 'Entrez vos données de naissance', desc: 'Date, heure et lieu de naissance. HexAstra cartographie votre configuration énergétique actuelle.' },
        { n: '02', title: 'L\'IA analyse vos dynamiques', desc: 'Transits planétaires, portes Human Design, cycles numérологiques — synthétisés en une vision cohérente.' },
        { n: '03', title: 'Recevez votre analyse', desc: 'Une lecture claire sur votre vie amoureuse, travail, humeur, santé et direction de vie.' },
      ],
    },
    analysis: {
      tag: 'Ce qu\'on analyse',
      title: 'Votre lecture personnelle comprend',
      sub: 'Cinq dimensions de votre quotidien, analysées avec précision.',
      items: [
        { icon: '♡', title: 'Amour & Relations', desc: 'Les dynamiques relationnelles et ce que ce moment vous enseigne.' },
        { icon: '◈', title: 'Travail & Argent', desc: 'Votre énergie professionnelle et vos opportunités actuelles.' },
        { icon: '◉', title: 'Humeur & État intérieur', desc: 'Votre météo émotionnelle — pas seulement comment vous vous sentez, mais pourquoi.' },
        { icon: '⊕', title: 'Santé & Énergie', desc: 'Rythmes physiques et énergétiques. Quand pousser, quand se reposer.' },
        { icon: '◎', title: 'Direction de vie', desc: 'La vision globale. Où vous en êtes dans votre cycle plus long.' },
      ],
    },
    example: {
      tag: 'Exemple d\'analyse',
      title: 'À quoi ressemble une analyse',
      sub: 'Claire. Personnelle. Utile.',
      name: 'Sophie M.',
      date: 'Aujourd\'hui · Analyse Premium',
      badge: 'Analyse complète',
      blocks: [
        { tag: 'Situation actuelle', title: 'Une invitation à ralentir', txt: 'Un mouvement intérieur vous invite à ralentir et à clarifier ce qui mérite vraiment votre attention en ce moment.' },
        { tag: 'Compréhension', title: 'Une phase, pas un blocage', txt: 'Ce que vous ressentez est une phase de réorganisation interne. Quelque chose s\'achève pour laisser place à quelque chose de nouveau.' },
        { tag: 'Action', title: 'Une décision, clairement', txt: 'Concentrez-vous sur une seule décision importante. L\'énergie disponible aujourd\'hui est précise, pas diffuse.' },
      ],
      ctaNote: 'Analyse complète : 6 pages · PDF · Audio',
      ctaBtn: 'Obtenir mon analyse',
    },
    pricing: {
      tag: 'Tarifs',
      title: 'Commencez gratuitement.',
      title2: 'Approfondissez quand vous êtes prêt.',
      sub: 'Sans engagement. Changez ou annulez à tout moment.',
      popular: 'Le plus populaire',
      note: 'Sans carte bancaire pour commencer · Annulez à tout moment',
      plans: [
        { key: 'free', tag: 'Découverte', name: 'Gratuit', price: '0', per: '', desc: 'Découvrez ce que HexAstra peut révéler.', features: ['1 analyse courte par jour', 'Format texte uniquement', 'Accès au chat', 'Sauvegarde de 3 analyses'], missing: ['Export PDF', 'Version audio', 'Thèmes avancés'], cta: 'Commencer gratuitement', style: 'ghost' },
        { key: 'essentiel', tag: 'Essentiel', name: 'Essentiel', price: '9', per: '/mois', desc: 'Les fondamentaux pour avancer avec clarté.', features: ['3 analyses complètes par jour', 'Analyses détaillées', 'Export PDF', 'Historique de 30 analyses', 'Thèmes avancés'], missing: ['Version audio', 'Usage client'], cta: 'Démarrer Essentiel', style: 'secondary' },
        { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mois', desc: 'Votre analyse complète, aussi profonde que vous le souhaitez.', features: ['Analyses illimitées', 'Analyse complète et détaillée', 'Arc de lecture 7 jours', 'Export PDF (6 pages)', 'Audio personnel (7 min)', 'Thèmes avancés', 'Support prioritaire'], missing: [], cta: 'Démarrer Premium', style: 'primary', featured: true },
        { key: 'praticien', tag: 'Professionnel', name: 'Praticien', price: '49', per: '/mois', desc: 'Pour les coachs et thérapeutes.', features: ['Accès complet au système', 'Usage en séance client', 'Droits d\'usage professionnel', 'PDF + audio pour chaque analyse', 'Export et partage', 'Support dédié', 'Génération prioritaire'], missing: [], cta: 'Démarrer Praticien', style: 'outline' },
      ],
    },
    finalCta: {
      tag: 'Votre analyse est prête',
      title: 'Comprenez où vous en êtes.',
      title2: 'Avancez avec clarté.',
      sub: 'Prêt en 2 minutes. Gratuit pour commencer.',
      btn: 'Commencer mon analyse',
      note: 'Essentiel 9€/mois · Premium 19€/mois · Praticien 49€/mois',
    },
    footer: {
      copy: '2026 HexAstra · Intelligence personnelle par IA',
      links: [
        { href: '#how', label: 'Comment ça marche' },
        { href: '#analysis', label: 'Ce qu\'on analyse' },
        { href: '#pricing', label: 'Tarifs' },
        { href: '/login', label: 'Connexion' },
      ],
    },
  },
  en: {
    nav: { how: 'How it works', analysis: 'What we analyze', pricing: 'Pricing', signIn: 'Sign in', cta: 'Start my analysis' },
    hero: {
      eyebrow: 'Intelligent personal analysis',
      title1: 'Understand what you',
      title2: 'are going through.',
      title3: 'Discover what is opening ahead of you.',
      sub: 'An intelligent analysis of your life moment, based on your birth data.',
      cta: 'Start my analysis',
      trust: '2,400+ analyses done',
      score: '4.9 / 5',
    },
    how: {
      tag: 'How it works',
      title: 'Three steps to clarity',
      sub: 'No complex charts. No jargon. A clear and personal analysis.',
      steps: [
        { n: '01', title: 'Enter your birth data', desc: 'Date, time and place of birth. HexAstra maps your current energetic configuration.' },
        { n: '02', title: 'AI analyzes your dynamics', desc: 'Planetary transits, Human Design gates, numerological cycles — synthesized into one coherent view.' },
        { n: '03', title: 'Receive your analysis', desc: 'A clear reading on your love life, work, mood, health and life direction.' },
      ],
    },
    analysis: {
      tag: 'What we analyze',
      title: 'Your personal reading includes',
      sub: 'Five dimensions of your daily life, analyzed with precision.',
      items: [
        { icon: '♡', title: 'Love & Connection', desc: 'The relational dynamics at play and what this moment teaches you.' },
        { icon: '◈', title: 'Work & Money', desc: 'Your professional energy and current opportunities.' },
        { icon: '◉', title: 'Mood & Inner State', desc: 'Your emotional weather — not just how you feel, but why.' },
        { icon: '⊕', title: 'Health & Energy', desc: 'Physical and energetic rhythms. When to push, when to rest.' },
        { icon: '◎', title: 'Life Direction', desc: 'The bigger picture. Where you are in your longer cycle.' },
      ],
    },
    example: {
      tag: 'Example analysis',
      title: 'What an analysis feels like',
      sub: 'Clear. Personal. Useful.',
      name: 'Sarah M.',
      date: 'Today · Premium Analysis',
      badge: 'Full analysis',
      blocks: [
        { tag: 'Current situation', title: 'An invitation to slow down', txt: 'An inner movement invites you to slow down and clarify what truly deserves your attention right now.' },
        { tag: 'Understanding', title: 'A phase, not a blockage', txt: 'What you feel is not a blockage, but a phase of internal reorganization. Something is completing itself.' },
        { tag: 'Action', title: 'One decision, clearly', txt: 'Focus on one important decision. The energy available today is precise, not broad.' },
      ],
      ctaNote: 'Full analysis: 6 pages · PDF · Audio',
      ctaBtn: 'Get my analysis',
    },
    pricing: {
      tag: 'Pricing',
      title: 'Start free.',
      title2: 'Go deeper when you\'re ready.',
      sub: 'No commitment. Upgrade or cancel anytime.',
      popular: 'Most popular',
      note: 'No credit card required · Cancel anytime',
      plans: [
        { key: 'free', tag: 'Starter', name: 'Free', price: '0', per: '', desc: 'Discover what HexAstra can reveal.', features: ['1 short analysis per day', 'Text format only', 'Chat access', 'Save up to 3 analyses'], missing: ['PDF export', 'Audio version', 'Advanced themes'], cta: 'Start for free', style: 'ghost' },
        { key: 'essentiel', tag: 'Essential', name: 'Essential', price: '9', per: '/mo', desc: 'The fundamentals to move forward with clarity.', features: ['3 full analyses per day', 'Detailed analyses', 'PDF export', 'History of 30 analyses', 'Advanced themes'], missing: ['Audio version', 'Client usage'], cta: 'Start Essential', style: 'secondary' },
        { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mo', desc: 'Your full personal reading, as deep as you want.', features: ['Unlimited analyses', 'Complete personalized reading', '7-day reading arc', 'PDF export (6 pages)', 'Personal audio (7 min)', 'Advanced themes', 'Priority support'], missing: [], cta: 'Start Premium', style: 'primary', featured: true },
        { key: 'praticien', tag: 'Professional', name: 'Practitioner', price: '49', per: '/mo', desc: 'For coaches and therapists.', features: ['Full system access', 'Client session use', 'Professional usage rights', 'PDF + audio for every analysis', 'Export & share', 'Dedicated support', 'Priority generation'], missing: [], cta: 'Start Practitioner', style: 'outline' },
      ],
    },
    finalCta: {
      tag: 'Your analysis is ready',
      title: 'Understand where you are.',
      title2: 'Move forward with clarity.',
      sub: 'Takes 2 minutes. Free to start.',
      btn: 'Start my analysis',
      note: 'Essential €9/mo · Premium €19/mo · Practitioner €49/mo',
    },
    footer: {
      copy: '2026 HexAstra · Personal intelligence by AI',
      links: [
        { href: '#how', label: 'How it works' },
        { href: '#analysis', label: 'What we analyze' },
        { href: '#pricing', label: 'Pricing' },
        { href: '/login', label: 'Sign in' },
      ],
    },
  },
}

const PLAN_PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium:   'premium_monthly',
  praticien: 'praticien_monthly',
}

/* ── LOGO ─────────────────────────────── */
function HexLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,3 59,18 59,46 32,61 5,46 5,18"
        fill="none" stroke="var(--gold)" strokeWidth="1.8"/>
      <polygon points="32,13 51,23 51,43 32,53 13,43 13,23"
        fill="rgba(231,194,125,0.08)" stroke="var(--gold)" strokeWidth="1" opacity="0.55"/>
      <circle cx="32" cy="32" r="5" fill="var(--gold)" opacity="0.9"/>
      <line x1="32" y1="13" x2="32" y2="27" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
      <line x1="32" y1="37" x2="32" y2="51" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
      <line x1="13" y1="23" x2="27" y2="29" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
      <line x1="37" y1="35" x2="51" y2="43" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
      <line x1="51" y1="23" x2="37" y2="29" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
      <line x1="27" y1="35" x2="13" y2="43" stroke="var(--gold)" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  )
}

/* ── STARS ────────────────────────────── */
function Stars() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.4 + 0.3,
    d: Math.random() * 4 + 2,
    delay: Math.random() * 5,
  }))
  return (
    <svg className="stars-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {stars.map(s => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r}
          fill="var(--text)" opacity={0.18 + Math.random() * 0.25}
          style={{ animationDelay: `${s.delay}s`, animationDuration: `${s.d}s` }}
          className="star"
        />
      ))}
    </svg>
  )
}

/* ── NAV ──────────────────────────────── */
function Nav({ t, lang, setLang, onCta }: any) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`nav${scrolled ? ' nav-scrolled' : ''}`}>
      <a href="/" className="nav-logo">
        <HexLogo size={30} />
        <span className="nav-brand">HexAstra <em>Coach</em></span>
      </a>
      <div className="nav-links">
        <a href="#how" className="nav-link">{t.nav.how}</a>
        <a href="#analysis" className="nav-link">{t.nav.analysis}</a>
        <a href="#pricing" className="nav-link">{t.nav.pricing}</a>
        <a href="/login" className="nav-link">{t.nav.signIn}</a>
      </div>
      <div className="nav-right">
        <div className="lang-sw">
          <button onClick={() => setLang('fr')} className={`lang-btn${lang==='fr'?' lang-on':''}`}>FR</button>
          <button onClick={() => setLang('en')} className={`lang-btn${lang==='en'?' lang-on':''}`}>EN</button>
        </div>
        <button onClick={onCta} className="btn-gold nav-cta">{t.nav.cta}</button>
      </div>
    </nav>
  )
}

/* ── HERO ─────────────────────────────── */
function Hero({ t, onCta }: any) {
  return (
    <section className="hero">
      <div className="hero-stars"><Stars /></div>
      <div className="hero-glow" />
      <div className="hero-content">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {t.hero.eyebrow}
        </div>
        <h1 className="hero-h1">
          <span className="h1-line1">{t.hero.title1}</span>
          <span className="h1-line2">{t.hero.title2}</span>
          <span className="h1-line3">{t.hero.title3}</span>
        </h1>
        <p className="hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <button onClick={onCta} className="btn-gold btn-lg">
            {t.hero.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div className="hero-trust">
          <div className="trust-avatars">
            {['A','B','C','D','E'].map((l,i) => (
              <div key={i} className="av" style={{ marginLeft: i > 0 ? '-9px' : 0 }}>{l}</div>
            ))}
          </div>
          <span className="trust-text">{t.hero.trust} &middot; {t.hero.score}</span>
        </div>
      </div>
    </section>
  )
}

/* ── HOW ──────────────────────────────── */
function HowSection({ t }: any) {
  return (
    <section id="how" className="section">
      <div className="section-inner">
        <div className="stag"><span className="stag-line" />{t.how.tag}</div>
        <h2 className="section-h2">{t.how.title}</h2>
        <p className="section-sub">{t.how.sub}</p>
        <div className="steps">
          {t.how.steps.map((s: any, i: number) => (
            <div key={i} className="step">
              <div className="step-num">{s.n}</div>
              <div className="step-body">
                <div className="step-connector" />
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── ANALYSIS DOMAINS ─────────────────── */
function AnalysisSection({ t }: any) {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section id="analysis" className="section section-alt">
      <div className="section-inner">
        <div className="stag"><span className="stag-line" />{t.analysis.tag}</div>
        <h2 className="section-h2">{t.analysis.title}</h2>
        <p className="section-sub">{t.analysis.sub}</p>
        <div className="domains">
          {t.analysis.items.map((item: any, i: number) => (
            <div
              key={i}
              className={`domain-card${active===i?' domain-active':''}`}
              onClick={() => setActive(active===i ? null : i)}
            >
              <div className="domain-icon">{item.icon}</div>
              <div className="domain-title">{item.title}</div>
              <p className="domain-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── EXAMPLE ──────────────────────────── */
function ExampleSection({ t, onCta }: any) {
  return (
    <section className="section">
      <div className="section-inner">
        <div className="stag"><span className="stag-line" />{t.example.tag}</div>
        <h2 className="section-h2">{t.example.title}</h2>
        <p className="section-sub">{t.example.sub}</p>
        <div className="ex-card">
          <div className="ex-header">
            <div className="ex-hl">
              <div className="ex-av"><HexLogo size={32} /></div>
              <div>
                <div className="ex-name">{t.example.name}</div>
                <div className="ex-date">{t.example.date}</div>
              </div>
            </div>
            <div className="ex-badge">{t.example.badge}</div>
          </div>
          <div className="ex-body">
            {t.example.blocks.map((b: any, i: number) => (
              <div key={i}>
                <div className="ex-block">
                  <div className="ex-btag">{b.tag}</div>
                  <div className="ex-btitle">{b.title}</div>
                  <p className="ex-btxt">{b.txt}</p>
                </div>
                {i < t.example.blocks.length - 1 && <div className="ex-sep" />}
              </div>
            ))}
            <div className="ex-sep" />
            <div className="ex-footer">
              <span className="ex-note">{t.example.ctaNote}</span>
              <button onClick={onCta} className="btn-gold btn-sm">{t.example.ctaBtn}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PRICING ──────────────────────────── */
function PricingSection({ t, onCta }: any) {
  return (
    <section id="pricing" className="section section-alt">
      <div className="section-inner">
        <div className="stag"><span className="stag-line" />{t.pricing.tag}</div>
        <h2 className="section-h2">{t.pricing.title} <em className="em-gold">{t.pricing.title2}</em></h2>
        <p className="section-sub">{t.pricing.sub}</p>
        <div className="plans">
          {t.pricing.plans.map((plan: any, i: number) => (
            <div key={i} className={`plan${plan.featured?' plan-featured':''}`}>
              {plan.featured && <div className="plan-badge">{t.pricing.popular}</div>}
              <div className="plan-tag">{plan.tag}</div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span className="plan-amt">{plan.price}</span>
                <span className="plan-cur">€</span>
                {plan.per && <span className="plan-per">{plan.per}</span>}
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-line" />
              <ul className="plan-feats">
                {plan.features.map((f: string, j: number) => (
                  <li key={j} className="feat feat-on">
                    <span className="feat-ico">✓</span>{f}
                  </li>
                ))}
                {plan.missing.map((f: string, j: number) => (
                  <li key={j} className="feat feat-off">
                    <span className="feat-ico">–</span>{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onCta(plan.key)}
                className={
                  plan.style === 'primary' ? 'btn-gold plan-btn'
                  : plan.style === 'secondary' ? 'btn-rose plan-btn'
                  : plan.style === 'outline' ? 'btn-outline plan-btn'
                  : 'btn-ghost plan-btn'
                }
              >{plan.cta}</button>
            </div>
          ))}
        </div>
        <p className="pricing-note">{t.pricing.note}</p>
      </div>
    </section>
  )
}

/* ── FINAL CTA ────────────────────────── */
function FinalCta({ t, onCta }: any) {
  return (
    <section className="section final">
      <div className="final-stars"><Stars /></div>
      <div className="final-glow" />
      <div className="final-inner">
        <div className="stag stag-center"><span className="stag-line" />{t.finalCta.tag}</div>
        <h2 className="final-h2">
          {t.finalCta.title}<br />
          <em className="em-gold">{t.finalCta.title2}</em>
        </h2>
        <p className="final-sub">{t.finalCta.sub}</p>
        <button onClick={onCta} className="btn-gold btn-xl">
          {t.finalCta.btn}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p className="final-note">{t.finalCta.note}</p>
      </div>
    </section>
  )
}

/* ── FOOTER ───────────────────────────── */
function Footer({ t }: any) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <HexLogo size={22} />
          <span className="footer-brand">HexAstra Coach</span>
        </a>
        <p className="footer-copy">© {t.footer.copy}</p>
        <div className="footer-links">
          {t.footer.links.map((l: any, i: number) => (
            <a key={i} href={l.href} className="footer-link">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ── PAGE ─────────────────────────────── */
export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const t = translations[lang]
  const goChat  = useCallback(() => router.push('/chat'), [router])
  const goLogin = useCallback(() => router.push('/login'), [router])

  const handleUpgrade = useCallback(async (planKey: string) => {
    if (planKey === 'free') { goChat(); return }
    const priceKey = PLAN_PRICE_KEYS[planKey]
    if (!priceKey) { goLogin(); return }
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceKey }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else goLogin()
    } catch { goLogin() }
  }, [goLogin])

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <Nav t={t} lang={lang} setLang={setLang} onCta={goChat} />
        <Hero t={t} onCta={goChat} />
        <div className="divider" />
        <HowSection t={t} />
        <div className="divider" />
        <AnalysisSection t={t} />
        <div className="divider" />
        <ExampleSection t={t} onCta={goLogin} />
        <div className="divider" />
        <PricingSection t={t} onCta={handleUpgrade} />
        <FinalCta t={t} onCta={goChat} />
        <Footer t={t} />
      </div>
    </>
  )
}

/* ════════════════════════════════════════
   CSS — HEXASTRA · SPECS DOC PALETTE
   Fond #1C1412 · Or #E7C27D · Rose #CFA7A0
   Text #F5EFEA · Playfair Display + Inter
   ════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

:root {
  --bg:       #1C1412;
  --bg2:      #161010;
  --bg3:      #120e0c;
  --panel:    #231816;
  --panel2:   #2c1e1b;
  --rose:     #CFA7A0;
  --gold:     #E7C27D;
  --gold2:    #f0d090;
  --goldDim:  rgba(231,194,125,0.10);
  --goldLine: rgba(231,194,125,0.16);
  --roseDim:  rgba(207,167,160,0.12);
  --roseLine: rgba(207,167,160,0.22);
  --text:     #F5EFEA;
  --text2:    #C8BDB8;
  --text3:    #8A7D78;
  --f-title:  'Playfair Display', Georgia, serif;
  --f-body:   'Inter', system-ui, sans-serif;
  --f-mono:   'DM Mono', monospace;
  --expo:     cubic-bezier(0.16,1,0.3,1);
}

@keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes twinkle  { 0%,100%{opacity:.15} 50%{opacity:.55} }
@keyframes breathe  { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.12);opacity:.8} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes shimmer  { from{background-position:200% center} to{background-position:-200% center} }

/* ── BASE ─────────────────────────────── */
.root { background:var(--bg); color:var(--text); font-family:var(--f-body); overflow-x:hidden; min-height:100vh; }
.divider { height:1px; background:linear-gradient(90deg,transparent,var(--goldLine),transparent); margin:0 56px; }

/* ── STARS ────────────────────────────── */
.stars-svg { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.star { animation:twinkle var(--d,3s) ease-in-out infinite; }

/* ── NAV ──────────────────────────────── */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 56px;
  transition:background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
}
.nav-scrolled {
  background:rgba(28,20,18,0.88);
  backdrop-filter:blur(24px);
  -webkit-backdrop-filter:blur(24px);
  box-shadow:0 1px 0 var(--goldLine);
}
.nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
.nav-brand { font-family:var(--f-title); font-size:19px; font-weight:400; color:var(--text); letter-spacing:0.02em; }
.nav-brand em { font-style:italic; color:var(--gold); }
.nav-links { display:flex; align-items:center; gap:30px; }
.nav-link { font-family:var(--f-body); font-size:13.5px; font-weight:400; color:var(--text3); text-decoration:none; letter-spacing:0.02em; background:none; border:none; cursor:pointer; transition:color 0.2s; }
.nav-link:hover { color:var(--rose); }
.nav-right { display:flex; align-items:center; gap:14px; }
.lang-sw { display:flex; background:rgba(255,255,255,0.05); border:1px solid var(--goldLine); border-radius:6px; overflow:hidden; }
.lang-btn { padding:5px 11px; font-family:var(--f-mono); font-size:10px; letter-spacing:0.12em; color:var(--text3); background:transparent; border:none; cursor:pointer; transition:all 0.2s; }
.lang-on { background:var(--gold) !important; color:var(--bg) !important; font-weight:600; }
.nav-cta { font-size:13px !important; padding:9px 20px !important; }

/* ── BUTTONS ──────────────────────────── */
.btn-gold {
  padding:13px 28px; background:var(--gold); color:var(--bg);
  font-family:var(--f-body); font-size:14px; font-weight:600; letter-spacing:0.02em;
  border:none; border-radius:50px; cursor:pointer;
  display:inline-flex; align-items:center; gap:8px;
  box-shadow:0 6px 32px rgba(231,194,125,0.30);
  transition:background 0.22s, transform 0.18s, box-shadow 0.22s;
  white-space:nowrap; text-decoration:none;
}
.btn-gold:hover { background:var(--gold2); transform:translateY(-2px); box-shadow:0 12px 40px rgba(231,194,125,0.42); }
.btn-rose {
  padding:13px 28px; background:var(--roseDim); color:var(--rose);
  font-family:var(--f-body); font-size:14px; font-weight:500;
  border:1px solid var(--roseLine); border-radius:50px; cursor:pointer;
  transition:background 0.22s; white-space:nowrap;
}
.btn-rose:hover { background:rgba(207,167,160,0.2); }
.btn-ghost {
  padding:13px 26px; background:transparent; color:var(--text2);
  font-family:var(--f-body); font-size:14px; font-weight:400;
  border:1px solid rgba(245,239,234,0.16); border-radius:50px; cursor:pointer;
  transition:all 0.22s; white-space:nowrap; display:inline-flex; align-items:center;
}
.btn-ghost:hover { border-color:rgba(245,239,234,0.36); color:var(--text); }
.btn-outline {
  padding:13px 26px; background:transparent; color:var(--text2);
  font-family:var(--f-body); font-size:14px;
  border:1px solid var(--goldLine); border-radius:50px; cursor:pointer;
  transition:all 0.22s; white-space:nowrap;
}
.btn-outline:hover { border-color:var(--gold); color:var(--gold); }
.btn-sm  { font-size:13px !important; padding:9px 20px !important; }
.btn-lg  { font-size:15px !important; padding:15px 34px !important; }
.btn-xl  { font-size:16px !important; padding:17px 42px !important; }

/* ── HERO ─────────────────────────────── */
.hero {
  min-height:100vh; display:flex; align-items:center;
  padding:130px 56px 100px; position:relative; overflow:hidden;
}
.hero-stars { position:absolute; inset:0; overflow:hidden; }
.hero-glow {
  position:absolute; top:30%; left:50%; transform:translate(-50%,-50%);
  width:700px; height:500px; border-radius:50%;
  background:radial-gradient(ellipse, rgba(231,194,125,0.08) 0%, rgba(207,167,160,0.04) 40%, transparent 70%);
  pointer-events:none; animation:breathe 9s ease-in-out infinite;
}
.hero-content {
  position:relative; z-index:1; max-width:700px;
  display:flex; flex-direction:column; gap:28px;
  animation:fadeUp 0.8s var(--expo) both;
}
.eyebrow {
  display:flex; align-items:center; gap:9px;
  font-family:var(--f-mono); font-size:11px; letter-spacing:0.22em;
  text-transform:uppercase; color:var(--rose); opacity:0.9;
}
.eyebrow-dot { width:5px; height:5px; border-radius:50%; background:var(--rose); animation:pulse 2.4s ease infinite; flex-shrink:0; }
.hero-h1 {
  display:flex; flex-direction:column; gap:4px;
}
.h1-line1 {
  font-family:var(--f-title); font-size:clamp(42px,5.5vw,78px);
  font-weight:400; line-height:1.08; color:var(--text); letter-spacing:-0.01em;
}
.h1-line2 {
  font-family:var(--f-title); font-size:clamp(48px,6.5vw,92px);
  font-weight:700; font-style:italic; line-height:1.0; color:var(--gold); letter-spacing:-0.02em;
}
.h1-line3 {
  font-family:var(--f-title); font-size:clamp(22px,2.6vw,38px);
  font-weight:400; font-style:italic; line-height:1.3; color:var(--rose); letter-spacing:0em;
  margin-top:6px;
}
.hero-sub { font-family:var(--f-body); font-size:18px; font-weight:300; line-height:1.85; color:var(--text2); max-width:520px; }
.hero-actions { display:flex; gap:14px; flex-wrap:wrap; align-items:center; }
.hero-trust { display:flex; align-items:center; gap:12px; }
.trust-avatars { display:flex; align-items:center; }
.av {
  width:28px; height:28px; border-radius:50%;
  background:linear-gradient(135deg, var(--panel2), var(--rose));
  border:2px solid var(--bg); display:flex; align-items:center; justify-content:center;
  font-family:var(--f-mono); font-size:9px; font-weight:600; color:var(--text); flex-shrink:0;
}
.trust-text { font-family:var(--f-body); font-size:12.5px; color:var(--text3); }

/* ── SECTIONS ─────────────────────────── */
.section { padding:100px 56px; position:relative; }
.section-alt { background:rgba(0,0,0,0.18); }
.section-inner { max-width:1100px; margin:0 auto; }
.stag {
  display:flex; align-items:center; gap:10px;
  font-family:var(--f-mono); font-size:10px; letter-spacing:0.24em;
  text-transform:uppercase; color:var(--rose); margin-bottom:20px;
}
.stag-center { justify-content:center; }
.stag-line { width:26px; height:1px; background:var(--rose); opacity:0.5; flex-shrink:0; }
.section-h2 {
  font-family:var(--f-title); font-size:clamp(32px,4vw,54px);
  font-weight:500; color:var(--text); line-height:1.1; letter-spacing:-0.01em;
  margin-bottom:16px;
}
.section-sub { font-family:var(--f-body); font-size:17px; font-weight:300; color:var(--text2); line-height:1.85; max-width:520px; }
.em-gold { font-style:italic; color:var(--gold); }

/* ── HOW STEPS ────────────────────────── */
.steps { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin-top:56px; position:relative; }
.steps::before {
  content:''; position:absolute; top:28px; left:calc(16.6% + 24px); right:calc(16.6% + 24px);
  height:1px; background:linear-gradient(90deg, var(--goldLine), var(--goldLine));
  pointer-events:none;
}
.step { padding:0 28px 0 0; display:flex; flex-direction:column; gap:0; }
.step-num {
  font-family:var(--f-title); font-size:42px; font-weight:700; font-style:italic;
  color:var(--goldLine); line-height:1; margin-bottom:20px; position:relative; z-index:1;
  text-shadow:0 0 30px rgba(231,194,125,0.25);
}
.step-body { display:flex; flex-direction:column; gap:12px; }
.step-connector { display:none; }
.step-title { font-family:var(--f-title); font-size:20px; font-weight:500; color:var(--text); line-height:1.3; }
.step-desc { font-family:var(--f-body); font-size:14px; font-weight:300; color:var(--text2); line-height:1.8; }

/* ── DOMAINS ──────────────────────────── */
.domains { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:14px; margin-top:54px; }
.domain-card {
  padding:28px 24px;
  background:var(--panel);
  border:1px solid var(--goldLine);
  border-radius:20px;
  display:flex; flex-direction:column; gap:12px;
  cursor:pointer; position:relative; overflow:hidden;
  transition:background 0.28s, border-color 0.28s, transform 0.28s, box-shadow 0.28s;
}
.domain-card::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 80% 60% at 50% 0%, rgba(231,194,125,0.07), transparent);
  opacity:0; transition:opacity 0.3s;
}
.domain-card:hover, .domain-active {
  background:var(--panel2);
  border-color:rgba(231,194,125,0.35);
  transform:translateY(-5px);
  box-shadow:0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(231,194,125,0.08);
}
.domain-card:hover::before, .domain-active::before { opacity:1; }
.domain-icon { font-size:26px; color:var(--gold); opacity:0.75; line-height:1; }
.domain-title { font-family:var(--f-title); font-size:18px; font-weight:500; color:var(--text); letter-spacing:-0.01em; }
.domain-desc { font-family:var(--f-body); font-size:13.5px; font-weight:300; color:var(--text2); line-height:1.75; }

/* ── EXAMPLE ──────────────────────────── */
.ex-card {
  background:var(--panel);
  border:1px solid var(--goldLine);
  border-radius:24px; overflow:hidden;
  max-width:740px; margin:56px auto 0;
  box-shadow:0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(231,194,125,0.05) inset;
}
.ex-header {
  padding:22px 32px;
  background:linear-gradient(135deg, var(--panel2), var(--panel));
  border-bottom:1px solid var(--goldLine);
  display:flex; align-items:center; justify-content:space-between;
}
.ex-hl { display:flex; align-items:center; gap:14px; }
.ex-av {
  width:42px; height:42px; border-radius:50%;
  border:1px solid var(--goldLine);
  display:flex; align-items:center; justify-content:center;
  background:rgba(231,194,125,0.06);
}
.ex-name { font-family:var(--f-title); font-size:19px; font-weight:500; color:var(--text); }
.ex-date { font-family:var(--f-mono); font-size:10px; color:var(--text3); letter-spacing:0.1em; margin-top:3px; }
.ex-badge {
  font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em;
  color:var(--gold); background:var(--goldDim); border:1px solid var(--goldLine);
  border-radius:100px; padding:5px 14px; text-transform:uppercase;
}
.ex-body { padding:34px 32px; display:flex; flex-direction:column; gap:24px; }
.ex-block { display:flex; flex-direction:column; gap:8px; }
.ex-btag { font-family:var(--f-mono); font-size:9.5px; letter-spacing:0.2em; color:var(--rose); text-transform:uppercase; }
.ex-btitle { font-family:var(--f-title); font-size:22px; font-weight:500; color:var(--text); letter-spacing:-0.01em; }
.ex-btxt { font-family:var(--f-body); font-size:15px; font-weight:300; color:var(--text2); line-height:1.9; font-style:italic; }
.ex-sep { height:1px; background:var(--goldLine); }
.ex-footer { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; }
.ex-note { font-family:var(--f-body); font-size:13px; color:var(--text3); font-style:italic; }

/* ── PRICING ──────────────────────────── */
.plans { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-top:54px; align-items:start; }
.plan {
  background:var(--panel); border:1px solid var(--goldLine); border-radius:22px;
  padding:28px; position:relative; display:flex; flex-direction:column;
  transition:transform 0.26s, box-shadow 0.26s;
}
.plan:hover { transform:translateY(-4px); box-shadow:0 24px 60px rgba(0,0,0,0.4); }
.plan-featured {
  border-color:rgba(231,194,125,0.45);
  background:linear-gradient(160deg, var(--panel2) 0%, var(--panel) 100%);
  box-shadow:0 0 0 1px rgba(231,194,125,0.12), 0 30px 70px rgba(0,0,0,0.5);
}
.plan-badge {
  position:absolute; top:-13px; left:50%; transform:translateX(-50%);
  background:var(--gold); color:var(--bg);
  font-family:var(--f-mono); font-size:9px; letter-spacing:0.14em;
  padding:4px 16px; border-radius:100px; white-space:nowrap; font-weight:600;
}
.plan-tag { font-family:var(--f-mono); font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:var(--text3); margin-bottom:10px; }
.plan-name { font-family:var(--f-title); font-size:26px; font-weight:500; color:var(--text); letter-spacing:-0.01em; }
.plan-price { display:flex; align-items:baseline; gap:3px; margin:12px 0 7px; }
.plan-amt { font-family:var(--f-title); font-size:52px; font-weight:700; color:var(--text); line-height:1; }
.plan-cur { font-family:var(--f-mono); font-size:16px; color:var(--text2); align-self:flex-start; margin-top:10px; }
.plan-per { font-family:var(--f-mono); font-size:11px; color:var(--text3); letter-spacing:0.06em; }
.plan-desc { font-family:var(--f-body); font-size:13px; font-style:italic; color:var(--text2); line-height:1.65; margin-bottom:20px; }
.plan-line { height:1px; background:var(--goldLine); margin-bottom:18px; }
.plan-feats { list-style:none; display:flex; flex-direction:column; gap:9px; margin-bottom:24px; flex:1; padding:0; }
.feat { display:flex; align-items:flex-start; gap:9px; font-family:var(--f-body); font-size:13px; line-height:1.5; }
.feat-on { color:var(--text2); }
.feat-off { color:var(--text3); opacity:0.4; }
.feat-ico { font-size:12px; flex-shrink:0; margin-top:1px; }
.feat-on .feat-ico { color:var(--gold); }
.plan-btn { width:100%; }
.pricing-note { font-family:var(--f-mono); font-size:10px; color:var(--text3); text-align:center; letter-spacing:0.1em; margin-top:28px; }

/* ── FINAL CTA ────────────────────────── */
.final { text-align:center; overflow:hidden; padding:120px 56px; }
.final-stars { position:absolute; inset:0; overflow:hidden; }
.final-glow {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  width:800px; height:400px; border-radius:50%;
  background:radial-gradient(ellipse, rgba(231,194,125,0.09) 0%, rgba(207,167,160,0.05) 50%, transparent 70%);
  pointer-events:none;
}
.final-inner {
  position:relative; z-index:1;
  max-width:640px; margin:0 auto;
  display:flex; flex-direction:column; align-items:center; gap:24px;
}
.final-h2 {
  font-family:var(--f-title); font-size:clamp(36px,5vw,64px);
  font-weight:500; color:var(--text); line-height:1.08; letter-spacing:-0.01em;
}
.final-sub { font-family:var(--f-body); font-size:18px; font-weight:300; color:var(--text2); line-height:1.8; }
.final-note { font-family:var(--f-mono); font-size:10px; color:var(--text3); letter-spacing:0.1em; }

/* ── FOOTER ───────────────────────────── */
.footer { border-top:1px solid var(--goldLine); background:var(--bg3); padding:30px 56px; }
.footer-inner { max-width:1100px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; }
.footer-logo { display:flex; align-items:center; gap:9px; text-decoration:none; }
.footer-brand { font-family:var(--f-title); font-size:16px; font-weight:400; color:var(--text2); }
.footer-copy { font-family:var(--f-mono); font-size:10px; color:var(--text3); letter-spacing:0.1em; }
.footer-links { display:flex; gap:22px; }
.footer-link { font-family:var(--f-body); font-size:12.5px; color:var(--text3); text-decoration:none; transition:color 0.2s; }
.footer-link:hover { color:var(--rose); }

/* ── RESPONSIVE ───────────────────────── */
@media(max-width:1100px) {
  .plans { grid-template-columns:repeat(2,1fr); }
}
@media(max-width:900px) {
  .nav { padding:14px 20px; }
  .nav-links { display:none; }
  .hero { padding:100px 22px 70px; }
  .hero-content { gap:22px; }
  .section { padding:70px 22px; }
  .steps { grid-template-columns:1fr; gap:32px; }
  .steps::before { display:none; }
  .step { padding:0; }
  .domains { grid-template-columns:1fr 1fr; }
  .plans { grid-template-columns:1fr; }
  .divider { margin:0 22px; }
  .footer { padding:24px 22px; }
  .final { padding:80px 22px; }
}
@media(max-width:500px) {
  .domains { grid-template-columns:1fr; }
  .h1-line2 { font-size:clamp(42px,13vw,72px); }
}
`
