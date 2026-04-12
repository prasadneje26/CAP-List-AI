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
      setError(err.response?.data?.message || 'Prediction failed. Ensure your academic profile is complete.')
    } finally { setLoading(false) }
  }

  useEffect(() => {
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

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Admissions Dashboard</h1>
            <p className="text-muted" style={{ fontSize: '15px' }}>
              Welcome back, <strong style={{ color:'var(--navy)' }}>{user?.name}</strong>. {' '}
              {data ? `${data.summary?.total_colleges} viable colleges identified.` : 'Run a diagnostic to view potential allocations.'}
            </p>
          </div>
          <div style={{ display:'flex', gap:'12px' }}>
            <Link to="/input" className="btn btn-outline" style={{ background: 'var(--white)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Profile
            </Link>
            <button onClick={runPrediction} className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing Model...' : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Run Prediction</>
              )}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <>
            <div className="grid-4" style={{ marginBottom:'40px' }}>
              {[
                { label:'Total Indexed', value: data.summary?.total_colleges, color:'var(--navy)' },
                { label:'Dream Matches',  value: data.summary?.dream_count,  color:'var(--danger)' },
                { label:'Target Matches', value: data.summary?.target_count, color:'var(--warning)' },
                { label:'Safe Matches',   value: data.summary?.safe_count,   color:'var(--success)' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {data.warnings?.length > 0 && (
              <div className="alert alert-info">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.warnings.map((w,i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom:'24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '20px', fontWeight: '700' }}>Top Recommended Profiles</h3>
              <div className="tabs" style={{ width:'320px' }}>
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

            <div style={{ marginTop:'40px', textAlign:'center', padding: '40px 0', borderTop: '1px solid var(--gray-200)' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Ready for the final CAP formulation?</h3>
              <p className="text-muted" style={{ marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
                Review the completely optimized sequence of {data.cap_list?.length} colleges formatted for official DTE submission.
              </p>
              <Link to="/results" className="btn btn-primary btn-lg">
                View Complete CAP Order Form
              </Link>
            </div>
          </>
        )}

        {!data && !loading && (
          <div style={emptyStyle}>
            <div style={{ width: '80px', height: '80px', background: 'var(--gray-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--gray-500)' }}>
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3 style={{ margin:'0 0 12px', fontSize: '24px' }}>No diagnostic records found</h3>
            <p className="text-muted" style={{ marginBottom:'32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              Finalize your academic input parameters and initiate a model run to populate your prediction arrays.
            </p>
            <Link to="/input" className="btn btn-primary btn-lg">Complete Academic Profile</Link>
          </div>
        )}

        {loading && (
          <div style={emptyStyle}>
            <div className="spinner" style={{ margin: '0 auto' }} />
            <p className="text-muted" style={{ marginTop:'24px', fontWeight: '500' }}>
              Model processing. Correlating multi-year cutoff data with your profile...
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
  background:'var(--white)', borderRadius:'var(--radius-xl)',
  border:'1px dashed var(--gray-300)',
  boxShadow: 'var(--shadow-sm)',
}