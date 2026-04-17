import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { predictionService } from '../services/predictionService'
import CollegeCard from '../components/CollegeCard.jsx'
import ChatbotWidget from '../components/ChatbotWidget.jsx'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

function StatCard({ label, value, color, icon, delta }) {
  return (
    <div className="stat-card animate-slideUp">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
          {icon}
        </div>
        {delta !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 600, color: delta >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}
          </span>
        )}
      </div>
      <span className="stat-value" style={{ color }}>{value ?? '—'}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="card card-sm" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton skeleton-title" style={{ width: '70%' }} />
      <div className="skeleton skeleton-text" style={{ width: '50%' }} />
      <div className="skeleton" style={{ height: 60 }} />
    </div>
  )
}

const PROB_COLORS = {
  Dream: '#EF4444',
  Target: '#F59E0B',
  Safe: '#10B981',
}

function ProbabilityChart({ colleges }) {
  if (!colleges?.length) return null
  const top12 = colleges.slice(0, 12).map(c => ({
    name: (c.college_name || c.name || '').split(' ').slice(0, 3).join(' '),
    probability: c.admission_probability || 0,
    cls: c.classification,
  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--navy)', color: 'white', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
          <div>{payload[0].payload.name}</div>
          <div style={{ color: 'var(--amber)', marginTop: 2 }}>{payload[0].value}% probability</div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="card animate-slideUp" style={{ marginBottom: 32, padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
            Admission Probability Overview
          </h3>
          <p className="text-muted" style={{ fontSize: 13 }}>ML-predicted probability for top {top12.length} matched colleges</p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {Object.entries(PROB_COLORS).map(([cls, color]) => (
            <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)' }}>{cls}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={top12} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
          <Bar dataKey="probability" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {top12.map((entry, i) => (
              <Cell key={i} fill={PROB_COLORS[entry.cls] || '#10B981'} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [tab,     setTab]     = useState('all')

  const runPrediction = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await predictionService.fullPrediction()
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Ensure your academic profile is complete.')
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const cached = sessionStorage.getItem('cap_results')
    if (cached) { try { setData(JSON.parse(cached)) } catch {} }
  }, [])

  useEffect(() => {
    if (data) sessionStorage.setItem('cap_results', JSON.stringify(data))
  }, [data])

  const allColleges = data
    ? [...(data.top_picks?.Dream || []), ...(data.top_picks?.Target || []), ...(data.top_picks?.Safe || [])]
    : []
  const filtered = tab === 'all' ? allColleges : allColleges.filter(c => c.classification === tab)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="page">
      <div className="container">

        {/* ── Header ─────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--amber-dark)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              {greeting()}, {user?.name?.split(' ')[0]} 👋
            </p>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', marginBottom: 8, letterSpacing: '-0.5px' }}>Admissions Dashboard</h1>
            <p className="text-muted" style={{ fontSize: 15 }}>
              {data
                ? `${data.summary?.total_colleges} viable colleges identified across ${data.summary?.dream_count || 0} Dream, ${data.summary?.target_count || 0} Target, and ${data.summary?.safe_count || 0} Safe profiles.`
                : 'Run an AI prediction to see your personalized college list.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/input" className="btn btn-outline" style={{ background: 'var(--white)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </Link>
            <button onClick={runPrediction} className="btn btn-primary" disabled={loading}>
              {loading ? (
                <><div className="spinner spinner-sm" /> Analyzing...</>
              ) : (
                <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Run Prediction</>
              )}
            </button>
          </div>
        </div>

        {/* ── Error ──────────────────────────────── */}
        {error && (
          <div className="alert alert-error animate-slideDown">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            {error}
            {error.includes('profile') && (
              <Link to="/input" style={{ marginLeft: 8, fontWeight: 700, textDecoration: 'underline', color: 'var(--danger)' }}>Complete profile →</Link>
            )}
          </div>
        )}

        {/* ── Loading skeleton ─────────────────── */}
        {loading && (
          <div>
            <div className="grid-4" style={{ marginBottom: 32 }}>
              {[1,2,3,4].map(i => (
                <div key={i} className="stat-card">
                  <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 12 }} />
                  <div className="skeleton skeleton-title" style={{ width: '60%' }} />
                  <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                </div>
              ))}
            </div>
            <div className="grid-2">
              {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ── Results ────────────────────────────── */}
        {data && !loading && (
          <>
            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 32 }}>
              <StatCard label="Total Matches"  value={data.summary?.total_colleges} color="var(--navy)"    icon="🎯" />
              <StatCard label="Dream Matches"  value={data.summary?.dream_count}    color="var(--danger)"  icon="⭐" />
              <StatCard label="Target Matches" value={data.summary?.target_count}   color="var(--warning)" icon="🎪" />
              <StatCard label="Safe Matches"   value={data.summary?.safe_count}     color="var(--success)" icon="✅" />
            </div>

            {/* Warnings */}
            {data.warnings?.length > 0 && (
              <div className="alert alert-warning animate-slideDown" style={{ marginBottom: 28 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <div>
                  {data.warnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              </div>
            )}

            {/* Chart */}
            <ProbabilityChart colleges={allColleges} />

            {/* College tabs + grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 19, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>
                  College Recommendations
                </h3>
                <p className="text-muted" style={{ fontSize: 13 }}>Click any card to expand details</p>
              </div>
              <div className="tabs" style={{ minWidth: 320 }}>
                {['all', 'Dream', 'Target', 'Safe'].map(t => (
                  <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                    {t === 'all' ? `All (${allColleges.length})` : `${t} (${(data.top_picks?.[t] || []).length})`}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 style={{ marginBottom: 8 }}>No {tab} colleges found</h3>
                <p className="text-muted">Try adjusting your category or broadening your branch preferences.</p>
              </div>
            ) : (
              <div className="grid-2">
                {filtered.map((c, i) => <CollegeCard key={i} college={c} />)}
              </div>
            )}

            {/* CTA to results */}
            {data.cap_list?.length > 0 && (
              <div style={{ marginTop: 48, textAlign: 'center', padding: '48px 32px', background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-lighter) 100%)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(255,183,3,0.08), transparent 60%)', zIndex: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
                  <h3 style={{ color: 'var(--white)', fontSize: 26, marginBottom: 12 }}>Your optimized CAP list is ready</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 28, fontSize: 15 }}>
                    {data.cap_list?.length} colleges ordered for maximum admission yield, ready for DTE submission.
                  </p>
                  <Link to="/results" className="btn btn-amber btn-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    View Complete CAP List
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Empty state ─────────────────────── */}
        {!data && !loading && (
          <div className="animate-fadeIn">
            <div className="empty-state" style={{ marginBottom: 32 }}>
              <div className="empty-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h3 style={{ marginBottom: 12, fontSize: 26 }}>Ready to find your colleges?</h3>
              <p className="text-muted" style={{ marginBottom: 32, maxWidth: 420, margin: '0 auto 32px', fontSize: 15 }}>
                Fill in your academic profile, then run a prediction to see AI-curated colleges matched to your percentile and category.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/input" className="btn btn-primary btn-lg">
                  Complete Academic Profile
                </Link>
                <button onClick={runPrediction} className="btn btn-outline btn-lg" disabled={loading}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Run Prediction Anyway
                </button>
              </div>
            </div>

            {/* Quick info cards */}
            <div className="grid-3">
              {[
                { icon: '📊', title: 'AI-Powered Cutoff Prediction', desc: 'ML model trained on 4 years of DTE data predicts exact cutoffs for your profile.' },
                { icon: '🎯', title: 'Smart Classification', desc: 'Every college ranked as Dream, Target, or Safe based on your percentile gap.' },
                { icon: '📋', title: 'Optimized CAP Order', desc: '30-college list generated in the exact order for maximum admission probability.' },
              ].map((item, i) => (
                <div key={i} className="card card-hover animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, padding: 28, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{item.icon}</div>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{item.title}</h4>
                  <p className="text-muted" style={{ fontSize: 13.5, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatbotWidget />
    </div>
  )
}
