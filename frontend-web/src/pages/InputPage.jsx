// ============================================================
// File: frontend-web/src/pages/InputPage.jsx
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const BRANCHES   = ['Computer Engineering','Information Technology','Electronics & Telecommunication','Mechanical Engineering','Civil Engineering','Electrical Engineering','Artificial Intelligence & Data Science']
const CATEGORIES = ['OPEN','OBC','SC','ST','EWS','TFWS','PWD']
const LOCATIONS  = ['Pune','Mumbai','Nashik','Aurangabad','Nagpur','Kolhapur','Sangli']

export default function InputPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    percentile:'', exam_type:'CET', category:'OPEN', gender:'',
    home_university:'', branch_preferences:[], location_preferences:[],
    college_type:'Any', budget_max:'',
  })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleArr = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }))
  }

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.post('/student/', { ...form, percentile: parseFloat(form.percentile), budget_max: form.budget_max ? parseInt(form.budget_max) : null })
      setSuccess('Profile saved! Redirecting to dashboard…')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      if (err.response?.status === 409) {
        // Already exists — update instead
        try {
          await api.put('/student/profile', { ...form, percentile: parseFloat(form.percentile), budget_max: form.budget_max ? parseInt(form.budget_max) : null })
          setSuccess('Profile updated! Redirecting…')
          setTimeout(() => navigate('/dashboard'), 1500)
        } catch (e2) { setError(e2.response?.data?.message || 'Update failed') }
      } else {
        setError(err.response?.data?.message || 'Save failed')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'700px' }}>
        <h1 style={{ marginBottom:'8px' }}>Your Academic Profile</h1>
        <p className="text-muted" style={{ marginBottom:'32px' }}>This information drives your AI predictions and CAP list.</p>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <div className="card">
            <h3 style={{ marginBottom:'18px' }}>Exam Details</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Percentile *</label>
                <input type="number" min="0" max="100" step="0.01"
                  value={form.percentile} onChange={e => set('percentile', e.target.value)}
                  placeholder="e.g. 94.5" required />
              </div>
              <div className="form-group">
                <label>Exam Type *</label>
                <select value={form.exam_type} onChange={e => set('exam_type', e.target.value)}>
                  <option>CET</option><option>JEE</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select…</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom:'18px' }}>Branch Preferences</h3>
            <p className="text-muted" style={{ fontSize:'13px', marginBottom:'14px' }}>Select in order of preference (first = top priority)</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {BRANCHES.map(b => (
                <button type="button" key={b}
                  onClick={() => toggleArr('branch_preferences', b)}
                  style={{
                    padding:'6px 14px', borderRadius:'99px', fontSize:'13px', cursor:'pointer', border:'1px solid',
                    borderColor: form.branch_preferences.includes(b) ? 'var(--amber)' : 'rgba(255,255,255,0.15)',
                    background:  form.branch_preferences.includes(b) ? 'rgba(245,166,35,0.15)' : 'transparent',
                    color:       form.branch_preferences.includes(b) ? 'var(--amber)' : 'var(--gray-2)',
                  }}>
                  {form.branch_preferences.includes(b) && `${form.branch_preferences.indexOf(b)+1}. `}{b}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom:'18px' }}>Preferences</h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Location preference</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'4px' }}>
                  {LOCATIONS.map(l => (
                    <button type="button" key={l}
                      onClick={() => toggleArr('location_preferences', l)}
                      style={{
                        padding:'4px 12px', borderRadius:'99px', fontSize:'12px', cursor:'pointer', border:'1px solid',
                        borderColor: form.location_preferences.includes(l) ? 'var(--amber)' : 'rgba(255,255,255,0.15)',
                        background:  form.location_preferences.includes(l) ? 'rgba(245,166,35,0.15)' : 'transparent',
                        color:       form.location_preferences.includes(l) ? 'var(--amber)' : 'var(--gray-2)',
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                <div className="form-group">
                  <label>College type</label>
                  <select value={form.college_type} onChange={e => set('college_type', e.target.value)}>
                    {['Any','Government','Aided','Unaided','Autonomous'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Max annual fees (₹)</label>
                  <input type="number" value={form.budget_max}
                    onChange={e => set('budget_max', e.target.value)}
                    placeholder="e.g. 150000" />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving…' : 'Save Profile & Go to Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  )
}
