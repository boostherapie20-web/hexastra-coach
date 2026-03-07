'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Lang = 'fr' | 'en'

const T = {
  fr: {
    nav: {
      how: 'Comment ça marche',
      uses: 'Usages',
      pricing: 'Tarifs',
      login: 'Connexion',
      cta: 'Accéder au chat',
    },
    hero: {
      badge: 'Clarté personnelle assistée par IA',
      title: 'HexAstra t’aide à voir plus clair, sans te noyer dans la complexité.',
      sub: 'Une interface légère et premium pour comprendre ton moment, retrouver du calme intérieur et poser de meilleures décisions.',
      primary: 'Ouvrir le chat',
      secondary: 'Découvrir le fonctionnement',
      chips: [
        'Je me sens bloqué en ce moment',
        'Est-ce le bon timing pour agir ?',
        'Pourquoi cette relation me travaille autant ?',
        'Quelle direction devient plus naturelle ?',
      ],
    },
    how: {
      tag: 'Comment ça fonctionne',
      title: 'Simple côté usage. Solide côté profondeur.',
      steps: [
        {
          n: '01',
          title: 'Tu entres dans le chat',
          desc: 'Tu arrives dans un espace clair, calme, pensé pour poser une question réelle sans surcharge inutile.',
        },
        {
          n: '02',
          title: 'HexAstra clarifie',
          desc: 'Le système écoute, reformule et hiérarchise les signaux utiles pour faire apparaître le vrai nœud.',
        },
        {
          n: '03',
          title: 'Approfondissement si nécessaire',
          desc: 'Quand c’est utile, tu peux compléter avec tes données personnelles pour une lecture plus fine.',
        },
      ],
    },
    uses: {
      tag: 'Usages',
      title: 'Pensé pour les moments où il faut retrouver une lecture intérieure.',
      items: [
        'Décision importante',
        'Transition professionnelle',
        'Question relationnelle',
        'Blocage créatif',
        'Énergie du moment',
        'Vision générale de période',
      ],
    },
    pricing: {
      tag: 'Tarifs',
      title: 'Découvrir gratuitement, approfondir ensuite.',
      plans: [
        {
          name: 'Découverte',
          price: '0€',
          desc: 'Pour tester la qualité du dialogue et du style HexAstra.',
        },
        {
          name: 'Essentiel',
          price: '9€/mois',
          desc: 'Pour une pratique personnelle régulière et fluide.',
        },
        {
          name: 'Premium',
          price: '19€/mois',
          desc: 'Pour aller plus loin avec PDF, audio et profondeur continue.',
        },
      ],
    },
    trust: 'HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas un avis médical, juridique ou financier.',
    footer: '2026 HexAstra · Interface de clarté assistée par IA',
  },
  en: {
    nav: {
      how: 'How it works',
      uses: 'Use cases',
      pricing: 'Pricing',
      login: 'Sign in',
      cta: 'Open chat',
    },
    hero: {
      badge: 'Personal clarity assisted by AI',
      title: 'HexAstra helps you see more clearly, without drowning you in complexity.',
      sub: 'A light, premium interface to understand your moment, regain mental space, and make better decisions.',
      primary: 'Open chat',
      secondary: 'See how it works',
      chips: [
        'I feel blocked right now',
        'Is this the right timing to act?',
        'Why is this relationship weighing on me?',
        'Which direction feels more natural?',
      ],
    },
    how: {
      tag: 'How it works',
      title: 'Simple to use. Strong in depth.',
      steps: [
        { n: '01', title: 'You enter the chat', desc: 'You start in a calm, clear space built for real questions, not overload.' },
        { n: '02', title: 'HexAstra clarifies', desc: 'The system listens, reframes, and surfaces what matters most.' },
        { n: '03', title: 'Deeper if needed', desc: 'When useful, you can add personal data for a more refined reading.' },
      ],
    },
    uses: {
      tag: 'Use cases',
      title: 'Built for moments when you need an inner reading again.',
      items: ['Important decision', 'Career transition', 'Relationship question', 'Creative block', 'Current energy', 'Period overview'],
    },
    pricing: {
      tag: 'Pricing',
      title: 'Start free, go deeper later.',
      plans: [
        { name: 'Discover', price: '€0', desc: 'Test the quality of the dialogue and HexAstra tone.' },
        { name: 'Essential', price: '€9/mo', desc: 'For a steady personal practice.' },
        { name: 'Premium', price: '€19/mo', desc: 'For PDF, audio, and continuous depth.' },
      ],
    },
    trust: 'HexAstra Coach is a personal reflection and exploration tool. It does not replace medical, legal, or financial advice.',
    footer: '2026 HexAstra · AI-assisted clarity interface',
  },
} as const

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('fr')
  const copy = useMemo(() => T[lang], [lang])

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-1)' }}>
      <header className="site-shell" style={{ paddingTop: 18 }}>
        <nav className="hx-topbar">
          <div className="hx-brand">
            <div className="hx-brand-mark" />
            <div>
              <div className="hx-brand-name">HexAstra Coach</div>
              <div className="hx-brand-sub">Clarté · Timing · Respiration mentale</div>
            </div>
          </div>

          <div className="hx-nav-links">
            <a href="#how">{copy.nav.how}</a>
            <a href="#uses">{copy.nav.uses}</a>
            <a href="#pricing">{copy.nav.pricing}</a>
          </div>

          <div className="hx-nav-actions">
            <button className="hx-lang-toggle" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
              {lang === 'fr' ? 'EN' : 'FR'}
            </button>
            <button className="hx-btn-ghost">{copy.nav.login}</button>
            <Link href="/chat" className="hx-btn-primary">
              {copy.nav.cta}
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="site-shell hx-home-hero">
          <div className="hx-home-grid">
            <div className="hx-home-copy hx-surface hx-home-panel-lg">
              <div className="hx-pill">{copy.hero.badge}</div>
              <h1 className="hx-home-title">{copy.hero.title}</h1>
              <p className="hx-home-sub">{copy.hero.sub}</p>

              <div className="hx-home-cta-row">
                <Link href="/chat" className="hx-btn-primary">
                  {copy.hero.primary}
                </Link>
                <a href="#how" className="hx-btn-ghost">
                  {copy.hero.secondary}
                </a>
              </div>

              <div className="hx-chip-row">
                {copy.hero.chips.map((chip) => (
                  <Link key={chip} href={`/chat?q=${encodeURIComponent(chip)}`} className="hx-chip">
                    {chip}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hx-surface hx-home-preview">
              <div className="hx-preview-head">
                <div>
                  <div className="hx-meta-label">Aperçu du chat</div>
                  <div className="hx-preview-title">Conversation en direct</div>
                </div>
                <div className="hx-online-dot">En ligne</div>
              </div>

              <div className="hx-preview-chat">
                <div className="hx-msg hx-msg-ai">
                  Bienvenue. Dis-moi ce que tu veux éclaircir aujourd’hui. Si une lecture plus fine est utile, je te demanderai ensuite tes données personnelles.
                </div>
                <div className="hx-msg hx-msg-user">
                  J’hésite entre rester dans mon activité actuelle ou lancer quelque chose de nouveau.
                </div>
                <div className="hx-msg hx-msg-ai">
                  On peut clarifier ça en 3 temps : ton état actuel, le vrai nœud de décision, puis le bon timing d’action.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="site-shell hx-home-section">
          <div className="hx-section-head">
            <div className="hx-meta-label">{copy.how.tag}</div>
            <h2>{copy.how.title}</h2>
          </div>
          <div className="hx-step-grid">
            {copy.how.steps.map((step) => (
              <div key={step.n} className="hx-surface hx-step-card">
                <div className="hx-step-number">{step.n}</div>
                <div className="hx-step-title">{step.title}</div>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="uses" className="site-shell hx-home-section">
          <div className="hx-section-head">
            <div className="hx-meta-label">{copy.uses.tag}</div>
            <h2>{copy.uses.title}</h2>
          </div>
          <div className="hx-use-grid">
            {copy.uses.items.map((item) => (
              <div key={item} className="hx-surface hx-use-card">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="site-shell hx-home-section">
          <div className="hx-section-head">
            <div className="hx-meta-label">{copy.pricing.tag}</div>
            <h2>{copy.pricing.title}</h2>
          </div>
          <div className="hx-price-grid">
            {copy.pricing.plans.map((plan, index) => (
              <div key={plan.name} className={`hx-surface hx-price-card ${index === 1 ? 'is-featured' : ''}`}>
                <div className="hx-price-name">{plan.name}</div>
                <div className="hx-price-value">{plan.price}</div>
                <p>{plan.desc}</p>
                <Link href="/chat" className={index === 1 ? 'hx-btn-primary' : 'hx-btn-ghost'}>
                  {copy.nav.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="site-shell hx-home-section">
          <div className="hx-trust-box">
            {copy.trust}
          </div>
        </section>
      </main>

      <footer className="site-shell hx-footer">{copy.footer}</footer>
    </div>
  )
}
