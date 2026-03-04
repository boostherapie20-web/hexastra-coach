'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

type PreviewMsg = { role: 'user' | 'ai'; text: string; isGate?: boolean }

const FREE_RESPONSES: Record<string, string> = {
  default: "Your current configuration points to a period of internal reorganization. What feels like hesitation is actually discernment — your system is calibrating before a meaningful shift.\n\nA clearer picture awaits in your full reading...",
  relation: "The relational tension you're sensing reflects a Venus-Node alignment that's asking for honesty over comfort. This is not a rupture — it's an invitation to deepen.\n\nYour full reading includes a detailed love & connection analysis...",
  travail: "A Jupiter transit is activating your professional axis right now. The uncertainty you feel is the space between what was and what's coming — a repositioning, not a setback.\n\nYour full reading includes career & financial dynamics...",
  decision: "Your inner authority is signaling something your analytical mind hasn't fully processed yet. The hesitation is data, not weakness.\n\nYour full reading reveals your decision-making profile...",
}

function getResponse(q: string): string {
  const ql = q.toLowerCase()
  if (ql.includes('relation') || ql.includes('love') || ql.includes('amour') || ql.includes('couple')) return FREE_RESPONSES.relation
  if (ql.includes('work') || ql.includes('travail') || ql.includes('job') || ql.includes('carrière')) return FREE_RESPONSES.travail
  if (ql.includes('decision') || ql.includes('décision') || ql.includes('choice') || ql.includes('choix')) return FREE_RESPONSES.decision
  return FREE_RESPONSES.default
}

export default function LandingPage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<PreviewMsg[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

  const handleAsk = async () => {
    const q = question.trim()
    if (!q || isTyping) return
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setQuestion('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 2000))
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'ai', text: getResponse(q), isGate: true }])
    setShowGate(true)
  }

  const chatStarted = messages.length > 0 || isTyping

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:       #2C1A14;
          --bg2:      #241610;
          --bg3:      #1E1109;
          --panel:    #3A2218;
          --panel2:   #452A1E;
          --gold:     #C6A769;
          --gold2:    #D4B87A;
          --gold3:    #E8D4A8;
          --goldDim:  rgba(198,167,105,0.12);
          --goldLine: rgba(198,167,105,0.2);
          --cream:    #F5F3EF;
          --cream2:   #D6CFC4;
          --cream3:   #9A9189;
          --void:     #150D09;
          --f-display: 'Cormorant Garamond', Georgia, serif;
          --f-body:    'DM Sans', system-ui, sans-serif;
          --f-mono:    'DM Mono', monospace;
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--cream); font-family: var(--f-body); overflow-x: hidden; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1; transform: scale(1); }
        }
        @keyframes scanLine {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }

        /* Noise texture overlay */
        .noise::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.4;
        }

        .fade-up { animation: fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .fade-up-1 { animation-delay: 0.1s; }
        .fade-up-2 { animation-delay: 0.22s; }
        .fade-up-3 { animation-delay: 0.34s; }
        .fade-up-4 { animation-delay: 0.46s; }

        /* Nav */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 48px;
          background: rgba(44,26,20,0.85);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--goldLine);
        }
        .nav-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .nav-logo-img { width: 36px; height: 36px; border-radius: 50%; filter: drop-shadow(0 0 12px rgba(198,167,105,0.5)); }
        .nav-logo-txt { font-family: var(--f-display); font-size: 22px; font-weight: 500; letter-spacing: 0.08em; color: var(--cream); }
        .nav-logo-accent { color: var(--gold); }
        .nav-links { display: flex; align-items: center; gap: 36px; }
        .nav-link { font-family: var(--f-body); font-size: 13px; font-weight: 400; color: var(--cream3); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
        .nav-link:hover { color: var(--gold); }
        .nav-cta {
          padding: 10px 22px;
          background: var(--gold); color: var(--void);
          font-family: var(--f-body); font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
          border: none; border-radius: 4px; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(198,167,105,0.3);
        }
        .nav-cta:hover { background: var(--gold2); transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 48px 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 60% 40%, rgba(198,167,105,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 20% 80%, rgba(44,26,20,0.9) 0%, transparent 70%),
            linear-gradient(160deg, var(--bg3) 0%, var(--bg) 50%, var(--bg2) 100%);
        }
        .hero-orb {
          position: absolute; right: -100px; top: 50%; transform: translateY(-50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(198,167,105,0.06) 0%, transparent 70%);
          animation: glow 8s ease-in-out infinite;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(198,167,105,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(198,167,105,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 70% at 60% 50%, black, transparent);
        }
        .hero-inner {
          position: relative; z-index: 1;
          max-width: 680px;
          display: flex; flex-direction: column; gap: 28px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--gold); opacity: 0.8;
        }
        .hero-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); animation: pulse 2s ease infinite; }
        .hero-title {
          font-family: var(--f-display);
          font-size: clamp(52px, 6vw, 88px);
          font-weight: 300;
          line-height: 1.0;
          letter-spacing: -0.01em;
          color: var(--cream);
        }
        .hero-title em { font-style: italic; color: var(--gold); }
        .hero-sub {
          font-family: var(--f-body); font-size: 18px; font-weight: 300; line-height: 1.75;
          color: var(--cream2); max-width: 540px;
        }
        .hero-ctas { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
        .btn-primary {
          padding: 15px 32px;
          background: var(--gold); color: var(--void);
          font-family: var(--f-body); font-size: 14px; font-weight: 600; letter-spacing: 0.04em;
          border: none; border-radius: 4px; cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 32px rgba(198,167,105,0.35);
          display: flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: var(--gold2); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(198,167,105,0.45); }
        .btn-secondary {
          padding: 15px 28px;
          background: transparent; color: var(--cream2);
          font-family: var(--f-body); font-size: 14px; font-weight: 400; letter-spacing: 0.04em;
          border: 1px solid rgba(198,167,105,0.25); border-radius: 4px; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-decoration: none; display: flex; align-items: center;
        }
        .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }
        .hero-trust { display: flex; align-items: center; gap: 14px; }
        .trust-avs { display: flex; }
        .trust-av {
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--panel2); border: 2px solid var(--bg);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--f-mono); font-size: 9px; color: var(--gold);
          margin-left: -6px;
        }
        .trust-av:first-child { margin-left: 0; }
        .trust-txt { font-family: var(--f-body); font-size: 12px; color: var(--cream3); }

        /* PREVIEW WIDGET (hero right) */
        .hero-widget {
          position: absolute; right: 48px; top: 50%; transform: translateY(-50%);
          width: 420px; z-index: 2;
          background: var(--panel);
          border: 1px solid var(--goldLine);
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,167,105,0.08) inset;
        }
        .widget-bar {
          background: var(--panel2); padding: 11px 16px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid var(--goldLine);
        }
        .w-dots { display: flex; gap: 5px; }
        .w-dot { width: 8px; height: 8px; border-radius: 50%; }
        .widget-title { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.12em; color: var(--cream3); text-transform: uppercase; flex: 1; text-align: center; }
        .widget-live { display: flex; align-items: center; gap: 5px; font-family: var(--f-mono); font-size: 9px; color: var(--gold); }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s ease infinite; }
        .widget-body { padding: 16px 14px; display: flex; flex-direction: column; gap: 12px; min-height: 220px; max-height: 400px; overflow-y: auto; }
        .widget-body::-webkit-scrollbar { width: 0; }
        .w-msg-row { display: flex; align-items: flex-end; gap: 8px; }
        .w-av { width: 26px; height: 26px; min-width: 26px; border-radius: 50%; overflow: hidden; border: 1px solid var(--goldLine); flex-shrink: 0; }
        .w-bub-ai {
          background: rgba(198,167,105,0.06); border: 1px solid var(--goldLine);
          border-radius: 12px; border-bottom-left-radius: 2px; padding: 10px 13px; max-width: 88%;
        }
        .w-bub-u {
          background: rgba(245,243,239,0.06); border: 1px solid rgba(245,243,239,0.1);
          border-radius: 12px; border-bottom-right-radius: 2px; padding: 10px 13px; max-width: 88%; margin-left: auto;
        }
        .w-txt { font-family: var(--f-body); font-size: 12.5px; line-height: 1.65; color: var(--cream2); white-space: pre-wrap; }
        .w-suggs { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; }
        .w-sugg {
          background: rgba(198,167,105,0.07); border: 1px solid rgba(198,167,105,0.18);
          border-radius: 6px; padding: 7px 12px;
          font-family: var(--f-body); font-size: 11px; color: var(--gold);
          cursor: pointer; text-align: left; transition: background 0.2s;
        }
        .w-sugg:hover { background: rgba(198,167,105,0.14); }
        .w-gate {
          margin-top: 12px;
          background: rgba(198,167,105,0.05); border: 1px solid rgba(198,167,105,0.2);
          border-radius: 10px; padding: 14px;
        }
        .w-gate-lock { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
        .w-gate-lock-txt { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; color: var(--gold); text-transform: uppercase; }
        .w-gate-desc { font-family: var(--f-body); font-size: 12px; color: var(--cream2); line-height: 1.6; margin-bottom: 10px; font-style: italic; }
        .w-gate-btn {
          width: 100%; padding: 10px;
          background: var(--gold); color: var(--void);
          font-family: var(--f-body); font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          border: none; border-radius: 6px; cursor: pointer;
          box-shadow: 0 6px 20px rgba(198,167,105,0.3);
          transition: background 0.2s;
        }
        .w-gate-btn:hover { background: var(--gold2); }
        .w-gate-sub { font-family: var(--f-mono); font-size: 9px; color: var(--cream3); text-align: center; margin-top: 8px; }
        .w-gate-link { color: var(--gold); text-decoration: underline; cursor: pointer; }
        .w-dots-row { display: flex; gap: 4px; align-items: center; }
        .w-dot-blink { width: 5px; height: 5px; border-radius: 50%; background: var(--cream3); display: inline-block; animation: blink 1.4s ease-in-out infinite; }
        .widget-composer { border-top: 1px solid var(--goldLine); padding: 11px 13px 10px; }
        .w-comp-inner {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(198,167,105,0.18);
          border-radius: 10px; padding: 9px 12px;
        }
        .w-input { flex: 1; background: transparent; border: none; outline: none; color: var(--cream); font-family: var(--f-body); font-size: 12.5px; }
        .w-input::placeholder { color: var(--cream3); }
        .w-send {
          width: 30px; height: 30px; flex-shrink: 0;
          background: var(--gold); border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: var(--void); border: none; cursor: pointer;
          box-shadow: 0 3px 12px rgba(198,167,105,0.3);
          transition: background 0.2s, opacity 0.2s;
        }
        .w-send:hover { background: var(--gold2); }
        .w-comp-note { font-family: var(--f-mono); font-size: 9px; color: var(--cream3); text-align: center; letter-spacing: 0.07em; margin-top: 7px; }

        /* SECTIONS */
        .section { padding: 96px 48px; position: relative; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-tag { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.22em; color: var(--gold); text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .section-tag::before { content: ''; display: block; width: 28px; height: 1px; background: var(--gold); opacity: 0.5; }
        .section-title { font-family: var(--f-display); font-size: clamp(36px, 4vw, 56px); font-weight: 400; letter-spacing: -0.01em; color: var(--cream); margin-bottom: 16px; line-height: 1.1; }
        .section-title em { font-style: italic; color: var(--gold); }
        .section-sub { font-family: var(--f-body); font-size: 17px; font-weight: 300; color: var(--cream2); line-height: 1.8; max-width: 560px; }
        .section-divider { height: 1px; background: linear-gradient(90deg, transparent, var(--goldLine), transparent); margin: 0 48px; }

        /* HOW IT WORKS */
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 56px; }
        .step {
          padding: 40px 36px; background: var(--panel);
          border: 1px solid var(--goldLine);
          display: flex; flex-direction: column; gap: 18px;
          position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .step:first-child { border-radius: 16px 0 0 16px; }
        .step:last-child { border-radius: 0 16px 16px 0; }
        .step::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 0%, rgba(198,167,105,0.06), transparent); opacity: 0; transition: opacity 0.3s; }
        .step:hover { background: var(--panel2); }
        .step:hover::before { opacity: 1; }
        .step-num { font-family: var(--f-display); font-size: 64px; font-weight: 300; color: rgba(198,167,105,0.15); line-height: 1; }
        .step-icon { width: 44px; height: 44px; background: var(--goldDim); border: 1px solid var(--goldLine); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--gold); }
        .step-title { font-family: var(--f-display); font-size: 22px; font-weight: 500; color: var(--cream); letter-spacing: -0.01em; }
        .step-desc { font-family: var(--f-body); font-size: 14px; font-weight: 300; color: var(--cream2); line-height: 1.75; }

        /* READING CARDS */
        .reading-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 56px; }
        .reading-card {
          padding: 28px 24px; background: var(--panel);
          border: 1px solid var(--goldLine); border-radius: 12px;
          display: flex; flex-direction: column; gap: 12px;
          cursor: pointer; transition: background 0.25s, border-color 0.25s, transform 0.25s;
          position: relative; overflow: hidden;
        }
        .reading-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); opacity: 0; transition: opacity 0.3s; }
        .reading-card:hover { background: var(--panel2); border-color: rgba(198,167,105,0.4); transform: translateY(-3px); }
        .reading-card:hover::after { opacity: 1; }
        .reading-card.active { background: var(--panel2); border-color: rgba(198,167,105,0.5); }
        .reading-card.active::after { opacity: 1; }
        .card-icon { font-size: 22px; }
        .card-title { font-family: var(--f-display); font-size: 18px; font-weight: 500; color: var(--cream); }
        .card-desc { font-family: var(--f-body); font-size: 13px; font-weight: 300; color: var(--cream2); line-height: 1.7; }

        /* EXAMPLE READING */
        .example-section { background: var(--bg2); }
        .example-card {
          background: var(--panel); border: 1px solid var(--goldLine);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.4);
          max-width: 780px; margin: 56px auto 0;
        }
        .example-header {
          padding: 24px 32px; background: var(--panel2);
          border-bottom: 1px solid var(--goldLine);
          display: flex; align-items: center; justify-content: space-between;
        }
        .example-header-left { display: flex; align-items: center; gap: 12px; }
        .example-avatar { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--goldLine); overflow: hidden; }
        .example-name { font-family: var(--f-display); font-size: 18px; font-weight: 500; color: var(--cream); }
        .example-date { font-family: var(--f-mono); font-size: 10px; color: var(--cream3); letter-spacing: 0.1em; }
        .example-badge { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.14em; color: var(--gold); background: var(--goldDim); border: 1px solid var(--goldLine); border-radius: 100px; padding: 4px 12px; text-transform: uppercase; }
        .example-body { padding: 36px 32px; display: flex; flex-direction: column; gap: 28px; }
        .reading-block { display: flex; flex-direction: column; gap: 8px; }
        .reading-block-tag { font-family: var(--f-mono); font-size: 9.5px; letter-spacing: 0.18em; color: var(--gold); text-transform: uppercase; }
        .reading-block-title { font-family: var(--f-display); font-size: 22px; font-weight: 500; color: var(--cream); }
        .reading-block-txt { font-family: var(--f-body); font-size: 15px; font-weight: 300; color: var(--cream2); line-height: 1.85; font-style: italic; }
        .reading-divider { height: 1px; background: var(--goldLine); }
        .reading-cta-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .reading-cta-note { font-family: var(--f-body); font-size: 13px; color: var(--cream3); font-style: italic; }

        /* PRICING */
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 56px; align-items: start; }
        .plan {
          background: var(--panel); border: 1px solid var(--goldLine);
          border-radius: 16px; padding: 32px; position: relative;
          display: flex; flex-direction: column; gap: 0;
          transition: transform 0.25s;
        }
        .plan:hover { transform: translateY(-4px); }
        .plan-featured { border-color: rgba(198,167,105,0.5); background: var(--panel2); box-shadow: 0 0 0 1px rgba(198,167,105,0.15), 0 32px 80px rgba(0,0,0,0.5); }
        .plan-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--gold); color: var(--void); font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.12em; padding: 4px 16px; border-radius: 100px; white-space: nowrap; font-weight: 500; }
        .plan-tag { font-family: var(--f-mono); font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--cream3); margin-bottom: 12px; }
        .plan-name { font-family: var(--f-display); font-size: 30px; font-weight: 400; color: var(--cream); line-height: 1; }
        .plan-price { display: flex; align-items: baseline; gap: 4px; margin: 14px 0 8px; }
        .plan-amt { font-family: var(--f-display); font-size: 54px; font-weight: 300; color: var(--cream); line-height: 1; }
        .plan-cur { font-family: var(--f-mono); font-size: 16px; color: var(--cream2); }
        .plan-per { font-family: var(--f-mono); font-size: 11px; color: var(--cream3); letter-spacing: 0.06em; }
        .plan-desc { font-family: var(--f-body); font-size: 13px; font-style: italic; color: var(--cream2); line-height: 1.6; margin-bottom: 20px; }
        .plan-divider { height: 1px; background: var(--goldLine); margin: 0 0 20px; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }
        .plan-feature { display: flex; align-items: flex-start; gap: 10px; font-family: var(--f-body); font-size: 13.5px; color: var(--cream2); line-height: 1.5; }
        .plan-feature-off { opacity: 0.35; }
        .check { color: var(--gold); font-weight: 600; flex-shrink: 0; }
        .cross { color: var(--cream3); flex-shrink: 0; }
        .plan-btn-primary {
          padding: 13px; width: 100%;
          background: var(--gold); color: var(--void);
          font-family: var(--f-body); font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
          border: none; border-radius: 6px; cursor: pointer;
          box-shadow: 0 8px 24px rgba(198,167,105,0.35); transition: background 0.2s;
        }
        .plan-btn-primary:hover { background: var(--gold2); }
        .plan-btn-secondary {
          padding: 12px; width: 100%;
          background: rgba(198,167,105,0.09); border: 1px solid rgba(198,167,105,0.25); color: var(--gold);
          font-family: var(--f-body); font-size: 13px; font-weight: 500; letter-spacing: 0.04em;
          border-radius: 6px; cursor: pointer; transition: background 0.2s, border-color 0.2s;
        }
        .plan-btn-secondary:hover { background: rgba(198,167,105,0.16); border-color: rgba(198,167,105,0.45); }
        .plan-btn-ghost {
          padding: 12px; width: 100%;
          background: transparent; border: 1px solid rgba(245,243,239,0.15); color: var(--cream2);
          font-family: var(--f-body); font-size: 13px; font-weight: 400;
          border-radius: 6px; cursor: pointer; transition: border-color 0.2s;
        }
        .plan-btn-ghost:hover { border-color: rgba(245,243,239,0.35); }

        /* FINAL CTA */
        .final-cta { text-align: center; position: relative; overflow: hidden; }
        .final-cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(198,167,105,0.08), transparent); pointer-events: none; }
        .final-cta-inner { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .final-cta-line { font-family: var(--f-display); font-size: clamp(38px, 4.5vw, 64px); font-weight: 300; color: var(--cream); line-height: 1.1; }
        .final-cta-line em { font-style: italic; color: var(--gold); }
        .final-cta-sub { font-family: var(--f-body); font-size: 16px; font-weight: 300; color: var(--cream2); line-height: 1.75; }
        .final-cta-note { font-family: var(--f-mono); font-size: 10px; color: var(--cream3); letter-spacing: 0.1em; }

        /* FOOTER */
        .footer { border-top: 1px solid var(--goldLine); background: var(--void); padding: 32px 48px; }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .footer-logo-txt { font-family: var(--f-display); font-size: 17px; font-weight: 400; letter-spacing: 0.06em; color: var(--cream); }
        .footer-txt { font-family: var(--f-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--cream3); }
        .footer-links { display: flex; gap: 20px; }
        .footer-link { font-family: var(--f-body); font-size: 12px; color: var(--cream3); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--gold); }

        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .nav-links { gap: 16px; }
          .hero { padding: 100px 24px 60px; flex-direction: column; min-height: auto; }
          .hero-inner { max-width: 100%; }
          .hero-widget { position: relative; right: auto; top: auto; transform: none; width: 100%; max-width: 460px; margin-top: 40px; }
          .steps { grid-template-columns: 1fr; }
          .step:first-child { border-radius: 16px 16px 0 0; }
          .step:last-child { border-radius: 0 0 16px 16px; }
          .pricing-grid { grid-template-columns: 1fr; }
          .section { padding: 64px 24px; }
          .section-divider { margin: 0 24px; }
          .footer { padding: 28px 24px; }
          .reading-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="noise">

        {/* NAV */}
        <nav className="nav">
          <a href="/" className="nav-logo">
            <Image src="/logo/hexastra.png" alt="HexAstra" width={36} height={36} className="nav-logo-img" />
            <span className="nav-logo-txt">Hex<span className="nav-logo-accent">Astra</span> Coach</span>
          </a>
          <div className="nav-links">
            <a href="#how" className="nav-link">How it works</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <button onClick={() => router.push('/login')} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>Sign in</button>
            <button onClick={() => router.push('/login')} className="nav-cta">Start a reading</button>
          </div>
        </nav>

        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-orb" />
          <div className="hero-grid" />

          <div className="hero-inner">
            <div className="hero-eyebrow fade-up">
              <span className="hero-eyebrow-dot" />
              Personal intelligence · AI-powered
            </div>

            <h1 className="hero-title fade-up fade-up-1">
              HexAstra<br />
              <em>Coach</em>
            </h1>

            <p className="hero-sub fade-up fade-up-2">
              Understand your inner state. Make clearer decisions.<br />Move forward with confidence.
            </p>

            <div className="hero-ctas fade-up fade-up-3">
              <button onClick={() => router.push('/login')} className="btn-primary">
                Start a reading
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
              <a href="#how" className="btn-secondary">How it works</a>
            </div>

            <div className="hero-trust fade-up fade-up-4">
              <div className="trust-avs">
                {['S','M','L','A','R'].map((l, i) => <div key={i} className="trust-av">{l}</div>)}
              </div>
              <span className="trust-txt">2,400+ readings · 4.9 / 5</span>
            </div>
          </div>

          {/* PREVIEW WIDGET */}
          <div className="hero-widget">
            <div className="widget-bar">
              <div className="w-dots">
                <span className="w-dot" style={{ background: '#ff5f57' }} />
                <span className="w-dot" style={{ background: '#febc2e' }} />
                <span className="w-dot" style={{ background: '#28c840' }} />
              </div>
              <div className="widget-title">Free preview · no sign-up</div>
              <div className="widget-live"><span className="live-dot" />Live</div>
            </div>

            <div className="widget-body">
              {!chatStarted && (
                <div className="w-msg-row">
                  <div className="w-av">
                    <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                  <div className="w-bub-ai">
                    <p className="w-txt">Ask me anything about your current situation — no account needed for your first insight.</p>
                    <div className="w-suggs">
                      {['My love life', 'A decision I need to make', 'My career right now'].map((sug, i) => (
                        <button key={i} className="w-sugg" onClick={() => setQuestion(sug)}>{sug}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className="w-msg-row" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {msg.role === 'ai' && (
                    <div className="w-av">
                      <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                  )}
                  <div className={msg.role === 'user' ? 'w-bub-u' : 'w-bub-ai'}>
                    <p className="w-txt">{msg.text}</p>
                    {msg.isGate && (
                      <div className="w-gate">
                        <div className="w-gate-lock">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C6A769" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                          <span className="w-gate-lock-txt">Full reading available</span>
                        </div>
                        <p className="w-gate-desc">Create your free account to receive your complete personalized reading.</p>
                        <button onClick={() => router.push('/login')} className="w-gate-btn">Continue for free →</button>
                        <p className="w-gate-sub">Already a member? <span className="w-gate-link" onClick={() => router.push('/login')}>Sign in</span></p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="w-msg-row">
                  <div className="w-av">
                    <Image src="/logo/hexastra.png" alt="HexAstra" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                  <div className="w-bub-ai">
                    <div className="w-dots-row">
                      {[0,1,2].map(i => <span key={i} className="w-dot-blink" style={{ animationDelay: `${i*0.18}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {!showGate && (
              <div className="widget-composer">
                <div className="w-comp-inner">
                  <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()} placeholder="Ask about your situation…" className="w-input" disabled={isTyping} />
                  <button onClick={handleAsk} disabled={!question.trim() || isTyping} className="w-send" style={{ opacity: !question.trim() || isTyping ? 0.35 : 1 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <p className="w-comp-note">Free · No credit card · No sign-up required</p>
              </div>
            )}
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── HOW IT WORKS ─────────────────────────────────── */}
        <section id="how" className="section">
          <div className="section-inner">
            <div className="section-tag">How it works</div>
            <h2 className="section-title">Three steps to <em>clarity</em></h2>
            <p className="section-sub">No complex charts. No jargon. A clear, personal reading about where you are right now.</p>

            <div className="steps">
              {[
                {
                  n: '01', title: 'Enter your birth information',
                  desc: 'Date, time and place of birth. HexAstra uses this to map your current energy configuration with precision.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/></svg>,
                },
                {
                  n: '02', title: 'HexAstra analyzes your dynamics',
                  desc: 'Planetary transits, Human Design gates, numerological cycles — all synthesized into one coherent view of your current life energy.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
                },
                {
                  n: '03', title: 'Receive your reading',
                  desc: 'A clear, actionable reading about your love life, work, mood, health and direction. Available as text, PDF, or personal audio.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>,
                },
              ].map((step, i) => (
                <div key={i} className="step">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-num">{step.n}</div>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── WHAT YOU RECEIVE ─────────────────────────────── */}
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <div className="section-inner">
            <div className="section-tag">What you receive</div>
            <h2 className="section-title">Your personal reading <em>includes</em></h2>
            <p className="section-sub">Each reading covers the five areas that shape how you experience your life day to day.</p>

            <div className="reading-grid">
              {[
                { icon: '♥', title: 'Love & Connection', desc: 'Understand the relational dynamics at play. What you need, what you attract, and what this moment is teaching you about love.' },
                { icon: '◈', title: 'Work & Money', desc: 'Clarity on your professional energy, your current opportunities, and the financial patterns shaping your decisions.' },
                { icon: '◯', title: 'Mood & Inner State', desc: 'A precise read of your emotional weather — not just how you feel, but why, and what to do with it.' },
                { icon: '✦', title: 'Health & Energy', desc: 'Physical and energetic rhythms. When to push, when to rest, and what your body is communicating right now.' },
                { icon: '→', title: 'Life Direction', desc: 'The bigger picture. Where you are in your longer cycle and what this phase is preparing you for.' },
              ].map((card, i) => (
                <div
                  key={i}
                  className={`reading-card ${activeCard === i ? 'active' : ''}`}
                  onClick={() => setActiveCard(activeCard === i ? null : i)}
                >
                  <div className="card-icon" style={{ color: 'var(--gold)' }}>{card.icon}</div>
                  <div className="card-title">{card.title}</div>
                  <p className="card-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── EXAMPLE READING ──────────────────────────────── */}
        <section className="section example-section">
          <div className="section-inner">
            <div className="section-tag">Example reading</div>
            <h2 className="section-title">What a reading <em>feels like</em></h2>
            <p className="section-sub">Clear. Personal. Useful. Not vague affirmations — actual insight about your current configuration.</p>

            <div className="example-card">
              <div className="example-header">
                <div className="example-header-left">
                  <div className="example-avatar">
                    <Image src="/logo/hexastra.png" alt="HexAstra" width={38} height={38} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                  <div>
                    <div className="example-name">Sarah M.</div>
                    <div className="example-date">Today · Premium Reading</div>
                  </div>
                </div>
                <div className="example-badge">◆ Full reading</div>
              </div>

              <div className="example-body">
                {[
                  { tag: 'Energy of the day', title: 'An invitation to slow down', txt: 'An inner movement invites you to slow down and clarify what truly deserves your attention. This is not lethargy — it is selective focus. Your system is filtering signal from noise.' },
                  { tag: 'Understanding', title: 'A phase, not a blockage', txt: 'What you feel is not a blockage, but a phase of internal reorganization. Something is completing and something new is forming — the discomfort is the transition itself.' },
                  { tag: 'Action', title: 'One decision, clearly', txt: 'Simplify your day and focus on one important decision. The energy available to you today is precise, not broad. Use it for depth, not breadth.' },
                ].map((block, i) => (
                  <div key={i}>
                    <div className="reading-block">
                      <div className="reading-block-tag">{block.tag}</div>
                      <div className="reading-block-title">{block.title}</div>
                      <p className="reading-block-txt">{block.txt}</p>
                    </div>
                    {i < 2 && <div className="reading-divider" style={{ marginTop: '28px' }} />}
                  </div>
                ))}

                <div style={{ height: '1px', background: 'var(--goldLine)' }} />
                <div className="reading-cta-row">
                  <p className="reading-cta-note">Full reading: 6 pages · PDF · Personal audio</p>
                  <button onClick={() => router.push('/login')} className="btn-primary" style={{ fontSize: '13px', padding: '12px 24px' }}>
                    Get my reading →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── PRICING ──────────────────────────────────────── */}
        <section id="pricing" className="section">
          <div className="section-inner">
            <div className="section-tag">Pricing</div>
            <h2 className="section-title">Start free. <em>Go deeper</em> when ready.</h2>
            <p className="section-sub">No commitment. Upgrade or cancel anytime.</p>

            <div className="pricing-grid">
              {/* FREE */}
              <div className="plan">
                <div className="plan-tag">// Free</div>
                <div className="plan-name">Starter</div>
                <div className="plan-price">
                  <span className="plan-amt">0</span>
                  <span className="plan-cur">€</span>
                </div>
                <p className="plan-desc">Discover what HexAstra can reveal. No commitment.</p>
                <div className="plan-divider" />
                <ul className="plan-features">
                  {[
                    { txt: '1 short reading per day', ok: true },
                    { txt: 'Text format only', ok: true },
                    { txt: 'Chat access', ok: true },
                    { txt: 'Save up to 3 readings', ok: true },
                    { txt: 'PDF download', ok: false },
                    { txt: 'Personal audio', ok: false },
                    { txt: 'Advanced themes', ok: false },
                  ].map((f, i) => (
                    <li key={i} className={`plan-feature ${!f.ok ? 'plan-feature-off' : ''}`}>
                      <span className={f.ok ? 'check' : 'cross'}>{f.ok ? '✓' : '✕'}</span>
                      {f.txt}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/login')} className="plan-btn-ghost">Start for free</button>
              </div>

              {/* PREMIUM */}
              <div className="plan plan-featured">
                <div className="plan-badge">Most popular</div>
                <div className="plan-tag" style={{ color: 'var(--gold)' }}>// Premium</div>
                <div className="plan-name">Premium</div>
                <div className="plan-price">
                  <span className="plan-amt">19</span>
                  <span className="plan-cur">€</span>
                  <span className="plan-per">/month</span>
                </div>
                <p className="plan-desc">Your full personal reading, as deep as you want to go.</p>
                <div className="plan-divider" />
                <ul className="plan-features">
                  {[
                    'Unlimited readings',
                    'Complete personalized reading',
                    'PDF download (6 pages)',
                    'Personal audio (7 min)',
                    'Full reading history',
                    'Advanced themes',
                    'Priority support',
                  ].map((f, i) => (
                    <li key={i} className="plan-feature">
                      <span className="check">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/login')} className="plan-btn-primary">Start Premium →</button>
              </div>

              {/* PRACTITIONER */}
              <div className="plan">
                <div className="plan-tag">// Pro</div>
                <div className="plan-name">Practitioner</div>
                <div className="plan-price">
                  <span className="plan-amt">49</span>
                  <span className="plan-cur">€</span>
                  <span className="plan-per">/month</span>
                </div>
                <p className="plan-desc">For coaches and therapists integrating HexAstra into their practice.</p>
                <div className="plan-divider" />
                <ul className="plan-features">
                  {[
                    'Unlimited readings',
                    'PDF + audio for every reading',
                    'Client usage rights',
                    'Export and share readings',
                    'Priority generation',
                    'Dedicated support',
                  ].map((f, i) => (
                    <li key={i} className="plan-feature">
                      <span className="check">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push('/login')} className="plan-btn-secondary">Start Practitioner →</button>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── FINAL CTA ────────────────────────────────────── */}
        <section className="section final-cta">
          <div className="final-cta-glow" />
          <div className="final-cta-inner">
            <div className="section-tag" style={{ justifyContent: 'center' }}>Your reading is ready</div>
            <h2 className="final-cta-line">
              Understand <em>where you are.</em><br />
              Move forward with clarity.
            </h2>
            <p className="final-cta-sub">Takes 2 minutes. Free to start.</p>
            <button onClick={() => router.push('/login')} className="btn-primary" style={{ fontSize: '15px', padding: '16px 38px' }}>
              Start my reading
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </button>
            <p className="final-cta-note">Premium · 19 €/month · Practitioner · 49 €/month · No commitment</p>
          </div>
        </section>

        {/* ─── FOOTER ───────────────────────────────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            <a href="/" className="footer-logo">
              <Image src="/logo/hexastra.png" alt="HexAstra" width={28} height={28} style={{ borderRadius: '50%', filter: 'drop-shadow(0 0 6px rgba(198,167,105,0.4))' }} />
              <span className="footer-logo-txt">HexAstra Coach</span>
            </a>
            <p className="footer-txt">© 2026 HexAstra · Personal intelligence by AI</p>
            <div className="footer-links">
              <a href="#pricing" className="footer-link">Pricing</a>
              <a href="#how" className="footer-link">How it works</a>
              <a href="/login" className="footer-link">Sign in</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
