// @ts-nocheck
'use client'

import { useRouter } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'
type Lang = 'fr' | 'en'
type Mode = 'libre' | 'praticien'

/* ══════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════ */
const T: Record<string, any> = {
  fr: {
    nav: { how: 'Comment ça marche', questions: 'Questions', pricing: 'Tarifs', login: 'Connexion', cta: 'Commencer' },
    hero: {
      title: 'Comprenez votre moment de vie.',
      sub: 'Discutez avec HexAstra pour clarifier votre situation, vos décisions et vos cycles personnels.',
    },
    chat: {
      online: 'En ligne',
      welcome: "Bienvenue. Dis-moi ce que tu veux éclaircir aujourd\'hui.\nSi tu veux une analyse personnalisée, je te demanderai ensuite tes infos de naissance.",
      placeholder: 'Écris ta question… (décision, relation, direction, blocage)',
      micro: 'Réponses claires, sans jargon. Analyse conversationnelle.',
      send: 'Envoyer',
      mode: { libre: 'Libre', praticien: 'Praticien' },
      persona: { question: 'Pour toi ou pour un client ?', self: 'Pour moi', client: 'Pour un client' },
      chips: [
        'Je suis bloqué en ce moment',
        'Décision importante à prendre',
        'Relation confuse',
        'Direction de vie',
      ],
      thinking: 'HexAstra analyse…',
      stages: ['Exploration', 'Clarification', 'Synthèse', 'Plan d\'action'],
    },
    how: {
      tag: 'Comment ça marche',
      title: 'Simple. Clair. Personnel.',
      steps: [
        { n: '1', title: 'Accédez au chat', desc: 'Entrez vos informations de naissance pour activer votre analyse personnalisée.' },
        { n: '2', title: 'Discutez avec HexAstra', desc: 'Posez vos questions et explorez votre situation actuelle, sans jargon.' },
        { n: '3', title: 'Recevez une analyse claire', desc: 'HexAstra vous aide à comprendre les dynamiques qui influencent votre vie.' },
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
    why: {
      tag: 'Pourquoi HexAstra est différent',
      title: 'Une approche différente',
      body: "HexAstra ne donne pas des réponses générales. Il analyse les dynamiques de votre vie en croisant plusieurs systèmes d\'observation des cycles humains.",
      detail: 'Le résultat est une lecture claire et personnalisée de votre situation actuelle.',
      points: [
        { icon: '◎', title: 'Analyse multi-dimensionnelle', desc: 'Cycles planétaires, Human Design, numérologie — croisés en une vision cohérente.' },
        { icon: '◈', title: 'Réponses personnalisées', desc: 'Chaque analyse est unique. Pas de réponses génériques ou de contenus pré-écrits.' },
        { icon: '⊕', title: 'Cinq domaines de vie', desc: 'Amour, travail, humeur, santé et direction — couverts dans chaque analyse.' },
        { icon: '◉', title: 'Immédiatement actionnable', desc: "Des insights clairs pour aujourd\'hui et les prochains jours." },
      ],
      trust: {
        title: 'Une approche claire et respectueuse',
        body: 'HexAstra ne fait pas de prédictions absolues. L\'objectif est d\'apporter de la clarté, du recul et des pistes de compréhension.',
        points: ['Pas de prédictions absolues', 'Respectueux de votre libre arbitre', 'Données personnelles protégées', 'Un outil de compréhension, pas de dépendance'],
      },
    },
    pricing: {
      tag: 'Tarifs',
      title: 'Commencez gratuitement.',
      sub: 'Approfondissez quand vous êtes prêt.',
      note: 'Sans carte bancaire · Annulez à tout moment',
      popular: 'Le plus populaire',
      plans: [
        { key: 'free', tag: 'Découverte', name: 'Gratuit', price: '0', per: '', desc: 'Découvrez HexAstra sans engagement.', features: ['1 analyse courte / jour', 'Accès au chat', '3 analyses sauvegardées'], missing: ['PDF', 'Audio', 'Thèmes avancés'], cta: 'Commencer gratuitement', style: 'ghost' },
        { key: 'essentiel', tag: 'Essentiel', name: 'Essentiel', price: '9', per: '/mois', desc: 'Les fondamentaux pour avancer.', features: ['3 analyses complètes / jour', 'Analyses détaillées', 'Export PDF', 'Historique 30 analyses'], missing: ['Audio', 'Usage client'], cta: 'Démarrer Essentiel', style: 'secondary' },
        { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mois', desc: 'Votre analyse complète, aussi profonde que vous le souhaitez.', features: ['Analyses illimitées', 'Analyse 6 pages', 'Arc 7 jours', 'PDF + Audio 7 min', 'Support prioritaire'], missing: [], cta: 'Démarrer Premium', style: 'primary', featured: true },
        { key: 'praticien', tag: 'Pro', name: 'Praticien', price: '49', per: '/mois', desc: 'Pour les coachs et thérapeutes.', features: ['Accès complet', 'Usage en séance', 'Droits pro', 'PDF + Audio', 'Support dédié'], missing: [], cta: 'Démarrer Praticien', style: 'outline' },
      ],
    },
    useCases: {
      tag: "Cas d'usage",
      title: 'Qui utilise HexAstra ?',
      sub: 'Des profils très différents, une même recherche de clarté.',
      cases: [
        { icon: '◎', title: 'En transition professionnelle', desc: 'Vous hésitez entre deux directions. HexAstra vous aide à voir laquelle correspond à votre énergie actuelle.' },
        { icon: '♡', title: 'Dans une période relationnelle complexe', desc: "Séparation, relation confuse, décision difficile. Comprendre les dynamiques en jeu avant d'agir." },
        { icon: '⊕', title: "Manque d'énergie ou de direction", desc: 'Vous avancez mais sans élan. HexAstra identifie ce qui bloque et ce qui peut relancer le mouvement.' },
        { icon: '◈', title: 'Prise de décision importante', desc: 'Déménagement, projet, changement. Voir si le timing et votre énergie sont alignés avec ce que vous envisagez.' },
        { icon: '◉', title: 'Praticiens et coachs', desc: "Un outil puissant pour enrichir les séances, identifier les cycles d'un client et structurer l'accompagnement." },
        { icon: '✦', title: 'Curiosité et exploration personnelle', desc: 'Vous voulez simplement mieux vous comprendre. Vos cycles, vos forces, vos périodes de recharge.' },
      ],
    },
    cta: {
      tag: 'Prêt à commencer ?',
      title: 'Commencer votre analyse',
      sub: 'Une conversation avec HexAstra peut vous aider à voir votre situation avec plus de clarté.',
      btn: 'Commencer maintenant',
      note: 'Gratuit pour commencer · Essentiel 9€ · Premium 19€',
    },
    footer: {
      copy: '2026 HexAstra · Intelligence personnelle par IA',
      links: [{ href: '#how', label: 'Comment ça marche' }, { href: '#pricing', label: 'Tarifs' }, { href: '/login', label: 'Connexion' }],
    },
  },
  en: {
    nav: { how: 'How it works', questions: 'Questions', pricing: 'Pricing', login: 'Sign in', cta: 'Get started' },
    hero: {
      title: 'Understand your life moment.',
      sub: 'Talk with HexAstra to clarify your situation, your decisions and your personal cycles.',
    },
    chat: {
      online: 'Online',
      welcome: "Welcome. Tell me what you want to clarify today.\nIf you want a personalized analysis, I\'ll ask for your birth details next.",
      placeholder: 'Write your question… (decision, relationship, direction, blockage)',
      micro: 'Clear answers, no jargon. Conversational analysis.',
      send: 'Send',
      mode: { libre: 'Free', praticien: 'Practitioner' },
      persona: { question: 'For you or a client?', self: 'For me', client: 'For a client' },
      chips: [
        'I feel stuck right now',
        'Important decision to make',
        'Confusing relationship',
        'Life direction',
      ],
      thinking: 'HexAstra is analyzing…',
      stages: ['Exploration', 'Clarification', 'Synthesis', 'Action plan'],
    },
    how: {
      tag: 'How it works',
      title: 'Simple. Clear. Personal.',
      steps: [
        { n: '1', title: 'Access the chat', desc: 'Enter your birth information to activate your personalized analysis.' },
        { n: '2', title: 'Talk with HexAstra', desc: 'Ask your questions and explore your current situation, without jargon.' },
        { n: '3', title: 'Receive a clear analysis', desc: 'HexAstra helps you understand the dynamics influencing your life.' },
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
    why: {
      tag: 'Why HexAstra is different',
      title: 'A different approach',
      body: "HexAstra doesn\'t give generic answers. It analyzes the dynamics of your life by crossing several systems of observation of human cycles.",
      detail: 'The result is a clear and personalized reading of your current situation.',
      points: [
        { icon: '◎', title: 'Multi-dimensional analysis', desc: 'Planetary cycles, Human Design, numerology — crossed into one coherent vision.' },
        { icon: '◈', title: 'Personalized responses', desc: 'Every analysis is unique. No generic responses or pre-written content.' },
        { icon: '⊕', title: 'Five life domains', desc: 'Love, work, mood, health and direction — covered in every analysis.' },
        { icon: '◉', title: 'Immediately actionable', desc: 'Clear insights for today and the coming days.' },
      ],
      trust: {
        title: 'A clear and respectful approach',
        body: 'HexAstra does not make absolute predictions. The goal is to bring clarity, perspective and understanding.',
        points: ['No absolute predictions', 'Respectful of your free will', 'Personal data protected', 'A tool for understanding, not dependency'],
      },
    },
    pricing: {
      tag: 'Pricing',
      title: 'Start free.',
      sub: "Go deeper when you\'re ready.",
      note: 'No credit card · Cancel anytime',
      popular: 'Most popular',
      plans: [
        { key: 'free', tag: 'Starter', name: 'Free', price: '0', per: '', desc: 'Discover HexAstra with no commitment.', features: ['1 short analysis / day', 'Chat access', 'Save 3 analyses'], missing: ['PDF', 'Audio', 'Advanced themes'], cta: 'Start for free', style: 'ghost' },
        { key: 'essentiel', tag: 'Essential', name: 'Essential', price: '9', per: '/mo', desc: 'The fundamentals to move forward.', features: ['3 full analyses / day', 'Detailed analyses', 'PDF export', '30 analysis history'], missing: ['Audio', 'Client usage'], cta: 'Start Essential', style: 'secondary' },
        { key: 'premium', tag: 'Premium', name: 'Premium', price: '19', per: '/mo', desc: 'Your full personal reading, as deep as you want.', features: ['Unlimited analyses', '6-page analysis', '7-day arc', 'PDF + Audio 7 min', 'Priority support'], missing: [], cta: 'Start Premium', style: 'primary', featured: true },
        { key: 'praticien', tag: 'Pro', name: 'Practitioner', price: '49', per: '/mo', desc: 'For coaches and therapists.', features: ['Full access', 'Client session use', 'Pro rights', 'PDF + Audio', 'Dedicated support'], missing: [], cta: 'Start Practitioner', style: 'outline' },
      ],
    },
    useCases: {
      tag: 'Use cases',
      title: 'Who uses HexAstra?',
      sub: 'Very different profiles, one shared need for clarity.',
      cases: [
        { icon: '◎', title: 'In professional transition', desc: 'Choosing between two paths. HexAstra helps you see which aligns with your current energy.' },
        { icon: '♡', title: 'In a complex relational period', desc: 'Separation, confusing relationship, difficult decision. Understanding the dynamics at play before acting.' },
        { icon: '⊕', title: 'Lacking energy or direction', desc: 'Moving forward but without momentum. HexAstra identifies what blocks and what can restart the flow.' },
        { icon: '◈', title: 'Important decision to make', desc: "Moving, project, change. Seeing if timing and energy align with what you're considering." },
        { icon: '◉', title: 'Practitioners and coaches', desc: "A powerful tool to enrich sessions, identify a client's cycles and structure the guidance." },
        { icon: '✦', title: 'Personal curiosity', desc: 'You simply want to understand yourself better. Your cycles, your strengths, your recharge periods.' },
      ],
    },
    cta: {
      tag: 'Ready to start?',
      title: 'Begin your analysis',
      sub: 'A conversation with HexAstra can help you see your situation with greater clarity.',
      btn: 'Start now',
      note: 'Free to start · Essential €9 · Premium €19',
    },
    footer: {
      copy: '2026 HexAstra · Personal intelligence by AI',
      links: [{ href: '#how', label: 'How it works' }, { href: '#pricing', label: 'Pricing' }, { href: '/login', label: 'Sign in' }],
    },
  },
}

const PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium:   'premium_monthly',
  praticien: 'praticien_monthly',
}

/* ── LOGO ─── */
function HexLogo({ size = 28, color = "#C6A35F" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <polygon points="32,3 59,18 59,46 32,61 5,46 5,18" fill="none" stroke={color} strokeWidth="1.8"/>
      <polygon points="32,13 51,23 51,43 32,53 13,43 13,23" fill="rgba(198,163,95,0.07)" stroke={color} strokeWidth="1" opacity="0.5"/>
      <circle cx="32" cy="32" r="4.5" fill={color} opacity="0.9"/>
      <line x1="32" y1="13" x2="32" y2="27" stroke={color} strokeWidth="1.2" opacity="0.55"/>
      <line x1="32" y1="37" x2="32" y2="51" stroke={color} strokeWidth="1.2" opacity="0.55"/>
      <line x1="13" y1="23" x2="27" y2="29" stroke={color} strokeWidth="1.2" opacity="0.55"/>
      <line x1="37" y1="35" x2="51" y2="43" stroke={color} strokeWidth="1.2" opacity="0.55"/>
      <line x1="51" y1="23" x2="37" y2="29" stroke={color} strokeWidth="1.2" opacity="0.55"/>
      <line x1="27" y1="35" x2="13" y2="43" stroke={color} strokeWidth="1.2" opacity="0.55"/>
    </svg>
  )
}

/* ── STARS ─── */
function Stars({ n = 70 }: { n?: number }) {
  const pts = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: (Math.random() * 100).toFixed(2),
    y: (Math.random() * 100).toFixed(2),
    r: (Math.random() * 1.2 + 0.25).toFixed(2),
    op: (0.1 + Math.random() * 0.28).toFixed(2),
    dur: (2.5 + Math.random() * 4).toFixed(1),
    del: (Math.random() * 7).toFixed(1),
  }))
  return (
    <svg className="stars" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      {pts.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
          fill="var(--ivoire)"
          style={{ animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`, opacity: s.op }}
        />
      ))}
    </svg>
  )
}

/* ══════════════════════════════════════════
   CHAT COMPONENT — pièce maîtresse
══════════════════════════════════════════ */
function HexastraChat({ t, threadId, onThreadId }: { t: any; threadId: string | null; onThreadId: (id: string) => void }) {
  const tc = t.chat
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: tc.welcome }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('libre')
  const [persona, setPersona] = useState<'self' | 'client' | null>(null)
  const [stage, setStage] = useState(0)
  const [chips, setChips] = useState<string[]>(tc.chips)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, loading])

  // Reset welcome message on lang change
  useEffect(() => {
    setMsgs([{ role: 'assistant', content: tc.welcome }])
    setChips(tc.chips)
  }, [tc.welcome])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return
    const newMsgs = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    setInput('')
    setLoading(true)
    setStage(s => Math.min(s + 1, 3))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          threadId,
          mode,
          persona: mode === 'praticien' ? persona : null,
          profile: {
            language: typeof window !== 'undefined' ? (document.documentElement.lang || 'fr') : 'fr',
          },
        }),
      })
      const data = await res.json()
      if (data.threadId) onThreadId(data.threadId)
      if (data.chips?.length) setChips(data.chips)
      const reply = data.reply ?? '…'
      setMsgs([...newMsgs, { role: 'assistant', content: reply }])
      // If n8n signals birth data needed, bump stage to Clarification
      if (data.needsBirthData) setStage(1)
    } catch {
      setMsgs([...newMsgs, { role: 'assistant', content: '⚠ Erreur de connexion. Réessayez.' }])
    } finally {
      setLoading(false)
    }
  }, [msgs, loading, threadId, mode, persona])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <div className="chat-card">
      {/* Header */}
      <div className="chat-head">
        <div className="ch-left">
          <HexLogo size={22} />
          <div>
            <div className="ch-title">HexAstra Coach</div>
            <div className="ch-status"><span className="ch-dot" />{tc.online}</div>
          </div>
        </div>
        {/* Stage bar */}
        <div className="stage-bar">
          {tc.stages.map((s: string, i: number) => (
            <div key={i} className={`stage-step${i <= stage ? ' stage-on' : ''}`}>{s}</div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="chat-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`msg ${m.role === 'user' ? 'msg-user' : 'msg-ai'}`}>
            {m.role === 'assistant' && (
              <div className="msg-av"><HexLogo size={16} /></div>
            )}
            <div className="msg-bubble">
              {m.content.split('\n').map((line: string, j: number) => (
                <span key={j}>{line}{j < m.content.split('\n').length - 1 && <br />}</span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg msg-ai">
            <div className="msg-av"><HexLogo size={16} /></div>
            <div className="msg-bubble msg-typing"><span/><span/><span/></div>
          </div>
        )}
      </div>

      {/* Mode toggle + persona */}
      <div className="chat-mode-bar">
        <div className="mode-toggle">
          <button onClick={() => setMode('libre')} className={`mode-btn${mode==='libre'?' mode-on':''}`}>{tc.mode.libre}</button>
          <button onClick={() => setMode('praticien')} className={`mode-btn${mode==='praticien'?' mode-on':''}`}>{tc.mode.praticien}</button>
        </div>
        {mode === 'praticien' && (
          <div className="persona-row">
            <span className="persona-q">{tc.persona.question}</span>
            <button onClick={() => setPersona('self')} className={`persona-btn${persona==='self'?' persona-on':''}`}>{tc.persona.self}</button>
            <button onClick={() => setPersona('client')} className={`persona-btn${persona==='client'?' persona-on':''}`}>{tc.persona.client}</button>
          </div>
        )}
      </div>

      {/* Chips */}
      <div className="chat-chips">
        {chips.map((c: string, i: number) => (
          <button key={i} className="chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder={tc.placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          rows={1}
        />
        <button className="chat-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="chat-micro">{tc.micro}</div>
    </div>
  )
}

/* ══════════════════════════════════════════
   NAV
══════════════════════════════════════════ */
function Nav({ t, lang, setLang, onCta }: any) {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <nav className={`nav${solid ? ' nav-s' : ''}`}>
      <a href="/" className="nav-logo">
        <HexLogo size={26} />
        <span className="nav-brand">HexAstra <em>Coach</em></span>
      </a>
      <div className="nav-links">
        <a href="#how" className="nl">{t.nav.how}</a>
        <a href="#questions" className="nl">{t.nav.questions}</a>
        <a href="#pricing" className="nl">{t.nav.pricing}</a>
        <a href="/login" className="nl">{t.nav.login}</a>
      </div>
      <div className="nav-r">
        <div className="lang-p">
          <button onClick={() => setLang('fr')} className={`lb${lang==='fr'?' la':''}`}>FR</button>
          <button onClick={() => setLang('en')} className={`lb${lang==='en'?' la':''}`}>EN</button>
        </div>
        <button onClick={onCta} className="btn-gold ncta">{t.nav.cta}</button>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════════════
   HERO — centré, sans chat
══════════════════════════════════════════ */
function Hero({ t, onCta }: any) {
  return (
    <section className="hero">
      <div className="hero-bg"><Stars n={90} /></div>
      <div className="hero-glow" />
      <div className="hero-center">
        <div className="eyebrow"><span className="eydot"/>Intelligence personnelle par IA</div>
        <h1 className="hero-h1">{t.hero.title}</h1>
        <p className="hero-p">{t.hero.sub}</p>
        <div className="hero-points-row">
          <div className="hp"><span className="hp-dot"/>Analyse conversationnelle</div>
          <div className="hp-sep"/>
          <div className="hp"><span className="hp-dot"/>Basée sur vos données de naissance</div>
          <div className="hp-sep"/>
          <div className="hp"><span className="hp-dot"/>Claire, précise, personnalisée</div>
        </div>
        <div className="hero-btns">
          <button onClick={onCta} className="btn-gold btn-lg">
            Commencer gratuitement
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <a href="#how" className="btn-ghost btn-lg">Voir comment ça fonctionne</a>
        </div>
        <p className="hero-trust">2 400+ analyses réalisées · 4,9 / 5 · Gratuit pour commencer</p>
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
        <div className="how-grid">
          {t.how.steps.map((s: any, i: number) => (
            <div key={i} className="how-card">
              <div className="how-n">{s.n}</div>
              <div className="how-sep"/>
              <h3 className="how-title">{s.title}</h3>
              <p className="how-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   QUESTIONS
══════════════════════════════════════════ */
function QuestionsSection({ t, onQ }: any) {
  return (
    <section id="questions" className="section">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.questions.tag}</div>
        <h2 className="sh2">{t.questions.title}</h2>
        <div className="q-grid">
          {t.questions.items.map((q: string, i: number) => (
            <button key={i} className="q-item" onClick={() => onQ(q)}>
              <span className="q-arr">→</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
        <p className="q-hint">Cliquez sur une question pour l'envoyer directement à HexAstra ↑</p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════
   WHY DIFFERENT
══════════════════════════════════════════ */
function WhySection({ t }: any) {
  return (
    <section className="section section-alt">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.why.tag}</div>
        <div className="why-top">
          <div className="why-left">
            <h2 className="sh2">{t.why.title}</h2>
            <p className="ssub">{t.why.body}</p>
            <p className="ssub" style={{ marginTop: '12px', fontStyle: 'italic', opacity: 0.75 }}>{t.why.detail}</p>
          </div>
          <div className="why-points">
            {t.why.points.map((p: any, i: number) => (
              <div key={i} className="why-pt">
                <div className="why-ico">{p.icon}</div>
                <div>
                  <div className="why-ptitle">{p.title}</div>
                  <p className="why-pdesc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Trust */}
        <div className="trust-box">
          <div className="trust-title">{t.why.trust.title}</div>
          <p className="trust-body">{t.why.trust.body}</p>
          <div className="trust-pts">
            {t.why.trust.points.map((p: string, i: number) => (
              <div key={i} className="trust-p"><span className="trust-chk">✓</span>{p}</div>
            ))}
          </div>
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
    <section id="pricing" className="section">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.pricing.tag}</div>
        <h2 className="sh2">{t.pricing.title} <em className="eg">{t.pricing.sub}</em></h2>
        <div className="plans">
          {t.pricing.plans.map((p: any, i: number) => (
            <div key={i} className={`plan${p.featured?' plan-f':''}`}>
              {p.featured && <div className="plan-pop">{t.pricing.popular}</div>}
              <div className="plan-tag">{p.tag}</div>
              <div className="plan-name">{p.name}</div>
              <div className="plan-pr">
                <span className="plan-amt">{p.price}</span>
                <span className="plan-eur">€</span>
                {p.per && <span className="plan-per">{p.per}</span>}
              </div>
              <p className="plan-desc">{p.desc}</p>
              <div className="plan-sep"/>
              <ul className="plan-feats">
                {p.features.map((f: string, j: number) => <li key={j} className="pf pf-ok"><span>✓</span>{f}</li>)}
                {p.missing.map((f: string, j: number) => <li key={j} className="pf pf-no"><span>–</span>{f}</li>)}
              </ul>
              <button onClick={() => onCta(p.key)} className={`plan-btn ${p.style==='primary'?'btn-gold':p.style==='secondary'?'btn-rose':p.style==='outline'?'btn-outline':'btn-ghost'}`}>{p.cta}</button>
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
function UseCasesSection({ t }: any) {
  return (
    <section className="section">
      <div className="si">
        <div className="stag"><span className="sl"/>{t.useCases.tag}</div>
        <h2 className="sh2">{t.useCases.title}</h2>
        <p className="ssub">{t.useCases.sub}</p>
        <div className="uc-grid">
          {t.useCases.cases.map((c: any, i: number) => (
            <div key={i} className="uc-card">
              <div className="uc-ico">{c.icon}</div>
              <div className="uc-title">{c.title}</div>
              <p className="uc-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ t, onCta }: any) {
  return (
    <section className="cta-sec">
      <div className="cta-bg"><Stars n={50}/></div>
      <div className="cta-glow"/>
      <div className="cta-inner">
        <div className="stag stag-c"><span className="sl"/>{t.cta.tag}</div>
        <h2 className="cta-h2">{t.cta.title}</h2>
        <p className="cta-p">{t.cta.sub}</p>
        <button onClick={onCta} className="btn-gold btn-xl">
          {t.cta.btn}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p className="cta-note">{t.cta.note}</p>
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
      <div className="fi">
        <a href="/" className="flogo"><HexLogo size={20}/><span className="fname">HexAstra Coach</span></a>
        <p className="fcopy">© {t.footer.copy}</p>
        <div className="flinks">
          {t.footer.links.map((l: any, i: number) => <a key={i} href={l.href} className="flink">{l.label}</a>)}
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════
   PAGE ROOT
══════════════════════════════════════════ */
export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const t = T[lang]

  const scrollToChat = useCallback(() => {
    router.push('/chat')
  }, [router])

  const sendQuestion = useCallback((q: string) => {
    scrollToChat()
    // Small delay so scroll completes first
    setTimeout(() => {
      const ta = document.querySelector<HTMLTextAreaElement>('.chat-input')
      if (ta) { ta.value = q; ta.dispatchEvent(new Event('input', { bubbles: true })) }
    }, 400)
  }, [scrollToChat])

  const handleUpgrade = useCallback(async (planKey: string) => {
    if (planKey === 'free') { scrollToChat(); return }
    const priceKey = PRICE_KEYS[planKey]
    if (!priceKey) { router.push('/login'); return }
    try {
      const res  = await fetch('/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ priceKey }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else router.push('/login')
    } catch { router.push('/login') }
  }, [router, scrollToChat])

  return (
    <>
      <style>{CSS}</style>
      <div className="root">
        <Nav t={t} lang={lang} setLang={setLang} onCta={scrollToChat} />

        {/* 1 — Hero + Chat */}
        <Hero t={t} onCta={scrollToChat} />

        <div className="divider"/>

        {/* 2 — Comment ça marche */}
        <HowSection t={t} />

        <div className="divider"/>

        {/* 3 — Questions */}
        <QuestionsSection t={t} onQ={sendQuestion} />

        <div className="divider"/>

        {/* 4 — Pourquoi différent */}
        <WhySection t={t} />

        <div className="divider"/>

        {/* 5 — Cas d usage */}
        <UseCasesSection t={t} />

        <div className="divider"/>

        {/* 6 — Pricing */}
        <PricingSection t={t} onCta={handleUpgrade} />

        {/* 6 — CTA final */}
        <CTASection t={t} onCta={scrollToChat} />

        <Footer t={t} />
      </div>
    </>
  )
}

/* ══════════════════════════════════════════
   CSS — PALETTE SPECS DOC
   #0E0B08 fond · #C6A35F or · #F3EFEA ivoire
   Playfair Display + Inter
══════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

:root{
  --bg:   #0E0B08;
  --card: #14100C;
  --lift: #1C1612;
  --hi:   #241e18;
  --gold: #C6A35F;
  --gold2:#d4b26e;
  --goldD:rgba(198,163,95,0.12);
  --goldB:rgba(198,163,95,0.20);
  --ivoire:#F3EFEA;
  --iv72: rgba(243,239,234,0.72);
  --iv52: rgba(243,239,234,0.52);
  --iv28: rgba(243,239,234,0.28);
  --iv10: rgba(243,239,234,0.10);
  --rose: #b89d96;
  --f-t: 'Playfair Display', Georgia, serif;
  --f-b: 'Inter', system-ui, sans-serif;
  --f-m: 'DM Mono', monospace;
  --expo:cubic-bezier(0.16,1,0.3,1);
}

@keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes twinkle {0%,100%{opacity:.1}50%{opacity:.45}}
@keyframes breathe {0%,100%{opacity:.4;transform:translate(-50%,-50%) scale(1)}50%{opacity:.7;transform:translate(-50%,-50%) scale(1.1)}}
@keyframes pulse   {0%,100%{opacity:1}50%{opacity:.25}}
@keyframes dots    {0%,80%,100%{opacity:.25;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}
@keyframes slideIn {from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* BASE */
.root{background:var(--bg);color:var(--ivoire);font-family:var(--f-b);overflow-x:hidden;min-height:100vh}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--goldB),transparent);margin:0 48px}
.stars{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:16px 52px;transition:all .3s}
.nav-s{background:rgba(14,11,8,.92);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);box-shadow:0 1px 0 var(--goldB)}
.nav-logo{display:flex;align-items:center;gap:9px;text-decoration:none}
.nav-brand{font-family:var(--f-t);font-size:18px;font-weight:400;color:var(--ivoire)}
.nav-brand em{font-style:italic;color:var(--gold)}
.nav-links{display:flex;gap:28px}
.nl{font-size:13px;color:var(--iv72);text-decoration:none;transition:color .2s;letter-spacing:.02em}
.nl:hover{color:var(--gold)}
.nav-r{display:flex;align-items:center;gap:11px}
.lang-p{display:flex;background:var(--iv10);border:1px solid var(--goldB);border-radius:6px;overflow:hidden}
.lb{padding:5px 10px;font-family:var(--f-m);font-size:10px;letter-spacing:.12em;color:var(--iv52);background:transparent;border:none;cursor:pointer;transition:all .2s}
.la{background:var(--gold)!important;color:var(--bg)!important;font-weight:600}
.ncta{font-size:12.5px!important;padding:8px 18px!important}

/* BUTTONS */
.btn-gold{padding:12px 26px;background:var(--gold);color:var(--bg);font-family:var(--f-b);font-size:14px;font-weight:600;letter-spacing:.02em;border:none;border-radius:50px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 6px 28px rgba(198,163,95,.28);transition:all .22s;white-space:nowrap;text-decoration:none}
.btn-gold:hover{background:var(--gold2);transform:translateY(-2px);box-shadow:0 12px 40px rgba(198,163,95,.4)}
.btn-rose{padding:12px 26px;background:rgba(184,157,150,.1);color:var(--rose);font-family:var(--f-b);font-size:14px;font-weight:500;border:1px solid rgba(184,157,150,.25);border-radius:50px;cursor:pointer;transition:all .2s;white-space:nowrap}
.btn-rose:hover{background:rgba(184,157,150,.18)}
.btn-ghost{padding:12px 24px;background:transparent;color:var(--iv72);font-family:var(--f-b);font-size:14px;font-weight:400;border:1px solid var(--iv28);border-radius:50px;cursor:pointer;transition:all .22s;white-space:nowrap;display:inline-flex;align-items:center;gap:7px;text-decoration:none}
.btn-ghost:hover{border-color:var(--iv52);color:var(--ivoire)}
.btn-outline{padding:12px 24px;background:transparent;color:var(--iv72);font-family:var(--f-b);font-size:14px;border:1px solid var(--goldB);border-radius:50px;cursor:pointer;transition:all .22s;white-space:nowrap}
.btn-outline:hover{border-color:var(--gold);color:var(--gold)}
.btn-xl{font-size:16px!important;padding:16px 42px!important}

/* HERO */
.hero{min-height:100vh;padding:130px 52px 100px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.hero-bg{position:absolute;inset:0;overflow:hidden}
.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(198,163,95,.07),rgba(184,157,150,.03) 50%,transparent 70%);pointer-events:none;animation:breathe 11s ease-in-out infinite}
.hero-center{position:relative;z-index:1;max-width:760px;width:100%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:28px;animation:fadeUp .8s var(--expo) both}
.eyebrow{display:flex;align-items:center;justify-content:center;gap:8px;font-family:var(--f-m);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--rose);opacity:.9}
.eydot{width:5px;height:5px;border-radius:50%;background:var(--rose);animation:pulse 2.5s ease infinite;flex-shrink:0}
.hero-h1{font-family:var(--f-t);font-size:clamp(38px,5.5vw,72px);font-weight:700;font-style:italic;line-height:1.06;color:var(--ivoire);letter-spacing:-.025em}
.hero-p{font-family:var(--f-b);font-size:18px;font-weight:300;line-height:1.88;color:var(--iv72);max-width:560px}
.hero-points-row{display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;row-gap:10px}
.hero-btns{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap}
.hp{display:flex;align-items:center;gap:8px;font-family:var(--f-m);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--iv72);padding:0 16px}
.hp-sep{width:1px;height:14px;background:var(--iv28);flex-shrink:0}
.hp-dot{width:4px;height:4px;border-radius:50%;background:var(--gold);opacity:.7;flex-shrink:0}
.hero-trust{font-family:var(--f-m);font-size:10px;color:var(--iv52);letter-spacing:.1em}

/* CHAT CARD */
.chat-card{background:var(--card);border:1px solid var(--goldB);border-radius:20px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.55),0 0 0 1px rgba(198,163,95,.04) inset;display:flex;flex-direction:column;max-height:600px}
.chat-head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:var(--lift);border-bottom:1px solid var(--goldB);gap:12px;flex-wrap:wrap}
.ch-left{display:flex;align-items:center;gap:10px;flex-shrink:0}
.ch-title{font-family:var(--f-t);font-size:15px;font-weight:500;color:var(--ivoire)}
.ch-status{display:flex;align-items:center;gap:5px;font-family:var(--f-m);font-size:9px;letter-spacing:.1em;color:var(--iv52);text-transform:uppercase}
.ch-dot{width:5px;height:5px;border-radius:50%;background:#5db87a;animation:pulse 2s ease infinite}

/* Stage bar */
.stage-bar{display:flex;gap:4px;align-items:center;flex-wrap:wrap}
.stage-step{font-family:var(--f-m);font-size:8px;letter-spacing:.1em;padding:3px 8px;border-radius:100px;color:var(--iv28);border:1px solid var(--iv10);transition:all .4s;white-space:nowrap}
.stage-on{color:var(--gold);border-color:rgba(198,163,95,.35);background:var(--goldD)}

/* Messages */
.chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:180px;scroll-behavior:smooth}
.chat-body::-webkit-scrollbar{width:2px}
.chat-body::-webkit-scrollbar-thumb{background:var(--goldB);border-radius:2px}
.msg{display:flex;gap:8px;align-items:flex-end;animation:slideIn .3s var(--expo) both}
.msg-user{flex-direction:row-reverse}
.msg-av{width:24px;height:24px;border-radius:50%;border:1px solid var(--goldB);display:flex;align-items:center;justify-content:center;background:var(--goldD);flex-shrink:0}
.msg-bubble{font-family:var(--f-b);font-size:13.5px;font-weight:300;line-height:1.72;padding:10px 14px;border-radius:16px;max-width:70ch}
.msg-user .msg-bubble{background:var(--goldD);border:1px solid var(--goldB);color:var(--ivoire);border-radius:16px 16px 4px 16px}
.msg-ai .msg-bubble{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--iv72);border-radius:16px 16px 16px 4px}
.msg-typing{display:flex!important;align-items:center;gap:5px;padding:12px 16px!important;min-width:52px}
.msg-typing span{width:6px;height:6px;border-radius:50%;background:var(--gold);animation:dots 1.2s ease infinite;flex-shrink:0}
.msg-typing span:nth-child(2){animation-delay:.18s}
.msg-typing span:nth-child(3){animation-delay:.36s}

/* Mode bar */
.chat-mode-bar{padding:8px 14px;border-top:1px solid var(--iv10);display:flex;align-items:center;flex-wrap:wrap;gap:8px}
.mode-toggle{display:flex;background:var(--iv10);border:1px solid var(--iv10);border-radius:6px;overflow:hidden}
.mode-btn{padding:4px 12px;font-family:var(--f-m);font-size:9.5px;letter-spacing:.12em;color:var(--iv52);background:transparent;border:none;cursor:pointer;transition:all .2s}
.mode-on{background:var(--goldD)!important;color:var(--gold)!important;border-right:1px solid var(--goldB)}
.persona-row{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.persona-q{font-family:var(--f-b);font-size:11px;color:var(--iv52)}
.persona-btn{font-family:var(--f-m);font-size:9.5px;letter-spacing:.1em;padding:3px 10px;border-radius:100px;border:1px solid var(--iv28);color:var(--iv52);background:transparent;cursor:pointer;transition:all .2s}
.persona-on{border-color:var(--gold)!important;color:var(--gold)!important;background:var(--goldD)!important}

/* Chips */
.chat-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;border-top:1px solid var(--iv10)}
.chip{font-family:var(--f-b);font-size:11.5px;color:var(--rose);background:rgba(184,157,150,.08);border:1px solid rgba(184,157,150,.2);border-radius:50px;padding:5px 13px;cursor:pointer;transition:all .2s;white-space:nowrap}
.chip:hover{background:rgba(184,157,150,.18);border-color:rgba(184,157,150,.38)}

/* Input */
.chat-input-area{display:flex;gap:8px;align-items:flex-end;padding:10px 14px;border-top:1px solid var(--goldB)}
.chat-input{flex:1;font-family:var(--f-b);font-size:13.5px;font-weight:300;color:var(--ivoire);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 14px;resize:none;line-height:1.5;transition:border-color .2s;min-height:42px;max-height:120px}
.chat-input::placeholder{color:var(--iv52)}
.chat-input:focus{border-color:var(--goldB);outline:none}
.chat-send{width:38px;height:38px;border-radius:50%;background:var(--gold);color:var(--bg);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;box-shadow:0 4px 16px rgba(198,163,95,.25)}
.chat-send:hover:not(:disabled){background:var(--gold2);transform:scale(1.05)}
.chat-send:disabled{opacity:.4;cursor:not-allowed}
.chat-micro{padding:6px 14px 10px;font-family:var(--f-m);font-size:9.5px;color:var(--iv52);letter-spacing:.08em;text-align:center}

/* SECTIONS */
.section{padding:92px 52px;position:relative}
.section-alt{background:rgba(255,255,255,.02)}
.si{max-width:1100px;margin:0 auto}
.stag{display:flex;align-items:center;gap:9px;font-family:var(--f-m);font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--rose);margin-bottom:18px}
.stag-c{justify-content:center}
.sl{width:24px;height:1px;background:var(--rose);opacity:.5;flex-shrink:0}
.sh2{font-family:var(--f-t);font-size:clamp(28px,3.5vw,50px);font-weight:500;color:var(--ivoire);line-height:1.1;letter-spacing:-.015em;margin-bottom:14px}
.ssub{font-family:var(--f-b);font-size:16px;font-weight:300;color:var(--iv72);line-height:1.88;max-width:520px}
.eg{font-style:italic;color:var(--gold)}

/* HOW */
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;margin-top:48px}
.how-card{background:var(--card);border:1px solid var(--goldB);padding:34px 28px;display:flex;flex-direction:column;gap:14px;transition:background .25s,transform .25s;position:relative;overflow:hidden}
.how-card:first-child{border-radius:16px 0 0 16px}
.how-card:last-child{border-radius:0 16px 16px 0}
.how-card:hover{background:var(--lift);transform:translateY(-4px)}
.how-n{font-family:var(--f-t);font-size:64px;font-weight:700;font-style:italic;color:var(--goldB);line-height:1;pointer-events:none}
.how-sep{height:1px;background:linear-gradient(90deg,var(--goldB),transparent)}
.how-title{font-family:var(--f-t);font-size:19px;font-weight:500;color:var(--ivoire);letter-spacing:-.01em}
.how-desc{font-family:var(--f-b);font-size:13.5px;font-weight:300;color:var(--iv72);line-height:1.8}

/* QUESTIONS */
.q-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:44px}
.q-item{display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--goldB);border-radius:12px;padding:16px 20px;cursor:pointer;text-align:left;font-family:var(--f-b);font-size:14.5px;font-weight:300;color:var(--iv72);transition:all .22s;width:100%}
.q-item:hover{background:var(--lift);border-color:rgba(198,163,95,.38);color:var(--ivoire);transform:translateX(5px)}
.q-arr{font-size:15px;color:var(--gold);opacity:.55;flex-shrink:0;transition:all .2s}
.q-item:hover .q-arr{opacity:1;transform:translateX(4px)}
.q-hint{font-family:var(--f-m);font-size:10px;color:var(--iv52);text-align:center;letter-spacing:.1em;margin-top:20px}

/* WHY */
.why-top{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start}
.why-left{display:flex;flex-direction:column;gap:14px}
.why-points{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.why-pt{display:flex;gap:12px;align-items:flex-start;background:var(--card);border:1px solid var(--goldB);border-radius:14px;padding:18px;transition:all .25s}
.why-pt:hover{background:var(--lift);transform:translateY(-3px)}
.why-ico{font-size:20px;color:var(--gold);opacity:.7;flex-shrink:0;margin-top:1px}
.why-ptitle{font-family:var(--f-t);font-size:15px;font-weight:500;color:var(--ivoire);margin-bottom:5px;letter-spacing:-.01em}
.why-pdesc{font-family:var(--f-b);font-size:12.5px;font-weight:300;color:var(--iv72);line-height:1.7}
.trust-box{margin-top:44px;background:var(--card);border:1px solid var(--goldB);border-radius:18px;padding:28px 32px}
.trust-title{font-family:var(--f-t);font-size:20px;font-weight:500;color:var(--ivoire);margin-bottom:10px;letter-spacing:-.01em}
.trust-body{font-family:var(--f-b);font-size:14.5px;font-weight:300;color:var(--iv72);line-height:1.82;max-width:600px;margin-bottom:18px}
.trust-pts{display:flex;flex-wrap:wrap;gap:10px 24px}
.trust-p{display:flex;align-items:center;gap:8px;font-family:var(--f-b);font-size:13.5px;color:var(--iv72)}
.trust-chk{color:var(--gold);font-weight:700}

/* PRICING */
.plans{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:48px;align-items:start}
.plan{background:var(--card);border:1px solid var(--goldB);border-radius:20px;padding:24px;position:relative;display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s}
.plan:hover{transform:translateY(-4px);box-shadow:0 20px 56px rgba(0,0,0,.4)}
.plan-f{border-color:rgba(198,163,95,.42);background:var(--lift);box-shadow:0 0 0 1px rgba(198,163,95,.1),0 28px 64px rgba(0,0,0,.5)}
.plan-pop{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--bg);font-family:var(--f-m);font-size:9px;letter-spacing:.14em;padding:3px 14px;border-radius:100px;white-space:nowrap;font-weight:600}
.plan-tag{font-family:var(--f-m);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--iv52);margin-bottom:8px}
.plan-name{font-family:var(--f-t);font-size:22px;font-weight:500;color:var(--ivoire);letter-spacing:-.01em}
.plan-pr{display:flex;align-items:baseline;gap:2px;margin:10px 0 5px}
.plan-amt{font-family:var(--f-t);font-size:46px;font-weight:700;color:var(--ivoire);line-height:1}
.plan-eur{font-family:var(--f-m);font-size:14px;color:var(--iv72);align-self:flex-start;margin-top:7px}
.plan-per{font-family:var(--f-m);font-size:10px;color:var(--iv52);letter-spacing:.06em}
.plan-desc{font-family:var(--f-b);font-size:12.5px;font-style:italic;color:var(--iv72);line-height:1.6;margin-bottom:16px}
.plan-sep{height:1px;background:var(--iv10);margin-bottom:14px}
.plan-feats{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:20px;flex:1;padding:0}
.pf{display:flex;align-items:flex-start;gap:7px;font-family:var(--f-b);font-size:12px;line-height:1.5}
.pf span{flex-shrink:0;font-size:11px;margin-top:1px}
.pf-ok{color:var(--iv72)}.pf-ok span{color:var(--gold)}
.pf-no{color:var(--iv28)}.pf-no span{color:var(--iv28)}
.plan-btn{width:100%}
.price-note{font-family:var(--f-m);font-size:10px;color:var(--iv52);text-align:center;letter-spacing:.1em;margin-top:24px}

/* CTA */
.cta-sec{position:relative;overflow:hidden;padding:120px 52px;text-align:center}
.cta-bg{position:absolute;inset:0;overflow:hidden}
.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:900px;height:500px;border-radius:50%;background:radial-gradient(ellipse,rgba(198,163,95,.08),rgba(184,157,150,.04) 45%,transparent 70%);pointer-events:none}
.cta-inner{position:relative;z-index:1;max-width:600px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:22px}
.cta-h2{font-family:var(--f-t);font-size:clamp(34px,5vw,62px);font-weight:700;font-style:italic;color:var(--ivoire);line-height:1.06;letter-spacing:-.02em}
.cta-p{font-family:var(--f-b);font-size:17px;font-weight:300;color:var(--iv72);line-height:1.82}
.cta-note{font-family:var(--f-m);font-size:10px;color:var(--iv52);letter-spacing:.1em}

/* FOOTER */
.footer{border-top:1px solid var(--iv10);background:rgba(0,0,0,.3);padding:26px 52px}
.fi{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px}
.flogo{display:flex;align-items:center;gap:8px;text-decoration:none}
.fname{font-family:var(--f-t);font-size:15px;font-weight:400;color:var(--iv72)}
.fcopy{font-family:var(--f-m);font-size:10px;color:var(--iv52);letter-spacing:.1em}
.flinks{display:flex;gap:20px}
.flink{font-family:var(--f-b);font-size:12px;color:var(--iv52);text-decoration:none;transition:color .2s}
.flink:hover{color:var(--gold)}

/* USE CASES */
.uc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}
.uc-card{background:var(--card);border:1px solid var(--goldB);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:12px;transition:all .25s;position:relative;overflow:hidden}
.uc-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);opacity:0;transition:opacity .3s}
.uc-card:hover{background:var(--lift);transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,.4)}
.uc-card:hover::after{opacity:1}
.uc-ico{font-size:24px;color:var(--gold);opacity:.7;line-height:1}
.uc-title{font-family:var(--f-t);font-size:16.5px;font-weight:500;color:var(--ivoire);letter-spacing:-.01em}
.uc-desc{font-family:var(--f-b);font-size:13px;font-weight:300;color:var(--iv72);line-height:1.78}

/* RESPONSIVE */
@media(max-width:1100px){
  .plans{grid-template-columns:repeat(2,1fr)}
  .why-top{grid-template-columns:1fr}
  .why-points{grid-template-columns:1fr 1fr}
}
@media(max-width:900px){
  .nav{padding:13px 20px}.nav-links{display:none}
  .hero{padding:90px 20px 60px}
  .hero-inner{grid-template-columns:1fr;gap:36px}
  .section{padding:68px 20px}
  .divider{margin:0 20px}
  .how-grid{grid-template-columns:1fr;gap:2px}
  .uc-grid{grid-template-columns:1fr 1fr}
  .how-card:first-child{border-radius:16px 16px 0 0}
  .how-card:last-child{border-radius:0 0 16px 16px}
  .q-grid{grid-template-columns:1fr}
  .why-points{grid-template-columns:1fr}
  .plans{grid-template-columns:1fr}
  .cta-sec{padding:80px 20px}
  .footer{padding:22px 20px}
}
`
