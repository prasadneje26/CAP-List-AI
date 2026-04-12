// ============================================================
// File: frontend-web/src/pages/Dashboard.jsx
// ============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { predictionService } from '../services/predictionService'
import CollegeCard from '../components/CollegeCard.jsx'
import ChatbotWidget from '../components/ChatbotWidget.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [tab,     setTab]     = useState('all')

  const runPrediction = async () => {
    setLoading(true); setError('')
    try {
      const res = await predictionService.fullPrediction()
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed. Make sure your profile is complete.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    // Auto-load if we have cached results
    const cached = sessionStorage.getItem('cap_results')
    if (cached) setData(JSON.parse(cached))
  }, [])

  useEffect(() => {
    if (data) sessionStorage.setItem('cap_results', JSON.stringify(data))
  }, [data])

  const allColleges = data
    ? [...(data.top_picks?.Dream||[]), ...(data.top_picks?.Target||[]), ...(data.top_picks?.Safe||[])]
    : []
  const filtered = tab === 'all' ? allColleges : allColleges.filter(c => c.classification === tab)

  return (
    <div className="page">
      <div className="container">

        {/* ── Header ─────────────────────────────────── */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">
              Welcome back, <strong style={{ color:'var(--white)' }}>{user?.name}</strong> ·{' '}
              {data ? `${data.summary?.total_colleges} colleges found` : 'Run a prediction to get started'}
            </p>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <Link to="/input" className="btn btn-outline">Edit Profile</Link>
            <button onClick={runPrediction} className="btn btn-primary" disabled={loading}>
              {loading ? '⟳ Running AI…' : '⚡ Run Prediction'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Summary cards ───────────────────────────── */}
        {data && (
          <>
            <div className="grid-4" style={{ marginBottom:'32px' }}>
              {[
                { label:'Total colleges', value: data.summary?.total_colleges, color:'var(--white)' },
                { label:'Dream',  value: data.summary?.dream_count,  color:'#f87171' },
                { label:'Target', value: data.summary?.target_count, color:'#fbbf24' },
                { label:'Safe',   value: data.summary?.safe_count,   color:'#4ade80' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Warnings */}
            {data.warnings?.length > 0 && (
              <div className="alert alert-info" style={{ marginBottom:'24px' }}>
                {data.warnings.map((w,i) => <div key={i}>⚠ {w}</div>)}
              </div>
            )}

            {/* Tabs + college cards */}
            <div style={{ marginBottom:'16px' }}>
              <div className="tabs" style={{ maxWidth:'360px' }}>
                {['all','Dream','Target','Safe'].map(t => (
                  <button key={t} className={`tab-btn ${tab===t?'active':''}`}
                    onClick={() => setTab(t)}>
                    {t === 'all' ? 'All' : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid-2">
              {filtered.map((c, i) => <CollegeCard key={i} college={c} />)}
            </div>

            <div style={{ marginTop:'24px', textAlign:'center' }}>
              <Link to="/results" className="btn btn-outline">
                View full CAP list ({data.cap_list?.length} colleges) →
              </Link>
            </div>
          </>
        )}

        {/* ── Empty state ─────────────────────────────── */}
        {!data && !loading && (
          <div style={emptyStyle}>
            <span style={{ fontSize:'48px' }}>🎯</span>
            <h3 style={{ margin:'16px 0 8px' }}>No predictions yet</h3>
            <p className="text-muted" style={{ marginBottom:'24px' }}>
              Complete your profile and hit Run Prediction to get your personalized CAP list.
            </p>
            <Link to="/input" className="btn btn-primary">Complete Profile →</Link>
          </div>
        )}

        {loading && (
          <div style={emptyStyle}>
            <div className="spinner" />
            <p className="text-muted" style={{ marginTop:'16px' }}>
              AI is analyzing colleges for your profile…
            </p>
          </div>
        )}
      </div>

      <ChatbotWidget />
    </div>
  )
}

const emptyStyle = {
  textAlign:'center', padding:'80px 20px',
  background:'var(--navy-card)', borderRadius:'var(--radius-lg)',
  border:'1px solid rgba(255,255,255,0.07)',
}
