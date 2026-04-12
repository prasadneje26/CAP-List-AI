// ============================================================
// File: frontend-web/src/pages/Home.jsx
// ============================================================

import { Link } from 'react-router-dom'

const features = [
  { icon: '⚡', title: 'AI Cutoff Prediction', desc: 'ML model trained on 4 years of Maharashtra cutoff data predicts next year trends.' },
  { icon: '🎯', title: 'Dream / Target / Safe', desc: 'Every college classified in seconds based on your exact percentile and category.' },
  { icon: '📋', title: 'CAP Order Optimizer', desc: 'Generates an optimized 30-entry preference list following CAP strategy rules.' },
  { icon: '🤖', title: 'AI Counselor Bot', desc: 'Ask anything — "Can I get PCCOE CS at 93 percentile OBC?" — get instant answers.' },
  { icon: '📄', title: 'PDF Report', desc: 'Download a complete counseling report with your CAP list and strategy tips.' },
  { icon: '👨‍🏫', title: 'Mentorship', desc: 'Book 1:1 sessions with senior students who cracked CAP for your dream college.' },
]

const stats = [
  { value: '400+', label: 'Colleges covered' },
  { value: '4 yrs', label: 'Cutoff history' },
  { value: '7',     label: 'Categories supported' },
  { value: '95%',   label: 'Prediction accuracy' },
]

export default function Home() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section style={hero.section}>
        <div style={hero.bg} />
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <p style={hero.eyebrow}>Maharashtra Engineering Admissions · CAP 2025</p>
          <h1 style={{ marginBottom: '20px', lineHeight: 1.15 }}>
            Know exactly which colleges<br />
            <span className="text-amber">you'll get into.</span>
          </h1>
          <p style={hero.sub}>
            AI-powered cutoff prediction, Dream/Target/Safe classification,<br />
            and an optimized CAP preference list — in under 60 seconds.
          </p>
          <div style={hero.ctas}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Free → 
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">
              Sign In
            </Link>
          </div>
          {/* Stats row */}
          <div style={hero.statsRow}>
            {stats.map(s => (
              <div key={s.label} style={hero.statBox}>
                <span style={hero.statVal}>{s.value}</span>
                <span style={hero.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Everything you need to crack CAP</h2>
          <p className="text-muted" style={{ textAlign: 'center', marginBottom: '48px' }}>
            Built specifically for Maharashtra students — CET &amp; JEE, all 7 categories.
          </p>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card" style={{ transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '8px' }}>{f.title}</h3>
                <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────── */}
      <section style={{ padding: '60px 0', background: 'rgba(245,166,35,0.06)', borderTop: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.15)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>Ready to build your CAP list?</h2>
          <p className="text-muted" style={{ marginBottom: '28px' }}>
            It takes 2 minutes. No payment required.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create free account →
          </Link>
        </div>
      </section>
    </div>
  )
}

const hero = {
  section: { position:'relative', padding:'100px 0 80px', overflow:'hidden' },
  bg: {
    position:'absolute', inset:0, zIndex:0,
    background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 70%)',
  },
  eyebrow: {
    fontSize:'12px', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase',
    color:'var(--amber)', marginBottom:'20px',
  },
  sub: { fontSize:'1.1rem', color:'var(--gray-2)', marginBottom:'36px', lineHeight:1.7 },
  ctas: { display:'flex', gap:'12px', justifyContent:'center', marginBottom:'60px' },
  statsRow: {
    display:'flex', gap:'0', justifyContent:'center',
    background:'var(--navy-card)',
    border:'1px solid rgba(255,255,255,0.07)',
    borderRadius:'var(--radius-lg)',
    maxWidth:'600px', margin:'0 auto',
    overflow:'hidden',
  },
  statBox: {
    flex:1, padding:'20px 16px', display:'flex', flexDirection:'column', gap:'4px',
    borderRight:'1px solid rgba(255,255,255,0.07)',
    alignItems:'center',
  },
  statVal: { fontFamily:'var(--font-display)', fontSize:'1.6rem', color:'var(--white)' },
  statLbl: { fontSize:'11px', color:'var(--gray-2)', textTransform:'uppercase', letterSpacing:'0.5px' },
}
