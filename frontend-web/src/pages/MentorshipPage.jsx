import { useState, useEffect } from 'react'
import api from '../services/api'

export default function MentorshipPage() {
  const [mentors,  setMentors]  = useState([])
  const [sessions, setSessions] = useState([])
  const [form,     setForm]     = useState({ mentor_id:'', session_date:'', topic:'', duration_minutes:30 })
  const [msg,      setMsg]      = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/mentorship/mentors').then(r => setMentors(r.data.data?.mentors || []))
    api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || []))
  }, [])

  const book = async e => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      await api.post('/mentorship/book', form)
      setMsg('Session committed. Awaiting peer network confirmation.')
      api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || []))
      setForm({ ...form, mentor_id:'', session_date:'', topic:'' })
    } catch (err) { 
      setMsg(err.response?.data?.message || 'Transmission error. Booking failed.') 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>Peer Mentorship Network</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Secure 1:1 intelligence transfer sessions with successfully admitted alumni.</p>
        </div>
        
        <div className="grid-2" style={{ gap: '32px' }}>
          <div className="card">
            <h3 style={{ fontSize: '20px', marginBottom:'24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '16px' }}>Schedule Connection</h3>
            
            {msg && <div className="alert alert-info">{msg}</div>}
            
            <form onSubmit={book} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div className="form-group">
                <label>Target Mentor</label>
                <select value={form.mentor_id} onChange={e => setForm(f => ({...f, mentor_id:e.target.value}))} required>
                  <option value="">Select available operative...</option>
                  {mentors.map(m => <option key={m.id} value={m.id}>{m.name} - {m.college || 'Verified Alumni'}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Temporal Coordinates</label>
                <input type="datetime-local" value={form.session_date} onChange={e => setForm(f => ({...f, session_date:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label>Discourse Topic</label>
                <input value={form.topic} onChange={e => setForm(f => ({...f, topic:e.target.value}))} placeholder="e.g. TFWS slot maximization" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? 'Processing...' : 'Reserve Session'}
              </button>
            </form>
          </div>
          
          <div>
            <h3 style={{ fontSize: '20px', marginBottom:'24px', fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--navy)' }}>Active Logs</h3>
            
            {sessions.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--gray-300)' }}>
                <p className="text-muted">No communication protocols established.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sessions.map((s, i) => (
                  <div key={i} className="card card-sm" style={{ borderLeft: s.status === 'confirmed' ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize: '16px', color: 'var(--navy)', marginBottom: '4px' }}>{s.mentor_name}</div>
                        <div className="text-muted" style={{ fontSize:'14px' }}>{s.topic}</div>
                      </div>
                      <span className="badge" style={{ 
                        background: s.status==='confirmed' ? '#ECFDF5' : '#FFFBEB', 
                        color: s.status==='confirmed' ? 'var(--success)' : 'var(--warning)',
                        border: `1px solid ${s.status==='confirmed' ? '#6EE7B7' : '#FCD34D'}`
                      }}>
                        {s.status}
                      </span>
                    </div>
                    <div style={{ fontSize:'13px', marginTop:'16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--gray-600)' }}>{new Date(s.session_date).toLocaleString('en-IN')}</span>
                      {s.meeting_link && (
                        <a href={s.meeting_link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ padding: '4px 12px' }}>
                          Initiate Link
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}