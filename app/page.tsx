// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
type Lang = 'fr' | 'en'

const translations: Record<string, any> = {
  fr: {
    nav: { howItWorks: 'Comment ca marche', practitioners: 'Praticiens', pricing: 'Tarifs', signIn: 'Connexion', startReading: 'Commencer une lecture' },
    hero: { eyebrow: 'Intelligence personnelle par IA', title1: 'HexAstra', title2: 'Coach', sub1: 'Comprenez votre etat interieur.', sub2: 'Prenez des decisions plus claires.', sub3: 'Avancez avec confiance.', cta1: 'Commencer une lecture', cta2: 'Comment ca marche', trust: '2 400+ lectures realisees', trustScore: '4,9 / 5' },
    how: { tag: 'Comment ca marche', title1: 'Trois etapes vers la', title2: 'clarte', sub: 'Pas de graphiques complexes. Pas de jargon. Une lecture claire et personnelle.', step1title: 'Entrez vos informations de naissance', step1desc: "Date, heure et lieu de naissance. HexAstra cartographie votre configuration energetique actuelle.", step2title: 'HexAstra analyse vos dynamiques', step2desc: "Transits planetaires, portes Human Design, cycles numerologiques - synthetises en une vision coherente.", step3title: 'Recevez votre lecture', step3desc: "Une lecture claire sur votre vie amoureuse, travail, humeur, sante et direction." },
    receive: { tag: 'Ce que vous recevez', title1: 'Votre lecture personnelle', title2: 'comprend', sub: 'Chaque lecture couvre les cinq domaines de votre quotidien.', card1title: 'Amour et Relations', card1desc: "Comprenez les dynamiques relationnelles et ce que ce moment vous enseigne.", card2title: 'Travail et Argent', card2desc: "Clarte sur votre energie professionnelle et vos opportunites actuelles.", card3title: 'Humeur et Etat interieur', card3desc: "Une lecture precise de votre meteo emotionnelle - pas seulement comment vous vous sentez, mais pourquoi.", card4title: 'Sante et Energie', card4desc: "Rythmes physiques et energetiques. Quand pousser, quand se reposer.", card5title: 'Direction de vie', card5desc: "La vision globale. Ou vous en etes dans votre cycle plus long." },
    example: { tag: 'Exemple de lecture', title1: 'A quoi ressemble', title2: 'une lecture', sub: 'Claire. Personnelle. Utile.', name: 'Sophie M.', date: "Aujourd'hui - Lecture Premium", badge: 'Lecture complete', block1tag: "Energie du jour", block1title: "Une invitation a ralentir", block1txt: "Un mouvement interieur vous invite a ralentir et a clarifier ce qui merite votre attention.", block2tag: 'Comprehension', block2title: 'Une phase, pas un blocage', block2txt: "Ce que vous ressentez est une phase de reorganisation interne. Quelque chose s'acheve.", block3tag: 'Action', block3title: 'Une decision, clairement', block3txt: "Concentrez-vous sur une decision importante. L'energie disponible aujourd'hui est precise.", ctaNote: 'Lecture complete : 6 pages - PDF - Audio', ctaBtn: 'Obtenir ma lecture' },
    practitioners: { tag: 'Pour les professionnels', title1: 'HexAstra pour les', title2: 'praticiens', sub: "Un outil puissant de lecture et d'analyse pour les professionnels.", profiles: ['Coachs', 'Therapeutes', 'Praticiens en developpement personnel', 'Praticiens holistiques', 'Guides et facilitateurs'], explain1: "HexAstra Coach a ete concu pour soutenir les praticiens qui souhaitent approfondir leur comprehension des personnes accompagnees.", explain2: "Le systeme analyse plusieurs dimensions et synthetise une lecture structuree utilisable en seance.", posTag: 'Positionnement', posTitle: 'Un outil de soutien professionnel', posTxt1: "HexAstra aide a mettre en evidence des schemas, cycles et dynamiques qui influencent les decisions et transitions de vie.", posTxt2: "Le praticien reste l'interpreteur final et integre la lecture dans sa propre approche.", b1title: 'Clarifier des situations complexes', b1desc: "Identifier les dynamiques profondes derriere l'etat actuel d'un client.", b2title: 'Structurer les seances', b2desc: 'Utiliser la lecture comme point de depart structure.', b3title: "Gagner du temps d'analyse", b3desc: 'Obtenir une perspective synthetisee sur les domaines les plus pertinents.', b4title: 'Enrichir la pratique', b4desc: "Complementer les approches de coaching et accompagnement.", useCaseTag: "Cas d'usage", useCases: ['Seances de coaching', 'Transitions de vie', 'Blocages personnels', 'Prise de decision', 'Soutien emotionnel', 'Direction de vie'], cta: 'Demarrer en tant que praticien' },
    pricing: { tag: 'Tarifs', title1: 'Commencez gratuitement.', title2: 'Approfondissez', title3: 'quand vous etes pret.', sub: 'Sans engagement. Changez ou annulez a tout moment.', mostPopular: 'Le plus populaire', note: 'Sans carte bancaire pour commencer - Annulez a tout moment', plans: [ { key: 'free', tag: 'Decouverte', name: 'Gratuit', price: '0', per: '', desc: 'Decouvrez ce que HexAstra peut reveler.', features: [ { t: '1 lecture courte par jour', ok: true }, { t: 'Format texte uniquement', ok: true }, { t: 'Acces au chat', ok: true }, { t: 'Sauvegarde de 3 lectures', ok: true }, { t: 'Export PDF', ok: false }, { t: 'Version audio', ok: false }, { t: 'Themes avances', ok: false } ], cta: 'Commencer gratuitement', style: 'ghost' }, { key: 'essentiel', tag: 'Essentiel', name: 'Essentiel', price: '9', per: '/mois', desc: 'Les fondamentaux pour avancer avec clarte.', features: [ { t: '3 lectures completes par jour', ok: true }, { t: 'Analyses detaillees', ok: true }, { t: 'Export PDF', ok: true }, { t: 'Historique de 30 lectures', ok: true }, { t: 'Themes avances', ok: true }, { t: 'Version audio', ok: false }, { t: 'Usage client', ok: false } ], cta: 'Demarrer Essentiel', style: 'secondary' }, { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mois', desc: 'Votre lecture complete, aussi profonde que vous le souhaitez.', features: [ { t: 'Lectures illimitees', ok: true }, { t: 'Analyse complete et detaillee', ok: true }, { t: 'Arc de lecture 7 jours', ok: true }, { t: 'Export PDF (6 pages)', ok: true }, { t: 'Audio personnel (7 min)', ok: true }, { t: 'Themes avances', ok: true }, { t: 'Support prioritaire', ok: true } ], cta: 'Demarrer Premium', style: 'primary', featured: true }, { key: 'praticien', tag: 'Professionnel', name: 'Praticien', price: '49', per: '/mois', desc: 'Pour les coachs et therapeutes.', features: [ { t: 'Acces complet au systeme', ok: true }, { t: 'Usage en seance client', ok: true }, { t: 'Droits d usage professionnel', ok: true }, { t: 'PDF + audio pour chaque lecture', ok: true }, { t: 'Export et partage des lectures', ok: true }, { t: 'Support dedie', ok: true }, { t: 'Generation prioritaire', ok: true } ], cta: 'Demarrer Praticien', style: 'outline' } ] },
    finalCta: { tag: 'Votre lecture est prete', title1: 'Comprenez', title2: 'ou vous en etes.', title3: 'Avancez avec clarte.', sub: 'Pret en 2 minutes. Gratuit pour commencer.', btn: 'Commencer ma lecture', note: 'Essentiel 9 EUR/mois - Premium 19 EUR/mois - Praticien 49 EUR/mois' },
    footer: { copy: '2026 HexAstra - Intelligence personnelle par IA', links: [ { href: '#how', label: 'Comment ca marche' }, { href: '#practitioners', label: 'Praticiens' }, { href: '#pricing', label: 'Tarifs' }, { href: '/login', label: 'Connexion' } ] },
  },
  en: {
    nav: { howItWorks: 'How it works', practitioners: 'Practitioners', pricing: 'Pricing', signIn: 'Sign in', startReading: 'Start a reading' },
    hero: { eyebrow: 'Personal intelligence by AI', title1: 'HexAstra', title2: 'Coach', sub1: 'Understand your inner state.', sub2: 'Make clearer decisions.', sub3: 'Move forward with confidence.', cta1: 'Start a reading', cta2: 'How it works', trust: '2,400+ readings', trustScore: '4.9 / 5' },
    how: { tag: 'How it works', title1: 'Three steps to', title2: 'clarity', sub: 'No complex charts. No jargon. A clear personal reading about where you are right now.', step1title: 'Enter your birth information', step1desc: 'Date, time and place of birth. HexAstra maps your current energy configuration.', step2title: 'HexAstra analyzes your dynamics', step2desc: 'Planetary transits, Human Design gates, numerological cycles - all synthesized into one coherent view.', step3title: 'Receive your reading', step3desc: 'A clear actionable reading about your love life, work, mood, health and direction.' },
    receive: { tag: 'What you receive', title1: 'Your personal reading', title2: 'includes', sub: 'Each reading covers the five areas that shape how you experience your daily life.', card1title: 'Love & Connection', card1desc: 'Understand the relational dynamics at play and what this moment teaches you.', card2title: 'Work & Money', card2desc: 'Clarity on your professional energy and current opportunities.', card3title: 'Mood & Inner State', card3desc: 'A precise read of your emotional weather - not just how you feel, but why.', card4title: 'Health & Energy', card4desc: 'Physical and energetic rhythms. When to push, when to rest.', card5title: 'Life Direction', card5desc: 'The bigger picture. Where you are in your longer cycle.' },
    example: { tag: 'Example reading', title1: 'What a reading', title2: 'feels like', sub: 'Clear. Personal. Useful.', name: 'Sarah M.', date: 'Today - Premium Reading', badge: 'Full reading', block1tag: 'Energy of the day', block1title: 'An invitation to slow down', block1txt: 'An inner movement invites you to slow down and clarify what truly deserves your attention.', block2tag: 'Understanding', block2title: 'A phase, not a blockage', block2txt: 'What you feel is not a blockage, but a phase of internal reorganization. Something new is forming.', block3tag: 'Action', block3title: 'One decision, clearly', block3txt: "Simplify your day and focus on one important decision. The energy today is precise, not broad.", ctaNote: 'Full reading: 6 pages - PDF - Audio', ctaBtn: 'Get my reading' },
    practitioners: { tag: 'For professionals', title1: 'HexAstra for', title2: 'practitioners', sub: 'A powerful reading and analysis tool to enrich professional guidance.', profiles: ['Coaches', 'Therapists', 'Personal development practitioners', 'Holistic practitioners', 'Guides & facilitators'], explain1: 'HexAstra Coach was designed to support practitioners who want to deepen their understanding of the people they accompany.', explain2: 'The system analyzes several dimensions and synthesizes a structured reading usable in sessions.', posTag: 'Positioning', posTitle: 'A professional support tool', posTxt1: 'HexAstra helps highlight patterns, cycles and dynamics that may influence decisions, emotions or life transitions.', posTxt2: 'The practitioner remains the final interpreter and integrates the reading within their own approach.', b1title: 'Clarify complex situations', b1desc: "Identify deeper dynamics behind a client's current state.", b2title: 'Structure sessions', b2desc: 'Use the reading as a structured starting point for conversations.', b3title: 'Save analysis time', b3desc: 'Get a synthesized perspective highlighting the most relevant areas.', b4title: 'Enrich professional practice', b4desc: 'Complement coaching, therapy or guidance approaches.', useCaseTag: 'Use cases', useCases: ['Coaching sessions', 'Life transitions', 'Personal blockages', 'Decision making', 'Emotional support', 'Life direction'], cta: 'Start as a practitioner' },
    pricing: { tag: 'Pricing', title1: 'Start free.', title2: 'Go deeper', title3: 'when ready.', sub: 'No commitment. Upgrade or cancel anytime.', mostPopular: 'Most popular', note: 'No credit card required - Cancel anytime', plans: [ { key: 'free', tag: 'Starter', name: 'Free', price: '0', per: '', desc: 'Discover what HexAstra can reveal. No commitment.', features: [ { t: '1 short reading per day', ok: true }, { t: 'Text format only', ok: true }, { t: 'Chat access', ok: true }, { t: 'Save up to 3 readings', ok: true }, { t: 'PDF export', ok: false }, { t: 'Audio version', ok: false }, { t: 'Advanced themes', ok: false } ], cta: 'Start for free', style: 'ghost' }, { key: 'essentiel', tag: 'Essential', name: 'Essential', price: '9', per: '/month', desc: 'The fundamentals to move forward with clarity.', features: [ { t: '3 full readings per day', ok: true }, { t: 'Detailed analyses', ok: true }, { t: 'PDF export', ok: true }, { t: 'History of 30 readings', ok: true }, { t: 'Advanced themes', ok: true }, { t: 'Audio version', ok: false }, { t: 'Client usage', ok: false } ], cta: 'Start Essential', style: 'secondary' }, { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/month', desc: 'Your full personal reading, as deep as you want.', features: [ { t: 'Unlimited readings', ok: true }, { t: 'Complete personalized reading', ok: true }, { t: '7-day reading arc', ok: true }, { t: 'PDF export (6 pages)', ok: true }, { t: 'Personal audio (7 min)', ok: true }, { t: 'Advanced themes', ok: true }, { t: 'Priority support', ok: true } ], cta: 'Start Premium', style: 'primary', featured: true }, { key: 'praticien', tag: 'Professional', name: 'Practitioner', price: '49', per: '/month', desc: 'For coaches and therapists integrating HexAstra into their practice.', features: [ { t: 'Full system access', ok: true }, { t: 'Client session use', ok: true }, { t: 'Professional usage rights', ok: true }, { t: 'PDF + audio for every reading', ok: true }, { t: 'Export & share readings', ok: true }, { t: 'Dedicated support', ok: true }, { t: 'Priority generation', ok: true } ], cta: 'Start Practitioner', style: 'outline' } ] },
    finalCta: { tag: 'Your reading is ready', title1: 'Understand', title2: 'where you are.', title3: 'Move forward with clarity.', sub: 'Takes 2 minutes. Free to start.', btn: 'Start my reading', note: 'Essential EUR 9/mo - Premium EUR 19/mo - Practitioner EUR 49/mo' },
    footer: { copy: '2026 HexAstra - Personal intelligence by AI', links: [ { href: '#how', label: 'How it works' }, { href: '#practitioners', label: 'Practitioners' }, { href: '#pricing', label: 'Pricing' }, { href: '/login', label: 'Sign in' } ] },
  },
}

const PLAN_PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium:   'premium_monthly',
  praticien: 'praticien_monthly',
}

function HexLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="none" stroke="var(--emerald)" strokeWidth="2.5"/>
      <polygon points="32,14 50,24 50,44 32,54 14,44 14,24" fill="rgba(31,175,140,0.12)" stroke="var(--emerald)" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="32" cy="32" r="6" fill="var(--emerald)" opacity="0.9"/>
      <line x1="32" y1="14" x2="32" y2="26" stroke="var(--emerald)" strokeWidth="1.5"/>
      <line x1="32" y1="38" x2="32" y2="50" stroke="var(--emerald)" strokeWidth="1.5"/>
      <line x1="14" y1="24" x2="26" y2="29" stroke="var(--emerald)" strokeWidth="1.5"/>
      <line x1="38" y1="35" x2="50" y2="44" stroke="var(--emerald)" strokeWidth="1.5"/>
      <line x1="50" y1="24" x2="38" y2="29" stroke="var(--emerald)" strokeWidth="1.5"/>
      <line x1="26" y1="35" x2="14" y2="44" stroke="var(--emerald)" strokeWidth="1.5"/>
    </svg>
  )
}

export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const t = translations[lang]
  const goChat = useCallback(() => router.push('/chat'), [router])
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
        <Hero t={t} lang={lang} onCta={goChat} />
        <div className="divider" />
        <HowSection t={t} />
        <div className="divider" />
        <ReceiveSection t={t} />
        <div className="divider" />
        <ExampleSection t={t} onCta={goLogin} />
        <div className="divider" />
        <div id="practitioners"><PractitionerSection t={t} onCta={goLogin} /></div>
        <div className="divider" />
        <PricingSection t={t} onCta={handleUpgrade} />
        <div className="divider" />
        <FinalCta t={t} onCta={goChat} />
        <Footer t={t} />
      </div>
    </>
  )
}

function Nav({ t, lang, setLang, onCta }: { t: any; lang: Lang; setLang: (l: Lang) => void; onCta: () => void }) {
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">
        <HexLogo size={34} />
        <span className="nav-logo-txt">HexAstra <span className="nav-accent">Coach</span></span>
      </a>
      <div className="nav-links">
        <a href="#how" className="nav-link">{t.nav.howItWorks}</a>
        <a href="#practitioners" className="nav-link">{t.nav.practitioners}</a>
        <a href="#pricing" className="nav-link">{t.nav.pricing}</a>
        <button onClick={onCta} className="nav-link nav-link-btn">{t.nav.signIn}</button>
      </div>
      <div className="nav-right">
        <div className="lang-toggle">
          <button onClick={() => setLang('fr')} className={'lang-btn' + (lang === 'fr' ? ' lang-active' : '')}>FR</button>
          <button onClick={() => setLang('en')} className={'lang-btn' + (lang === 'en' ? ' lang-active' : '')}>EN</button>
        </div>
        <button onClick={onCta} className="btn-primary nav-cta">{t.nav.startReading}</button>
      </div>
    </nav>
  )
}

function Hero({ t, lang, onCta }: { t: any; lang: Lang; onCta: () => void }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-orb" />
      <div className="hero-left">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          {t.hero.eyebrow}
        </div>
        <h1 className="hero-title">
          {t.hero.title1}<br />
          <span className="hero-accent">{t.hero.title2}</span>
        </h1>
        <p className="hero-sub">
          {t.hero.sub1}<br />{t.hero.sub2}<br />{t.hero.sub3}
        </p>
        <div className="hero-ctas">
          <button onClick={onCta} className="btn-primary">
            {t.hero.cta1} <ArrowIcon />
          </button>
          <a href="#how" className="btn-ghost">{t.hero.cta2}</a>
        </div>
        <div className="trust-row">
          <div className="trust-avs">
            {['S','M','L','A','R'].map((l, i) => (
              <div key={i} className="trust-av" style={{ marginLeft: i > 0 ? '-7px' : '0' }}>{l}</div>
            ))}
          </div>
          <span className="trust-txt">{t.hero.trust} &middot; {t.hero.trustScore}</span>
        </div>
      </div>
    </section>
  )
}

function HowSection({ t }: { t: any }) {
  return (
    <section id="how" className="section">
      <div className="section-inner">
        <STag label={t.how.tag} />
        <h2 className="section-title">{t.how.title1} <em>{t.how.title2}</em></h2>
        <p className="section-sub">{t.how.sub}</p>
        <div className="steps">
          {[
            { n: '01', title: t.how.step1title, desc: t.how.step1desc, icon: <CalIcon /> },
            { n: '02', title: t.how.step2title, desc: t.how.step2desc, icon: <ClockIcon /> },
            { n: '03', title: t.how.step3title, desc: t.how.step3desc, icon: <DocIcon /> },
          ].map((s, i) => (
            <div key={i} className="step-card">
              <div className="step-top">
                <div className="step-icon">{s.icon}</div>
                <div className="step-num">{s.n}</div>
              </div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReceiveSection({ t }: { t: any }) {
  const [active, setActive] = useState<number | null>(null)
  const cards = [
    { title: t.receive.card1title, desc: t.receive.card1desc },
    { title: t.receive.card2title, desc: t.receive.card2desc },
    { title: t.receive.card3title, desc: t.receive.card3desc },
    { title: t.receive.card4title, desc: t.receive.card4desc },
    { title: t.receive.card5title, desc: t.receive.card5desc },
  ]
  return (
    <section className="section bg-deep">
      <div className="section-inner">
        <STag label={t.receive.tag} />
        <h2 className="section-title">{t.receive.title1} <em>{t.receive.title2}</em></h2>
        <p className="section-sub">{t.receive.sub}</p>
        <div className="cards-grid">
          {cards.map((c, i) => (
            <div
              key={i}
              className={'reading-card' + (active === i ? ' reading-card-active' : '')}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="card-num">0{i + 1}</div>
              <div className="card-title">{c.title}</div>
              <p className="card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExampleSection({ t, onCta }: { t: any; onCta: () => void }) {
  return (
    <section className="section">
      <div className="section-inner">
        <STag label={t.example.tag} />
        <h2 className="section-title">{t.example.title1} <em>{t.example.title2}</em></h2>
        <p className="section-sub">{t.example.sub}</p>
        <div className="ex-card">
          <div className="ex-header">
            <div className="ex-header-left">
              <div className="ex-av"><HexLogo size={36} /></div>
              <div>
                <div className="ex-name">{t.example.name}</div>
                <div className="ex-date">{t.example.date}</div>
              </div>
            </div>
            <div className="ex-badge">{t.example.badge}</div>
          </div>
          <div className="ex-body">
            {[
              { tag: t.example.block1tag, title: t.example.block1title, txt: t.example.block1txt },
              { tag: t.example.block2tag, title: t.example.block2title, txt: t.example.block2txt },
              { tag: t.example.block3tag, title: t.example.block3title, txt: t.example.block3txt },
            ].map((b, i) => (
              <div key={i}>
                <div className="ex-block">
                  <div className="ex-block-tag">{b.tag}</div>
                  <div className="ex-block-title">{b.title}</div>
                  <p className="ex-block-txt">{b.txt}</p>
                </div>
                {i < 2 && <div className="ex-divider" />}
              </div>
            ))}
            <div className="ex-divider" />
            <div className="ex-cta-row">
              <p className="ex-cta-note">{t.example.ctaNote}</p>
              <button onClick={onCta} className="btn-primary btn-sm">{t.example.ctaBtn}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PractitionerSection({ t, onCta }: { t: any; onCta: () => void }) {
  return (
    <section className="section bg-deep">
      <div className="section-inner">
        <STag label={t.practitioners.tag} />
        <h2 className="section-title">{t.practitioners.title1} <em>{t.practitioners.title2}</em></h2>
        <p className="section-sub">{t.practitioners.sub}</p>
        <div className="prac-tags">
          {t.practitioners.profiles.map((p, i) => <span key={i} className="prac-tag">{p}</span>)}
        </div>
        <div className="prac-grid">
          <div className="prac-left">
            <p className="prac-txt">{t.practitioners.explain1}</p>
            <p className="prac-txt">{t.practitioners.explain2}</p>
            <div className="prac-pos">
              <div className="prac-pos-tag">{t.practitioners.posTag}</div>
              <div className="prac-pos-title">{t.practitioners.posTitle}</div>
              <p className="prac-pos-txt">{t.practitioners.posTxt1}</p>
              <p className="prac-pos-txt" style={{ marginTop: '8px', fontStyle: 'italic', opacity: 0.75 }}>{t.practitioners.posTxt2}</p>
            </div>
          </div>
          <div className="prac-benefits">
            {[
              { title: t.practitioners.b1title, desc: t.practitioners.b1desc },
              { title: t.practitioners.b2title, desc: t.practitioners.b2desc },
              { title: t.practitioners.b3title, desc: t.practitioners.b3desc },
              { title: t.practitioners.b4title, desc: t.practitioners.b4desc },
            ].map((b, i) => (
              <div key={i} className="benefit-card">
                <div className="benefit-title">{b.title}</div>
                <p className="benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="use-cases">
          <div className="use-case-tag">{t.practitioners.useCaseTag}</div>
          <div className="use-case-row">
            {t.practitioners.useCases.map((u, i) => (
              <div key={i} className="use-case-item">
                <span className="use-case-dot" />{u}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onCta} className="btn-secondary prac-cta">{t.practitioners.cta}</button>
      </div>
    </section>
  )
}

function PricingSection({ t, onCta }: { t: any; onCta: (key: string) => void }) {
  const plans = t.pricing.plans as Array<{
    key: string; tag: string; name: string; price: string; per: string;
    desc: string; features: { t: string; ok: boolean }[];
    cta: string; style: string; featured?: boolean;
  }>
  return (
    <section id="pricing" className="section">
      <div className="section-inner">
        <STag label={t.pricing.tag} />
        <h2 className="section-title">{t.pricing.title1} <em>{t.pricing.title2}</em> {t.pricing.title3}</h2>
        <p className="section-sub">{t.pricing.sub}</p>
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={'plan-card' + (plan.featured ? ' plan-featured' : '')}>
              {plan.featured && <div className="plan-badge">{t.pricing.mostPopular}</div>}
              <div className="plan-tag">{plan.tag}</div>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price-row">
                <span className="plan-amt">{plan.price}</span>
                <span className="plan-cur">EUR</span>
                {plan.per && <span className="plan-per">{plan.per}</span>}
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((f, j) => (
                  <li key={j} className={'plan-feature' + (!f.ok ? ' plan-feature-off' : '')}>
                    <span className={f.ok ? 'feat-check' : 'feat-cross'}>{f.ok ? 'v' : 'x'}</span>
                    {f.t}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onCta(plan.key)}
                className={
                  plan.style === 'primary' ? 'btn-primary plan-btn'
                  : plan.style === 'secondary' ? 'btn-secondary plan-btn'
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

function FinalCta({ t, onCta }: { t: any; onCta: () => void }) {
  return (
    <section className="section final-cta">
      <div className="final-glow" />
      <div className="final-inner">
        <STag label={t.finalCta.tag} centered />
        <h2 className="final-title">
          {t.finalCta.title1} <em>{t.finalCta.title2}</em><br />{t.finalCta.title3}
        </h2>
        <p className="final-sub">{t.finalCta.sub}</p>
        <button onClick={onCta} className="btn-primary btn-lg">
          {t.finalCta.btn} <ArrowIcon />
        </button>
        <p className="final-note">{t.finalCta.note}</p>
      </div>
    </section>
  )
}

function Footer({ t }: { t: any }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <HexLogo size={26} />
          <span className="footer-logo-txt">HexAstra Coach</span>
        </a>
        <p className="footer-copy">&copy; {t.footer.copy}</p>
        <div className="footer-links">
          {t.footer.links.map((l, i) => (
            <a key={i} href={l.href} className="footer-link">{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}

function STag({ label, centered }: { label: string; centered?: boolean }) {
  return (
    <div className="section-tag" style={centered ? { justifyContent: 'center' } : {}}>
      <span className="section-tag-line" />{label}
    </div>
  )
}
function ArrowIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> }
function CalIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> }
function DocIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg> }

const CSS = `

:root {
  --void: #1a0f0b;
  --pitch: #2C1F1A;
  --deep: #241510;
  --panel: #2e1a12;
  --lift: #3a2218;
  --chrome: #f5f0eb;
  --emerald: #1FAF8C;
  --emerald-lt: #2dd4aa;
  --emerald-dk: #15806a;
  --tx1: #f5f0eb;
  --tx2: #9a8878;
  --tx3: #5a4a42;
  --b1: rgba(255,255,255,0.04);
  --b2: rgba(255,255,255,0.08);
  --b3: rgba(255,255,255,0.14);
  --b4: rgba(255,255,255,0.22);
  --f-display: 'Bebas Neue', sans-serif;
  --f-serif: 'DM Serif Display', serif;
  --f-mono: 'Geist Mono', monospace;
  --f-ui: 'Outfit', sans-serif;
  --expo: cubic-bezier(0.16,1,0.3,1);
}
@keyframes fadeUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
@keyframes glow { 0%,100% { opacity:0.6; transform:translateY(-50%) scale(1) } 50% { opacity:1; transform:translateY(-50%) scale(1.08) } }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
.root{background:var(--pitch);color:var(--tx1);font-family:var(--f-ui);overflow-x:hidden;min-height:100vh}
.bg-deep{background:var(--deep)}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--b3),transparent);margin:0 48px}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:16px 48px;background:rgba(44,31,26,0.92);backdrop-filter:blur(24px);border-bottom:1px solid var(--b2)}
.nav-logo{display:flex;align-items:center;gap:11px;text-decoration:none}
.nav-logo-txt{font-family:var(--f-display);font-size:20px;letter-spacing:0.08em;color:var(--chrome)}
.nav-accent{color:var(--emerald)}
.nav-links{display:flex;align-items:center;gap:28px}
.nav-link{font-family:var(--f-ui);font-size:13px;color:var(--tx2);text-decoration:none;transition:color 0.2s;background:none;border:none;cursor:pointer}
.nav-link:hover{color:var(--emerald)}
.nav-link-btn{font-family:var(--f-ui);font-size:13px}
.nav-right{display:flex;align-items:center;gap:12px}
.lang-toggle{display:flex;background:var(--panel);border:1px solid var(--b2);border-radius:6px;overflow:hidden}
.lang-btn{padding:5px 12px;font-family:var(--f-mono);font-size:10px;letter-spacing:0.12em;color:var(--tx3);background:transparent;border:none;cursor:pointer;transition:background 0.2s,color 0.2s}
.lang-active{background:var(--emerald)!important;color:var(--void)!important;font-weight:600}
.btn-primary{padding:12px 26px;background:var(--emerald);color:var(--void);font-family:var(--f-ui);font-size:14px;font-weight:600;border:none;border-radius:4px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 6px 24px rgba(31,175,140,0.3);transition:background 0.2s,transform 0.15s;white-space:nowrap;text-decoration:none}
.btn-primary:hover{background:var(--emerald-lt);transform:translateY(-1px)}
.btn-secondary{padding:12px 26px;background:rgba(31,175,140,0.1);color:var(--emerald);font-family:var(--f-ui);font-size:14px;font-weight:500;border:1px solid rgba(31,175,140,0.3);border-radius:4px;cursor:pointer;transition:background 0.2s;white-space:nowrap}
.btn-secondary:hover{background:rgba(31,175,140,0.18)}
.btn-ghost{padding:12px 26px;background:transparent;color:var(--tx2);font-family:var(--f-ui);font-size:14px;border:1px solid var(--b3);border-radius:4px;cursor:pointer;transition:border-color 0.2s,color 0.2s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center}
.btn-ghost:hover{border-color:var(--b4);color:var(--tx1)}
.btn-outline{padding:12px 26px;background:transparent;color:var(--tx2);font-family:var(--f-ui);font-size:14px;border:1px solid var(--b3);border-radius:4px;cursor:pointer;white-space:nowrap;transition:border-color 0.2s}
.btn-outline:hover{border-color:var(--emerald);color:var(--emerald)}
.btn-sm{font-size:13px!important;padding:10px 20px!important}
.btn-lg{font-size:15px!important;padding:16px 36px!important}
.nav-cta{font-size:13px!important;padding:10px 20px!important}
.hero{min-height:100vh;display:flex;align-items:center;padding:120px 48px 80px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(31,175,140,0.06),transparent),linear-gradient(160deg,var(--void) 0%,var(--pitch) 50%,var(--deep) 100%)}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(var(--b1) 1px,transparent 1px),linear-gradient(90deg,var(--b1) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)}
.hero-orb{position:absolute;right:0;top:50%;transform:translateY(-50%);width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(31,175,140,0.06),transparent 70%);animation:glow 8s ease-in-out infinite;pointer-events:none}
.hero-left{position:relative;z-index:1;max-width:640px;display:flex;flex-direction:column;gap:28px;animation:fadeUp 0.7s var(--expo) both}
.eyebrow{display:flex;align-items:center;gap:8px;font-family:var(--f-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--emerald);opacity:0.85}
.eyebrow-dot{width:5px;height:5px;border-radius:50%;background:var(--emerald);animation:pulse 2s ease infinite;flex-shrink:0}
.hero-title{font-family:var(--f-display);font-size:clamp(60px,7vw,100px);font-weight:400;line-height:0.95;letter-spacing:0.04em;color:var(--chrome);text-transform:uppercase}
.hero-accent{color:var(--emerald);font-family:var(--f-serif);font-style:italic;text-transform:none;letter-spacing:-0.01em;font-size:clamp(54px,6vw,90px)}
.hero-sub{font-family:var(--f-ui);font-size:20px;font-weight:300;line-height:1.8;color:var(--tx2)}
.hero-ctas{display:flex;gap:12px;flex-wrap:wrap}
.trust-row{display:flex;align-items:center;gap:12px}
.trust-avs{display:flex;align-items:center}
.trust-av{width:27px;height:27px;border-radius:50%;background:var(--lift);border:2px solid var(--pitch);display:flex;align-items:center;justify-content:center;font-family:var(--f-mono);font-size:9px;color:var(--emerald);flex-shrink:0}
.trust-txt{font-family:var(--f-ui);font-size:12px;color:var(--tx3)}
.section{padding:96px 48px;position:relative}
.section-inner{max-width:1100px;margin:0 auto}
.section-tag{display:flex;align-items:center;gap:10px;font-family:var(--f-mono);font-size:10px;letter-spacing:0.22em;color:var(--emerald);text-transform:uppercase;margin-bottom:18px}
.section-tag-line{width:28px;height:1px;background:var(--emerald);opacity:0.5;flex-shrink:0}
.section-title{font-family:var(--f-display);font-size:clamp(32px,4vw,54px);font-weight:400;letter-spacing:0.04em;color:var(--chrome);text-transform:uppercase;margin-bottom:14px;line-height:1.05}
.section-title em{font-family:var(--f-serif);font-style:italic;color:var(--emerald);text-transform:none;letter-spacing:-0.01em}
.section-sub{font-family:var(--f-ui);font-size:17px;font-weight:300;color:var(--tx2);line-height:1.8;max-width:540px}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:52px}
.step-card{padding:36px 32px;background:var(--panel);border:1px solid var(--b2);display:flex;flex-direction:column;gap:16px;transition:background 0.25s,transform 0.25s}
.step-card:hover{background:var(--lift);transform:translateY(-3px)}
.step-top{display:flex;justify-content:space-between;align-items:flex-start}
.step-icon{width:44px;height:44px;background:rgba(31,175,140,0.08);border:1px solid rgba(31,175,140,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--emerald)}
.step-num{font-family:var(--f-display);font-size:64px;font-weight:400;color:rgba(31,175,140,0.12);line-height:1}
.step-title{font-family:var(--f-serif);font-size:20px;color:var(--chrome)}
.step-desc{font-family:var(--f-ui);font-size:14px;font-weight:300;color:var(--tx2);line-height:1.75}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px;margin-top:52px}
.reading-card{padding:24px 20px;background:var(--panel);border:1px solid var(--b2);border-radius:12px;display:flex;flex-direction:column;gap:10px;cursor:pointer;transition:background 0.25s,border-color 0.25s,transform 0.25s}
.reading-card:hover,.reading-card-active{background:var(--lift);border-color:rgba(31,175,140,0.3);transform:translateY(-3px)}
.card-num{font-family:var(--f-display);font-size:28px;color:rgba(31,175,140,0.4);line-height:1}
.card-title{font-family:var(--f-serif);font-size:17px;color:var(--chrome)}
.card-desc{font-family:var(--f-ui);font-size:13px;font-weight:300;color:var(--tx2);line-height:1.7}
.ex-card{background:var(--panel);border:1px solid var(--b2);border-radius:20px;overflow:hidden;max-width:760px;margin:52px auto 0;box-shadow:0 40px 80px rgba(0,0,0,0.4)}
.ex-header{padding:22px 32px;background:var(--lift);border-bottom:1px solid var(--b2);display:flex;align-items:center;justify-content:space-between}
.ex-header-left{display:flex;align-items:center;gap:12px}
.ex-av{width:38px;height:38px;border-radius:50%;border:1px solid rgba(31,175,140,0.3);overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--panel)}
.ex-name{font-family:var(--f-serif);font-size:18px;color:var(--chrome)}
.ex-date{font-family:var(--f-mono);font-size:10px;color:var(--tx3);letter-spacing:0.1em}
.ex-badge{font-family:var(--f-mono);font-size:9px;letter-spacing:0.14em;color:var(--emerald);background:rgba(31,175,140,0.08);border:1px solid rgba(31,175,140,0.2);border-radius:100px;padding:4px 14px;text-transform:uppercase}
.ex-body{padding:32px;display:flex;flex-direction:column;gap:24px}
.ex-block{display:flex;flex-direction:column;gap:7px}
.ex-block-tag{font-family:var(--f-mono);font-size:9.5px;letter-spacing:0.18em;color:var(--emerald);text-transform:uppercase}
.ex-block-title{font-family:var(--f-serif);font-size:22px;color:var(--chrome)}
.ex-block-txt{font-family:var(--f-ui);font-size:15px;font-weight:300;color:var(--tx2);line-height:1.85;font-style:italic}
.ex-divider{height:1px;background:var(--b2)}
.ex-cta-row{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.ex-cta-note{font-family:var(--f-ui);font-size:13px;color:var(--tx3);font-style:italic}
.prac-tags{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 44px}
.prac-tag{font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;color:var(--emerald);background:rgba(31,175,140,0.08);border:1px solid rgba(31,175,140,0.2);border-radius:100px;padding:5px 14px;text-transform:uppercase}
.prac-grid{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
.prac-left{display:flex;flex-direction:column;gap:18px}
.prac-txt{font-family:var(--f-ui);font-size:16px;font-weight:300;color:var(--tx2);line-height:1.85}
.prac-pos{background:var(--panel);border:1px solid var(--b2);border-radius:12px;padding:22px}
.prac-pos-tag{font-family:var(--f-mono);font-size:9px;letter-spacing:0.18em;color:var(--emerald);text-transform:uppercase;margin-bottom:8px}
.prac-pos-title{font-family:var(--f-serif);font-size:19px;color:var(--chrome);margin-bottom:10px}
.prac-pos-txt{font-family:var(--f-ui);font-size:14px;font-weight:300;color:var(--tx2);line-height:1.8}
.prac-benefits{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.benefit-card{background:var(--panel);border:1px solid var(--b2);border-radius:10px;padding:18px;transition:background 0.2s}
.benefit-card:hover{background:var(--lift)}
.benefit-title{font-family:var(--f-serif);font-size:16px;color:var(--chrome);margin-bottom:6px}
.benefit-desc{font-family:var(--f-ui);font-size:13px;font-weight:300;color:var(--tx2);line-height:1.65}
.use-cases{margin-top:36px;background:var(--panel);border:1px solid var(--b2);border-radius:12px;padding:22px 26px}
.use-case-tag{font-family:var(--f-mono);font-size:9px;letter-spacing:0.18em;color:var(--emerald);text-transform:uppercase;margin-bottom:14px}
.use-case-row{display:flex;flex-wrap:wrap;gap:10px}
.use-case-item{display:flex;align-items:center;gap:8px;font-family:var(--f-ui);font-size:14px;color:var(--tx2)}
.use-case-dot{width:5px;height:5px;border-radius:50%;background:var(--emerald);flex-shrink:0}
.prac-cta{margin-top:28px}
.pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:52px;align-items:start}
.plan-card{background:var(--panel);border:1px solid var(--b2);border-radius:14px;padding:26px;position:relative;display:flex;flex-direction:column;transition:transform 0.25s}
.plan-card:hover{transform:translateY(-3px)}
.plan-featured{border-color:rgba(31,175,140,0.4);background:var(--lift);box-shadow:0 0 0 1px rgba(31,175,140,0.1),0 24px 60px rgba(0,0,0,0.5)}
.plan-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--emerald);color:var(--void);font-family:var(--f-mono);font-size:9px;letter-spacing:0.12em;padding:4px 14px;border-radius:100px;white-space:nowrap;font-weight:600}
.plan-tag{font-family:var(--f-mono);font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--tx3);margin-bottom:8px}
.plan-name{font-family:var(--f-display);font-size:24px;color:var(--chrome);text-transform:uppercase;letter-spacing:0.06em;line-height:1}
.plan-price-row{display:flex;align-items:baseline;gap:4px;margin:12px 0 6px}
.plan-amt{font-family:var(--f-display);font-size:46px;color:var(--chrome);line-height:1}
.plan-cur{font-family:var(--f-mono);font-size:13px;color:var(--tx2)}
.plan-per{font-family:var(--f-mono);font-size:10px;color:var(--tx3);letter-spacing:0.06em}
.plan-desc{font-family:var(--f-ui);font-size:13px;font-style:italic;color:var(--tx2);line-height:1.6;margin-bottom:18px}
.plan-divider{height:1px;background:var(--b2);margin:0 0 16px}
.plan-features{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:22px;flex:1;padding:0}
.plan-feature{display:flex;align-items:flex-start;gap:9px;font-family:var(--f-ui);font-size:12.5px;color:var(--tx2);line-height:1.5}
.plan-feature-off{opacity:0.35}
.feat-check{color:var(--emerald);font-weight:700;flex-shrink:0}
.feat-cross{color:var(--tx3);flex-shrink:0}
.plan-btn{width:100%}
.pricing-note{font-family:var(--f-mono);font-size:10px;color:var(--tx3);text-align:center;letter-spacing:0.1em;margin-top:24px}
.final-cta{text-align:center;overflow:hidden}
.final-glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 60% at 50% 50%,rgba(31,175,140,0.07),transparent);pointer-events:none}
.final-inner{position:relative;z-index:1;max-width:620px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:22px}
.final-title{font-family:var(--f-display);font-size:clamp(34px,4.5vw,60px);font-weight:400;color:var(--chrome);line-height:1.05;text-transform:uppercase;letter-spacing:0.04em}
.final-title em{font-family:var(--f-serif);font-style:italic;color:var(--emerald);text-transform:none;letter-spacing:-0.01em}
.final-sub{font-family:var(--f-ui);font-size:17px;font-weight:300;color:var(--tx2);line-height:1.75}
.final-note{font-family:var(--f-mono);font-size:10px;color:var(--tx3);letter-spacing:0.08em}
.footer{border-top:1px solid var(--b2);background:var(--void);padding:28px 48px}
.footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.footer-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.footer-logo-txt{font-family:var(--f-display);font-size:16px;letter-spacing:0.08em;color:var(--chrome)}
.footer-copy{font-family:var(--f-mono);font-size:10px;letter-spacing:0.1em;color:var(--tx3)}
.footer-links{display:flex;gap:20px}
.footer-link{font-family:var(--f-ui);font-size:12px;color:var(--tx3);text-decoration:none;transition:color 0.2s}
.footer-link:hover{color:var(--emerald)}
@media(max-width:1100px){.pricing-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){
  .nav{padding:14px 20px}
  .nav-links{display:none}
  .hero{padding:100px 20px 60px;min-height:auto}
  .steps{grid-template-columns:1fr}
  .prac-grid{grid-template-columns:1fr}
  .prac-benefits{grid-template-columns:1fr 1fr}
  .pricing-grid{grid-template-columns:1fr}
  .section{padding:64px 20px}
  .divider{margin:0 20px}
  .footer{padding:24px 20px}
}
`
