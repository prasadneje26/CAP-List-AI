import { useState } from 'react'
import api from '../services/api'

export default function FeedbackPage() {
  const [form,    setForm]    = useState({ rating:5, message:'', category:'general' })
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      await api.post('/feedback/submit', form)
      setSuccess('Data received. System diagnostics updated.')
      setForm({ rating:5, message:'', category:'general' })
    } catch (err) { 
      setError(err.response?.data?.message || 'Transmission failed.') 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'600px' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--gray-200)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--navy)' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </div>
          <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>System Diagnostics</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Provide operational feedback to refine the analytical model.</p>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error   && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ padding: '40px' }}>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
            <div className="form-group">
              <label>Efficacy Rating (1-5)</label>
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={() => setForm(f => ({...f, rating:n}))}
                    style={{ flex: 1, height:'48px', borderRadius:'var(--radius-sm)', border:'2px solid', fontSize:'16px', fontWeight: 700,
                      borderColor: form.rating >= n ? 'var(--navy)' : 'var(--gray-200)',
                      background: form.rating >= n ? 'var(--navy)' : 'var(--white)',
                      color: form.rating >= n ? 'var(--white)' : 'var(--gray-400)',
                      cursor:'pointer', transition: 'var(--transition)' }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Module Vector</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category:e.target.value}))}>
                <option value="general">Global Interface</option>
                <option value="ui">Frontend Presentation</option>
                <option value="prediction">Prediction Accuracy</option>
                <option value="mentorship">Network Routing</option>
                <option value="other">Anomalies</option>
              </select>
            </div>
            <div className="form-group">
              <label>Diagnostic Payload</label>
              <textarea rows={5} value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))} placeholder="Detail observed behaviors or requested parameters..." />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
               {loading ? 'Transmitting...' : 'Upload Telemetry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}