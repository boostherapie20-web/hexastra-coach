import Link from 'next/link'
import HexastraLogo from '@/app/components/HexastraLogo'

const features = [
  {
    title: 'Clarifier une décision',
    text: 'Quand tout semble mélangé, HexAstra remet de l’ordre entre intuition, contexte et action.',
  },
  {
    title: 'Retrouver le bon timing',
    text: 'Avancer, ralentir, consolider, pivoter : la lecture aide à sentir le rythme juste.',
  },
  {
    title: 'Respirer mentalement',
    text: 'Une interface calme pour alléger la surcharge et retrouver une vision plus nette.',
  },
]

const useCases = [
  'Amour et relations',
  'Travail et argent',
  'Énergie du moment',
  'Direction de vie',
  'Blocage intérieur',
  'Lecture générale',
]

const pricing = [
  {
    name: 'Découverte',
    price: '0€',
    desc: 'Pour tester la qualité de l’expérience et découvrir l’univers HexAstra.',
    cta: 'Découvrir',
    featured: false,
  },
  {
    name: 'Essentiel',
    price: '9€/mois',
    desc: 'Pour une pratique personnelle régulière, simple, claire et utile au quotidien.',
    cta: 'Choisir Essentiel',
    featured: true,
  },
  {
    name: 'Premium',
    price: '19€/mois',
    desc: 'Pour aller plus loin avec davantage de profondeur, de continuité et de confort.',
    cta: 'Choisir Premium',
    featured: false,
  },
  {
    name: 'Praticien',
    price: '49€/mois',
    desc: 'Pensé pour les accompagnants, coachs et praticiens qui veulent un usage avancé.',
    cta: 'Espace praticien',
    featured: false,
  },
]

export default function HomePage() {
  return (
    <main className="hex-light">
      <header className="hx-site-header">
        <div className="hx-site-shell hx-site-header-inner">
          <Link href="/" className="hx-brand">
            <HexastraLogo size={42} animated={false} />
            <div>
              <div className="hx-brand-title">HexAstra Coach</div>
              <div className="hx-brand-subtitle">Clarté · Timing · Respiration mentale</div>
            </div>
          </Link>

          <nav className="hx-main-nav">
            <a href="#fonctionnement">Comment ça marche</a>
            <a href="#usages">Usages</a>
            <a href="#tarifs">Tarifs</a>
          </nav>

          <div className="hx-header-actions">
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Accéder au chat
            </Link>
          </div>
        </div>
      </header>

      <section className="hx-site-shell hx-home-hero">
        <div className="hx-home-hero-copy">
          <div className="hx-hero-logo-row">
            <HexastraLogo size={148} priority animated />
          </div>

          <div className="hx-eyebrow">Clarté personnelle assistée par IA</div>

          <h1 className="hx-home-title">
            HexAstra t’aide à voir plus clair,
            <br />
            sans te noyer dans la complexité.
          </h1>

          <p className="hx-home-subtitle">
            Une interface légère et premium pour comprendre ton moment, retrouver du calme intérieur
            et poser de meilleures décisions.
          </p>

          <div className="hx-home-hero-actions">
            <Link href="/chat" className="hx-btn hx-btn-primary">
              Ouvrir le chat
            </Link>
            <a href="#fonctionnement" className="hx-btn hx-btn-ghost">
              Découvrir le fonctionnement
            </a>
          </div>

          <div className="hx-home-chips">
            <Link href="/chat?q=Je me sens bloqué en ce moment" className="hx-chip">
              Je me sens bloqué en ce moment
            </Link>
            <Link href="/chat?q=Est-ce le bon timing pour agir ?" className="hx-chip">
              Est-ce le bon timing pour agir ?
            </Link>
            <Link href="/chat?q=Pourquoi cette relation me travaille autant ?" className="hx-chip">
              Pourquoi cette relation me travaille autant ?
            </Link>
            <Link href="/chat?q=Quelle direction devient plus naturelle ?" className="hx-chip">
              Quelle direction devient plus naturelle ?
            </Link>
          </div>
        </div>

        <div className="hx-home-preview hx-card">
          <div className="hx-preview-top">
            <div>
              <div className="hx-label">Aperçu du chat</div>
              <div className="hx-preview-title">Conversation en direct</div>
            </div>
            <div className="hx-online-dot">En ligne</div>
          </div>

          <div className="hx-preview-thread">
            <div className="hx-preview-bubble hx-preview-bubble-ai">
              Bienvenue. Dis-moi ce que tu veux éclaircir aujourd’hui.
            </div>

            <div className="hx-preview-bubble hx-preview-bubble-user">
              J’hésite entre rester dans mon activité actuelle ou lancer quelque chose de nouveau.
            </div>

            <div className="hx-preview-bubble hx-preview-bubble-ai">
              On peut clarifier ça en 3 temps : ton état actuel, le vrai nœud de décision, puis le
              bon timing d’action.
            </div>
          </div>
        </div>
      </section>

      <section id="fonctionnement" className="hx-site-shell hx-home-section">
        <div className="hx-section-head">
          <div className="hx-label">Comment ça marche</div>
          <h2 className="hx-section-title">Simple côté usage. Solide côté profondeur.</h2>
        </div>

        <div className="hx-home-feature-grid">
          {features.map((item, index) => (
            <article key={item.title} className="hx-card hx-info-card">
              <div className="hx-step-badge">{String(index + 1).padStart(2, '0')}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="usages" className="hx-site-shell hx-home-section">
        <div className="hx-section-head">
          <div className="hx-label">Usages</div>
          <h2 className="hx-section-title">Pensé pour les moments où il faut retrouver une lecture intérieure.</h2>
        </div>

        <div className="hx-home-use-grid">
          {useCases.map((item) => (
            <div key={item} className="hx-card hx-use-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="tarifs" className="hx-site-shell hx-home-section">
        <div className="hx-section-head">
          <div className="hx-label">Tarifs</div>
          <h2 className="hx-section-title">Découvrir gratuitement, approfondir ensuite.</h2>
        </div>

        <div className="hx-home-pricing-grid">
          {pricing.map((plan) => (
            <article
              key={plan.name}
              className={`hx-card hx-pricing-card ${plan.featured ? 'hx-pricing-card-featured' : ''}`}
            >
              <div className="hx-label">{plan.name}</div>
              <div className="hx-price">{plan.price}</div>
              <p>{plan.desc}</p>
              <Link href="/chat" className={`hx-btn ${plan.featured ? 'hx-btn-primary' : 'hx-btn-ghost'}`}>
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="hx-site-shell hx-home-disclaimer-wrap">
        <div className="hx-home-disclaimer hx-card">
          HexAstra Coach est un outil d’exploration et de réflexion personnelle. Il ne remplace pas
          un avis médical, juridique ou financier.
        </div>
      </section>
    </main>
  )
}
