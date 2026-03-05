// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'
type Lang = 'fr' | 'en'

/* ══════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════ */
const T: Record<string, any> = {
  fr: {
    nav: {
      how: 'Comment ça marche', pricing: 'Tarifs', login: 'Connexion',
      cta: 'Commencer avec HexAstra',
    },
    hero: {
      title: 'Comprenez votre moment de vie.',
      sub: 'HexAstra est un coach intelligent qui vous aide à comprendre votre situation, vos cycles personnels et les décisions importantes de votre vie.',
      cta1: 'Commencer avec HexAstra',
      cta2: 'Voir comment ça fonctionne',
      trust: '2 400+ analyses réalisées · 4,9 / 5',
    },
    demo: {
      tag: 'Aperçu',
      title: 'Une conversation qui va au fond des choses',
      sub: 'Posez vos vraies questions. HexAstra analyse vos dynamiques personnelles et vous répond avec précision.',
      messages: [
        { role: 'user', text: 'Pourquoi je me sens bloqué dans mon travail en ce moment ?' },
        { role: 'ai', text: 'Certaines périodes demandent de ralentir plutôt que d\'agir. Votre configuration actuelle indique une phase de réorganisation interne — non pas un blocage, mais une transition. Regardons ce qui se passe dans votre cycle…', delay: 900 },
        { role: 'ai', text: 'Votre énergie professionnelle est actuellement orientée vers la clarification, pas l\'expansion. C\'est le moment idéal pour préciser ce que vous voulez vraiment, avant de vous lancer dans de nouvelles directions.', delay: 2200 },
      ],
      placeholder: 'Posez votre question à HexAstra…',
      suggestions: [
        'Pourquoi je me sens bloqué ?',
        'Est-ce le bon moment pour changer ?',
        'Pourquoi cette relation est compliquée ?',
        'Quelle direction me correspond ?',
      ],
    },
    how: {
      tag: 'Comment ça marche',
      title: 'Simple. Clair. Personnel.',
      steps: [
        { n: '1', title: 'Accédez au chat', desc: 'Ouvrez HexAstra et entrez vos informations de naissance. Date, heure, lieu — en moins de 30 secondes.' },
        { n: '2', title: 'Discutez avec HexAstra', desc: 'Posez vos vraies questions — sur votre situation, une décision, vos relations, votre énergie actuelle.' },
        { n: '3', title: 'Recevez une analyse claire', desc: 'HexAstra analyse vos cycles et dynamiques pour vous donner une lecture précise et personnalisée.' },
      ],
    },
    diff: {
      tag: 'Une approche différente',
      title: 'HexAstra ne donne pas des réponses générales.',
      body: 'Il analyse les dynamiques de votre vie en croisant plusieurs systèmes d\'observation des cycles humains. Le résultat est une lecture claire et personnalisée de votre situation actuelle.',
      points: [
        { icon: '◎', label: 'Analyse multi-dimensionnelle', desc: 'Cycles planétaires, Human Design, numérologie — croisés en une vision cohérente.' },
        { icon: '◈', label: 'Réponses personnalisées', desc: 'Chaque analyse est unique. Pas de réponses génériques ou de contenus pré-écrits.' },
        { icon: '⊕', label: 'Cinq domaines de vie', desc: 'Amour, travail, humeur, santé et direction — couverts dans chaque analyse.' },
        { icon: '◉', label: 'Utilisable immédiatement', desc: 'Des insights clairs, actionnables, pour aujourd\'hui et les prochains jours.' },
      ],
    },
    questions: {
      tag: 'Exemples de questions',
      title: 'Vous pouvez demander par exemple',
      items: [
        'Pourquoi certaines situations se répètent dans ma vie ?',
        'Est-ce le bon moment pour changer de travail ?',
        'Pourquoi cette relation est compliquée ?',
        'Pourquoi je manque d\'énergie en ce moment ?',
        'Quelle direction devient plus naturelle pour moi ?',
        'Comment traverser cette période de doute ?',
        'Que me dit cette phase de transition ?',
        'Pourquoi je n\'arrive pas à avancer sur ce projet ?',
      ],
    },
    trust: {
      tag: 'Notre approche',
      title: 'Une approche claire et respectueuse',
      body: 'HexAstra ne fait pas de prédictions absolues. L\'objectif est d\'apporter de la clarté, du recul et des pistes de compréhension pour mieux naviguer dans les cycles de la vie.',
      points: [
        'Pas de prédictions ni de certitudes absolues',
        'Un outil de compréhension, pas de dépendance',
        'Respectueux de votre intelligence et de votre libre arbitre',
        'Données personnelles protégées et jamais revendues',
      ],
    },
    pricing: {
      tag: 'Tarifs',
      title: 'Commencez gratuitement.',
      sub: 'Approfondissez quand vous êtes prêt. Sans engagement.',
      popular: 'Le plus populaire',
      note: 'Sans carte bancaire · Annulez à tout moment',
      plans: [
        {
          key: 'free', tag: 'Découverte', name: 'Gratuit', price: '0', per: '',
          desc: 'Découvrez HexAstra sans engagement.',
          features: ['1 analyse courte par jour', 'Accès au chat', 'Sauvegarde de 3 analyses'],
          missing: ['Export PDF', 'Version audio', 'Thèmes avancés'],
          cta: 'Commencer gratuitement', style: 'ghost',
        },
        {
          key: 'essentiel', tag: 'Essentiel', name: 'Essentiel', price: '9', per: '/mois',
          desc: 'Les fondamentaux pour avancer avec clarté.',
          features: ['3 analyses complètes par jour', 'Analyses détaillées', 'Export PDF', 'Historique 30 analyses', 'Thèmes avancés'],
          missing: ['Version audio', 'Usage client'],
          cta: 'Démarrer Essentiel', style: 'secondary',
        },
        {
          key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mois',
          desc: 'Votre analyse complète, aussi profonde que vous le souhaitez.',
          features: ['Analyses illimitées', 'Analyse complète 6 pages', 'Arc de lecture 7 jours', 'Export PDF', 'Audio personnel 7 min', 'Support prioritaire'],
          missing: [],
          cta: 'Démarrer Premium', style: 'primary', featured: true,
        },
        {
          key: 'praticien', tag: 'Professionnel', name: 'Praticien', price: '49', per: '/mois',
          desc: 'Pour les coachs et thérapeutes.',
          features: ['Accès complet', 'Usage en séance client', 'Droits professionnels', 'PDF + audio', 'Support dédié'],
          missing: [],
          cta: 'Démarrer Praticien', style: 'outline',
        },
      ],
    },
    final: {
      tag: 'Prêt à commencer ?',
      title: 'Commencer votre analyse',
      sub: 'Une conversation avec HexAstra peut vous aider à voir votre situation avec plus de clarté.',
      btn: 'Commencer maintenant',
      note: 'Gratuit pour commencer · Essentiel 9€/mois · Premium 19€/mois',
    },
    footer: {
      copy: '2026 HexAstra · Intelligence personnelle par IA',
      links: [
        { href: '#how', label: 'Comment ça marche' },
        { href: '#pricing', label: 'Tarifs' },
        { href: '/login', label: 'Connexion' },
      ],
    },
  },
  en: {
    nav: {
      how: 'How it works', pricing: 'Pricing', login: 'Sign in',
      cta: 'Start with HexAstra',
    },
    hero: {
      title: 'Understand your life moment.',
      sub: 'HexAstra is an intelligent coach that helps you understand your situation, your personal cycles and the important decisions of your life.',
      cta1: 'Start with HexAstra',
      cta2: 'See how it works',
      trust: '2,400+ analyses done · 4.9 / 5',
    },
    demo: {
      tag: 'Preview',
      title: 'A conversation that goes to the heart of things',
      sub: 'Ask your real questions. HexAstra analyzes your personal dynamics and responds with precision.',
      messages: [
        { role: 'user', text: 'Why do I feel stuck in my work right now?' },
        { role: 'ai', text: 'Some periods call for slowing down rather than acting. Your current configuration points to an internal reorganization phase — not a blockage, but a transition. Let\'s look at what\'s happening in your cycle…', delay: 900 },
        { role: 'ai', text: 'Your professional energy is currently oriented toward clarification, not expansion. This is the ideal time to clarify what you truly want before launching into new directions.', delay: 2200 },
      ],
      placeholder: 'Ask your question to HexAstra…',
      suggestions: [
        'Why do I feel stuck?',
        'Is this a good time to change?',
        'Why is this relationship complicated?',
        'What direction suits me?',
      ],
    },
    how: {
      tag: 'How it works',
      title: 'Simple. Clear. Personal.',
      steps: [
        { n: '1', title: 'Access the chat', desc: 'Open HexAstra and enter your birth information. Date, time, place — in under 30 seconds.' },
        { n: '2', title: 'Talk with HexAstra', desc: 'Ask your real questions — about your situation, a decision, your relationships, your current energy.' },
        { n: '3', title: 'Receive a clear analysis', desc: 'HexAstra analyzes your cycles and dynamics to give you a precise and personalized reading.' },
      ],
    },
    diff: {
      tag: 'A different approach',
      title: 'HexAstra doesn\'t give generic answers.',
      body: 'It analyzes the dynamics of your life by crossing several systems of observation of human cycles. The result is a clear and personalized reading of your current situation.',
      points: [
        { icon: '◎', label: 'Multi-dimensional analysis', desc: 'Planetary cycles, Human Design, numerology — crossed into one coherent vision.' },
        { icon: '◈', label: 'Personalized responses', desc: 'Every analysis is unique. No generic responses or pre-written content.' },
        { icon: '⊕', label: 'Five life domains', desc: 'Love, work, mood, health and direction — covered in every analysis.' },
        { icon: '◉', label: 'Immediately actionable', desc: 'Clear, actionable insights for today and the coming days.' },
      ],
    },
    questions: {
      tag: 'Example questions',
      title: 'You can ask for example',
      items: [
        'Why do certain situations keep repeating in my life?',
        'Is this the right time to change jobs?',
        'Why is this relationship so complicated?',
        'Why do I lack energy right now?',
        'What direction is becoming more natural for me?',
        'How do I navigate this period of doubt?',
        'What is this transition phase telling me?',
        'Why can\'t I move forward on this project?',
      ],
    },
    trust: {
      tag: 'Our approach',
      title: 'A clear and respectful approach',
      body: 'HexAstra does not make absolute predictions. The goal is to bring clarity, perspective and understanding to better navigate life\'s cycles.',
      points: [
        'No absolute predictions or certainties',
        'A tool for understanding, not dependency',
        'Respectful of your intelligence and free will',
        'Personal data protected and never sold',
      ],
    },
    pricing: {
      tag: 'Pricing',
      title: 'Start free.',
      sub: 'Go deeper when you\'re ready. No commitment.',
      popular: 'Most popular',
      note: 'No credit card · Cancel anytime',
      plans: [
        {
          key: 'free', tag: 'Starter', name: 'Free', price: '0', per: '',
          desc: 'Discover HexAstra with no commitment.',
          features: ['1 short analysis per day', 'Chat access', 'Save up to 3 analyses'],
          missing: ['PDF export', 'Audio version', 'Advanced themes'],
          cta: 'Start for free', style: 'ghost',
        },
        {
          key: 'essentiel', tag: 'Essential', name: 'Essential', price: '9', per: '/mo',
          desc: 'The fundamentals to move forward with clarity.',
          features: ['3 full analyses per day', 'Detailed analyses', 'PDF export', '30 analysis history', 'Advanced themes'],
          missing: ['Audio version', 'Client usage'],
          cta: 'Start Essential', style: 'secondary',
        },
        {
          key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mo',
          desc: 'Your full personal reading, as deep as you want.',
          features: ['Unlimited analyses', 'Complete 6-page analysis', '7-day reading arc', 'PDF export', 'Personal audio 7 min', 'Priority support'],
          missing: [],
          cta: 'Start Premium', style: 'primary', featured: true,
        },
        {
          key: 'praticien', tag: 'Professional', name: 'Practitioner', price: '49', per: '/mo',
          desc: 'For coaches and therapists.',
          features: ['Full system access', 'Client session use', 'Professional rights', 'PDF + audio', 'Dedicated support'],
          missing: [],
          cta: 'Start Practitioner', style: 'outline',
        },
      ],
    },
    final: {
      tag: 'Ready to start?',
      title: 'Begin your analysis',
      sub: 'A conversation with HexAstra can help you see your situation with greater clarity.',
      btn: 'Start now',
      note: 'Free to start · Essential €9/mo · Premium €19/mo',
    },
    footer: {
      copy: '2026 HexAstra · Personal intelligence by AI',
      links: [
        { href: '#how', label: 'How it works' },
        { href: '#pricing', label: 'Pricing' },
        { href: '/login', label: 'Sign in' },
      ],
    },
  },
}

const PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium:   'premium_monthly',
  praticien: 'praticien_monthly',
}

/* ══════════════════════════════════════════
   LOGO
══════════════════════════════════════════ */
function HexLogo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,3 59,18 59,46 32,61 5,46 5,18"
        fill="none" stroke="var(--gold)" strokeWidth="1.8"/>
      <polygon points="32,13 51,23 51,43 32,53 13,43 13,23"
        fill="rgba(231,194,125,0.07)" stroke="var(--gold)" strokeWidth="1" opacity="0.5"/>
      <circle cx="32" cy="32" r="4.5" fill="var(--gold)" opacity="0.9"/>
      <line x1="32" y1="13" x2="32" y2="27" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
      <line x1="32" y1="37" x2="32" y2="51" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
      <line x1="13" y1="23" x2="27" y2="29" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
      <line x1="37" y1="35" x2="51" y2="43" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
      <line x1="51" y1="23" x2="37" y2="29" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
      <line x1="27" y1="35" x2="13" y2="43" stroke="var(--gold)" strokeWidth="1.2" opacity="0.55"/>
    </svg>
  )
}

/* ══════════════════════════════════════════
   STARS CANVAS
══════════════════════════════════════════ */
function StarField({ density = 70 }: { density?: number }) {
  const stars = Array.from({ length: density }, (_, i) => ({
    id: i,
    cx: `${(Math.random() * 100).toFixed(2)}%`,
    cy: `${(Math.random() * 100).toFixed(2)}%`,
    r:  (Math.random() * 1.3 + 0.3).toFixed(2),
    op: (0.1 + Math.random() * 0.3).toFixed(2),
    dur:`${(2.5 + Math.random() * 4).toFixed(1)}s`,
    del:`${(Math.random() * 6).toFixed(1)}s`,
  }))
  return (
    <svg className="starfield" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {stars.map(s => (
        <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r}
          fill="#F5EFEA" opacity={s.op}
          style={{ animation: `twinkle ${s.dur} ${s.del} ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav({ t, lang, setLang, onCta }: any) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`nav${solid ? ' nav-solid' : ''}`}>
      <a href="/" className="nav-logo">
        <HexLogo size={28} />
        <span className="nav-name">HexAstra <em>Coach</em></span>
      </a>
      <div className="nav-center">
        <a href="#how" className="nl">{t.nav.how}</a>
        <a href="#pricing" className="nl">{t.nav.pricing}</a>
        <a href="/login" className="nl">{t.nav.login}</a>
      </div>
      <div className="nav-right">
        <div className="lang-pill">
          <button onClick={() => setLang('fr')} className={`lb${lang==='fr'?' la':''}`}>FR</button>
          <button onClick={() => setLang('en')} className={`lb${lang==='en'?' la':''}`}>EN</button>
        </div>
        <button onClick={onCta} className="btn-gold nav-cta-btn">{t.nav.cta}</button>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
function Hero({ t, onCta }: any) {
  return (
    <section className="hero">
      <div className="hero-bg"><StarField density={90} /></div>
      <div className="hero-glow-1" />
      <div className="hero-glow-2" />
      <div className="hero-inner">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="eydot" />
            Intelligence personnelle par IA
          </div>
          <h1 className="hero-h1">{t.hero.title}</h1>
          <p className="hero-p">{t.hero.sub}</p>
          <div className="hero-btns">
            <button onClick={onCta} className="btn-gold btn-lg">
              {t.hero.cta1}
              <ArrowR />
            </button>
            <a href="#how" className="btn-ghost btn-lg">{t.hero.cta2}</a>
          </div>
          <p className="hero-trust">{t.hero.trust}</p>
        </div>
        <div className="hero-preview">
          <MiniChat t={t} onCta={onCta} />
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   MINI CHAT (hero right side)
══════════════════════════════════════════ */
function MiniChat({ t, onCta }: any) {
  const [step, setStep] = useState(0)
  const msgs = t.demo.messages
  useEffect(() => {
    if (step >= msgs.length) return
    const delay = step === 0 ? 600 : msgs[step].delay
    const timer = setTimeout(() => setStep(s => s + 1), delay)
    return () => clearTimeout(timer)
  }, [step, msgs])

  return (
    <div className="mini-chat">
      <div className="mc-header">
        <div className="mc-dot mc-r" /><div className="mc-dot mc-y" /><div className="mc-dot mc-g" />
        <div className="mc-title"><HexLogo size={16} /> HexAstra Coach</div>
      </div>
      <div className="mc-body">
        {msgs.slice(0, step).map((m: any, i: number) => (
          <div key={i} className={`mc-msg ${m.role === 'user' ? 'mc-user' : 'mc-ai'}`}>
            {m.role === 'ai' && <div className="mc-avatar"><HexLogo size={18} /></div>}
            <div className="mc-bubble">{m.text}</div>
          </div>
        ))}
        {step < msgs.length && step > 0 && (
          <div className="mc-msg mc-ai">
            <div className="mc-avatar"><HexLogo size={18} /></div>
            <div className="mc-bubble mc-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="mc-footer">
        <div className="mc-input" onClick={onCta}>{t.demo.placeholder}</div>
        <button className="mc-send" onClick={onCta}><ArrowR /></button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   DEMO SECTION (standalone)
══════════════════════════════════════════ */
function DemoSection({ t, onCta }: any) {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="section">
      <div className="si">
        <div className="stag"><span className="sl" />{t.demo.tag}</div>
        <h2 className="sh2">{t.demo.title}</h2>
        <p className="ssub">{t.demo.sub}</p>
        <div className="demo-grid">
          <div className="demo-chat-full">
            <div className="dc-header">
              <div className="mc-dot mc-r"/><div className="mc-dot mc-y"/><div className="mc-dot mc-g"/>
              <div className="mc-title"><HexLogo size={16}/> HexAstra Coach</div>
            </div>
            <div className="dc-body">
              {t.demo.messages.map((m: any, i: number) => (
                <div key={i} className={`mc-msg ${m.role==='user'?'mc-user':'mc-ai'}`}>
                  {m.role==='ai' && <div className="mc-avatar"><HexLogo size={18}/></div>}
                  <div className="mc-bubble">{m.text}</div>
                </div>
              ))}
            </div>
            <div className="dc-footer">
              <div className="dc-suggestions">
                {t.demo.suggestions.map((s: string, i: number) => (
                  <button key={i} onClick={onCta} className="dc-sug">{s}</button>
                ))}
              </div>
              <div className="dc-input-row">
                <div className="mc-input" onClick={onCta}>{t.demo.placeholder}</div>
                <button className="mc-send" onClick={onCta}><ArrowR /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   HOW IT WORKS
══════════════════════════════════════════ */
function HowSection({ t }: any) {
  return (
    <section id="how" className="section section-alt">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.how.tag}</div>
        <h2 className="sh2">{t.how.title}</h2>
        <div className="how-steps">
          {t.how.steps.map((s: any, i: number) => (
            <div key={i} className="how-step">
              <div className="hs-num">{s.n}</div>
              <div className="hs-line" />
              <h3 className="hs-title">{s.title}</h3>
              <p className="hs-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   DIFFÉRENT
══════════════════════════════════════════ */
function DiffSection({ t }: any) {
  return (
    <section className="section">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.diff.tag}</div>
        <div className="diff-grid">
          <div className="diff-left">
            <h2 className="sh2">{t.diff.title}</h2>
            <p className="ssub">{t.diff.body}</p>
          </div>
          <div className="diff-points">
            {t.diff.points.map((p: any, i: number) => (
              <div key={i} className="diff-point">
                <div className="dp-icon">{p.icon}</div>
                <div>
                  <div className="dp-label">{p.label}</div>
                  <p className="dp-desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   QUESTIONS
══════════════════════════════════════════ */
function QuestionsSection({ t, onCta }: any) {
  return (
    <section className="section section-alt">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.questions.tag}</div>
        <h2 className="sh2">{t.questions.title}</h2>
        <div className="q-grid">
          {t.questions.items.map((q: string, i: number) => (
            <button key={i} className="q-item" onClick={onCta}>
              <span className="q-arrow">→</span>
              <span className="q-text">{q}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   TRUST / APPROCHE
══════════════════════════════════════════ */
function TrustSection({ t }: any) {
  return (
    <section className="section">
      <div className="si trust-si">
        <div className="stag stag-center"><span className="sl"/>{t.trust.tag}</div>
        <h2 className="sh2 tc">{t.trust.title}</h2>
        <p className="ssub tc mx">{t.trust.body}</p>
        <div className="trust-points">
          {t.trust.points.map((p: string, i: number) => (
            <div key={i} className="trust-point">
              <span className="tp-check">✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   PRICING
══════════════════════════════════════════ */
function PricingSection({ t, onCta }: any) {
  return (
    <section id="pricing" className="section section-alt">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.pricing.tag}</div>
        <h2 className="sh2">{t.pricing.title} <em className="egold">{t.pricing.sub.split('.')[0]}.</em></h2>
        <p className="ssub">{t.pricing.sub.split('. ').slice(1).join('. ')}</p>
        <div className="plans-grid">
          {t.pricing.plans.map((p: any, i: number) => (
            <div key={i} className={`plan-card${p.featured?' plan-feat':''}`}>
              {p.featured && <div className="plan-pop">{t.pricing.popular}</div>}
              <div className="plan-tag">{p.tag}</div>
              <div className="plan-name">{p.name}</div>
              <div className="plan-price-row">
                <span className="plan-amt">{p.price}</span>
                <span className="plan-eur">€</span>
                {p.per && <span className="plan-per">{p.per}</span>}
              </div>
              <p className="plan-desc">{p.desc}</p>
              <div className="plan-sep" />
              <ul className="plan-feats">
                {p.features.map((f: string, j: number) => (
                  <li key={j} className="pf pf-on"><span>✓</span>{f}</li>
                ))}
                {p.missing.map((f: string, j: number) => (
                  <li key={j} className="pf pf-off"><span>–</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => onCta(p.key)}
                className={`plan-btn ${
                  p.style==='primary'?'btn-gold':
                  p.style==='secondary'?'btn-rose':
                  p.style==='outline'?'btn-outline':'btn-ghost'
                }`}>{p.cta}</button>
            </div>
          ))}
        </div>
        <p className="price-note">{t.pricing.note}</p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════ */
function FinalSection({ t, onCta }: any) {
  return (
    <section className="final-section">
      <div className="final-bg"><StarField density={60} /></div>
      <div className="final-glow" />
      <div className="final-inner">
        <div className="stag stag-center"><span className="sl"/>{t.final.tag}</div>
        <h2 className="final-h2">{t.final.title}</h2>
        <p className="final-p">{t.final.sub}</p>
        <button onClick={onCta} className="btn-gold btn-xl">
          {t.final.btn} <ArrowR />
        </button>
        <p className="final-note">{t.final.note}</p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function Footer({ t }: any) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <HexLogo size={20}/>
          <span className="footer-name">HexAstra Coach</span>
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

/* ── micro icons ── */
function ArrowR() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

/* ══════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════ */
export default function Page() {
  const router  = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const t       = T[lang]
  const goChat  = useCallback(() => router.push('/chat'),  [router])
  const goLogin = useCallback(() => router.push('/login'), [router])

  const handleUpgrade = useCallback(async (planKey: string) => {
    if (planKey === 'free') { goChat(); return }
    const priceKey = PRICE_KEYS[planKey]
    if (!priceKey) { goLogin(); return }
    try {
      const res  = await fetch('/api/stripe/checkout', {
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

        {/* 1 — Hero + mini chat */}
        <Hero t={t} onCta={goChat} />

        <div className="divider" />

        {/* 2 — Démo chat complète */}
        <DemoSection t={t} onCta={goChat} />

        <div className="divider" />

        {/* 3 — Comment ça marche */}
        <HowSection t={t} />

        <div className="divider" />

        {/* 4 — Pourquoi différent */}
        <DiffSection t={t} />

        <div className="divider" />

        {/* 5 — Exemples de questions */}
        <QuestionsSection t={t} onCta={goChat} />

        <div className="divider" />

        {/* 6 — Approche / confiance */}
        <TrustSection t={t} />

        <div className="divider" />

        {/* 7 — Pricing */}
        <PricingSection t={t} onCta={handleUpgrade} />

        {/* 8 — Final CTA */}
        <FinalSection t={t} onCta={goChat} />

        <Footer t={t} />
      </div>
    </>
  )
}

/* ══════════════════════════════════════════
   CSS
   Palette specs doc :
   #1C1412 · #E7C27D · #CFA7A0 · #F5EFEA
   Playfair Display + Inter
══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

:root{
  --bg:      #1C1412;
  --bg2:     #161010;
  --bg3:     #120e0c;
  --panel:   #231816;
  --panel2:  #2c1e1b;
  --gold:    #E7C27D;
  --gold2:   #f0d090;
  --goldD:   rgba(231,194,125,0.10);
  --goldL:   rgba(231,194,125,0.16);
  --rose:    #CFA7A0;
  --roseD:   rgba(207,167,160,0.12);
  --roseL:   rgba(207,167,160,0.22);
  --text:    #F5EFEA;
  --text2:   #C4B8B3;
  --text3:   #857872;
  --f-t: 'Playfair Display', Georgia, serif;
  --f-b: 'Inter', system-ui, sans-serif;
  --f-m: 'DM Mono', monospace;
  --expo: cubic-bezier(0.16,1,0.3,1);
}

@keyframes fadeUp  {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes twinkle {0%,100%{opacity:.12}50%{opacity:.48}}
@keyframes breathe {0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.4}50%{transform:translate(-50%,-50%) scale(1.14);opacity:.75}}
@keyframes pulse   {0%,100%{opacity:1}50%{opacity:.2}}
@keyframes dots    {0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

/* BASE */
.root{background:var(--bg);color:var(--text);font-family:var(--f-b);overflow-x:hidden;min-height:100vh}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--goldL),transparent);margin:0 56px}

/* STARS */
.starfield{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:18px 56px;transition:all .35s}
.nav-solid{background:rgba(28,20,18,.9);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 1px 0 var(--goldL)}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-name{font-family:var(--f-t);font-size:18px;font-weight:400;color:var(--text)}
.nav-name em{font-style:italic;color:var(--gold)}
.nav-center{display:flex;gap:28px}
.nl{font-size:13.5px;color:var(--text3);text-decoration:none;transition:color .2s;letter-spacing:.02em}
.nl:hover{color:var(--rose)}
.nav-right{display:flex;align-items:center;gap:12px}
.lang-pill{display:flex;background:rgba(255,255,255,.05);border:1px solid var(--goldL);border-radius:6px;overflow:hidden}
.lb{padding:5px 11px;font-family:var(--f-m);font-size:10px;letter-spacing:.12em;color:var(--text3);background:transparent;border:none;cursor:pointer;transition:all .2s}
.la{background:var(--gold)!important;color:var(--bg)!important;font-weight:600}
.nav-cta-btn{font-size:12.5px!important;padding:9px 18px!important;border-radius:50px!important}

/* BUTTONS */
.btn-gold{padding:13px 28px;background:var(--gold);color:var(--bg);font-family:var(--f-b);font-size:14px;font-weight:600;letter-spacing:.02em;border:none;border-radius:50px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 6px 30px rgba(231,194,125,.28);transition:background .22s,transform .18s,box-shadow .22s;white-space:nowrap;text-decoration:none}
.btn-gold:hover{background:var(--gold2);transform:translateY(-2px);box-shadow:0 12px 42px rgba(231,194,125,.4)}
.btn-rose{padding:13px 28px;background:var(--roseD);color:var(--rose);font-family:var(--f-b);font-size:14px;font-weight:500;border:1px solid var(--roseL);border-radius:50px;cursor:pointer;transition:background .2s;white-space:nowrap}
.btn-rose:hover{background:rgba(207,167,160,.22)}
.btn-ghost{padding:13px 26px;background:transparent;color:var(--text2);font-family:var(--f-b);font-size:14px;font-weight:400;border:1px solid rgba(245,239,234,.18);border-radius:50px;cursor:pointer;transition:all .22s;white-space:nowrap;display:inline-flex;align-items:center;gap:8px}
.btn-ghost:hover{border-color:rgba(245,239,234,.38);color:var(--text)}
.btn-outline{padding:13px 26px;background:transparent;color:var(--text2);font-family:var(--f-b);font-size:14px;border:1px solid var(--goldL);border-radius:50px;cursor:pointer;transition:all .22s;white-space:nowrap}
.btn-outline:hover{border-color:var(--gold);color:var(--gold)}
.btn-lg{font-size:15px!important;padding:15px 32px!important}
.btn-xl{font-size:16px!important;padding:17px 44px!important}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:130px 56px 100px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;overflow:hidden}
.hero-glow-1{position:absolute;top:35%;left:30%;transform:translate(-50%,-50%);width:600px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(231,194,125,.07),transparent 65%);pointer-events:none;animation:breathe 10s ease-in-out infinite}
.hero-glow-2{position:absolute;top:60%;right:5%;width:400px;height:400px;border-radius:50%;background:radial-gradient(ellipse,rgba(207,167,160,.05),transparent 70%);pointer-events:none}
.hero-inner{position:relative;z-index:1;max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
.hero-text{display:flex;flex-direction:column;gap:26px;animation:fadeUp .8s var(--expo) both}
.eyebrow{display:flex;align-items:center;gap:9px;font-family:var(--f-m);font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--rose);opacity:.9}
.eydot{width:5px;height:5px;border-radius:50%;background:var(--rose);animation:pulse 2.5s ease infinite;flex-shrink:0}
.hero-h1{font-family:var(--f-t);font-size:clamp(38px,4.8vw,68px);font-weight:700;font-style:italic;line-height:1.08;color:var(--text);letter-spacing:-.02em}
.hero-p{font-family:var(--f-b);font-size:17.5px;font-weight:300;line-height:1.88;color:var(--text2);max-width:480px}
.hero-btns{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.hero-trust{font-family:var(--f-m);font-size:10.5px;color:var(--text3);letter-spacing:.12em}
.hero-preview{animation:fadeUp .8s .2s var(--expo) both}

/* MINI CHAT */
.mini-chat{background:var(--panel);border:1px solid var(--goldL);border-radius:20px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.5),0 0 0 1px rgba(231,194,125,.04) inset}
.mc-header{display:flex;align-items:center;gap:7px;padding:13px 18px;background:var(--panel2);border-bottom:1px solid var(--goldL)}
.mc-dot{width:10px;height:10px;border-radius:50%}
.mc-r{background:#ff5f56}.mc-y{background:#febc2e}.mc-g{background:#28c840}
.mc-title{display:flex;align-items:center;gap:7px;font-family:var(--f-m);font-size:11px;color:var(--text3);letter-spacing:.08em;margin-left:6px}
.mc-body{padding:18px;display:flex;flex-direction:column;gap:13px;min-height:220px}
.mc-msg{display:flex;gap:9px;align-items:flex-start}
.mc-user{flex-direction:row-reverse}
.mc-avatar{width:26px;height:26px;border-radius:50%;border:1px solid var(--goldL);display:flex;align-items:center;justify-content:center;background:var(--goldD);flex-shrink:0}
.mc-bubble{font-family:var(--f-b);font-size:13px;font-weight:300;line-height:1.7;padding:10px 14px;border-radius:14px;max-width:85%}
.mc-user .mc-bubble{background:var(--goldD);border:1px solid var(--goldL);color:var(--text);border-radius:14px 14px 4px 14px}
.mc-ai .mc-bubble{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:var(--text2);border-radius:14px 14px 14px 4px}
.mc-typing{display:flex;align-items:center;gap:5px;padding:12px 16px!important}
.mc-typing span{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:dots 1.2s ease infinite}
.mc-typing span:nth-child(2){animation-delay:.2s}
.mc-typing span:nth-child(3){animation-delay:.4s}
.mc-footer{padding:12px 14px;border-top:1px solid var(--goldL);display:flex;gap:9px;align-items:center}
.mc-input{flex:1;font-family:var(--f-b);font-size:13px;color:var(--text3);padding:9px 14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:50px;cursor:text;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mc-send{width:34px;height:34px;border-radius:50%;background:var(--gold);color:var(--bg);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s}
.mc-send:hover{background:var(--gold2)}

/* SECTIONS */
.section{padding:96px 56px;position:relative}
.section-alt{background:rgba(0,0,0,.2)}
.si{max-width:1100px;margin:0 auto}
.stag{display:flex;align-items:center;gap:10px;font-family:var(--f-m);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--rose);margin-bottom:20px}
.stag-center{justify-content:center}
.sl{width:26px;height:1px;background:var(--rose);opacity:.5;flex-shrink:0}
.sh2{font-family:var(--f-t);font-size:clamp(30px,3.8vw,52px);font-weight:500;color:var(--text);line-height:1.1;letter-spacing:-.015em;margin-bottom:16px}
.ssub{font-family:var(--f-b);font-size:16.5px;font-weight:300;color:var(--text2);line-height:1.88;max-width:540px}
.egold{font-style:italic;color:var(--gold)}
.tc{text-align:center}
.mx{margin-left:auto;margin-right:auto}

/* DEMO SECTION */
.demo-grid{margin-top:52px}
.demo-chat-full{background:var(--panel);border:1px solid var(--goldL);border-radius:22px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.5)}
.dc-header{display:flex;align-items:center;gap:7px;padding:14px 20px;background:var(--panel2);border-bottom:1px solid var(--goldL)}
.dc-body{padding:28px 28px 20px;display:flex;flex-direction:column;gap:16px}
.dc-footer{border-top:1px solid var(--goldL);padding:16px 20px;display:flex;flex-direction:column;gap:12px}
.dc-suggestions{display:flex;flex-wrap:wrap;gap:8px}
.dc-sug{font-family:var(--f-b);font-size:12.5px;color:var(--rose);background:var(--roseD);border:1px solid var(--roseL);border-radius:50px;padding:6px 16px;cursor:pointer;transition:background .2s,border-color .2s;white-space:nowrap}
.dc-sug:hover{background:rgba(207,167,160,.22);border-color:rgba(207,167,160,.38)}
.dc-input-row{display:flex;gap:9px;align-items:center}

/* HOW */
.how-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:52px;position:relative}
.how-step{padding:0 32px 0 0;display:flex;flex-direction:column;gap:16px}
.hs-num{font-family:var(--f-t);font-size:72px;font-weight:700;font-style:italic;color:var(--goldL);line-height:1;position:relative}
.hs-num::after{content:'';position:absolute;bottom:-14px;left:0;width:100%;height:1px;background:linear-gradient(90deg,var(--goldL),transparent)}
.hs-line{height:1px;background:linear-gradient(90deg,var(--goldL),transparent);margin-bottom:6px}
.hs-title{font-family:var(--f-t);font-size:21px;font-weight:500;color:var(--text);letter-spacing:-.01em}
.hs-desc{font-family:var(--f-b);font-size:14px;font-weight:300;color:var(--text2);line-height:1.82}

/* DIFF */
.diff-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start;margin-top:0}
.diff-left{display:flex;flex-direction:column;gap:16px}
.diff-points{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.diff-point{display:flex;gap:14px;align-items:flex-start;background:var(--panel);border:1px solid var(--goldL);border-radius:16px;padding:20px;transition:background .25s,transform .25s}
.diff-point:hover{background:var(--panel2);transform:translateY(-3px)}
.dp-icon{font-size:22px;color:var(--gold);opacity:.75;flex-shrink:0;line-height:1;margin-top:2px}
.dp-label{font-family:var(--f-t);font-size:16px;font-weight:500;color:var(--text);margin-bottom:6px;letter-spacing:-.01em}
.dp-desc{font-family:var(--f-b);font-size:13px;font-weight:300;color:var(--text2);line-height:1.7}

/* QUESTIONS */
.q-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:48px}
.q-item{display:flex;align-items:center;gap:14px;background:var(--panel);border:1px solid var(--goldL);border-radius:14px;padding:18px 22px;cursor:pointer;text-align:left;transition:background .22s,border-color .22s,transform .22s}
.q-item:hover{background:var(--panel2);border-color:rgba(231,194,125,.35);transform:translateX(4px)}
.q-arrow{font-size:16px;color:var(--gold);opacity:.6;flex-shrink:0;transition:opacity .2s,transform .2s}
.q-item:hover .q-arrow{opacity:1;transform:translateX(4px)}
.q-text{font-family:var(--f-b);font-size:15px;font-weight:300;color:var(--text2);line-height:1.5}

/* TRUST */
.trust-si{display:flex;flex-direction:column;align-items:center;text-align:center}
.trust-points{display:flex;flex-wrap:wrap;gap:12px 24px;justify-content:center;margin-top:32px}
.trust-point{display:flex;align-items:center;gap:9px;font-family:var(--f-b);font-size:14px;color:var(--text2)}
.tp-check{color:var(--gold);font-weight:700;font-size:15px}

/* PRICING */
.plans-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:52px;align-items:start}
.plan-card{background:var(--panel);border:1px solid var(--goldL);border-radius:22px;padding:26px;position:relative;display:flex;flex-direction:column;transition:transform .26s,box-shadow .26s}
.plan-card:hover{transform:translateY(-4px);box-shadow:0 24px 64px rgba(0,0,0,.4)}
.plan-feat{border-color:rgba(231,194,125,.42);background:linear-gradient(160deg,var(--panel2),var(--panel));box-shadow:0 0 0 1px rgba(231,194,125,.1),0 28px 70px rgba(0,0,0,.5)}
.plan-pop{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--bg);font-family:var(--f-m);font-size:9px;letter-spacing:.14em;padding:4px 16px;border-radius:100px;white-space:nowrap;font-weight:600}
.plan-tag{font-family:var(--f-m);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--text3);margin-bottom:9px}
.plan-name{font-family:var(--f-t);font-size:24px;font-weight:500;color:var(--text);letter-spacing:-.01em}
.plan-price-row{display:flex;align-items:baseline;gap:3px;margin:10px 0 6px}
.plan-amt{font-family:var(--f-t);font-size:50px;font-weight:700;color:var(--text);line-height:1}
.plan-eur{font-family:var(--f-m);font-size:15px;color:var(--text2);margin-top:8px;align-self:flex-start}
.plan-per{font-family:var(--f-m);font-size:11px;color:var(--text3);letter-spacing:.06em}
.plan-desc{font-family:var(--f-b);font-size:13px;font-style:italic;color:var(--text2);line-height:1.6;margin-bottom:18px}
.plan-sep{height:1px;background:var(--goldL);margin-bottom:16px}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:22px;flex:1;padding:0}
.pf{display:flex;align-items:flex-start;gap:8px;font-family:var(--f-b);font-size:12.5px;line-height:1.5}
.pf span{flex-shrink:0;margin-top:1px;font-size:12px}
.pf-on{color:var(--text2)}.pf-on span{color:var(--gold)}
.pf-off{color:var(--text3);opacity:.35}
.plan-btn{width:100%}
.price-note{font-family:var(--f-m);font-size:10px;color:var(--text3);text-align:center;letter-spacing:.1em;margin-top:26px}

/* FINAL */
.final-section{position:relative;overflow:hidden;padding:120px 56px;text-align:center}
.final-bg{position:absolute;inset:0;overflow:hidden}
.final-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(231,194,125,.09),rgba(207,167,160,.05) 40%,transparent 70%);pointer-events:none}
.final-inner{position:relative;z-index:1;max-width:640px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:24px}
.final-h2{font-family:var(--f-t);font-size:clamp(36px,5vw,66px);font-weight:700;font-style:italic;color:var(--text);line-height:1.06;letter-spacing:-.02em}
.final-p{font-family:var(--f-b);font-size:17px;font-weight:300;color:var(--text2);line-height:1.82}
.final-note{font-family:var(--f-m);font-size:10px;color:var(--text3);letter-spacing:.1em}

/* FOOTER */
.footer{border-top:1px solid var(--goldL);background:var(--bg3);padding:28px 56px}
.footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-logo{display:flex;align-items:center;gap:9px;text-decoration:none}
.footer-name{font-family:var(--f-t);font-size:15px;font-weight:400;color:var(--text2)}
.footer-copy{font-family:var(--f-m);font-size:10px;color:var(--text3);letter-spacing:.1em}
.footer-links{display:flex;gap:20px}
.footer-link{font-family:var(--f-b);font-size:12px;color:var(--text3);text-decoration:none;transition:color .2s}
.footer-link:hover{color:var(--rose)}

/* RESPONSIVE */
@media(max-width:1100px){
  .plans-grid{grid-template-columns:repeat(2,1fr)}
  .hero-inner{grid-template-columns:1fr;gap:40px}
  .hero-preview{display:none}
  .diff-grid{grid-template-columns:1fr}
}
@media(max-width:900px){
  .nav{padding:14px 20px}.nav-center{display:none}
  .hero{padding:100px 22px 70px}
  .section{padding:70px 22px}
  .divider{margin:0 22px}
  .how-steps{grid-template-columns:1fr;gap:28px}
  .diff-points{grid-template-columns:1fr}
  .q-grid{grid-template-columns:1fr}
  .plans-grid{grid-template-columns:1fr}
  .final-section{padding:80px 22px}
  .footer{padding:24px 22px}
}
`
