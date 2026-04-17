import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const MAX_COMPARE = 3

const FIELDS = [
  { key: 'location',        label: 'Location / District' },
  { key: 'university',      label: 'Affiliated University' },
  { key: 'college_type',    label: 'College Type' },
  { key: 'annual_fees',     label: 'Annual Fees',      format: v => v ? `₹${Number(v).toLocaleString('en-IN')}` : 'N/A' },
  { key: 'total_seats',     label: 'Total Seats' },
  { key: 'rating',          label: 'Rating',           format: v => v ? `${Number(v).toFixed(1)} / 5` : 'N/A', highlight: 'highest' },
  { key: 'placement_score', label: 'Placement Score',  format: v => v ? `${Number(v).toFixed(1)}%` : 'N/A', highlight: 'highest' },
  { key: 'is_autonomous',   label: 'Autonomous',       format: v => v ? 'Yes' : 'No' },
  { key: 'code',            label: 'DTE Code' },
  { key: 'website',         label: 'Website',          format: v => v ? v : 'N/A' },
]

export default function ComparePage() {
  const [colleges,    setColleges]    = useState([])
  const [selected,    setSelected]    = useState([])
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [highlighted, setHighlighted] = useState(null)

  useEffect(() => {
    api.get('/colleges/')
      .then(r => setColleges(r.data.data?.colleges || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = colleges.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase()) ||
    c.district?.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = college => {
    setSelected(prev => {
      const exists = prev.find(c => c.id === college.id)
      if (exists) return prev.filter(c => c.id !== college.id)
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, college]
    })
  }

  const isSelected = c => selected.some(s => s.id === c.id)

  const getVal = (college, field) => {
    const raw = college[field.key]
    if (field.format) return field.format(raw)
    if (raw === null || raw === undefined || raw === '') return '—'
    return String(raw)
  }

  const getBest = (key, mode) => {
    if (selected.length < 2) return null
    const vals = selected.map(c => parseFloat(c[key])).filter(v => !isNaN(v))
    if (vals.length === 0) return null
    return mode === 'highest' ? Math.max(...vals) : Math.min(...vals)
  }

  const isBestVal = (college, field) => {
    if (!field.highlight || selected.length < 2) return false
    const best = getBest(field.key, field.highlight)
    if (best === null) return false
    return parseFloat(college[field.key]) === best
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>College Comparison</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>
            Select up to {MAX_COMPARE} colleges to compare side by side.
            {selected.length > 0 && (
              <span style={{ color: 'var(--navy)', fontWeight: 600 }}> {selected.length} / {MAX_COMPARE} selected.</span>
            )}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', alignItems: 'flex-start' }}>

          {/* Selector Panel */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '88px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-sans)', fontWeight: '700', marginBottom: '14px' }}>
                Select Colleges
              </h3>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name or location..."
                  style={{ width: '100%' }}
                />
              </div>

              {/* Selected chips */}
              {selected.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid var(--gray-200)' }}>
                  {selected.map(c => (
                    <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--navy)', color: 'var(--white)', fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                      {c.name.split(' ').slice(0,3).join(' ')}…
                      <button onClick={() => toggleSelect(c)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '0 0 0 2px', lineHeight: 1 }}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
              ) : (
                <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {filtered.slice(0, 60).map(c => {
                    const sel      = isSelected(c)
                    const disabled = !sel && selected.length >= MAX_COMPARE
                    return (
                      <button
                        key={c.id}
                        onClick={() => !disabled && toggleSelect(c)}
                        disabled={disabled}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${sel ? 'var(--navy)' : 'var(--gray-200)'}`,
                          background: sel ? 'var(--navy)' : 'var(--white)',
                          color: sel ? 'var(--white)' : 'var(--gray-800)',
                          cursor: disabled ? 'not-allowed' : 'pointer',
                          opacity: disabled ? 0.4 : 1,
                          textAlign: 'left', width: '100%',
                          transition: 'var(--transition)',
                        }}>
                        <div style={{
                          width: '20px', height: '20px', flexShrink: 0,
                          borderRadius: '5px',
                          border: `2px solid ${sel ? 'var(--amber)' : 'var(--gray-300)'}`,
                          background: sel ? 'var(--amber)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {sel && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="3.5"><path d="M20 6L9 17l-5-5"/></svg>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>{c.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.65, marginTop: '2px' }}>{c.college_type} · {c.location || c.district}</div>
                        </div>
                      </button>
                    )
                  })}
                  {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px 0', fontSize: '14px' }}>No colleges found.</p>
                  )}
                </div>
              )}

              {selected.length > 0 && (
                <button onClick={() => setSelected([])} className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '14px', borderColor: 'var(--gray-300)' }}>
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Comparison Table */}
          <div>
            {selected.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--gray-300)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ width: '72px', height: '72px', background: 'var(--gray-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--gray-500)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>No colleges selected yet</h3>
                <p className="text-muted" style={{ fontSize: '15px', maxWidth: '360px', margin: '0 auto' }}>
                  Choose 2 or 3 colleges from the panel on the left to see them compared side by side.
                </p>
              </div>
            ) : (
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                {/* College header row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `180px repeat(${selected.length}, 1fr)`,
                  background: 'var(--navy)',
                }}>
                  <div style={{ padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.08)' }} />
                  {selected.map(c => (
                    <div key={c.id} style={{ padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                      <button onClick={() => toggleSelect(c)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '14px', color: 'var(--white)', lineHeight: 1.3, paddingRight: '20px', marginBottom: '6px' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 600 }}>{c.college_type}</div>
                      {c.rating && (
                        <div style={{ marginTop: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                          ⭐ {Number(c.rating).toFixed(1)} / 5
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {FIELDS.map((field, fi) => (
                  <div
                    key={field.key}
                    onMouseEnter={() => setHighlighted(fi)}
                    onMouseLeave={() => setHighlighted(null)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `180px repeat(${selected.length}, 1fr)`,
                      borderBottom: '1px solid var(--gray-200)',
                      background: highlighted === fi ? '#F0F7FF' : (fi % 2 === 0 ? 'var(--white)' : 'var(--gray-100)'),
                      transition: 'background 0.15s',
                    }}>
                    <div style={{ padding: '16px', borderRight: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', background: 'inherit' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--gray-500)' }}>
                        {field.label}
                      </span>
                    </div>
                    {selected.map(c => {
                      const val  = getVal(c, field)
                      const best = isBestVal(c, field)
                      return (
                        <div key={c.id} style={{ padding: '16px', borderRight: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center' }}>
                          {field.key === 'website' && val !== '—' && val !== 'N/A' ? (
                            <a href={val.startsWith('http') ? val : `https://${val}`} target="_blank" rel="noreferrer" style={{ color: 'var(--navy)', fontSize: '13px', fontWeight: 600, textDecoration: 'underline' }}>
                              Visit
                            </a>
                          ) : (
                            <span style={{ fontWeight: best ? 800 : 500, fontSize: '14px', color: best ? 'var(--success)' : 'var(--navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {best && <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--success)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
                              {val}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Footer */}
                <div style={{ padding: '16px 20px', background: 'var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-200)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--success)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Star = Best among selected colleges
                  </span>
                  <Link to="/dashboard" className="btn btn-primary btn-sm">Go to Dashboard</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
