import { useState, useEffect } from 'react'
import api from '../services/api'

const STATUS_CONFIG = {
  confirmed: { bg: 'var(--success-bg)', color: 'var(--success)', border: 'var(--success-border)', label: 'Confirmed' },
  pending:   { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'var(--warning-border)', label: 'Pending' },
  completed: { bg: 'var(--info-bg)',    color: 'var(--info)',    border: 'var(--info-border)',    label: 'Completed' },
}

export default function MentorshipPage() {
  const [mentors,  setMentors]  = useState([])
  const [sessions, setSessions] = useState([])
  const [form,     setForm]     = useState({ mentor_id: '', session_date: '', topic: '', duration_minutes: 30 })
  const [msg,      setMsg]      = useState({ text: '', type: '' })
  const [loading,  setLoading]  = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/mentorship/mentors').then(r => setMentors(r.data.data?.mentors || [])).catch(() => {})
    api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || [])).catch(() => {})
  }, [])

  const selectMentor = (m) => {
    setSelected(m)
    setForm(f => ({ ...f, mentor_id: m.id }))
  }

  const book = async e => {
    e.preventDefault()
    setLoading(true)
    setMsg({ text: '', type: '' })
    try {
      await api.post('/mentorship/book', form)
      setMsg({ text: 'Session booked successfully! The mentor will confirm shortly.', type: 'success' })
      const r = await api.get('/mentorship/my')
      setSessions(r.data.data?.sessions || [])
      setForm({ ...form, mentor_id: '', session_date: '', topic: '' })
      setSelected(null)
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Booking failed. Please try again.', type: 'error' })
    } finally { setLoading(false) }
  }

  const TOPICS = ['CAP strategy', 'TFWS seat maximization', 'Branch vs. college tradeoff', 'Round 1 vs. Round 2', 'Fee structure guidance', 'Home university advantage']

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">1:1 Guidance</div>
          <h1 style={{ fontSize: 'clamp(26px, 4vw, 34px)', marginBottom: 10, letterSpacing: '-0.5px' }}>Alumni Mentorship</h1>
          <p className="text-muted" style={{ fontSize: 15, maxWidth: 560 }}>
            Book 1:1 sessions with seniors who got into your target colleges. Get real first-hand strategy — not guesswork.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'flex-start' }}>

          {/* Left — mentor grid + booking */}
          <div>
            {/* Mentor selector */}
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>
              Available Mentors
            </h3>

            {mentors.length === 0 ? (
              <div className="empty-state" style={{ marginBottom: 28, padding: '48px 20px' }}>
                <div className="empty-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <h4 style={{ marginBottom: 8, fontSize: 18 }}>No mentors available yet</h4>
                <p className="text-muted" style={{ fontSize: 14 }}>Mentors will appear here once they register. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
                {mentors.map(m => (
                  <div
                    key={m.id}
                    onClick={() => selectMentor(m)}
                    className="card card-hover"
                    style={{
                      padding: 20, cursor: 'pointer',
                      border: `2px solid ${selected?.id === m.id ? 'var(--navy)' : 'var(--gray-200)'}`,
                      background: selected?.id === m.id ? 'var(--navy)' : 'var(--white)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: selected?.id === m.id ? 'rgba(255,183,3,0.2)' : 'var(--gray-100)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, fontWeight: 700,
                        color: selected?.id === m.id ? 'var(--amber)' : 'var(--navy)',
                      }}>
                        {m.name?.charAt(0) || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: selected?.id === m.id ? 'var(--white)' : 'var(--navy)', marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: selected?.id === m.id ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)', fontWeight: 500 }}>
                          {m.college || 'Verified Alumni'}
                        </div>
                        {m.branch && (
                          <div style={{ fontSize: 11, color: selected?.id === m.id ? 'rgba(255,183,3,0.8)' : 'var(--amber-dark)', fontWeight: 600, marginTop: 4 }}>
                            {m.branch}
                          </div>
                        )}
                      </div>
                      {selected?.id === m.id && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Booking form */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Book a Session</h3>
              <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 24 }}>
                {selected ? `Booking with ${selected.name}` : 'Select a mentor above to book'}
              </p>

              {msg.text && (
                <div className={`alert animate-slideDown ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={book} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {!selected && (
                  <div style={{ padding: '14px 16px', background: 'var(--warning-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--warning-border)', fontSize: 13.5, color: '#92400E', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Please select a mentor from the list above first.
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Session Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={form.session_date}
                    onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Discussion Topic *</label>
                  <input
                    value={form.topic}
                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                    placeholder="What do you want to discuss?"
                    required
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {TOPICS.map(t => (
                      <button key={t} type="button" onClick={() => setForm(f => ({ ...f, topic: t }))}
                        style={{
                          padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 12,
                          fontWeight: 500, cursor: 'pointer',
                          border: `1px solid ${form.topic === t ? 'var(--navy)' : 'var(--gray-300)'}`,
                          background: form.topic === t ? 'var(--navy)' : 'var(--white)',
                          color: form.topic === t ? 'var(--white)' : 'var(--gray-600)',
                          transition: 'var(--transition)',
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Duration</label>
                  <select value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading || !selected} style={{ marginTop: 4 }}>
                  {loading ? <><div className="spinner spinner-sm" /> Booking...</> : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Book Session</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right — booked sessions */}
          <div className="sidebar-sticky">
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>
              My Sessions{sessions.length > 0 && <span className="badge badge-navy" style={{ marginLeft: 8, fontSize: 11 }}>{sessions.length}</span>}
            </h3>

            {sessions.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--gray-300)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📅</div>
                <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>No sessions booked yet. Book your first session with a mentor!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sessions.map((s, i) => {
                  const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.pending
                  return (
                    <div key={i} className="card card-sm animate-slideUp" style={{ animationDelay: `${i * 0.08}s`, borderLeft: `4px solid ${sc.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', marginBottom: 3 }}>{s.mentor_name || 'Mentor'}</div>
                          <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>{s.topic}</div>
                        </div>
                        <span className="badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 10 }}>
                          {sc.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 500 }}>
                        📅 {new Date(s.session_date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                      {s.meeting_link && (
                        <a href={s.meeting_link} target="_blank" rel="noreferrer"
                          className="btn btn-primary btn-sm"
                          style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                          Join Meeting
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
