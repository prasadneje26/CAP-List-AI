import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function AnimatedStat({ value, suffix, label, delay, started }) {
  const num = parseInt(value.replace(/\D/g, '')) || 0
  const count = useCountUp(num, 1600, started)
  return (
    <div className="animate-slideUp" style={{ animationDelay: delay, textAlign: 'center', padding: '32px 24px', flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 8 }}>{label}</div>
    </div>
  )
}

const STEPS = [
  { n: '01', title: 'Enter Your Profile', desc: 'Provide your MHT-CET or JEE percentile, category, preferred branches, and locations in under 2 minutes.', icon: '📋' },
  { n: '02', title: 'AI Analyses Cutoffs', desc: 'Our ML model trained on 4 years of DTE data predicts next-year cutoffs with 95%+ accuracy across all categories.', icon: '🤖' },
  { n: '03', title: 'Get Your CAP List', desc: 'Receive an optimized 30-college preference list — sorted and classified as Dream, Target, or Safe for your profile.', icon: '🎯' },
]

const FEATURES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'ML Cutoff Prediction',
    desc: 'GradientBoosting model trained on 2021–2025 Maharashtra cutoff data. Predicts 2026 cutoffs with MAE of 0.58.',
    badge: '96% Accuracy',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: 'Dream / Target / Safe',
    desc: 'Each college is instantly classified based on your percentile gap, with an ML-computed admission probability score.',
    badge: 'Real-time',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
    title: 'CAP Preference Optimizer',
    desc: 'Generates the optimal 30-entry preference order following official DTE CAP strategy rules to maximise yield.',
    badge: 'DTE-compliant',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    title: 'AI Counseling Bot',
    desc: 'Ask anything — "Can I get PCCOE CS at 93 percentile OBC?" — and get instant, data-backed counseling advice.',
    badge: 'Powered by AI',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    title: 'Strategy PDF Report',
    desc: 'Download a comprehensive counseling report with your curated CAP list, predictions, and admission tips.',
    badge: 'Downloadable',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Alumni Mentorship',
    desc: 'Book 1:1 sessions with seniors who got into your target colleges. Get first-hand strategy and tips.',
    badge: 'Human guidance',
  },
]

const CATEGORIES = [
  { code: 'OPEN', label: 'Open / General', color: '#0A192F' },
  { code: 'OBC',  label: 'OBC',           color: '#1D4ED8' },
  { code: 'SC',   label: 'SC',            color: '#7C3AED' },
  { code: 'ST',   label: 'ST',            color: '#B45309' },
  { code: 'EWS',  label: 'EWS',           color: '#065F46' },
  { code: 'TFWS', label: 'TFWS',          color: '#9D174D' },
  { code: 'PWD',  label: 'PWD',           color: '#1F2937' },
]

export default function Home() {
  const statsRef = useRef(null)
  const [statsStarted, setStatsStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      {/* ── Hero ────────────────────────────────── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A192F 0%, #112240 50%, #0D2137 100%)',
        padding: '100px 0 0',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(circle at 70% 50%, rgba(255,183,3,0.06) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '8%', width: 380, height: 380,
          borderRadius: '50%', border: '1px solid rgba(255,183,3,0.08)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '25%', right: '12%', width: 240, height: 240,
          borderRadius: '50%', border: '1px solid rgba(255,183,3,0.12)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            {/* Eyebrow */}
            <div className="animate-slideDown" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px', marginBottom: 32,
              background: 'rgba(255,183,3,0.1)', border: '1px solid rgba(255,183,3,0.2)',
              borderRadius: 'var(--radius-full)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', display: 'block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--amber)' }}>
                Maharashtra Engineering Admissions · CAP 2026
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-slideUp" style={{
              fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 700,
              color: 'var(--white)', letterSpacing: '-2px', lineHeight: 1.08,
              marginBottom: 24,
            }}>
              Navigate CAP Rounds<br />
              with{' '}
              <span style={{
                background: 'linear-gradient(90deg, var(--amber) 0%, #FF8C00 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Data-Driven AI.
              </span>
            </h1>

            <p className="animate-slideUp delay-1" style={{
              fontSize: 19, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
              marginBottom: 48, maxWidth: 600, margin: '0 auto 48px',
            }}>
              AI-powered cutoff predictions, smart Dream / Target / Safe profiling,
              and a mathematically optimized CAP preference list — ready in 60 seconds.
            </p>

            <div className="animate-slideUp delay-2" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
              <Link to="/register" className="btn btn-amber btn-lg" style={{ minWidth: 200, fontSize: 16, fontWeight: 700 }}>
                Build My CAP List — Free
              </Link>
              <Link to="/login" className="btn btn-lg" style={{
                background: 'rgba(255,255,255,0.08)', color: 'var(--white)',
                border: '1.5px solid rgba(255,255,255,0.2)', fontSize: 16,
              }}>
                Sign In
              </Link>
            </div>

            {/* Category pills */}
            <div className="animate-slideUp delay-3" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, alignSelf: 'center', marginRight: 4 }}>Supports:</span>
              {CATEGORIES.map(c => (
                <span key={c.code} style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                }}>
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          {/* Stats band */}
          <div ref={statsRef} style={{
            display: 'flex', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            overflow: 'hidden', maxWidth: 900, margin: '0 auto',
          }}>
            {[
              { value: '400', suffix: '+', label: 'Colleges Indexed' },
              { value: '4',   suffix: ' yr', label: 'Cutoff History' },
              { value: '7',   suffix: '',   label: 'Reservation Categories' },
              { value: '95',  suffix: '%',  label: 'Prediction Accuracy' },
            ].map((s, i) => (
              <AnimatedStat key={s.label} {...s} delay={`${i * 0.1}s`} started={statsStarted} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--gray-100)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">How it works</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 16 }}>Three steps to your ideal college</h2>
            <p className="text-muted" style={{ fontSize: 17, maxWidth: 520, margin: '0 auto' }}>
              No spreadsheets, no guesswork. Let AI do the heavy lifting.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={step.n} className="card card-hover animate-slideUp" style={{ animationDelay: `${i * 0.12}s`, position: 'relative', padding: 36 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, marginBottom: 24,
                  background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                }}>
                  {step.icon}
                </div>
                <div style={{
                  position: 'absolute', top: 28, right: 28,
                  fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 700,
                  color: 'var(--gray-200)', lineHeight: 1, userSelect: 'none',
                }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: 20, fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: 12 }}>{step.title}</h3>
                <p className="text-muted" style={{ fontSize: 14.5, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label">Platform Features</div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 16 }}>The complete admissions toolkit</h2>
            <p className="text-muted" style={{ fontSize: 17, maxWidth: 560, margin: '0 auto' }}>
              Built exclusively for Maharashtra MHT-CET &amp; JEE candidates across all 7 reservation categories.
            </p>
          </div>
          <div className="grid-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card card-hover animate-slideUp" style={{ animationDelay: `${i * 0.08}s`, padding: '36px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: 'var(--gray-100)', color: 'var(--navy)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {f.icon}
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: 10 }}>{f.badge}</span>
                </div>
                <h3 style={{ fontSize: 18, fontFamily: 'var(--font-sans)', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Social proof ─────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--gray-100)', borderTop: '1px solid var(--gray-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">What Students Say</div>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>Trusted by students across Maharashtra</h2>
          </div>
          <div className="grid-3" style={{ gap: 20 }}>
            {[
              { name: 'Riya Sharma', score: '97.8%', category: 'OPEN', college: 'COEP, Pune', text: 'The CAP list generator saved me so much stress. I submitted exactly what it suggested and got COEP Computer — my first choice!' },
              { name: 'Akash Patil', score: '89.2%', category: 'OBC', college: 'VJTI, Mumbai', text: 'I had no idea OBC cutoffs were so different. The category-specific predictions were spot on. Got VJTI IT in first round.' },
              { name: 'Priya Desai', score: '92.5%', category: 'EWS', college: 'PCCOE, Pune', text: 'The chatbot answered all my TFWS queries instantly. Could not have navigated this alone. Highly recommend!' },
            ].map((t, i) => (
              <div key={i} className="card animate-slideUp" style={{ animationDelay: `${i * 0.12}s`, padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="var(--amber)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--gray-700)', marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--navy)', color: 'var(--white)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 700, flexShrink: 0,
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{t.score} · {t.category} · {t.college}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────── */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(135deg, #0A192F 0%, #112240 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 70%, rgba(255,183,3,0.07) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ textAlign: 'center', maxWidth: 640, position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ color: 'var(--amber)' }}>Start Today</div>
          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(28px,4vw,44px)', marginBottom: 20, letterSpacing: '-0.5px' }}>
            Secure your ideal college — don't leave it to chance.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.65, marginBottom: 44 }}>
            Stop guessing admission chances. Use 4 years of historical data and AI-powered predictions to build a foolproof CAP strategy in minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-amber btn-lg" style={{ fontSize: 16, fontWeight: 700, minWidth: 220 }}>
              Create Free Account
            </Link>
            <Link to="/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--white)', border: '1.5px solid rgba(255,255,255,0.15)', fontSize: 16 }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
