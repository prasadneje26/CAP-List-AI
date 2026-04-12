// File: frontend-web/src/pages/MentorshipPage.jsx
import { useState, useEffect } from 'react'
import api from '../services/api'
export default function MentorshipPage() {
  const [mentors,  setMentors]  = useState([])
  const [sessions, setSessions] = useState([])
  const [form,     setForm]     = useState({ mentor_id:'', session_date:'', topic:'', duration_minutes:30 })
  const [msg,      setMsg]      = useState('')
  useEffect(() => {
    api.get('/mentorship/mentors').then(r => setMentors(r.data.data?.mentors || []))
    api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || []))
  }, [])
  const book = async e => {
    e.preventDefault()
    try {
      await api.post('/mentorship/book', form)
      setMsg('Session booked! Mentor will confirm shortly.')
      api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || []))
    } catch (err) { setMsg(err.response?.data?.message || 'Booking failed') }
  }
  return (
    <div className="page"><div className="container">
      <h1 style={{ marginBottom:'32px' }}>Mentorship</h1>
      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom:'18px' }}>Book a Session</h3>
          {msg && <div className="alert alert-info" style={{ marginBottom:'14px' }}>{msg}</div>}
          <form onSubmit={book} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div className="form-group">
              <label>Select Mentor</label>
              <select value={form.mentor_id} onChange={e => setForm(f => ({...f, mentor_id:e.target.value}))} required>
                <option value="">Choose a mentor…</option>
                {mentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Session Date &amp; Time</label>
              <input type="datetime-local" value={form.session_date} onChange={e => setForm(f => ({...f, session_date:e.target.value}))} required />
            </div>
            <div className="form-group">
              <label>Topic</label>
              <input value={form.topic} onChange={e => setForm(f => ({...f, topic:e.target.value}))} placeholder="e.g. CAP round strategy" required />
            </div>
            <button type="submit" className="btn btn-primary">Book Session</button>
          </form>
        </div>
        <div>
          <h3 style={{ marginBottom:'16px' }}>My Sessions</h3>
          {sessions.length === 0
            ? <p className="text-muted">No sessions yet.</p>
            : sessions.map((s, i) => (
              <div key={i} className="card card-sm" style={{ marginBottom:'10px' }}>
                <div style={{ fontWeight:500 }}>{s.mentor_name}</div>
                <div className="text-muted" style={{ fontSize:'12px' }}>{s.topic}</div>
                <div style={{ fontSize:'12px', marginTop:'6px' }}>
                  {new Date(s.session_date).toLocaleString('en-IN')} · {' '}
                  <span style={{ color: s.status==='confirmed'?'var(--success)':'var(--amber)' }}>{s.status}</span>
                </div>
                {s.meeting_link && <a href={s.meeting_link} target="_blank" rel="noreferrer" style={{ fontSize:'12px', color:'var(--amber)' }}>Join meeting ↗</a>}
              </div>
            ))
          }
        </div>
      </div>
    </div></div>
  )
}
