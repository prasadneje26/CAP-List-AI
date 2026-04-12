import { Link } from 'react-router-dom'

const features = [
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>, title: 'AI Cutoff Prediction', desc: 'ML model trained on 4 years of Maharashtra cutoff data predicts next year trends with high precision.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, title: 'Target Profiling', desc: 'Every college classified instantly as Dream, Target, or Safe based on your percentile and category.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, title: 'CAP Order Optimizer', desc: 'Generates an optimized 30-entry preference list strictly following official CAP strategy rules.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>, title: 'AI Counselor Bot', desc: 'Ask complex queries like "Can I get PCCOE CS at 93 percentile OBC?" and get instant answers.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, title: 'Strategy Reports', desc: 'Download a comprehensive counseling PDF report with your curated CAP list and execution tips.' },
  { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Alumni Mentorship', desc: 'Book 1:1 strategy sessions with senior students who successfully secured your target colleges.' },
]

const stats = [
  { value: '400+', label: 'Colleges Profiled' },
  { value: '4 yrs', label: 'Cutoff History' },
  { value: '7',     label: 'Categories' },
  { value: '95%',   label: 'Accuracy Model' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={hero.section}>
        <div style={hero.bg} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={hero.eyebrow}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--amber-dark)', borderRadius: '50%', marginRight: '8px' }}></span>
              Maharashtra Engineering Admissions · CAP 2025
            </div>
            <h1 style={hero.title}>
              Navigate CAP Rounds<br />
              with <span style={{ color: 'var(--amber-dark)' }}>Data-Driven Precision.</span>
            </h1>
            <p style={hero.sub}>
              AI-powered cutoff prediction, intelligent Dream/Target/Safe profiling,
              and a mathematically optimized CAP preference list — ready in 60 seconds.
            </p>
            <div style={hero.ctas}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg" style={{ background: 'var(--white)' }}>
                Sign In
              </Link>
            </div>
          </div>
          
          <div style={hero.statsWrapper}>
            <div style={hero.statsRow}>
              {stats.map(s => (
                <div key={s.label} style={hero.statBox}>
                  <span style={hero.statVal}>{s.value}</span>
                  <span style={hero.statLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: '600px', margin: '0 auto 64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>The complete admissions toolkit</h2>
            <p className="text-muted" style={{ fontSize: '18px' }}>
              Engineered exclusively for Maharashtra MHT-CET &amp; JEE candidates across all reservation categories.
            </p>
          </div>
          <div className="grid-3">
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: '40px 32px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--gray-100)', color: 'var(--navy)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>{f.title}</h3>
                <p className="text-muted" style={{ fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'var(--navy)', color: 'var(--white)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h2 style={{ color: 'var(--white)', fontSize: '36px', marginBottom: '20px' }}>Secure your ideal college.</h2>
          <p style={{ color: 'var(--gray-400)', fontSize: '18px', marginBottom: '40px' }}>
            Stop guessing your admission chances. Use historical data and predictive modeling to build a foolproof CAP strategy today.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg" style={{ background: 'var(--amber)', color: 'var(--navy)' }}>
            Start Building Your CAP List
          </Link>
        </div>
      </section>
    </div>
  )
}

const hero = {
  section: { position:'relative', padding:'120px 0 80px', overflow:'hidden', background: 'var(--gray-100)' },
  bg: {
    position:'absolute', inset:0, zIndex:0,
    background: 'radial-gradient(circle at 50% 0%, var(--gray-200) 0%, transparent 70%)',
  },
  eyebrow: {
    display: 'inline-flex', alignItems: 'center',
    padding: '8px 16px', background: 'var(--white)', border: '1px solid var(--gray-300)',
    borderRadius: 'var(--radius-full)',
    fontSize:'13px', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase',
    color:'var(--navy)', marginBottom:'32px',
    boxShadow: 'var(--shadow-sm)',
  },
  title: { fontSize: '64px', letterSpacing: '-1.5px', marginBottom: '24px' },
  sub: { fontSize:'20px', color:'var(--gray-600)', marginBottom:'48px', lineHeight:1.6 },
  ctas: { display:'flex', gap:'16px', justifyContent:'center', marginBottom:'80px' },
  statsWrapper: {
    padding: '0 24px',
  },
  statsRow: {
    display:'flex', gap:'0', justifyContent:'center',
    background:'var(--white)',
    border:'1px solid var(--gray-200)',
    borderRadius:'var(--radius-xl)',
    maxWidth:'800px', margin:'0 auto',
    boxShadow: 'var(--shadow-md)',
    overflow:'hidden',
  },
  statBox: {
    flex:1, padding:'32px 24px', display:'flex', flexDirection:'column', gap:'8px',
    borderRight:'1px solid var(--gray-200)',
    alignItems:'center',
  },
  statVal: { fontFamily:'var(--font-display)', fontSize:'40px', color:'var(--navy)', fontWeight: '700', letterSpacing: '-1px' },
  statLbl: { fontSize:'12px', color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'1px', fontWeight: '600' },
}