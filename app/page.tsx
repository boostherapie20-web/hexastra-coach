'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Lang = 'fr' | 'en'

const T = {
  fr: {
    nav: {
      how: 'Comment ça marche',
      questions: 'Questions',
      pricing: 'Tarifs',
      login: 'Connexion',
      cta: 'Commencer',
    },
    hero: {
      badge: 'Intelligence personnelle par IA',
      title: 'Une interface de clarté pour vos moments de bascule.',
      sub: "HexAstra vous accueille comme une conversation premium : vous posez votre question, l'IA vous guide, puis approfondit avec vos données de naissance si nécessaire.",
      primary: 'Ouvrir le chat',
      secondary: 'Voir le fonctionnement',
      trust: 'Analyse conversationnelle · Lecture personnalisée · Compatible PDF + audio',
      chips: [
        'Je me sens bloqué en ce moment',
        'Est-ce le bon timing pour agir ?',
        'Pourquoi cette relation me travaille autant ?',
        'Quelle direction devient plus naturelle ?',
      ],
      preview: {
        label: 'Aperçu du chat',
        status: 'En ligne',
        messages: [
          {
            role: 'assistant',
            content:
              "Bienvenue. Dis-moi ce que tu veux éclaircir aujourd’hui. Si une lecture plus fine est utile, je te demanderai ensuite tes données de naissance.",
          },
          {
            role: 'user',
            content:
              "J’hésite entre rester dans mon activité actuelle ou lancer quelque chose de nouveau.",
          },
          {
            role: 'assistant',
            content:
              "On peut clarifier ça en 3 temps : ton état actuel, le vrai nœud de décision, puis le bon timing d’action.",
          },
        ],
      },
      bullets: [
        'Expérience type Claude / Perplexity',
        'Design cosmique premium',
        'Réponses claires, non médicales',
      ],
    },
    how: {
      tag: 'Comment ça marche',
      title: 'Simple côté utilisateur. Solide côté expérience.',
      steps: [
        {
          n: '01',
          title: 'Entrez dans le chat',
          desc: 'Vous arrivez dans une interface claire, rapide et centrée sur votre question du moment.',
        },
        {
          n: '02',
          title: 'HexAstra clarifie',
          desc: 'L’IA reformule, hiérarchise les signaux utiles et vous aide à voir ce qui se joue vraiment.',
        },
        {
          n: '03',
          title: 'Approfondissement si nécessaire',
          desc: 'Quand la situation le demande, HexAstra utilise vos données de naissance pour aller plus loin.',
        },
      ],
    },
    questions: {
      tag: 'Exemples de questions',
      title: 'Des questions réelles, pas des promesses floues',
      hint: 'Un clic ouvre le chat avec la question déjà préremplie.',
      items: [
        'Pourquoi je sens que quelque chose doit changer maintenant ?',
        'Est-ce une bonne période pour prendre une décision forte ?',
        'Pourquoi cette relation me laisse dans le flou ?',
        'Qu’est-ce qui bloque vraiment mon passage à l’action ?',
        'Comment retrouver une direction plus naturelle ?',
        'Est-ce une phase pour accélérer ou consolider ?',
        'Pourquoi ce projet ne se pose pas clairement ?',
        'Comment lire ce moment sans me raconter d’histoire ?',
      ],
    },
    why: {
      tag: 'Pourquoi HexAstra',
      title: 'Une IA de lecture, pas un générateur de banalités.',
      body:
        "HexAstra n'affiche pas une pile de jargon ni des promesses absolues. L'expérience vise la clarté, le recul et la compréhension actionnable.",
      points: [
        {
          title: 'Conversation d’abord',
          desc: 'Le site commence par le chat. Pas par un formulaire lourd ni une interface froide.',
        },
        {
          title: 'Profondeur progressive',
          desc: 'Vous pouvez rester en échange simple ou aller vers une lecture plus poussée selon votre besoin.',
        },
        {
          title: 'Positionnement clair',
          desc: 'HexAstra accompagne la compréhension et la décision. Ce n’est pas un outil médical.',
        },
        {
          title: 'Rendu premium',
          desc: 'Univers visuel premium, lisibilité forte, expérience pensée pour la confiance.',
        },
      ],
      trustTitle: 'Cadre de confiance',
      trustBody:
        "HexAstra aide à prendre du recul, pas à remplacer un professionnel de santé ou à imposer des certitudes.",
      trustPoints: [
        'Pas de promesse absolue',
        'Pas de posture médicale',
        'Respect du libre arbitre',
        'Compatible avec une expérience premium sur Vercel',
      ],
    },
    useCases: {
      tag: "Cas d’usage",
      title: 'Pensé pour plusieurs moments de vie',
      items: [
        {
          title: 'Transition professionnelle',
          desc: 'Quand il faut arbitrer entre sécurité, appel intérieur et timing réel.',
        },
        {
          title: 'Question relationnelle',
          desc: 'Quand le flou affectif brouille votre discernement et vos décisions.',
        },
        {
          title: 'Blocage créatif',
          desc: 'Quand vous sentez du potentiel, mais que rien ne s’assemble clairement.',
        },
        {
          title: 'Décision importante',
          desc: 'Quand vous devez choisir sans vous faire aspirer par le bruit mental.',
        },
        {
          title: 'Praticiens et coachs',
          desc: 'Pour enrichir une séance avec une lecture structurée, fluide et sobre.',
        },
        {
          title: 'Exploration personnelle',
          desc: 'Pour mieux comprendre vos cycles, votre énergie du moment et votre axe naturel.',
        },
      ],
    },
    pricing: {
      tag: 'Tarifs',
      title: 'Commencer gratuitement, approfondir ensuite.',
      note: 'Sans carte bancaire pour découvrir · Annulable à tout moment',
      popular: 'Le plus populaire',
      choose: 'Choisir',
      enter: 'Entrer',
      plans: [
        {
          key: 'free',
          label: 'Découverte',
          name: 'Gratuit',
          price: '0',
          per: '',
          desc: 'Pour tester la qualité du dialogue et de la lecture.',
          features: ['Accès au chat', '1 analyse courte / jour', 'Historique léger'],
        },
        {
          key: 'essentiel',
          label: 'Essentiel',
          name: 'Essentiel',
          price: '9',
          per: '/mois',
          desc: 'Pour une pratique personnelle régulière.',
          features: ['3 analyses complètes / jour', 'Export PDF', 'Historique étendu'],
        },
        {
          key: 'premium',
          label: 'Premium',
          name: 'Premium',
          price: '19',
          per: '/mois',
          desc: 'Pour une expérience profonde et continue.',
          features: ['Analyses illimitées', 'Arc 7 jours', 'PDF + audio'],
          featured: true,
        },
        {
          key: 'praticien',
          label: 'Pro',
          name: 'Praticien',
          price: '49',
          per: '/mois',
          desc: 'Pour un usage accompagnant, coaching ou séance.',
          features: ['Usage client', 'Exports complets', 'Support prioritaire'],
        },
      ],
    },
    cta: {
      title: 'Ouvrir HexAstra Coach',
      sub: 'Le site doit donner envie d’entrer, pas d’étudier un manuel. Le bon tempo, c’est conversation d’abord.',
      btn: 'Accéder au chat',
    },
    footer: {
      copy: '2026 HexAstra · Interface de clarté assistée par IA',
    },
  },
  en: {
    nav: {
      how: 'How it works',
      questions: 'Questions',
      pricing: 'Pricing',
      login: 'Sign in',
      cta: 'Start',
    },
    hero: {
      badge: 'Personal intelligence by AI',
      title: 'A clarity interface for turning points in life.',
      sub:
        'HexAstra welcomes users like a premium conversation: they ask their question first, then the system deepens with birth data only when useful.',
      primary: 'Open chat',
      secondary: 'See how it works',
      trust: 'Conversational analysis · Personalized reading · PDF + audio ready',
      chips: [
        'I feel stuck right now',
        'Is this the right timing to act?',
        'Why is this relationship affecting me so much?',
        'What direction feels more natural now?',
      ],
      preview: {
        label: 'Chat preview',
        status: 'Online',
        messages: [
          {
            role: 'assistant',
            content:
              "Welcome. Tell me what you want to clarify today. If a deeper reading is useful, I'll ask for your birth details next.",
          },
          {
            role: 'user',
            content:
              "I’m hesitating between staying in my current work or launching something new.",
          },
          {
            role: 'assistant',
            content:
              'We can clarify this in 3 steps: your current state, the real decision knot, then the right action timing.',
          },
        ],
      },
      bullets: [
        'Claude / Perplexity style experience',
        'Premium cosmic design',
        'Clear, non-medical responses',
      ],
    },
    how: {
      tag: 'How it works',
      title: 'Simple for users. Strong in execution.',
      steps: [
        {
          n: '01',
          title: 'Enter the chat',
          desc: 'Users arrive in a clear, fast interface centered on their current question.',
        },
        {
          n: '02',
          title: 'HexAstra clarifies',
          desc: 'The AI reframes, prioritizes meaningful signals, and shows what is really happening.',
        },
        {
          n: '03',
          title: 'Go deeper when needed',
          desc: 'When the situation calls for it, HexAstra uses birth data to deepen the reading.',
        },
      ],
    },
    questions: {
      tag: 'Example questions',
      title: 'Real questions, not vague promises',
      hint: 'One click opens the chat with the question already filled in.',
      items: [
        'Why do I feel that something needs to change now?',
        'Is this a good period to make a strong decision?',
        'Why does this relationship leave me confused?',
        'What is really blocking my ability to act?',
        'How do I recover a more natural direction?',
        'Is this a phase to accelerate or consolidate?',
        'Why does this project still feel unclear?',
        'How can I read this moment without fooling myself?',
      ],
    },
    why: {
      tag: 'Why HexAstra',
      title: 'A reading AI, not a generic answer machine.',
      body:
        'HexAstra does not dump jargon or make absolute promises. The experience is built for clarity, perspective, and actionable understanding.',
      points: [
        {
          title: 'Conversation first',
          desc: 'The site starts with chat, not with a heavy form or a cold dashboard.',
        },
        {
          title: 'Progressive depth',
          desc: 'Users can stay in simple dialogue or move into a deeper reading when needed.',
        },
        {
          title: 'Clear positioning',
          desc: 'HexAstra supports understanding and decisions. It is not a medical tool.',
        },
        {
          title: 'Premium feel',
          desc: 'Premium visual universe, strong readability, and trust-oriented pacing.',
        },
      ],
      trustTitle: 'Trust frame',
      trustBody:
        'HexAstra helps users step back and understand their moment. It does not replace health professionals or impose certainty.',
      trustPoints: [
        'No absolute promises',
        'No medical positioning',
        'Respect for free will',
        'Works well in a premium Vercel setup',
      ],
    },
    useCases: {
      tag: 'Use cases',
      title: 'Designed for different life moments',
      items: [
        {
          title: 'Professional transition',
          desc: 'When choosing between security, inner call, and actual timing.',
        },
        {
          title: 'Relationship questions',
          desc: 'When emotional fog starts to blur judgment and decisions.',
        },
        {
          title: 'Creative blockage',
          desc: 'When you feel potential, but nothing assembles clearly.',
        },
        {
          title: 'Important decision',
          desc: 'When you need to choose without being swallowed by mental noise.',
        },
        {
          title: 'Practitioners and coaches',
          desc: 'To enrich a session with a structured, fluid, sober reading.',
        },
        {
          title: 'Personal exploration',
          desc: 'To better understand cycles, current energy, and natural direction.',
        },
      ],
    },
    pricing: {
      tag: 'Pricing',
      title: 'Start free, go deeper later.',
      note: 'No credit card to try · Cancel anytime',
      popular: 'Most popular',
      choose: 'Choose',
      enter: 'Enter',
      plans: [
        {
          key: 'free',
          label: 'Starter',
          name: 'Free',
          price: '0',
          per: '',
          desc: 'To test the quality of dialogue and reading.',
          features: ['Chat access', '1 short analysis / day', 'Light history'],
        },
        {
          key: 'essentiel',
          label: 'Essential',
          name: 'Essential',
          price: '9',
          per: '/mo',
          desc: 'For regular personal use.',
          features: ['3 full analyses / day', 'PDF export', 'Extended history'],
        },
        {
          key: 'premium',
          label: 'Premium',
          name: 'Premium',
          price: '19',
          per: '/mo',
          desc: 'For a deeper ongoing experience.',
          features: ['Unlimited analyses', '7-day arc', 'PDF + audio'],
          featured: true,
        },
        {
          key: 'praticien',
          label: 'Pro',
          name: 'Practitioner',
          price: '49',
          per: '/mo',
          desc: 'For coaching, client work, or session usage.',
          features: ['Client usage', 'Full exports', 'Priority support'],
        },
      ],
    },
    cta: {
      title: 'Open HexAstra Coach',
      sub: 'The site should make people want to enter, not read a manual. The right pace is conversation first.',
      btn: 'Go to chat',
    },
    footer: {
      copy: '2026 HexAstra · AI-assisted clarity interface',
    },
  },
} as const

const PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium: 'premium_monthly',
  praticien: 'praticien_monthly',
}

function HexLogo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo/hexastra-logo-transparent.png"
      alt="HexAstra"
      width={size}
      height={size}
      priority
      style={{ borderRadius: 8 }}
    />
  )
}

function Nav({
  t,
  lang,
  setLang,
  onCta,
}: {
  t: (typeof T)['fr']
  lang: Lang
  setLang: (lang: Lang) => void
  onCta: () => void
}) {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`hx-home-nav${solid ? ' is-solid' : ''}`}>
      <a href="/" className="hx-brand">
        <HexLogo size={26} />
        <span>
          HexAstra <em>Coach</em>
        </span>
      </a>

      <div className="hx-home-links">
        <a href="#how">{t.nav.how}</a>
        <a href="#questions">{t.nav.questions}</a>
        <a href="#pricing">{t.nav.pricing}</a>
        <a href="/login">{t.nav.login}</a>
      </div>

      <div className="hx-home-actions">
        <div className="hx-lang-switch">
          <button
            type="button"
            className={lang === 'fr' ? 'active' : ''}
            onClick={() => setLang('fr')}
          >
            FR
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
        <button type="button" className="hx-btn hx-btn-primary" onClick={onCta}>
          {t.nav.cta}
        </button>
      </div>
    </nav>
  )
}

function Hero({
  t,
  onCta,
  onQuestion,
}: {
  t: (typeof T)['fr']
  onCta: () => void
  onQuestion: (q: string) => void
}) {
  return (
    <section className="hx-home-hero">
      <div className="hx-home-grid">
        <div className="hx-home-copy">
          <div className="hx-tag">{t.hero.badge}</div>
          <h1 className="hexastra-title hx-home-title">{t.hero.title}</h1>
          <p className="hx-body hx-home-sub">{t.hero.sub}</p>

          <div className="hx-home-bullets">
            {t.hero.bullets.map((item) => (
              <span key={item} className="hx-home-bullet">
                <span className="dot" />
                {item}
              </span>
            ))}
          </div>

          <div className="hx-home-cta-row">
            <button type="button" className="hx-btn hx-btn-primary" onClick={onCta}>
              {t.hero.primary}
            </button>
            <a href="#how" className="hx-btn hx-btn-ghost">
              {t.hero.secondary}
            </a>
          </div>

          <p className="hx-small hx-home-trust">{t.hero.trust}</p>

          <div className="hx-home-chip-row">
            {t.hero.chips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="hx-chip"
                onClick={() => onQuestion(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="hx-card hx-preview-card">
          <div className="hx-preview-head">
            <div className="hx-preview-title">
              <HexLogo size={20} />
              <div>
                <strong>HexAstra Coach</strong>
                <span>{t.hero.preview.label}</span>
              </div>
            </div>
            <div className="hx-preview-status">
              <span className="live-dot" />
              {t.hero.preview.status}
            </div>
          </div>

          <div className="hx-preview-body">
            {t.hero.preview.messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`hx-preview-message ${message.role === 'user' ? 'is-user' : 'is-ai'}`}
              >
                <div className="bubble">{message.content}</div>
              </div>
            ))}
          </div>

          <div className="hx-preview-footer">
            <button type="button" className="hx-btn hx-btn-primary" onClick={onCta}>
              {t.hero.primary}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowSection({ t }: { t: (typeof T)['fr'] }) {
  return (
    <section id="how" className="hx-home-section">
      <div className="hx-home-shell">
        <div className="hx-tag">{t.how.tag}</div>
        <h2 className="hx-t1">{t.how.title}</h2>

        <div className="hx-home-steps">
          {t.how.steps.map((step) => (
            <article key={step.n} className="hx-card hx-step-card">
              <span className="step-number">{step.n}</span>
              <h3 className="hx-t3">{step.title}</h3>
              <p className="hx-body-sm">{step.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function QuestionsSection({
  t,
  onQuestion,
}: {
  t: (typeof T)['fr']
  onQuestion: (q: string) => void
}) {
  return (
    <section id="questions" className="hx-home-section hx-home-section-alt">
      <div className="hx-home-shell">
        <div className="hx-tag">{t.questions.tag}</div>
        <h2 className="hx-t1">{t.questions.title}</h2>

        <div className="hx-home-questions">
          {t.questions.items.map((question) => (
            <button
              key={question}
              type="button"
              className="hx-question-card"
              onClick={() => onQuestion(question)}
            >
              <span>↗</span>
              <span>{question}</span>
            </button>
          ))}
        </div>

        <p className="hx-small hx-home-hint">{t.questions.hint}</p>
      </div>
    </section>
  )
}

function WhySection({ t }: { t: (typeof T)['fr'] }) {
  return (
    <section className="hx-home-section">
      <div className="hx-home-shell hx-home-why">
        <div>
          <div className="hx-tag">{t.why.tag}</div>
          <h2 className="hx-t1">{t.why.title}</h2>
          <p className="hx-body hx-why-copy">{t.why.body}</p>
        </div>

        <div className="hx-home-why-grid">
          {t.why.points.map((point) => (
            <article key={point.title} className="hx-card hx-why-card">
              <h3 className="hx-t3">{point.title}</h3>
              <p className="hx-body-sm">{point.desc}</p>
            </article>
          ))}
        </div>

        <div className="hx-card hx-trust-card">
          <h3 className="hx-t3">{t.why.trustTitle}</h3>
          <p className="hx-body-sm">{t.why.trustBody}</p>
          <div className="hx-trust-points">
            {t.why.trustPoints.map((item) => (
              <span key={item} className="hx-trust-pill">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCasesSection({ t }: { t: (typeof T)['fr'] }) {
  return (
    <section className="hx-home-section hx-home-section-alt">
      <div className="hx-home-shell">
        <div className="hx-tag">{t.useCases.tag}</div>
        <h2 className="hx-t1">{t.useCases.title}</h2>

        <div className="hx-usecase-grid">
          {t.useCases.items.map((item) => (
            <article key={item.title} className="hx-card hx-usecase-card">
              <h3 className="hx-t3">{item.title}</h3>
              <p className="hx-body-sm">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingSection({
  t,
  onUpgrade,
}: {
  t: (typeof T)['fr']
  onUpgrade: (planKey: string) => void
}) {
  return (
    <section id="pricing" className="hx-home-section">
      <div className="hx-home-shell">
        <div className="hx-tag">{t.pricing.tag}</div>
        <h2 className="hx-t1">{t.pricing.title}</h2>

        <div className="hx-pricing-grid">
          {t.pricing.plans.map((plan) => (
            <article
              key={plan.key}
              className={`hx-card hx-pricing-card ${plan.featured ? 'is-featured' : ''}`}
            >
              {plan.featured && (
                <span className="hx-pricing-badge">{t.pricing.popular}</span>
              )}
              <span className="hx-label">{plan.label}</span>
              <h3 className="hx-t2">{plan.name}</h3>
              <div className="hx-price-row">
                <strong>{plan.price}€</strong>
                {plan.per ? <span>{plan.per}</span> : null}
              </div>
              <p className="hx-body-sm">{plan.desc}</p>

              <ul className="hx-pricing-list">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <button
                type="button"
                className={`hx-btn ${plan.featured ? 'hx-btn-primary' : 'hx-btn-ghost'}`}
                onClick={() => onUpgrade(plan.key)}
              >
                {plan.key === 'free'
                  ? t.pricing.enter
                  : `${t.pricing.choose} ${plan.name}`}
              </button>
            </article>
          ))}
        </div>

        <p className="hx-small hx-pricing-note">{t.pricing.note}</p>
      </div>
    </section>
  )
}

function FinalCTA({
  t,
  onCta,
}: {
  t: (typeof T)['fr']
  onCta: () => void
}) {
  return (
    <section className="hx-home-cta">
      <div className="hx-home-shell">
        <div className="hx-card hx-home-cta-card">
          <h2 className="hx-t1">{t.cta.title}</h2>
          <p className="hx-body">{t.cta.sub}</p>
          <button type="button" className="hx-btn hx-btn-primary" onClick={onCta}>
            {t.cta.btn}
          </button>
        </div>
      </div>
    </section>
  )
}

function Footer({ t }: { t: (typeof T)['fr'] }) {
  return (
    <footer className="hx-home-footer">
      <div className="hx-home-shell hx-home-footer-inner">
        <div className="hx-brand">
          <HexLogo size={22} />
          <span>
            HexAstra <em>Coach</em>
          </span>
        </div>
        <p className="hx-small">{t.footer.copy}</p>
      </div>
    </footer>
  )
}

export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')

  const t = useMemo(() => T[lang], [lang])

  const goToChat = useCallback(
    (prefill?: string) => {
      const params = new URLSearchParams()
      params.set('lang', lang)
      if (prefill) params.set('q', prefill)
      router.push(`/chat?${params.toString()}`)
    },
    [lang, router],
  )

  const handleUpgrade = useCallback(
    async (planKey: string) => {
      if (planKey === 'free') {
        goToChat()
        return
      }

      const priceKey = PRICE_KEYS[planKey]
      if (!priceKey) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceKey }),
        })

        const data = await res.json()

        if (data?.url) {
          window.location.href = data.url
          return
        }

        router.push('/login')
      } catch {
        router.push('/login')
      }
    },
    [goToChat, router],
  )

  return (
    <>
      <div className="hx-stars" />
      <div className="hx-sacred-halo" />
      <div className="hx-home-noise" />

      <main className="hx-home-root">
        <Nav t={t} lang={lang} setLang={setLang} onCta={() => goToChat()} />
        <Hero t={t} onCta={() => goToChat()} onQuestion={goToChat} />
        <HowSection t={t} />
        <QuestionsSection t={t} onQuestion={goToChat} />
        <WhySection t={t} />
        <UseCasesSection t={t} />
        <PricingSection t={t} onUpgrade={handleUpgrade} />
        <FinalCTA t={t} onCta={() => goToChat()} />
        <Footer t={t} />
      </main>

      <style jsx global>{`
        .hx-home-root {
          position: relative;
          z-index: 3;
          overflow: clip;
        }

        .hx-home-noise {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.08;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
        }

        .hx-home-shell {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .hx-home-section {
          position: relative;
          padding: 72px 0;
        }

        .hx-home-section-alt {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.02),
            rgba(255, 255, 255, 0.01)
          );
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .hx-home-nav {
          position: sticky;
          top: 0;
          z-index: 30;
          width: min(1240px, calc(100% - 24px));
          margin: 18px auto 0;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border: 1px solid transparent;
          border-radius: 18px;
          transition:
            background 0.25s var(--ease-out),
            border-color 0.25s var(--ease-out),
            box-shadow 0.25s var(--ease-out);
        }

        .hx-home-nav.is-solid {
          background: rgba(15, 10, 7, 0.72);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-color: rgba(255, 255, 255, 0.06);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .hx-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .hx-brand span {
          font-family: var(--font-title);
          font-size: 16px;
          font-weight: 600;
          color: var(--tx-primary);
          white-space: nowrap;
        }

        .hx-brand em {
          color: var(--amber);
          font-style: normal;
        }

        .hx-home-links,
        .hx-home-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .hx-home-links a {
          font-size: 14px;
          color: var(--tx-secondary);
          transition: color 0.2s ease;
        }

        .hx-home-links a:hover {
          color: var(--tx-primary);
        }

        .hx-lang-switch {
          display: inline-flex;
          border: 1px solid var(--border);
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
        }

        .hx-lang-switch button {
          padding: 8px 11px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--tx-muted);
        }

        .hx-lang-switch button.active {
          background: rgba(212, 165, 116, 0.12);
          color: var(--amber);
        }

        .hx-home-hero {
          padding: 56px 0 40px;
        }

        .hx-home-grid {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
          gap: 28px;
          align-items: center;
        }

        .hx-home-copy {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hx-home-title {
          max-width: 12ch;
          font-size: clamp(42px, 6vw, 74px);
          letter-spacing: -0.04em;
        }

        .hx-home-sub {
          max-width: 66ch;
        }

        .hx-home-bullets,
        .hx-home-chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hx-home-bullet {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--tx-secondary);
          font-size: 13px;
        }

        .hx-home-bullet .dot {
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(135deg, #f5f1ea, #d4a574);
          box-shadow: 0 0 18px rgba(212, 165, 116, 0.35);
        }

        .hx-home-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hx-home-trust {
          color: var(--tx-muted);
        }

        .hx-preview-card {
          position: relative;
          overflow: hidden;
          padding: 0;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.03),
              rgba(255, 255, 255, 0.015)
            ),
            radial-gradient(circle at top right, rgba(212, 165, 116, 0.18), transparent 35%),
            rgba(20, 14, 10, 0.72);
        }

        .hx-preview-card::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 25%);
        }

        .hx-preview-head,
        .hx-preview-footer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hx-preview-footer {
          border-bottom: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          justify-content: flex-start;
        }

        .hx-preview-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hx-preview-title strong {
          display: block;
          font-size: 14px;
          color: var(--tx-primary);
        }

        .hx-preview-title span {
          display: block;
          font-size: 12px;
          color: var(--tx-muted);
        }

        .hx-preview-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--tx-secondary);
        }

        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #57d27c;
          box-shadow: 0 0 0 6px rgba(87, 210, 124, 0.12);
        }

        .hx-preview-body {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 20px;
        }

        .hx-preview-message {
          display: flex;
        }

        .hx-preview-message.is-user {
          justify-content: flex-end;
        }

        .hx-preview-message .bubble {
          max-width: 78%;
          padding: 14px 15px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.65;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .hx-preview-message.is-ai .bubble {
          background: rgba(255, 255, 255, 0.045);
          color: var(--tx-primary);
        }

        .hx-preview-message.is-user .bubble {
          background: rgba(212, 165, 116, 0.12);
          border-color: rgba(212, 165, 116, 0.18);
          color: var(--tx-primary);
        }

        .hx-home-steps,
        .hx-usecase-grid,
        .hx-pricing-grid {
          display: grid;
          gap: 16px;
          margin-top: 26px;
        }

        .hx-home-steps {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .hx-step-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 220px;
        }

        .step-number {
          font-family: var(--font-title);
          font-size: 34px;
          line-height: 1;
          color: rgba(212, 165, 116, 0.92);
        }

        .hx-home-questions {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .hx-question-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          padding: 18px;
          text-align: left;
          border-radius: 18px;
          color: var(--tx-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition:
            transform 0.22s var(--ease-out),
            border-color 0.22s var(--ease-out),
            color 0.22s var(--ease-out),
            background 0.22s var(--ease-out);
        }

        .hx-question-card:hover {
          transform: translateY(-2px);
          color: var(--tx-primary);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(212, 165, 116, 0.18);
        }

        .hx-question-card span:first-child {
          color: var(--amber);
          font-size: 14px;
          margin-top: 2px;
        }

        .hx-home-hint {
          margin-top: 16px;
        }

        .hx-home-why {
          display: grid;
          gap: 20px;
        }

        .hx-why-copy {
          max-width: 70ch;
          margin-top: 10px;
        }

        .hx-home-why-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .hx-why-card,
        .hx-usecase-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hx-trust-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .hx-trust-points {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hx-trust-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(212, 165, 116, 0.08);
          border: 1px solid rgba(212, 165, 116, 0.16);
          color: var(--tx-primary);
          font-size: 13px;
        }

        .hx-usecase-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .hx-pricing-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          align-items: stretch;
        }

        .hx-pricing-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 100%;
        }

        .hx-pricing-card.is-featured {
          border-color: rgba(212, 165, 116, 0.25);
          box-shadow: var(--shadow-card), 0 0 60px rgba(212, 165, 116, 0.08);
        }

        .hx-pricing-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          background: linear-gradient(135deg, #d4a574, #8c6239);
        }

        .hx-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .hx-price-row strong {
          font-family: var(--font-title);
          font-size: 40px;
          line-height: 1;
        }

        .hx-price-row span {
          color: var(--tx-muted);
          font-size: 13px;
        }

        .hx-pricing-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 4px 0 6px;
          padding: 0;
          color: var(--tx-secondary);
          font-size: 14px;
          flex: 1;
        }

        .hx-pricing-list li::before {
          content: '•';
          color: var(--amber);
          margin-right: 8px;
        }

        .hx-pricing-note {
          margin-top: 16px;
        }

        .hx-home-cta {
          padding: 24px 0 84px;
        }

        .hx-home-cta-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          background:
            radial-gradient(circle at top right, rgba(212, 165, 116, 0.14), transparent 30%),
            rgba(20, 14, 10, 0.78);
        }

        .hx-home-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px 0 36px;
        }

        .hx-home-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        @media (max-width: 1100px) {
          .hx-home-grid,
          .hx-home-steps,
          .hx-pricing-grid,
          .hx-usecase-grid,
          .hx-home-why-grid {
            grid-template-columns: 1fr 1fr;
          }

          .hx-home-grid {
            align-items: stretch;
          }
        }

        @media (max-width: 920px) {
          .hx-home-links {
            display: none;
          }

          .hx-home-grid,
          .hx-home-steps,
          .hx-home-questions,
          .hx-home-why-grid,
          .hx-usecase-grid,
          .hx-pricing-grid {
            grid-template-columns: 1fr;
          }

          .hx-home-title {
            max-width: none;
          }

          .hx-home-nav {
            width: calc(100% - 20px);
            padding: 12px 14px;
          }

          .hx-home-shell {
            width: calc(100% - 20px);
          }

          .hx-home-actions {
            gap: 10px;
          }
        }

        @media (max-width: 640px) {
          .hx-home-actions .hx-btn {
            display: none;
          }

          .hx-home-hero {
            padding-top: 28px;
          }

          .hx-preview-message .bubble {
            max-width: 88%;
          }

          .hx-home-bullets,
          .hx-home-chip-row,
          .hx-trust-points {
            gap: 8px;
          }
        }
      `}</style>
    </>
  )
}
