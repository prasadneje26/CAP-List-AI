import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { predictionService } from '../services/predictionService'
import CollegeCard from '../components/CollegeCard.jsx'
import PDFDownloadButton from '../components/PDFDownloadButton.jsx'

const CLS_COLORS = {
  Dream:  { dot: 'var(--danger)',  bg: '#FEF2F2'  },
  Target: { dot: 'var(--warning)', bg: '#FFFBEB'  },
  Safe:   { dot: 'var(--success)', bg: '#ECFDF5'  },
}

export default function ResultsPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    predictionService.getHistory()
      .then(r => setPredictions(r.data?.predictions || []))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = predictions.filter(p => {
    const matchFilter = filter === 'all' || p.classification === filter
    const matchSearch = !search || (p.college_name || '').toLowerCase().includes(search.toLowerCase()) || (p.branch || '').toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const counts = {
    Dream:  predictions.filter(p => p.classification === 'Dream').length,
    Target: predictions.filter(p => p.classification === 'Target').length,
    Safe:   predictions.filter(p => p.classification === 'Safe').length,
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-loader">
            <div className="spinner" />
            <p className="text-muted" style={{ marginTop: 16 }}>Loading your CAP list...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="section-label">Optimized Preference List</div>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', marginBottom: 8, letterSpacing: '-0.5px' }}>Your CAP Order</h1>
            <p className="text-muted" style={{ fontSize: 15 }}>
              {predictions.length} colleges ranked by AI for maximum admission probability.
            </p>
          </div>
          <PDFDownloadButton />
        </div>

        {/* Stats row */}
        {predictions.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 0 auto', display: 'flex', gap: 12 }}>
              {Object.entries(counts).map(([cls, count]) => (
                <div key={cls} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 16px', borderRadius: 'var(--radius-md)',
                  background: CLS_COLORS[cls].bg, flex: 1,
                  border: `1px solid ${CLS_COLORS[cls].dot}22`,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: CLS_COLORS[cls].dot, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{count}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: CLS_COLORS[cls].dot, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cls}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap',
          background: 'var(--white)', padding: '14px 18px', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)',
        }}>
          <div className="tabs" style={{ minWidth: 360, flex: '1 0 auto', maxWidth: 480 }}>
            {['all', 'Dream', 'Target', 'Safe'].map(f => (
              <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? `All (${predictions.length})` : `${f} (${counts[f]})`}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search colleges..."
              style={{ width: '100%', paddingLeft: 36, padding: '8px 12px 8px 36px', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', fontSize: 13.5, outline: 'none', background: 'var(--gray-50)' }}
            />
          </div>
          {(search || filter !== 'all') && (
            <button onClick={() => { setSearch(''); setFilter('all') }} className="btn btn-ghost btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Clear filters
            </button>
          )}
        </div>

        {/* Empty state */}
        {predictions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h3 style={{ marginBottom: 12 }}>No CAP list generated yet</h3>
            <p className="text-muted" style={{ marginBottom: 28, maxWidth: 380, margin: '0 auto 28px', fontSize: 15 }}>
              Run an AI prediction from the Dashboard to generate your personalized CAP preference order.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: '48px 20px' }}>
            <h3 style={{ marginBottom: 10 }}>No results for this filter</h3>
            <p className="text-muted">Try clearing the search or switching the category filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filtered.map((p, i) => (
              <div key={i} className="animate-slideUp" style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s`, display: 'flex', gap: 16, alignItems: 'stretch' }}>
                {/* Rank indicator */}
                <div style={{ width: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: p.cap_order <= 5 ? 'var(--amber)' : p.cap_order <= 15 ? 'var(--navy)' : 'var(--gray-300)',
                    color: p.cap_order <= 5 ? 'var(--navy)' : p.cap_order <= 15 ? 'var(--white)' : 'var(--gray-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, marginTop: 18, flexShrink: 0,
                    boxShadow: p.cap_order <= 5 ? 'var(--shadow-md)' : 'none',
                  }}>
                    {p.cap_order}
                  </div>
                  {i !== filtered.length - 1 && (
                    <div style={{ flex: 1, width: 2, background: 'var(--gray-200)', marginTop: 6, minHeight: 20 }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <CollegeCard college={{ ...p, college_name: p.college_name }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DTE tip */}
        {predictions.length > 0 && (
          <div style={{ marginTop: 40, padding: '20px 24px', background: 'var(--info-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--info-border)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, marginBottom: 4 }}>DTE Strategy Reminder</div>
              <p style={{ fontSize: 13.5, color: 'var(--gray-700)', lineHeight: 1.6 }}>
                Always fill your preference list in the order shown — from highest to lowest admission probability. In Maharashtra CAP, your <strong>higher preferences are always secured first</strong>. Never list a college you don't want at the top.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
