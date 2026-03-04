'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

type PreviewMsg = { role: 'user' | 'ai'; text: string; isGate?: boolean }

const FREE_RESPONSES: Record<string, string> = {
  default: "Votre question touche à quelque chose d'important dans votre parcours actuel. Les cycles planétaires du moment indiquent une période de transition — une invitation à réévaluer ce qui compte vraiment pour vous.\n\nVoici un aperçu de ce que révèle votre configuration...",
  relation: "Les dynamiques relationnelles que vous décrivez reflètent souvent des schémas profonds liés à votre Vénus natale. Ce que vous vivez n'est pas un hasard — c'est une invitation à comprendre votre façon d'aimer.\n\nVoici un aperçu de votre analyse relationnelle...",
  travail: "Votre questionnement professionnel est lié à une période de Jupiter qui active votre Maison X. C'est une phase de repositionnement, pas d'échec — les fondations se réorganisent.\n\nVoici un aperçu de votre analyse professionnelle...",
  decision: "Les hésitations que vous ressentez sont souvent le signe que deux parts de vous-même s'expriment. En Human Design, votre autorité intérieure est la clé — et elle ne ment jamais.\n\nVoici un aperçu de votre analyse décisionnelle...",
}

function getResponse(q: string): string {
  const ql = q.toLowerCase()
  if (ql.includes('relation') || ql.includes('amour') || ql.includes('couple')) return FREE_RESPONSES.relation
  if (ql.includes('travail') || ql.includes('emploi') || ql.includes('carrière')) return FREE_RESPONSES.travail
  if (ql.includes('décision') || ql.includes('choix') || ql.includes('hésit')) return FREE_RESPONSES.decision
  return FREE_RESPONSES.default
}

export default function HomePage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<PreviewMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleAsk = async () => {
    const q = question.trim()
    if (!q || isTyping) return
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setQuestion('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1800))
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'ai', text: getResponse(q), isGate: true }])
    setShowGate(true)
  }

  const chatStarted = messages.length > 0 || isTyping

  return (
    <div style={s.root}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />
      <div style={s.scanWrap}><div style={s.scanLine} /></div>

      {/* NAV */}
      <nav style={s.nav}>
        <a href="/" style={s.navLogo}>
          <Image src="/logo/hexastra.png" alt="HexAstra" width={40} height={40} style={s.navLogoImg} priority />
          <span style={s.navLogoTxt}>Hex<span style={s.navAccent}>Astra</span></span>
        </a>
        <div style={s.navLinks}>
          <a href="#pricing" style={s.navLink}>Tarifs</a>
          <a href="#comment" style={s.navLink}>Comment ça marche</a>
          <button onClick={() => router.push('/login')} style={s.navCta}>Connexion</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroTag}>// Intelligence personnelle · IA · Gratuit pour commencer</div>
          <h1 style={s.heroTitle}>
            Comprenez votre<br />
            <em style={s.heroEm}>moment de vie</em><br />
            en quelques minutes
          </h1>
          <p style={s.heroSub}>
            HexAstra analyse votre situation et vous donne des clés concrètes pour vos relations, vos décisions et votre évolution personnelle.
          </p>
          <div style={s.heroBadges}>
            <span style={s.badge}>✓ Gratuit pour commencer</span>
            <span style={s.badge}>✓ Sans carte bancaire</span>
            <span style={s.badge}>✓ Résultats en 2 minutes</span>
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

        {/* WIDGET APERÇU GRATUIT */}
        <div style={s.widget}>
          <div style={s.widgetHdr}>
            <div style={s.widgetDots}>
              <span style={{ ...s.wDot, background: '#ff5f57' }} />
              <span style={{ ...s.wDot, background: '#febc2e' }} />
              <span style={{ ...s.wDot, background: '#28c840' }} />
            </div>
            <div style={s.widgetTitle}>Essai gratuit · sans inscription</div>
            <div style={s.widgetLive}><span style={s.liveDot} />En ligne</div>
          </div>

          <div style={s.widgetBody}>
            {!chatStarted && (
              <div style={s.msgRow}>
                <div style={s.av}>
                  <Image src="/logo/hexastra.png" alt="HexAstra" width={28} height={28} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div style={s.bubAI}>
                  <p style={s.bubTxt}>Posez votre question — je vous donne un premier éclairage gratuit, sans créer de compte.</p>
                  <div style={s.suggestions}>
                    {['Ma situation amoureuse', 'Une décision difficile', 'Mon évolution pro'].map((sug, i) => (
                      <button key={i} style={s.suggBtn} onClick={() => setQuestion(sug)}>{sug}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ ...s.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'ai' && (
                  <div style={s.av}>
                    <Image src="/logo/hexastra.png" alt="HexAstra" width={28} height={28} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                )}
                <div style={msg.role === 'user' ? s.bubU : s.bubAI}>
                  <p style={s.bubTxt}>{msg.text}</p>
                  {msg.isGate && (
                    <div style={s.gate}>
                      <div style={s.gateLock}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        <span style={s.gateLockTxt}>Lecture complète disponible</span>
                      </div>
                      <p style={s.gateDesc}>Créez votre compte gratuit pour recevoir votre analyse complète.</p>
                      <button onClick={() => router.push('/login')} style={s.gateBtn}>Continuer gratuitement →</button>
                      <p style={s.gateSub}>Déjà un compte ? <span style={s.gateLink} onClick={() => router.push('/login')}>Se connecter</span></p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={s.msgRow}>
                <div style={s.av}>
                  <Image src="/logo/hexastra.png" alt="HexAstra" width={28} height={28} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div style={s.bubAI}>
                  <div style={s.dots}>{[0,1,2].map(i => <span key={i} style={{ ...s.dot, animationDelay: `${i*0.18}s` }} />)}</div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {!showGate && (
            <div style={s.composer}>
              <div style={s.compInner}>
                <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} placeholder="Posez votre question…" style={s.input} disabled={isTyping} />
                <button onClick={handleAsk} disabled={!question.trim() || isTyping} style={{ ...s.sendBtn, opacity: !question.trim() || isTyping ? 0.35 : 1 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <p style={s.compNote}>Gratuit · sans carte bancaire · sans inscription</p>
            </div>
          )}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={s.section}>
        <div style={s.sectionInner}>
          <div style={s.sectionTag}>// Tarifs</div>
          <h2 style={s.sectionTitle}>Choisissez votre formule</h2>
          <p style={s.sectionSub}>Commencez gratuitement, évoluez selon vos besoins.</p>

          <div style={s.pricingGrid}>
            {/* GRATUIT */}
            <div style={s.planCard}>
              <div style={s.planTop}>
                <div style={s.planTag}>// Freemium</div>
                <div style={s.planName}>Gratuit</div>
                <div style={s.planPrice}><span style={s.planAmt}>0</span><span style={s.planCur}>€</span></div>
                <p style={s.planDesc}>Pour découvrir HexAstra sans engagement.</p>
              </div>
              <div style={s.planDivider} />
              <ul style={s.planFeatures}>
                {['1 lecture gratuite par jour', 'Analyse courte', 'Texte uniquement', 'Accès au chat HexAstra', 'Sauvegarde limitée (3 lectures)'].map((f, i) => (
                  <li key={i} style={s.planFeature}><span style={s.checkGreen}>✓</span>{f}</li>
                ))}
                {['PDF téléchargeable', 'Version audio', 'Analyses avancées'].map((f, i) => (
                  <li key={i} style={s.planFeatureLocked}><span style={s.cross}>✕</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => router.push('/login')} style={s.planBtnFree}>Commencer gratuitement</button>
            </div>

            {/* PREMIUM */}
            <div style={{ ...s.planCard, ...s.planCardFeatured }}>
              <div style={s.featuredBadge}>⭐ Le plus populaire</div>
              <div style={s.planTop}>
                <div style={{ ...s.planTag, color: 'var(--emerald)' }}>// Premium</div>
                <div style={s.planName}>Premium</div>
                <div style={s.planPrice}>
                  <span style={s.planAmt}>19</span>
                  <span style={s.planCur}>€</span>
                  <span style={s.planPer}>/mois</span>
                </div>
                <p style={s.planDesc}>Pour aller en profondeur, sans limite.</p>
              </div>
              <div style={s.planDivider} />
              <ul style={s.planFeatures}>
                {['Lectures illimitées', 'Analyses complètes et détaillées', 'PDF téléchargeables', 'Audio personnalisé', 'Historique complet', 'Thèmes avancés'].map((f, i) => (
                  <li key={i} style={s.planFeature}><span style={s.checkGreen}>✓</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => router.push('/login')} style={s.planBtnPrimary}>Démarrer Premium →</button>
            </div>

            {/* PRATICIEN */}
            <div style={s.planCard}>
              <div style={s.planTop}>
                <div style={s.planTag}>// Pro</div>
                <div style={s.planName}>Praticien</div>
                <div style={s.planPrice}>
                  <span style={s.planAmt}>49</span>
                  <span style={s.planCur}>€</span>
                  <span style={s.planPer}>/mois</span>
                </div>
                <p style={s.planDesc}>Pour les coachs et thérapeutes.</p>
              </div>
              <div style={s.planDivider} />
              <ul style={s.planFeatures}>
                {['Lectures illimitées', 'PDF + Audio pour chaque lecture', 'Usage pour vos clients', 'Export des analyses', 'Génération prioritaire', 'Support dédié'].map((f, i) => (
                  <li key={i} style={s.planFeature}><span style={s.checkGreen}>✓</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => router.push('/login')} style={s.planBtnSecondary}>Démarrer Praticien →</button>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="comment" style={{ ...s.section, background: 'var(--panel)' }}>
        <div style={s.sectionInner}>
          <div style={s.sectionTag}>// 01 — Processus</div>
          <h2 style={s.sectionTitle}>Comment ça marche</h2>
          <div style={s.steps}>
            {[
              { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01"/></svg>, n: '01', title: 'Entrez vos informations', desc: 'Date, heure et ville de naissance permettent à HexAstra de créer votre profil personnel.' },
              { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, n: '02', title: 'Choisissez votre thème', desc: 'Relations, décisions importantes, projets de vie ou blocages à surmonter.' },
              { icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>, n: '03', title: 'Recevez votre analyse', desc: 'Une lecture claire avec des conseils concrets adaptés à votre situation actuelle.' },
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
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <div style={s.ctaInner}>
          <div style={s.ctaTag}>// Votre lecture vous attend</div>
          <h2 style={s.ctaTitle}>COMMENCEZ MAINTENANT</h2>
          <p style={s.ctaDesc}>Gratuit pour commencer. Évoluez à votre rythme.</p>
          <button onClick={() => router.push('/login')} style={s.ctaBtn}>
            Commencer gratuitement
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          <p style={s.ctaNote}>19 €/mois pour le Premium · 49 €/mois pour le Praticien · Sans engagement</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <a href="/" style={s.footerLogo}>
            <Image src="/logo/hexastra.png" alt="HexAstra" width={24} height={24} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 5px rgba(31,175,140,0.4))' }} />
            <span style={s.footerLogoTxt}>Hex<span style={{ color: 'var(--emerald)' }}>Astra</span></span>
          </a>
          <p style={s.footerTxt}>© 2026 HexAstra · Analyse personnelle par IA</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#pricing" style={s.footerLink}>Tarifs</a>
            <a href="/login" style={s.footerLink}>Connexion</a>
          </div>
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
  hero: { position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '72px 48px 80px', gap: '48px', flexWrap: 'wrap' as const },
  heroInner: { maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 300px', paddingTop: '16px' },
  heroTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.16em', color: 'var(--emerald)', textTransform: 'uppercase' },
  heroTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(34px,3.8vw,58px)', lineHeight: 1.05, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  heroEm: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: 'clamp(34px,3.8vw,58px)', color: 'var(--emerald)', textTransform: 'none' },
  heroSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '15px', lineHeight: 1.8, color: 'var(--tx2)' },
  heroBadges: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px' },
  badge: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.08em', color: 'var(--emerald)', background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.2)', borderRadius: '100px', padding: '4px 12px' },
  heroTrust: { display: 'flex', alignItems: 'center', gap: '12px' },
  trustAvatars: { display: 'flex', alignItems: 'center' },
  trustAv: { width: '26px', height: '26px', borderRadius: '50%', background: 'var(--lift)', border: '2px solid var(--pitch)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-mono)', fontSize: '8px', color: 'var(--emerald)', flexShrink: 0 },
  trustTxt: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', letterSpacing: '0.08em' },
  widget: { flex: '1 1 380px', maxWidth: '460px', background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1 },
  widgetHdr: { background: 'var(--lift)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--b1)' },
  widgetDots: { display: 'flex', gap: '5px' },
  wDot: { width: '8px', height: '8px', borderRadius: '50%' },
  widgetTitle: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--tx3)', textTransform: 'uppercase', flex: 1, textAlign: 'center' as const },
  widgetLive: { display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--emerald)', letterSpacing: '0.1em' },
  liveDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--emerald)', animation: 'pulse 2s ease infinite' },
  widgetBody: { padding: '16px 14px', display: 'flex', flexDirection: 'column' as const, gap: '12px', minHeight: '200px', maxHeight: '420px', overflowY: 'auto' as const },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  av: { width: '28px', height: '28px', minWidth: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(31,175,140,0.3)', flexShrink: 0, marginBottom: '2px' },
  bubAI: { background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b1)', borderRadius: '12px', borderBottomLeftRadius: '2px', padding: '10px 13px', maxWidth: '85%' },
  bubU: { background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.1)', borderRadius: '12px', borderBottomRightRadius: '2px', padding: '10px 13px', maxWidth: '85%', marginLeft: 'auto' },
  bubTxt: { fontFamily: 'var(--f-ui)', fontSize: '13px', lineHeight: 1.65, color: 'var(--tx2)', whiteSpace: 'pre-wrap' as const, margin: 0 },
  suggestions: { display: 'flex', flexDirection: 'column' as const, gap: '5px', marginTop: '10px' },
  suggBtn: { background: 'rgba(31,175,140,0.06)', border: '1px solid rgba(31,175,140,0.15)', borderRadius: '6px', padding: '7px 12px', fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.06em', color: 'var(--emerald)', cursor: 'pointer', textAlign: 'left' as const },
  gate: { marginTop: '14px', background: 'rgba(31,175,140,0.04)', border: '1px solid rgba(31,175,140,0.15)', borderRadius: '10px', padding: '14px' },
  gateLock: { display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px', color: 'var(--emerald)' },
  gateLockTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.12em', color: 'var(--emerald)', textTransform: 'uppercase' },
  gateDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '12.5px', color: 'var(--tx2)', lineHeight: 1.65, marginBottom: '10px' },
  gateBtn: { width: '100%', padding: '10px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(31,175,140,0.3)' },
  gateSub: { fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--tx3)', textAlign: 'center' as const, marginTop: '8px' },
  gateLink: { color: 'var(--emerald)', textDecoration: 'underline', cursor: 'pointer' },
  dots: { display: 'flex', gap: '4px', alignItems: 'center' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: 'var(--tx3)', display: 'inline-block', animation: 'blink 1.4s ease-in-out infinite' },
  composer: { borderTop: '1px solid var(--b1)', padding: '12px 14px 10px' },
  compInner: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--b2)', borderRadius: '10px', padding: '9px 12px' },
  input: { flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--tx1)', fontSize: '13px', fontFamily: 'var(--f-ui)' },
  sendBtn: { width: '30px', height: '30px', flexShrink: 0, background: 'var(--emerald)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--void)', border: 'none', cursor: 'pointer', boxShadow: '0 3px 12px rgba(31,175,140,0.3)' },
  compNote: { fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'var(--tx3)', textAlign: 'center' as const, letterSpacing: '0.08em', marginTop: '8px' },
  section: { position: 'relative', zIndex: 1, padding: '80px 48px' },
  sectionInner: { maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' },
  sectionTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  sectionTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  sectionSub: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--tx2)', lineHeight: 1.75 },
  // Pricing grid
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px', alignItems: 'start' },
  planCard: { background: 'var(--panel)', border: '1px solid var(--b2)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column' as const, gap: '0', position: 'relative' as const },
  planCardFeatured: { border: '1px solid rgba(31,175,140,0.4)', boxShadow: '0 0 0 1px rgba(31,175,140,0.15), 0 24px 60px rgba(0,0,0,0.4)', background: 'rgba(31,175,140,0.04)' },
  featuredBadge: { position: 'absolute' as const, top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.12em', padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap' as const, fontWeight: 600 },
  planTop: { display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '20px' },
  planTag: { fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '0.18em', color: 'var(--tx3)', textTransform: 'uppercase' },
  planName: { fontFamily: 'var(--f-display)', fontSize: '26px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--chrome)', lineHeight: 1 },
  planPrice: { display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' },
  planAmt: { fontFamily: 'var(--f-display)', fontSize: '48px', color: 'var(--chrome)', lineHeight: 1 },
  planCur: { fontFamily: 'var(--f-mono)', fontSize: '16px', color: 'var(--tx2)', marginBottom: '4px' },
  planPer: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', letterSpacing: '0.06em' },
  planDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.6 },
  planDivider: { height: '1px', background: 'var(--b1)', margin: '0 0 18px' },
  planFeatures: { listStyle: 'none', display: 'flex', flexDirection: 'column' as const, gap: '9px', marginBottom: '24px', flex: 1 },
  planFeature: { display: 'flex', alignItems: 'flex-start', gap: '9px', fontFamily: 'var(--f-ui)', fontSize: '13px', color: 'var(--tx2)', lineHeight: 1.5 },
  planFeatureLocked: { display: 'flex', alignItems: 'flex-start', gap: '9px', fontFamily: 'var(--f-ui)', fontSize: '13px', color: 'var(--tx3)', lineHeight: 1.5, opacity: 0.5 },
  checkGreen: { color: 'var(--emerald)', fontWeight: 700, flexShrink: 0, marginTop: '1px' },
  cross: { color: 'var(--tx3)', flexShrink: 0, marginTop: '1px' },
  planBtnFree: { padding: '12px', background: 'transparent', border: '1px solid var(--b2)', color: 'var(--tx2)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '6px', cursor: 'pointer', width: '100%' },
  planBtnPrimary: { padding: '13px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 8px 24px rgba(31,175,140,0.3)' },
  planBtnSecondary: { padding: '12px', background: 'rgba(31,175,140,0.08)', border: '1px solid rgba(31,175,140,0.2)', color: 'var(--emerald)', fontFamily: 'var(--f-mono)', fontSize: '10.5px', letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: '6px', cursor: 'pointer', width: '100%' },
  steps: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' },
  stepCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--b2)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column' as const, gap: '14px' },
  stepIconRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  stepIconWrap: { width: '48px', height: '48px', background: 'rgba(31,175,140,0.07)', border: '1px solid rgba(31,175,140,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontFamily: 'var(--f-display)', fontSize: '42px', color: 'rgba(31,175,140,0.15)', lineHeight: 1 },
  stepTitle: { fontFamily: 'var(--f-display)', fontSize: '18px', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  stepDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '14px', lineHeight: 1.75, color: 'var(--tx2)', margin: 0 },
  ctaSection: { position: 'relative', zIndex: 1, padding: '100px 48px', textAlign: 'center' as const, overflow: 'hidden' },
  ctaGlow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(31,175,140,0.08),transparent)', pointerEvents: 'none' },
  ctaInner: { position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  ctaTag: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.18em', color: 'var(--emerald)', textTransform: 'uppercase' },
  ctaTitle: { fontFamily: 'var(--f-display)', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--chrome)', margin: 0 },
  ctaDesc: { fontFamily: 'var(--f-serif)', fontStyle: 'italic', fontSize: '17px', color: 'var(--tx2)', lineHeight: 1.75 },
  ctaBtn: { padding: '16px 36px', background: 'var(--emerald)', color: 'var(--void)', fontFamily: 'var(--f-mono)', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 36px rgba(31,175,140,0.35)' },
  ctaNote: { fontFamily: 'var(--f-mono)', fontSize: '10px', color: 'var(--tx3)', letterSpacing: '0.08em' },
  footer: { borderTop: '1px solid var(--b1)', background: 'var(--void)', padding: '28px 48px' },
  footerInner: { maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: '16px' },
  footerLogo: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
  footerLogoTxt: { fontFamily: 'var(--f-display)', fontSize: '15px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--chrome)' },
  footerTxt: { fontFamily: 'var(--f-mono)', fontSize: '9.5px', letterSpacing: '0.1em', color: 'var(--tx3)', textTransform: 'uppercase' },
  footerLink: { fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--tx3)', textDecoration: 'none', textTransform: 'uppercase' },
}
