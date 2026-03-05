'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { translations, type Lang } from '@/lib/i18n'

const RESPONSES_FR: Record<string, string> = {
  default:  "Votre configuration actuelle indique une periode de reorganisation interne. Ce qui ressemble a de l'hesitation est en realite du discernement - votre systeme se calibre avant un changement significatif.\n\nUne image plus claire vous attend dans votre lecture complete...",
  relation: "La tension relationnelle que vous percevez reflete un alignement Venus-Noeuds qui demande honnetet plutot que confort. Ce n'est pas une rupture - c'est une invitation a approfondir.\n\nVotre lecture complete inclut une analyse amour et relations...",
  travail:  "Un transit Jupiter active votre axe professionnel en ce moment. L'incertitude que vous ressentez est l'espace entre ce qui etait et ce qui vient - un repositionnement, pas un echec.\n\nVotre lecture complete inclut les dynamiques carriere et finances...",
  decision: "Votre autorite interieure signale quelque chose que votre esprit analytique n'a pas encore completement traite. L'hesitation est une donnee, pas une faiblesse.\n\nVotre lecture complete revele votre profil decisionnel...",
}
const RESPONSES_EN: Record<string, string> = {
  default:  "Your current configuration points to a period of internal reorganization. What feels like hesitation is actually discernment - your system is calibrating before a meaningful shift.\n\nA clearer picture awaits in your full reading...",
  relation: "The relational tension you're sensing reflects a Venus-Node alignment asking for honesty over comfort. This is not a rupture - it's an invitation to deepen.\n\nYour full reading includes a love & connection analysis...",
  travail:  "A Jupiter transit is activating your professional axis right now. The uncertainty you feel is the space between what was and what's coming - a repositioning, not a setback.\n\nYour full reading includes career & financial dynamics...",
  decision: "Your inner authority is signaling something your analytical mind hasn't fully processed yet. The hesitation is data, not weakness.\n\nYour full reading reveals your decision-making profile...",
}

function getResponse(q: string, lang: Lang): string {
  const ql = q.toLowerCase()
  const R = lang === 'fr' ? RESPONSES_FR : RESPONSES_EN
  if (ql.includes('amour') || ql.includes('love') || ql.includes('relation') || ql.includes('couple')) return R.relation
  if (ql.includes('travail') || ql.includes('work') || ql.includes('job') || ql.includes('career') || ql.includes('carriere')) return R.travail
  if (ql.includes('decision') || ql.includes('choix') || ql.includes('choice') || ql.includes('hesi')) return R.decision
  return R.default
}

type Msg = { role: 'user' | 'ai'; text: string; gate?: boolean }

const PLAN_PRICE_KEYS: Record<string, string> = {
  essentiel: 'essentiel_monthly',
  premium:   'premium_monthly',
  praticien: 'praticien_monthly',
}

export default function Page() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('fr')
  const t = translations[lang]
  const goLogin = useCallback(() => router.push('/login'), [router])
  const handleUpgrade = useCallback(async (planKey: string) => {
    if (planKey === 'free') { goLogin(); return }
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
        <Nav t={t} lang={lang} setLang={setLang} onCta={goLogin} />
        <Hero t={t} lang={lang} onCta={goLogin} />
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
        <FinalCta t={t} onCta={goLogin} />
        <Footer t={t} />
      </div>
    </>
  )
}

function Nav({ t, lang, setLang, onCta }: { t: typeof translations.fr; lang: Lang; setLang: (l: Lang) => void; onCta: () => void }) {
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">
        <Image src="/logo/hexastra.png" alt="HexAstra" width={34} height={34} className="nav-logo-img" />
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
          <button
            onClick={() => setLang('fr')}
            className={'lang-btn' + (lang === 'fr' ? ' lang-active' : '')}
          >FR</button>
          <button
            onClick={() => setLang('en')}
            className={'lang-btn' + (lang === 'en' ? ' lang-active' : '')}
          >EN</button>
        </div>
        <button onClick={onCta} className="btn-primary nav-cta">{t.nav.startReading}</button>
      </div>
    </nav>
  )
}

function Hero({ t, lang, onCta }: { t: typeof translations.fr; lang: Lang; onCta: () => void }) {
  const [question, setQuestion] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)
  const [gated, setGated] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, typing])

  const ask = async () => {
    const q = question.trim()
    if (!q || typing) return
    setMsgs(p => [...p, { role: 'user', text: q }])
    setQuestion('')
    setTyping(true)
    await new Promise(r => setTimeout(r, 1900))
    setTyping(false)
    setMsgs(p => [...p, { role: 'ai', text: getResponse(q, lang), gate: true }])
    setGated(true)
  }

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
            {t.hero.cta1}
            <ArrowIcon />
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

      <div className="widget">
        <div className="widget-bar">
          <div className="w-dots">
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <span key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span className="widget-title">{t.widget.title}</span>
          <div className="widget-live"><span className="live-dot" />{t.widget.live}</div>
        </div>

        <div className="widget-body">
          {msgs.length === 0 && !typing && (
            <div className="w-row">
              <AiAv />
              <div className="w-bub-ai">
                <p className="w-txt">{t.widget.intro}</p>
                <div className="w-suggs">
                  {[t.widget.sugg1, t.widget.sugg2, t.widget.sugg3].map((s, i) => (
                    <button key={i} className="w-sugg" onClick={() => setQuestion(s)}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {msgs.map((msg, i) => (
            <div key={i} className="w-row" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && <AiAv />}
              <div className={msg.role === 'user' ? 'w-bub-u' : 'w-bub-ai'}>
                <p className="w-txt">{msg.text}</p>
                {msg.gate && (
                  <div className="w-gate">
                    <div className="w-gate-lock">
                      <LockIcon />
                      <span className="w-gate-lock-txt">{t.widget.gateLock}</span>
                    </div>
                    <p className="w-gate-desc">{t.widget.gateDesc}</p>
                    <button onClick={onCta} className="w-gate-btn">{t.widget.gateCta}</button>
                    <p className="w-gate-sub">
                      {t.widget.gateLogin}{' '}
                      <span className="w-gate-link" onClick={onCta}>{t.widget.gateLoginLink}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="w-row">
              <AiAv />
              <div className="w-bub-ai">
                <div className="typing-dots">
                  {[0,1,2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i*0.18}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {!gated && (
          <div className="widget-comp">
            <div className="w-comp-inner">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder={t.widget.placeholder}
                className="w-input"
                disabled={typing}
              />
              <button onClick={ask} disabled={!question.trim() || typing} className="w-send" style={{ opacity: !question.trim() || typing ? 0.3 : 1 }}>
                <SendIcon />
              </button>
            </div>
            <p className="w-comp-note">{t.widget.note}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function HowSection({ t }: { t: typeof translations.fr }) {
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

function ReceiveSection({ t }: { t: typeof translations.fr }) {
  const [active, setActive] = useState<number | null>(null)
  const cards = [
    { icon: 'v', title: t.receive.card1title, desc: t.receive.card1desc },
    { icon: 'o', title: t.receive.card2title, desc: t.receive.card2desc },
    { icon: '*', title: t.receive.card3title, desc: t.receive.card3desc },
    { icon: '+', title: t.receive.card4title, desc: t.receive.card4desc },
    { icon: '>', title: t.receive.card5title, desc: t.receive.card5desc },
  ]
  return (
    <section className="section" style={{ background: 'var(--deep)' }}>
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
              <div className="card-icon">{c.icon}</div>
              <div className="card-title">{c.title}</div>
              <p className="card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ExampleSection({ t, onCta }: { t: typeof translations.fr; onCta: () => void }) {
  return (
    <section className="section">
      <div className="section-inner">
        <STag label={t.example.tag} />
        <h2 className="section-title">{t.example.title1} <em>{t.example.title2}</em></h2>
        <p className="section-sub">{t.example.sub}</p>
        <div className="ex-card">
          <div className="ex-header">
            <div className="ex-header-left">
              <div className="ex-av">
                <Image src="/logo/hexastra.png" alt="" width={38} height={38} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              </div>
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

function PractitionerSection({ t, onCta }: { t: typeof translations.fr; onCta: () => void }) {
  return (
    <section className="section" style={{ background: 'var(--deep)' }}>
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
                <span className="use-case-dot" />
                {u}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onCta} className="btn-secondary prac-cta">{t.practitioners.cta}</button>
      </div>
    </section>
  )
}

function PricingSection({ t, onCta }: { t: typeof translations.fr; onCta: (key: string) => void }) {
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
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="pricing-note">{t.pricing.note}</p>
      </div>
    </section>
  )
}

function FinalCta({ t, onCta }: { t: typeof translations.fr; onCta: () => void }) {
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

function Footer({ t }: { t: typeof translations.fr }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <a href="/" className="footer-logo">
          <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ borderRadius: '50%' }} />
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
      <span className="section-tag-line" />
      {label}
    </div>
  )
}
function AiAv() {
  return (
    <div className="w-av">
      <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
    </div>
  )
}
function ArrowIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> }
function LockIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> }
function SendIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function CalIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> }
function ClockIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> }
function DocIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg> }

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

.root { background: var(--pitch); color: var(--tx1); font-family: var(--f-ui); overflow-x: hidden; min-height: 100vh; }
.divider { height: 1px; background: linear-gradient(90deg, transparent, var(--b3), transparent); margin: 0 48px; }

/* NAV */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 16px 48px; background: rgba(44,31,26,0.9); backdrop-filter: blur(24px); border-bottom: 1px solid var(--b2); }
.nav-logo { display: flex; align-items: center; gap: 11px; text-decoration: none; }
.nav-logo-img { border-radius: 50%; filter: drop-shadow(0 0 10px rgba(31,175,140,0.4)); }
.nav-logo-txt { font-family: var(--f-display); font-size: 20px; letter-spacing: 0.08em; color: var(--chrome); }
.nav-accent { color: var(--emerald); }
.nav-links { display: flex; align-items: center; gap: 28px; }
.nav-link { font-family: var(--f-ui); font-size: 13px; color: var(--tx2); text-decoration: none; transition: color 0.2s; background: none; border: none; cursor: pointer; }
.nav-link:hover { color: var(--emerald); }
.nav-link-btn { font-family: var(--f-ui); font-size: 13px; }
.nav-right { display: flex; align-items: center; gap: 12px; }

/* LANG TOGGLE */
.lang-toggle { display: flex; background: var(--panel); border: 1px solid var(--b2); border-radius: 6px; overflow: hidden; }
.lang-btn { padding: 5px 12px; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.12em; color: var(--tx3); background: transparent; border: none; cursor: pointer; transition: background 0.2s, color 0.2s; }
.lang-active { background: var(--emerald) !important; color: var(--void) !important; font-weight: 600; }

/* BUTTONS */
.btn-primary { padding: 12px 26px; background: var(--emerald); color: var(--void); font-family: var(--f-ui); font-size: 14px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 6px 24px rgba(31,175,140,0.3); transition: background 0.2s, transform 0.15s; white-space: nowrap; text-decoration: none; }
.btn-primary:hover { background: var(--emerald-lt); transform: translateY(-1px); }
.btn-secondary { padding: 12px 26px; background: rgba(31,175,140,0.1); color: var(--emerald); font-family: var(--f-ui); font-size: 14px; font-weight: 500; border: 1px solid rgba(31,175,140,0.3); border-radius: 4px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
.btn-secondary:hover { background: rgba(31,175,140,0.18); }
.btn-ghost { padding: 12px 26px; background: transparent; color: var(--tx2); font-family: var(--f-ui); font-size: 14px; border: 1px solid var(--b3); border-radius: 4px; cursor: pointer; transition: border-color 0.2s, color 0.2s; white-space: nowrap; text-decoration: none; display: inline-flex; align-items: center; }
.btn-ghost:hover { border-color: var(--b4); color: var(--tx1); }
.btn-outline { padding: 12px 26px; background: transparent; color: var(--tx2); font-family: var(--f-ui); font-size: 14px; border: 1px solid var(--b3); border-radius: 4px; cursor: pointer; white-space: nowrap; transition: border-color 0.2s; }
.btn-outline:hover { border-color: var(--emerald); color: var(--emerald); }
.btn-sm { font-size: 13px; padding: 10px 20px; }
.btn-lg { font-size: 15px; padding: 16px 36px; }
.nav-cta { font-size: 13px; padding: 10px 20px; }

/* HERO */
.hero { min-height: 100vh; display: flex; align-items: center; justify-content: space-between; padding: 120px 48px 80px; position: relative; overflow: hidden; gap: 40px; flex-wrap: wrap; }
.hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(31,175,140,0.06), transparent), linear-gradient(160deg, var(--void) 0%, var(--pitch) 50%, var(--deep) 100%); }
.hero-grid { position: absolute; inset: 0; background-image: linear-gradient(var(--b1) 1px, transparent 1px), linear-gradient(90deg, var(--b1) 1px, transparent 1px); background-size: 80px 80px; mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, black, transparent); }
.hero-orb { position: absolute; right: -80px; top: 50%; transform: translateY(-50%); width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(31,175,140,0.05), transparent 70%); animation: glow 8s ease-in-out infinite; pointer-events: none; }
.hero-left { position: relative; z-index: 1; max-width: 520px; flex: 1 1 300px; display: flex; flex-direction: column; gap: 26px; animation: fadeUp 0.7s var(--expo) both; }
.eyebrow { display: flex; align-items: center; gap: 8px; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--emerald); opacity: 0.85; }
.eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--emerald); animation: pulse 2s ease infinite; flex-shrink: 0; }
.hero-title { font-family: var(--f-display); font-size: clamp(52px,5.5vw,84px); font-weight: 400; line-height: 1.0; letter-spacing: 0.04em; color: var(--chrome); text-transform: uppercase; }
.hero-accent { color: var(--emerald); font-family: var(--f-serif); font-style: italic; text-transform: none; letter-spacing: -0.01em; }
.hero-sub { font-family: var(--f-ui); font-size: 18px; font-weight: 300; line-height: 1.8; color: var(--tx2); }
.hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; }
.trust-row { display: flex; align-items: center; gap: 12px; }
.trust-avs { display: flex; align-items: center; }
.trust-av { width: 27px; height: 27px; border-radius: 50%; background: var(--lift); border: 2px solid var(--pitch); display: flex; align-items: center; justify-content: center; font-family: var(--f-mono); font-size: 9px; color: var(--emerald); flex-shrink: 0; }
.trust-txt { font-family: var(--f-ui); font-size: 12px; color: var(--tx3); }

/* WIDGET */
.widget { position: relative; z-index: 2; flex: 1 1 360px; max-width: 420px; background: var(--panel); border: 1px solid var(--b2); border-radius: 16px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6); animation: fadeUp 0.7s 0.15s var(--expo) both; }
.widget-bar { background: var(--lift); padding: 11px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid var(--b2); }
.w-dots { display: flex; gap: 5px; }
.widget-title { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.12em; color: var(--tx3); text-transform: uppercase; flex: 1; text-align: center; }
.widget-live { display: flex; align-items: center; gap: 5px; font-family: var(--f-mono); font-size: 9px; color: var(--emerald); }
.live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--emerald); animation: pulse 2s ease infinite; }
.widget-body { padding: 16px 14px; display: flex; flex-direction: column; gap: 12px; min-height: 220px; max-height: 400px; overflow-y: auto; }
.widget-body::-webkit-scrollbar { width: 0; }
.w-row { display: flex; align-items: flex-end; gap: 8px; }
.w-av { width: 26px; height: 26px; min-width: 26px; border-radius: 50%; overflow: hidden; border: 1px solid rgba(31,175,140,0.3); flex-shrink: 0; }
.w-bub-ai { background: rgba(31,175,140,0.06); border: 1px solid rgba(31,175,140,0.15); border-radius: 12px; border-bottom-left-radius: 2px; padding: 10px 13px; max-width: 88%; }
.w-bub-u { background: var(--lift); border: 1px solid var(--b2); border-radius: 12px; border-bottom-right-radius: 2px; padding: 10px 13px; max-width: 88%; margin-left: auto; }
.w-txt { font-family: var(--f-ui); font-size: 12.5px; line-height: 1.65; color: var(--tx2); white-space: pre-wrap; }
.w-suggs { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; }
.w-sugg { background: rgba(31,175,140,0.07); border: 1px solid rgba(31,175,140,0.18); border-radius: 6px; padding: 7px 12px; font-family: var(--f-ui); font-size: 11px; color: var(--emerald); cursor: pointer; text-align: left; transition: background 0.2s; }
.w-sugg:hover { background: rgba(31,175,140,0.14); }
.w-gate { margin-top: 12px; background: rgba(31,175,140,0.05); border: 1px solid rgba(31,175,140,0.2); border-radius: 10px; padding: 14px; }
.w-gate-lock { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
.w-gate-lock-txt { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; color: var(--emerald); text-transform: uppercase; }
.w-gate-desc { font-family: var(--f-ui); font-size: 12px; color: var(--tx2); line-height: 1.6; margin-bottom: 10px; font-style: italic; }
.w-gate-btn { width: 100%; padding: 10px; background: var(--emerald); color: var(--void); font-family: var(--f-ui); font-size: 12px; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; }
.w-gate-sub { font-family: var(--f-mono); font-size: 9px; color: var(--tx3); text-align: center; margin-top: 8px; }
.w-gate-link { color: var(--emerald); text-decoration: underline; cursor: pointer; }
.typing-dots { display: flex; gap: 4px; align-items: center; }
.typing-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--tx3); display: inline-block; animation: blink 1.4s ease-in-out infinite; }
.widget-comp { border-top: 1px solid var(--b2); padding: 11px 13px 10px; }
.w-comp-inner { display: flex; align-items: center; gap: 8px; background: var(--lift); border: 1px solid var(--b2); border-radius: 10px; padding: 9px 12px; }
.w-input { flex: 1; background: transparent; border: none; outline: none; color: var(--tx1); font-family: var(--f-ui); font-size: 12.5px; }
.w-input::placeholder { color: var(--tx3); }
.w-send { width: 30px; height: 30px; flex-shrink: 0; background: var(--emerald); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--void); border: none; cursor: pointer; }
.w-comp-note { font-family: var(--f-mono); font-size: 9px; color: var(--tx3); text-align: center; letter-spacing: 0.07em; margin-top: 7px; }

/* SECTIONS */
.section { padding: 96px 48px; position: relative; }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-tag { display: flex; align-items: center; gap: 10px; font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.22em; color: var(--emerald); text-transform: uppercase; margin-bottom: 18px; }
.section-tag-line { width: 28px; height: 1px; background: var(--emerald); opacity: 0.5; flex-shrink: 0; }
.section-title { font-family: var(--f-display); font-size: clamp(32px,4vw,54px); font-weight: 400; letter-spacing: 0.04em; color: var(--chrome); text-transform: uppercase; margin-bottom: 14px; line-height: 1.05; }
.section-title em { font-family: var(--f-serif); font-style: italic; color: var(--emerald); text-transform: none; letter-spacing: -0.01em; }
.section-sub { font-family: var(--f-ui); font-size: 17px; font-weight: 300; color: var(--tx2); line-height: 1.8; max-width: 540px; margin-bottom: 0; }

/* STEPS */
.steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; margin-top: 52px; }
.step-card { padding: 36px 32px; background: var(--panel); border: 1px solid var(--b2); display: flex; flex-direction: column; gap: 16px; transition: background 0.25s, transform 0.25s; cursor: default; }
.step-card:hover { background: var(--lift); transform: translateY(-3px); }
.step-top { display: flex; justify-content: space-between; align-items: flex-start; }
.step-icon { width: 44px; height: 44px; background: rgba(31,175,140,0.08); border: 1px solid rgba(31,175,140,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--emerald); }
.step-num { font-family: var(--f-display); font-size: 64px; font-weight: 400; color: rgba(31,175,140,0.12); line-height: 1; }
.step-title { font-family: var(--f-serif); font-size: 20px; color: var(--chrome); }
.step-desc { font-family: var(--f-ui); font-size: 14px; font-weight: 300; color: var(--tx2); line-height: 1.75; }

/* READING CARDS */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(190px,1fr)); gap: 12px; margin-top: 52px; }
.reading-card { padding: 24px 20px; background: var(--panel); border: 1px solid var(--b2); border-radius: 12px; display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: background 0.25s, border-color 0.25s, transform 0.25s; }
.reading-card:hover, .reading-card-active { background: var(--lift); border-color: rgba(31,175,140,0.3); transform: translateY(-3px); }
.card-icon { font-size: 18px; color: var(--emerald); font-weight: 700; }
.card-title { font-family: var(--f-serif); font-size: 17px; color: var(--chrome); }
.card-desc { font-family: var(--f-ui); font-size: 13px; font-weight: 300; color: var(--tx2); line-height: 1.7; }

/* EXAMPLE */
.ex-card { background: var(--panel); border: 1px solid var(--b2); border-radius: 20px; overflow: hidden; max-width: 760px; margin: 52px auto 0; box-shadow: 0 40px 80px rgba(0,0,0,0.4); }
.ex-header { padding: 22px 32px; background: var(--lift); border-bottom: 1px solid var(--b2); display: flex; align-items: center; justify-content: space-between; }
.ex-header-left { display: flex; align-items: center; gap: 12px; }
.ex-av { width: 38px; height: 38px; border-radius: 50%; border: 1px solid rgba(31,175,140,0.3); overflow: hidden; }
.ex-name { font-family: var(--f-serif); font-size: 18px; color: var(--chrome); }
.ex-date { font-family: var(--f-mono); font-size: 10px; color: var(--tx3); letter-spacing: 0.1em; }
.ex-badge { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; color: var(--emerald); background: rgba(31,175,140,0.08); border: 1px solid rgba(31,175,140,0.2); border-radius: 100px; padding: 4px 14px; text-transform: uppercase; }
.ex-body { padding: 32px; display: flex; flex-direction: column; gap: 24px; }
.ex-block { display: flex; flex-direction: column; gap: 7px; }
.ex-block-tag { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.18em; color: var(--emerald); text-transform: uppercase; }
.ex-block-title { font-family: var(--f-serif); font-size: 22px; color: var(--chrome); }
.ex-block-txt { font-family: var(--f-ui); font-size: 15px; font-weight: 300; color: var(--tx2); line-height: 1.85; font-style: italic; }
.ex-divider { height: 1px; background: var(--b2); }
.ex-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; }
.ex-cta-note { font-family: var(--f-ui); font-size: 13px; color: var(--tx3); font-style: italic; }

/* PRACTITIONERS */
.prac-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 24px 0 44px; }
.prac-tag { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--emerald); background: rgba(31,175,140,0.08); border: 1px solid rgba(31,175,140,0.2); border-radius: 100px; padding: 5px 14px; text-transform: uppercase; }
.prac-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: start; }
.prac-left { display: flex; flex-direction: column; gap: 18px; }
.prac-txt { font-family: var(--f-ui); font-size: 16px; font-weight: 300; color: var(--tx2); line-height: 1.85; }
.prac-pos { background: var(--panel); border: 1px solid var(--b2); border-radius: 12px; padding: 22px; margin-top: 6px; }
.prac-pos-tag { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.18em; color: var(--emerald); text-transform: uppercase; margin-bottom: 8px; }
.prac-pos-title { font-family: var(--f-serif); font-size: 19px; color: var(--chrome); margin-bottom: 10px; }
.prac-pos-txt { font-family: var(--f-ui); font-size: 14px; font-weight: 300; color: var(--tx2); line-height: 1.8; }
.prac-benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.benefit-card { background: var(--panel); border: 1px solid var(--b2); border-radius: 10px; padding: 18px; transition: background 0.2s; }
.benefit-card:hover { background: var(--lift); }
.benefit-title { font-family: var(--f-serif); font-size: 16px; color: var(--chrome); margin-bottom: 6px; }
.benefit-desc { font-family: var(--f-ui); font-size: 13px; font-weight: 300; color: var(--tx2); line-height: 1.65; }
.use-cases { margin-top: 36px; background: var(--panel); border: 1px solid var(--b2); border-radius: 12px; padding: 22px 26px; }
.use-case-tag { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.18em; color: var(--emerald); text-transform: uppercase; margin-bottom: 14px; }
.use-case-row { display: flex; flex-wrap: wrap; gap: 10px; }
.use-case-item { display: flex; align-items: center; gap: 8px; font-family: var(--f-ui); font-size: 14px; color: var(--tx2); }
.use-case-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--emerald); flex-shrink: 0; }
.prac-cta { margin-top: 28px; }

/* PRICING - 4 plans */
.pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-top: 52px; align-items: start; }
.plan-card { background: var(--panel); border: 1px solid var(--b2); border-radius: 14px; padding: 26px; position: relative; display: flex; flex-direction: column; transition: transform 0.25s; }
.plan-card:hover { transform: translateY(-3px); }
.plan-featured { border-color: rgba(31,175,140,0.4); background: var(--lift); box-shadow: 0 0 0 1px rgba(31,175,140,0.1), 0 24px 60px rgba(0,0,0,0.5); }
.plan-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--emerald); color: var(--void); font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.12em; padding: 4px 14px; border-radius: 100px; white-space: nowrap; font-weight: 600; }
.plan-tag { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--tx3); margin-bottom: 8px; }
.plan-name { font-family: var(--f-display); font-size: 24px; font-weight: 400; color: var(--chrome); text-transform: uppercase; letter-spacing: 0.06em; line-height: 1; }
.plan-price-row { display: flex; align-items: baseline; gap: 4px; margin: 12px 0 6px; }
.plan-amt { font-family: var(--f-display); font-size: 46px; color: var(--chrome); line-height: 1; }
.plan-cur { font-family: var(--f-mono); font-size: 13px; color: var(--tx2); }
.plan-per { font-family: var(--f-mono); font-size: 10px; color: var(--tx3); letter-spacing: 0.06em; }
.plan-desc { font-family: var(--f-ui); font-size: 13px; font-style: italic; color: var(--tx2); line-height: 1.6; margin-bottom: 18px; }
.plan-divider { height: 1px; background: var(--b2); margin: 0 0 16px; }
.plan-features { list-style: none; display: flex; flex-direction: column; gap: 9px; margin-bottom: 22px; flex: 1; }
.plan-feature { display: flex; align-items: flex-start; gap: 9px; font-family: var(--f-ui); font-size: 12.5px; color: var(--tx2); line-height: 1.5; }
.plan-feature-off { opacity: 0.35; }
.feat-check { color: var(--emerald); font-weight: 700; flex-shrink: 0; }
.feat-cross { color: var(--tx3); flex-shrink: 0; }
.plan-btn { width: 100%; }
.pricing-note { font-family: var(--f-mono); font-size: 10px; color: var(--tx3); text-align: center; letter-spacing: 0.1em; margin-top: 24px; }

/* FINAL CTA */
.final-cta { text-align: center; overflow: hidden; }
.final-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(31,175,140,0.07), transparent); pointer-events: none; }
.final-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 22px; }
.final-title { font-family: var(--f-display); font-size: clamp(34px,4.5vw,60px); font-weight: 400; color: var(--chrome); line-height: 1.05; text-transform: uppercase; letter-spacing: 0.04em; }
.final-title em { font-family: var(--f-serif); font-style: italic; color: var(--emerald); text-transform: none; letter-spacing: -0.01em; }
.final-sub { font-family: var(--f-ui); font-size: 17px; font-weight: 300; color: var(--tx2); line-height: 1.75; }
.final-note { font-family: var(--f-mono); font-size: 10px; color: var(--tx3); letter-spacing: 0.08em; }

/* FOOTER */
.footer { border-top: 1px solid var(--b2); background: var(--void); padding: 28px 48px; }
.footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.footer-logo-txt { font-family: var(--f-display); font-size: 16px; letter-spacing: 0.08em; color: var(--chrome); }
.footer-copy { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--tx3); }
.footer-links { display: flex; gap: 20px; }
.footer-link { font-family: var(--f-ui); font-size: 12px; color: var(--tx3); text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: var(--emerald); }

@media (max-width: 1100px) { .pricing-grid { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 900px) {
  .nav { padding: 14px 20px; }
  .nav-links { display: none; }
  .hero { padding: 100px 20px 60px; flex-direction: column; min-height: auto; }
  .hero-left { max-width: 100%; }
  .widget { max-width: 100%; }
  .steps { grid-template-columns: 1fr; }
  .prac-grid { grid-template-columns: 1fr; }
  .prac-benefits { grid-template-columns: 1fr 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
  .section { padding: 64px 20px; }
  .divider { margin: 0 20px; }
  .footer { padding: 24px 20px; }
  .ex-card { margin-top: 36px; }
}
`