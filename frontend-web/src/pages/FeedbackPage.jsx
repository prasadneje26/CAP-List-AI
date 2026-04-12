// File: frontend-web/src/pages/FeedbackPage.jsx
import { useState } from 'react'
import api from '../services/api'
export default function FeedbackPage() {
  const [form,    setForm]    = useState({ rating:5, message:'', category:'general' })
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const submit = async e => {
    e.preventDefault(); setError('')
    try {
      await api.post('/feedback/submit', form)
      setSuccess('Thank you for your feedback!')
      setForm({ rating:5, message:'', category:'general' })
    } catch (err) { setError(err.response?.data?.message || 'Submit failed') }
  }
  return (
    <div className="page"><div className="container" style={{ maxWidth:'540px' }}>
      <h1 style={{ marginBottom:'8px' }}>Feedback</h1>
      <p className="text-muted" style={{ marginBottom:'28px' }}>Help us improve the platform.</p>
      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}
      <div className="card">
        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
          <div className="form-group">
            <label>Rating (1–5)</label>
            <div style={{ display:'flex', gap:'8px', marginTop:'4px' }}>
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={() => setForm(f => ({...f, rating:n}))}
                  style={{ width:'40px', height:'40px', borderRadius:'8px', border:'1px solid', fontSize:'18px',
                    borderColor: form.rating===n ? 'var(--amber)' : 'rgba(255,255,255,0.15)',
                    background: form.rating===n ? 'rgba(245,166,35,0.15)' : 'transparent',
                    cursor:'pointer', color:'var(--amber)' }}>
                  {'★'}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))}>
              {['general','ui','prediction','mentorship','other'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Message (optional)</label>
            <textarea rows={4} value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))} placeholder="Tell us what you think…" />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Submit Feedback</button>
        </form>
      </div>
    </div></div>
  )
}
