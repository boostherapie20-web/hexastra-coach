'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

/* ─── TYPES ──────────────────────────────────────────────────────────────── */
type PreviewMsg = { role: 'user' | 'ai'; text: string; isGate?: boolean }

/* ─── MOCK RESPONSES ─────────────────────────────────────────────────────── */
const RESPONSES: Record<string, string> = {
  default:  "Your current configuration points to a period of internal reorganization. What feels like hesitation is actually discernment — your system is calibrating before a meaningful shift.\n\nA clearer picture awaits in your full reading...",
  relation: "The relational tension you're sensing reflects a Venus-Node alignment asking for honesty over comfort. This is not a rupture — it's an invitation to deepen.\n\nYour full reading includes a detailed love & connection analysis...",
  work:     "A Jupiter transit is activating your professional axis right now. The uncertainty you feel is the space between what was and what's coming — a repositioning, not a setback.\n\nYour full reading includes career & financial dynamics...",
  decision: "Your inner authority is signaling something your analytical mind hasn't fully processed yet. The hesitation is data, not weakness.\n\nYour full reading reveals your decision-making profile...",
}

function getResponse(q: string): string {
  const ql = q.toLowerCase()
  if (ql.includes('love') || ql.includes('relation') || ql.includes('amour') || ql.includes('couple')) return RESPONSES.relation
  if (ql.includes('work') || ql.includes('travail') || ql.includes('job') || ql.includes('career')) return RESPONSES.work
  if (ql.includes('decision') || ql.includes('décision') || ql.includes('choice') || ql.includes('choix')) return RESPONSES.decision
  return RESPONSES.default
}

/* ─── COMPONENTS ─────────────────────────────────────────────────────────── */

function HeroSection({ onCta }: { onCta: () => void }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<PreviewMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleAsk = async () => {
    const q = question.trim()
    if (!q || isTyping) return
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setQuestion('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1900))
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'ai', text: getResponse(q), isGate: true }])
    setShowGate(true)
  }

  return (
    <section style={hero.section}>
      {/* Backgrounds */}
      <div style={hero.bg} />
      <div style={hero.grid} />
      <div style={hero.orb} />

      {/* Left content */}
      <div style={hero.left}>
        <div style={hero.eyebrow}>
          <span style={hero.eyebrowDot} />
          Personal intelligence · AI-powered
        </div>

        <h1 style={hero.title}>
          HexAstra<br />
          <span style={hero.titleAccent}>Coach</span>
        </h1>

        <p style={hero.sub}>
          Understand your inner state.<br />
          Make clearer decisions.<br />
          Move forward with confidence.
        </p>

        <div style={hero.ctas}>
          <button onClick={onCta} style={btn.primary}>
            Start a reading
            <Arrow />
          </button>
          <a href="#how" style={btn.ghost}>How it works</a>
        </div>

        <div style={hero.trust}>
          <div style={hero.trustAvs}>
            {['S','M','L','A','R'].map((l, i) => (
              <div key={i} style={{ ...hero.trustAv, marginLeft: i > 0 ? '-7px' : 0 }}>{l}</div>
            ))}
          </div>
          <span style={hero.trustTxt}>2,400+ readings · 4.9 / 5</span>
        </div>
      </div>

      {/* Right: live preview widget */}
      <div style={hero.widget}>
        <div style={widget.bar}>
          <div style={widget.dots}>
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => <span key={i} style={{ ...widget.dot, background: c }} />)}
          </div>
          <span style={widget.title}>Free preview · no sign-up</span>
          <div style={widget.live}><span style={widget.liveDot} />Live</div>
        </div>

        <div style={widget.body}>
          {messages.length === 0 && !isTyping && (
            <div style={widget.row}>
              <AiAvatar />
              <div style={widget.bubAi}>
                <p style={widget.txt}>Ask me anything about your current situation — no account needed for your first insight.</p>
                <div style={widget.suggs}>
                  {['My love life', 'A decision I need to make', 'My career right now'].map((s, i) => (
                    <button key={i} style={widget.sugg} onClick={() => setQuestion(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ ...widget.row, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && <AiAvatar />}
              <div style={msg.role === 'user' ? widget.bubUser : widget.bubAi}>
                <p style={widget.txt}>{msg.text}</p>
                {msg.isGate && (
                  <div style={widget.gate}>
                    <div style={widget.gateLock}>
                      <LockIcon />
                      <span style={widget.gateLockTxt}>Full reading available</span>
                    </div>
                    <p style={widget.gateDesc}>Create your free account to receive your complete personalized reading.</p>
                    <button onClick={onCta} style={widget.gateBtn}>Continue for free →</button>
                    <p style={widget.gateSub}>
                      Already a member?{' '}
                      <span style={widget.gateLink} onClick={onCta}>Sign in</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={widget.row}>
              <AiAvatar />
              <div style={widget.bubAi}>
                <div style={widget.typingDots}>
                  {[0,1,2].map(i => <span key={i} style={{ ...widget.typingDot, animationDelay: `${i*0.18}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {!showGate && (
          <div style={widget.composer}>
            <div style={widget.compInner}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAsk()}
                placeholder="Ask about your situation…"
                style={widget.input}
                disabled={isTyping}
              />
              <button
                onClick={handleAsk}
                disabled={!question.trim() || isTyping}
                style={{ ...widget.sendBtn, opacity: !question.trim() || isTyping ? 0.3 : 1 }}
              >
                <SendIcon />
              </button>
            </div>
            <p style={widget.compNote}>Free · No credit card · No sign-up</p>
          </div>
        )}
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      n: '01',
      title: 'Enter your birth information',
      desc: 'Date, time and place of birth. HexAstra uses this to map your current energy configuration with precision.',
      icon: <CalendarIcon />,
    },
    {
      n: '02',
      title: 'HexAstra analyzes your dynamics',
      desc: 'Planetary transits, Human Design gates, numerological cycles — all synthesized into one coherent view of your current life energy.',
      icon: <ClockIcon />,
    },
    {
      n: '03',
      title: 'Receive your reading',
      desc: 'A clear, actionable reading about your love life, work, mood, health and direction. Available as text, PDF, or personal audio.',
      icon: <DocIcon />,
    },
  ]

  return (
    <section id="how" style={section.wrap}>
      <div style={section.inner}>
        <SectionTag label="How it works" />
        <h2 style={section.title}>Three steps to <em style={section.em}>clarity</em></h2>
        <p style={section.sub}>No complex charts. No jargon. A clear, personal reading about where you are right now.</p>

        <div style={how.grid}>
          {steps.map((step, i) => (
            <div key={i} style={how.card} className="step-card">
              <div style={how.cardTop}>
                <div style={how.iconWrap}>{step.icon}</div>
                <div style={how.num}>{step.n}</div>
              </div>
              <h3 style={how.cardTitle}>{step.title}</h3>
              <p style={how.cardDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReadingPreview() {
  const [active, setActive] = useState<number | null>(null)
  const cards = [
    { icon: '♥', title: 'Love & Connection', desc: 'Understand the relational dynamics at play and what this moment is teaching you about intimacy and connection.' },
    { icon: '◈', title: 'Work & Money', desc: 'Clarity on your professional energy, current opportunities, and the financial patterns shaping your decisions.' },
    { icon: '◯', title: 'Mood & Inner State', desc: 'A precise read of your emotional weather — not just how you feel, but why, and what to do with it.' },
    { icon: '✦', title: 'Health & Energy', desc: 'Physical and energetic rhythms. When to push, when to rest, and what your body is communicating right now.' },
    { icon: '→', title: 'Life Direction', desc: 'The bigger picture. Where you are in your longer cycle and what this phase is preparing you for.' },
  ]

  return (
    <section style={{ ...section.wrap, background: 'var(--bg2)' }}>
      <div style={section.inner}>
        <SectionTag label="What you receive" />
        <h2 style={section.title}>Your personal reading <em style={section.em}>includes</em></h2>
        <p style={section.sub}>Each reading covers the five areas that shape how you experience your life day to day.</p>

        <div style={reading.grid}>
          {cards.map((card, i) => (
            <div
              key={i}
              style={{ ...reading.card, ...(active === i ? reading.cardActive : {}) }}
              onClick={() => setActive(active === i ? null : i)}
              className="reading-card"
            >
              <div style={reading.cardIcon}>{card.icon}</div>
              <div style={reading.cardTitle}>{card.title}</div>
              <p style={reading.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExampleReading({ onCta }: { onCta: () => void }) {
  return (
    <section style={section.wrap}>
      <div style={section.inner}>
        <SectionTag label="Example reading" />
        <h2 style={section.title}>What a reading <em style={section.em}>feels like</em></h2>
        <p style={section.sub}>Clear. Personal. Useful. Not vague affirmations — actual insight about your current configuration.</p>

        <div style={example.card}>
          <div style={example.header}>
            <div style={example.headerLeft}>
              <div style={example.avatar}>
                <Image src="/logo/hexastra.png" alt="" width={38} height={38} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
              <div>
                <div style={example.name}>Sarah M.</div>
                <div style={example.date}>Today · Premium Reading</div>
              </div>
            </div>
            <div style={example.badge}>◆ Full reading</div>
          </div>

          <div style={example.body}>
            {[
              { tag: 'Energy of the day', title: 'An invitation to slow down', txt: 'An inner movement invites you to slow down and clarify what truly deserves your attention. This is not lethargy — it is selective focus. Your system is filtering signal from noise.' },
              { tag: 'Understanding', title: 'A phase, not a blockage', txt: 'What you feel is not a blockage, but a phase of internal reorganization. Something is completing and something new is forming — the discomfort is the transition itself.' },
              { tag: 'Action', title: 'One decision, clearly', txt: 'Simplify your day and focus on one important decision. The energy available today is precise, not broad. Use it for depth, not breadth.' },
            ].map((block, i) => (
              <div key={i}>
                <div style={example.block}>
                  <div style={example.blockTag}>{block.tag}</div>
                  <div style={example.blockTitle}>{block.title}</div>
                  <p style={example.blockTxt}>{block.txt}</p>
                </div>
                {i < 2 && <div style={example.divider} />}
              </div>
            ))}

            <div style={example.divider} />
            <div style={example.ctaRow}>
              <p style={example.ctaNote}>Full reading: 6 pages · PDF · Personal audio</p>
              <button onClick={onCta} style={{ ...btn.primary, fontSize: '13px', padding: '11px 22px' }}>
                Get my reading →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PractitionerSection({ onCta }: { onCta: () => void }) {
  const useCases = ['Coaching sessions', 'Life transitions', 'Personal blockages', 'Decision making', 'Emotional support', 'Life direction']
  const benefits = [
    { icon: '◎', title: 'Clarify complex situations', desc: 'Identify deeper dynamics behind a client\'s current state.' },
    { icon: '◈', title: 'Structure sessions', desc: 'Use the reading as a structured starting point for conversations.' },
    { icon: '◇', title: 'Save analysis time', desc: 'Get a synthesized perspective that highlights the most relevant areas.' },
    { icon: '◆', title: 'Enrich professional practice', desc: 'Complement coaching, therapy or guidance approaches.' },
  ]
  const profiles = ['Coaches', 'Therapists', 'Personal development practitioners', 'Holistic practitioners', 'Guides & facilitators']

  return (
    <section style={{ ...section.wrap, background: 'var(--bg2)' }}>
      <div style={section.inner}>
        <SectionTag label="For professionals" />
        <h2 style={section.title}>HexAstra for <em style={section.em}>practitioners</em></h2>
        <p style={{ ...section.sub, maxWidth: '620px' }}>
          A powerful reading and analysis tool to enrich professional guidance.
        </p>

        {/* Profile tags */}
        <div style={prac.tags}>
          {profiles.map((p, i) => (
            <span key={i} style={prac.tag}>{p}</span>
          ))}
        </div>

        {/* Main explanation */}
        <div style={prac.explainGrid}>
          <div style={prac.explainLeft}>
            <p style={prac.explainTxt}>
              HexAstra Coach was designed to support practitioners who want to deepen their understanding of the people they accompany.
            </p>
            <p style={prac.explainTxt}>
              The system analyzes several dimensions of a person's dynamics and synthesizes them into a structured reading that can be used during sessions.
            </p>
            <div style={prac.positionCard}>
              <div style={prac.positionTag}>// Positioning</div>
              <div style={prac.positionTitle}>A professional support tool</div>
              <p style={prac.positionTxt}>
                HexAstra is designed as a reading and analysis assistant. It helps highlight patterns, cycles and dynamics that may influence a person's decisions, emotions or life transitions.
              </p>
              <p style={{ ...prac.positionTxt, marginTop: '10px', fontStyle: 'italic', opacity: 0.8 }}>
                The practitioner remains the final interpreter and integrates the reading within their own professional approach.
              </p>
            </div>
          </div>

          <div style={prac.benefitGrid}>
            {benefits.map((b, i) => (
              <div key={i} style={prac.benefitCard} className="prac-card">
                <div style={prac.benefitIcon}>{b.icon}</div>
                <div style={prac.benefitTitle}>{b.title}</div>
                <p style={prac.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div style={prac.useCaseWrap}>
          <div style={prac.useCaseTag}>// Use cases</div>
          <div style={prac.useCaseRow}>
            {useCases.map((u, i) => (
              <div key={i} style={prac.useCaseItem}>
                <span style={prac.useCaseDot}>◦</span>
                {u}
              </div>
            ))}
          </div>
        </div>

        <button onClick={onCta} style={{ ...btn.secondary, alignSelf: 'flex-start' }}>
          Start as a practitioner →
        </button>
      </div>
    </section>
  )
}

function PricingSection({ onCta }: { onCta: () => void }) {
  const plans = [
    {
      tag: '// Starter',
      name: 'Free',
      price: '0', per: '',
      desc: 'Discover what HexAstra can reveal. No commitment.',
      features: [
        { t: '1 short reading per day', ok: true },
        { t: 'Text format only', ok: true },
        { t: 'Chat access', ok: true },
        { t: 'Save up to 3 readings', ok: true },
        { t: 'PDF export', ok: false },
        { t: 'Audio version', ok: false },
        { t: 'Advanced themes', ok: false },
      ],
      cta: 'Start for free', style: 'ghost' as const, featured: false,
    },
    {
      tag: '// Premium',
      name: 'Premium',
      price: '19', per: '/month',
      desc: 'Your full personal reading, as deep as you want to go.',
      features: [
        { t: 'Unlimited readings', ok: true },
        { t: 'Full personalized reading', ok: true },
        { t: '7-day reading arc', ok: true },
        { t: 'PDF export (6 pages)', ok: true },
        { t: 'Audio version (7 min)', ok: true },
        { t: 'Advanced themes', ok: true },
        { t: 'Priority support', ok: true },
      ],
      cta: 'Start Premium →', style: 'primary' as const, featured: true,
    },
    {
      tag: '// Professional',
      name: 'Practitioner',
      price: '49', per: '/month',
      desc: 'For coaches and therapists integrating HexAstra into their practice.',
      features: [
        { t: 'Full system access', ok: true },
        { t: 'Client session use', ok: true },
        { t: 'Reading generation tools', ok: true },
        { t: 'Professional usage rights', ok: true },
        { t: 'PDF + audio for every reading', ok: true },
        { t: 'Export & share readings', ok: true },
        { t: 'Dedicated support', ok: true },
      ],
      cta: 'Start Practitioner →', style: 'secondary' as const, featured: false,
    },
  ]

  return (
    <section id="pricing" style={section.wrap}>
      <div style={section.inner}>
        <SectionTag label="Pricing" />
        <h2 style={section.title}>Start free. <em style={section.em}>Go deeper</em> when ready.</h2>
        <p style={section.sub}>No commitment. Upgrade or cancel anytime.</p>

        <div style={pricing.grid}>
          {plans.map((plan, i) => (
            <div key={i} style={{ ...pricing.card, ...(plan.featured ? pricing.cardFeatured : {}) }} className="plan-card">
              {plan.featured && <div style={pricing.badge}>Most popular</div>}
              <div style={pricing.planTag}>{plan.tag}</div>
              <div style={pricing.planName}>{plan.name}</div>
              <div style={pricing.planPrice}>
                <span style={pricing.planAmt}>{plan.price}</span>
                <span style={pricing.planCur}>€</span>
                {plan.per && <span style={pricing.planPer}>{plan.per}</span>}
              </div>
              <p style={pricing.planDesc}>{plan.desc}</p>
              <div style={pricing.divider} />
              <ul style={pricing.features}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ ...pricing.feature, ...(f.ok ? {} : pricing.featureOff) }}>
                    <span style={f.ok ? pricing.check : pricing.cross}>{f.ok ? '✓' : '✕'}</span>
                    {f.t}
                  </li>
                ))}
              </ul>
              <button
                onClick={onCta}
                style={plan.style === 'primary' ? btn.primary : plan.style === 'secondary' ? btn.secondary : btn.ghost}
                className="plan-btn"
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p style={pricing.note}>No credit card required to start · Cancel anytime</p>
      </div>
    </section>
  )
}

/* ─── SMALL REUSABLE PIECES ──────────────────────────────────────────────── */
function SectionTag({ label }: { label: string }) {
  return (
    <div style={section.tag}>
      <span style={section.tagLine} />
      {label}
    </div>
  )
}
function AiAvatar() {
  return (
    <div style={widget.av}>
      <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    </div>
  )
}
function Arrow() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
}
function LockIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C6A769" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
}
function SendIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function CalendarIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>
}
function ClockIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
}
function DocIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
}

/* ─── ROOT PAGE ──────────────────────────────────────────────────────────── */
export default function Page() {
  const router = useRouter()
  const goLogin = () => router.push('/login')

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: 'var(--bg)', color: 'var(--cream)', fontFamily: 'var(--f-body)', overflowX: 'hidden', minHeight: '100vh' }}>

        {/* STICKY NAV */}
        <nav style={nav.wrap}>
          <a href="/" style={nav.logo}>
            <Image src="/logo/hexastra.png" alt="HexAstra" width={34} height={34} style={nav.logoImg} />
            <span style={nav.logoTxt}>HexAstra <span style={nav.logoAccent}>Coach</span></span>
          </a>
          <div style={nav.links}>
            <a href="#how" style={nav.link}>How it works</a>
            <a href="#practitioners" style={nav.link}>Practitioners</a>
            <a href="#pricing" style={nav.link}>Pricing</a>
            <button onClick={goLogin} style={nav.link as React.CSSProperties} className="nav-link-btn">Sign in</button>
          </div>
          <button onClick={goLogin} style={btn.primary} className="nav-cta">
            Start a reading
          </button>
        </nav>

        {/* SECTIONS */}
        <HeroSection onCta={goLogin} />
        <Divider />
        <HowItWorksSection />
        <Divider />
        <ReadingPreview />
        <Divider />
        <ExampleReading onCta={goLogin} />
        <Divider />
        <div id="practitioners"><PractitionerSection onCta={goLogin} /></div>
        <Divider />
        <PricingSection onCta={goLogin} />
        <Divider />

        {/* FINAL CTA */}
        <section style={{ ...section.wrap, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(198,167,105,0.08), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
            <SectionTag label="Your reading is ready" />
            <h2 style={{ ...section.title, textAlign: 'center', margin: 0 }}>
              Understand <em style={section.em}>where you are.</em><br />
              Move forward with clarity.
            </h2>
            <p style={{ ...section.sub, textAlign: 'center' }}>Takes 2 minutes. Free to start.</p>
            <button onClick={goLogin} style={{ ...btn.primary, fontSize: '15px', padding: '16px 38px' }}>
              Start my reading <Arrow />
            </button>
            <p style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--cream3)', letterSpacing: '0.1em' }}>
              Premium · 19 €/month · Practitioner · 49 €/month · No commitment
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={footer.wrap}>
          <div style={footer.inner}>
            <a href="/" style={footer.logo}>
              <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 6px rgba(198,167,105,0.4))' }} />
              <span style={footer.logoTxt}>HexAstra Coach</span>
            </a>
            <p style={footer.txt}>© 2026 HexAstra · Personal intelligence by AI</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[['#how','How it works'],['#practitioners','Practitioners'],['#pricing','Pricing'],['/login','Sign in']].map(([href, label]) => (
                <a key={href} href={href} style={footer.link}>{label}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

function Divider() {
  return <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(198,167,105,0.2), transparent)', margin: '0 48px' }} />
}

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:      #2C1A14;
  --bg2:     #241610;
  --bg3:     #1E1109;
  --panel:   #3A2218;
  --panel2:  #452A1E;
  --gold:    #C6A769;
  --gold2:   #D4B87A;
  --goldDim: rgba(198,167,105,0.1);
  --goldLine:rgba(198,167,105,0.18);
  --cream:   #F5F3EF;
  --cream2:  #D6CFC4;
  --cream3:  #8A8178;
  --void:    #150D09;
  --f-display:'Cormorant Garamond', Georgia, serif;
  --f-body:  'DM Sans', system-ui, sans-serif;
  --f-mono:  'DM Mono', monospace;
}
html { scroll-behavior: smooth; }
body { background: var(--bg); }
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes glow   { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.6;transform:scale(1.08)} }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes blink  { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
@keyframes spin   { from{transform:rotate(0)} to{transform:rotate(360deg)} }

.nav-link-btn { background:none; border:none; cursor:pointer; font:inherit; }
.step-card:hover { background: var(--panel2) !important; transform: translateY(-3px); }
.reading-card:hover { background: var(--panel2) !important; border-color: rgba(198,167,105,0.4) !important; transform: translateY(-3px); }
.prac-card:hover { background: var(--panel2) !important; border-color: rgba(198,167,105,0.3) !important; }
.plan-card:hover { transform: translateY(-4px); }
.plan-btn:hover { opacity: 0.88; }
.nav-cta:hover { background: var(--gold2) !important; transform: translateY(-1px); }

@media (max-width: 900px) {
  .hero-widget-wrap { position: relative !important; right: auto !important; top: auto !important; transform: none !important; width: 100% !important; max-width: 460px !important; }
}
`

const hero: Record<string, React.CSSProperties> = {
  section: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '120px 48px 80px', position: 'relative', overflow: 'hidden', gap: '40px', flexWrap: 'wrap' },
  bg:      { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 60% 40%,rgba(198,167,105,0.07),transparent),linear-gradient(160deg,#1E1109 0%,#2C1A14 50%,#241610 100%)' },
  grid:    { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(198,167,105,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(198,167,105,0.04) 1px,transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 70% 70% at 60% 50%,black,transparent)' } as React.CSSProperties,
  orb:     { position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(198,167,105,0.06),transparent 70%)', animation: 'glow 8s ease-in-out infinite', pointerEvents: 'none' },
  left:    { position: 'relative', zIndex: 1, maxWidth: '540px', display: 'flex', flexDirection: 'column', gap: '28px', flex: '1 1 300px', animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both' },
  eyebrow: { display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--f-mono)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', opacity: 0.85 },
  eyebrowDot: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s ease infinite', flexShrink: 0 },
  title:   { fontFamily: 'var(--f-display)', fontSize: 'clamp(52px,5.5vw,84px)', fontWeight: 300, lineHeight: 1.0, letterSpacing: '-0.01em', color: 'var(--cream)' },
  titleAccent: { fontStyle: 'italic', color: 'var(--gold)' },
  sub:     { fontFamily: 'var(--f-body)', fontSize: '18px', fontWeight: 300, lineHeight: 1.8, color: 'var(--cream2)' },
  ctas:    { display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' as const },
  trust:   { display: 'flex', alignItems: 'center', gap: '12px' },
  trustAvs:{ display: 'flex', alignItems: 'center' },
  trustAv: { width: '27px', height: '27px', borderRadius: '50%', background: 'var(--panel2)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--gold)', flexShrink: 0 },
  trustTxt:{ fontFamily: 'var(--f-body)', fontSize: '12px', color: 'var(--cream3)' },
  widget:  { position: 'relative', zIndex: 2, flex: '1 1 360px', maxWidth: '430px', background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,167,105,0.06) inset', animation: 'fadeUp 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both' },
}

const widget: Record<string, React.CSSProperties> = {
  bar:       { background: 'var(--panel2)', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--goldLine)' },
  dots:      { display: 'flex', gap: '5px' },
  dot:       { width: '8px', height: '8px', borderRadius: '50%' },
  title:     { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.12em', color: 'var(--cream3)', textTransform: 'uppercase', flex: 1, textAlign: 'center' as const },
  live:      { display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--gold)' },
  liveDot:   { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 2s ease infinite' },
  body:      { padding: '16px 14px', display: 'flex', flexDirection: 'column' as const, gap: '12px', minHeight: '220px', maxHeight: '400px', overflowY: 'auto' as const },
  row:       { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  av:        { width: '26px', height: '26px', minWidth: '26px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--goldLine)', flexShrink: 0, marginBottom: '2px' },
  bubAi:     { background: 'rgba(198,167,105,0.06)', border: '1px solid var(--goldLine)', borderRadius: '12px', borderBottomLeftRadius: '2px', padding: '10px 13px', maxWidth: '88%' },
  bubUser:   { background: 'rgba(245,243,239,0.06)', border: '1px solid rgba(245,243,239,0.1)', borderRadius: '12px', borderBottomRightRadius: '2px', padding: '10px 13px', maxWidth: '88%', marginLeft: 'auto' },
  txt:       { fontFamily: 'var(--f-body)', fontSize: '12.5px', lineHeight: 1.65, color: 'var(--cream2)', whiteSpace: 'pre-wrap' as const },
  suggs:     { display: 'flex', flexDirection: 'column' as const, gap: '5px', marginTop: '10px' },
  sugg:      { background: 'rgba(198,167,105,0.07)', border: '1px solid rgba(198,167,105,0.18)', borderRadius: '6px', padding: '7px 12px', fontFamily: 'var(--f-body)', fontSize: '11px', color: 'var(--gold)', cursor: 'pointer', textAlign: 'left' as const, transition: 'background 0.2s' },
  gate:      { marginTop: '12px', background: 'rgba(198,167,105,0.05)', border: '1px solid rgba(198,167,105,0.2)', borderRadius: '10px', padding: '14px' },
  gateLock:  { display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' },
  gateLockTxt:{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--gold)', textTransform: 'uppercase' as const },
  gateDesc:  { fontFamily: 'var(--f-body)', fontSize: '12px', color: 'var(--cream2)', lineHeight: 1.6, marginBottom: '10px', fontStyle: 'italic' },
  gateBtn:   { width: '100%', padding: '10px', background: 'var(--gold)', color: 'var(--void)', fontFamily: 'var(--f-body)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em', border: 'none', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(198,167,105,0.3)' },
  gateSub:   { fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--cream3)', textAlign: 'center' as const, marginTop: '8px' },
  gateLink:  { color: 'var(--gold)', textDecoration: 'underline', cursor: 'pointer' },
  typingDots:{ display: 'flex', gap: '4px', alignItems: 'center' },
  typingDot: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--cream3)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },
  composer:  { borderTop: '1px solid var(--goldLine)', padding: '11px 13px 10px' },
  compInner: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(198,167,105,0.18)', borderRadius: '10px', padding: '9px 12px' },
  input:     { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--cream)', fontFamily: 'var(--f-body)', fontSize: '12.5px' },
  sendBtn:   { width: '30px', height: '30px', flexShrink: 0, background: 'var(--gold)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--void)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' },
  compNote:  { fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--cream3)', textAlign: 'center' as const, letterSpacing: '0.07em', marginTop: '7px' },
}

const nav: Record<string, React.CSSProperties> = {
  wrap:      { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', background: 'rgba(44,26,20,0.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(198,167,105,0.15)' },
  logo:      { display: 'flex', alignItems: 'center', gap: '11px', textDecoration: 'none' },
  logoImg:   { width: '34px', height: '34px', borderRadius: '50%', filter: 'drop-shadow(0 0 10px rgba(198,167,105,0.5))', objectFit: 'contain' },
  logoTxt:   { fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 400, letterSpacing: '0.06em', color: 'var(--cream)' },
  logoAccent:{ fontStyle: 'italic', color: 'var(--gold)' },
  links:     { display: 'flex', alignItems: 'center', gap: '32px' },
  link:      { fontFamily: 'var(--f-body)', fontSize: '13px', fontWeight: 400, color: 'var(--cream3)', textDecoration: 'none', letterSpacing: '0.03em', transition: 'color 0.2s' },
}

const section: Record<string, React.CSSProperties> = {
  wrap:  { padding: '96px 48px', position: 'relative' },
  inner: { maxWidth: '1100px', margin: '0 auto' },
  tag:   { display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.22em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '18px' },
  tagLine:{ width: '28px', height: '1px', background: 'var(--gold)', opacity: 0.5, flexShrink: 0 },
  title: { fontFamily: 'var(--f-display)', fontSize: 'clamp(34px,4vw,54px)', fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--cream)', marginBottom: '16px', lineHeight: 1.1 },
  em:    { fontStyle: 'italic', color: 'var(--gold)' },
  sub:   { fontFamily: 'var(--f-body)', fontSize: '17px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.8, maxWidth: '540px', marginBottom: '0' },
}

const how: Record<string, React.CSSProperties> = {
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', marginTop: '56px' },
  card:     { padding: '40px 36px', background: 'var(--panel)', border: '1px solid var(--goldLine)', display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', overflow: 'hidden', transition: 'background 0.25s, transform 0.25s', cursor: 'default' },
  cardTop:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconWrap: { width: '44px', height: '44px', background: 'var(--goldDim)', border: '1px solid var(--goldLine)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' },
  num:      { fontFamily: 'var(--f-display)', fontSize: '64px', fontWeight: 300, color: 'rgba(198,167,105,0.15)', lineHeight: 1 },
  cardTitle:{ fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 500, color: 'var(--cream)', letterSpacing: '-0.01em' },
  cardDesc: { fontFamily: 'var(--f-body)', fontSize: '14px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.75 },
}

const reading: Record<string, React.CSSProperties> = {
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '12px', marginTop: '56px' },
  card:       { padding: '26px 22px', background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer', transition: 'background 0.25s, border-color 0.25s, transform 0.25s', position: 'relative', overflow: 'hidden' },
  cardActive: { background: 'var(--panel2)', borderColor: 'rgba(198,167,105,0.45)' },
  cardIcon:   { fontSize: '20px', color: 'var(--gold)' },
  cardTitle:  { fontFamily: 'var(--f-display)', fontSize: '18px', fontWeight: 500, color: 'var(--cream)' },
  cardDesc:   { fontFamily: 'var(--f-body)', fontSize: '13px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.7 },
}

const example: Record<string, React.CSSProperties> = {
  card:       { background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.4)', maxWidth: '760px', margin: '56px auto 0' },
  header:     { padding: '22px 32px', background: 'var(--panel2)', borderBottom: '1px solid var(--goldLine)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar:     { width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--goldLine)', overflow: 'hidden' },
  name:       { fontFamily: 'var(--f-display)', fontSize: '18px', fontWeight: 500, color: 'var(--cream)' },
  date:       { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--cream3)', letterSpacing: '0.1em' },
  badge:      { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.14em', color: 'var(--gold)', background: 'var(--goldDim)', border: '1px solid var(--goldLine)', borderRadius: '100px', padding: '4px 14px', textTransform: 'uppercase' as const },
  body:       { padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '28px' },
  block:      { display: 'flex', flexDirection: 'column', gap: '8px' },
  blockTag:   { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' as const },
  blockTitle: { fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 500, color: 'var(--cream)' },
  blockTxt:   { fontFamily: 'var(--f-body)', fontSize: '15px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.85, fontStyle: 'italic' },
  divider:    { height: '1px', background: 'var(--goldLine)' },
  ctaRow:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' },
  ctaNote:    { fontFamily: 'var(--f-body)', fontSize: '13px', color: 'var(--cream3)', fontStyle: 'italic' },
}

const prac: Record<string, React.CSSProperties> = {
  tags:        { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '28px', marginBottom: '48px' },
  tag:         { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--gold)', background: 'var(--goldDim)', border: '1px solid var(--goldLine)', borderRadius: '100px', padding: '5px 16px', textTransform: 'uppercase' as const },
  explainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' },
  explainLeft: { display: 'flex', flexDirection: 'column', gap: '20px' },
  explainTxt:  { fontFamily: 'var(--f-body)', fontSize: '16px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.85 },
  positionCard:{ background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '12px', padding: '24px', marginTop: '8px' },
  positionTag: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' as const, marginBottom: '8px' },
  positionTitle:{ fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 500, color: 'var(--cream)', marginBottom: '12px' },
  positionTxt: { fontFamily: 'var(--f-body)', fontSize: '14px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.8 },
  benefitGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  benefitCard: { background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '12px', padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'background 0.25s, border-color 0.25s', cursor: 'default' },
  benefitIcon: { fontSize: '18px', color: 'var(--gold)' },
  benefitTitle:{ fontFamily: 'var(--f-display)', fontSize: '17px', fontWeight: 500, color: 'var(--cream)' },
  benefitDesc: { fontFamily: 'var(--f-body)', fontSize: '13px', fontWeight: 300, color: 'var(--cream2)', lineHeight: 1.7 },
  useCaseWrap: { marginTop: '40px', marginBottom: '32px', background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '12px', padding: '24px 28px' },
  useCaseTag:  { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' as const, marginBottom: '16px' },
  useCaseRow:  { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  useCaseItem: { display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--f-body)', fontSize: '14px', color: 'var(--cream2)' },
  useCaseDot:  { color: 'var(--gold)', fontSize: '16px' },
}

const pricing: Record<string, React.CSSProperties> = {
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginTop: '56px', alignItems: 'start' },
  card:       { background: 'var(--panel)', border: '1px solid var(--goldLine)', borderRadius: '16px', padding: '32px', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'transform 0.25s' },
  cardFeatured:{ borderColor: 'rgba(198,167,105,0.45)', background: 'var(--panel2)', boxShadow: '0 0 0 1px rgba(198,167,105,0.12), 0 32px 80px rgba(0,0,0,0.5)' },
  badge:      { position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', padding: '4px 16px', borderRadius: '100px', whiteSpace: 'nowrap', fontWeight: 500 } as React.CSSProperties,
  planTag:    { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cream3)', marginBottom: '10px' } as React.CSSProperties,
  planName:   { fontFamily: 'var(--f-display)', fontSize: '30px', fontWeight: 400, color: 'var(--cream)', lineHeight: 1 },
  planPrice:  { display: 'flex', alignItems: 'baseline', gap: '4px', margin: '14px 0 8px' },
  planAmt:    { fontFamily: 'var(--f-display)', fontSize: '54px', fontWeight: 300, color: 'var(--cream)', lineHeight: 1 },
  planCur:    { fontFamily: 'var(--f-mono)', fontSize: '16px', color: 'var(--cream2)' },
  planPer:    { fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--cream3)', letterSpacing: '0.06em' },
  planDesc:   { fontFamily: 'var(--f-body)', fontSize: '13px', fontStyle: 'italic', color: 'var(--cream2)', lineHeight: 1.6, marginBottom: '20px' },
  divider:    { height: '1px', background: 'var(--goldLine)', margin: '0 0 18px' },
  features:   { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', flex: 1 } as React.CSSProperties,
  feature:    { display: 'flex', alignItems: 'flex-start', gap: '10px', fontFamily: 'var(--f-body)', fontSize: '13.5px', color: 'var(--cream2)', lineHeight: 1.5 },
  featureOff: { opacity: 0.35 },
  check:      { color: 'var(--gold)', fontWeight: 600, flexShrink: 0 },
  cross:      { color: 'var(--cream3)', flexShrink: 0 },
  note:       { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--cream3)', textAlign: 'center', letterSpacing: '0.1em', marginTop: '28px' } as React.CSSProperties,
}

const btn: Record<string, React.CSSProperties> = {
  primary:   { padding: '13px 28px', background: 'var(--gold)', color: 'var(--void)', fontFamily: 'var(--f-body)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 24px rgba(198,167,105,0.32)', transition: 'background 0.2s, transform 0.15s', whiteSpace: 'nowrap' as const },
  secondary: { padding: '13px 28px', background: 'rgba(198,167,105,0.1)', color: 'var(--gold)', fontFamily: 'var(--f-body)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em', border: '1px solid rgba(198,167,105,0.3)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s, border-color 0.2s', whiteSpace: 'nowrap' as const },
  ghost:     { padding: '13px 26px', background: 'transparent', color: 'var(--cream2)', fontFamily: 'var(--f-body)', fontSize: '14px', fontWeight: 400, letterSpacing: '0.04em', border: '1px solid rgba(245,243,239,0.18)', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'border-color 0.2s', textDecoration: 'none', whiteSpace: 'nowrap' as const },
}

const footer: Record<string, React.CSSProperties> = {
  wrap:   { borderTop: '1px solid rgba(198,167,105,0.15)', background: 'var(--void)', padding: '32px 48px' },
  inner:  { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' },
  logo:   { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoTxt:{ fontFamily: 'var(--f-display)', fontSize: '17px', fontWeight: 400, letterSpacing: '0.06em', color: 'var(--cream)' },
  txt:    { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--cream3)' },
  link:   { fontFamily: 'var(--f-body)', fontSize: '12px', color: 'var(--cream3)', textDecoration: 'none', transition: 'color 0.2s' },
}
