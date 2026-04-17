import { useState, useEffect } from 'react'
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
  const [loading,     setLoading]     = useState(false)
  const [fetching,    setFetching]    = useState(true)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState('')
  const [hasProfile,  setHasProfile]  = useState(false)

  useEffect(() => {
    api.get('/student/profile')
      .then(r => {
        const s = r.data.data?.student
        if (s) {
          setHasProfile(true)
          setForm({
            percentile:           s.percentile?.toString() || '',
            exam_type:            s.exam_type || 'CET',
            category:             s.category  || 'OPEN',
            gender:               s.gender    || '',
            home_university:      s.home_university || '',
            branch_preferences:   s.branch_preferences || [],
            location_preferences: s.location_preferences || [],
            college_type:         s.college_type || 'Any',
            budget_max:           s.budget_max?.toString() || '',
          })
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleArr = (key, val) => {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }))
  }

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    const payload = { ...form, percentile: parseFloat(form.percentile), budget_max: form.budget_max ? parseInt(form.budget_max) : null }
    try {
      if (hasProfile) {
        await api.put('/student/profile', payload)
      } else {
        await api.post('/student/', payload)
        setHasProfile(true)
      }
      setSuccess('Profile saved. Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      if (!hasProfile && err.response?.status === 409) {
        try {
          await api.put('/student/profile', payload)
          setHasProfile(true)
          setSuccess('Profile updated. Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard'), 1500)
        } catch (e2) { setError(e2.response?.data?.message || 'Save failed.') }
      } else {
        setError(err.response?.data?.message || 'Save failed.')
      }
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'760px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom:'12px' }}>
            {hasProfile ? 'Update Academic Profile' : 'Academic Input Form'}
          </h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>
            {hasProfile
              ? 'Update your academic parameters to get a fresh prediction.'
              : 'Fill in your details to get your personalised CAP preference list.'}
          </p>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'32px' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700', marginBottom:'24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
              Academic Details
            </h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Percentile *</label>
                <input type="number" min="0" max="100" step="0.01"
                  value={form.percentile} onChange={e => set('percentile', e.target.value)}
                  placeholder="e.g. 94.50" required />
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
                  <option value="">Prefer not to say</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Home University</label>
                <input value={form.home_university}
                  onChange={e => set('home_university', e.target.value)}
                  placeholder="e.g. Savitribai Phule Pune University" />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700', marginBottom:'8px' }}>
              Branch Preferences
            </h3>
            <p className="text-muted" style={{ fontSize:'14px', marginBottom:'24px' }}>Select your preferred branches. Order matters — first selected = highest priority.</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px' }}>
              {BRANCHES.map(b => (
                <button type="button" key={b}
                  onClick={() => toggleArr('branch_preferences', b)}
                  style={{
                    padding:'8px 16px', borderRadius:'var(--radius-full)', fontSize:'14px', fontWeight: '500', cursor:'pointer', border:'2px solid',
                    borderColor: form.branch_preferences.includes(b) ? 'var(--navy)' : 'var(--gray-300)',
                    background:  form.branch_preferences.includes(b) ? 'var(--navy)' : 'var(--white)',
                    color:       form.branch_preferences.includes(b) ? 'var(--white)' : 'var(--gray-600)',
                    transition:  'var(--transition)'
                  }}>
                  {form.branch_preferences.includes(b) && (
                    <span style={{ opacity: 0.7, marginRight: '6px' }}>{form.branch_preferences.indexOf(b)+1}.</span>
                  )}
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700', marginBottom:'24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
              Filters & Constraints
            </h3>
            <div className="grid-2">
              <div className="form-group">
                <label>Preferred Locations</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
                  {LOCATIONS.map(l => (
                    <button type="button" key={l}
                      onClick={() => toggleArr('location_preferences', l)}
                      style={{
                        padding:'6px 14px', borderRadius:'var(--radius-full)', fontSize:'13px', fontWeight: '500', cursor:'pointer', border:'1px solid',
                        borderColor: form.location_preferences.includes(l) ? 'var(--amber-dark)' : 'var(--gray-300)',
                        background:  form.location_preferences.includes(l) ? 'var(--amber)' : 'var(--white)',
                        color:       form.location_preferences.includes(l) ? 'var(--navy)' : 'var(--gray-600)',
                        transition:  'var(--transition)'
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                <div className="form-group">
                  <label>College Type</label>
                  <select value={form.college_type} onChange={e => set('college_type', e.target.value)}>
                    {['Any','Government','Aided','Unaided'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Max Annual Fees (₹)</label>
                  <input type="number" value={form.budget_max}
                    onChange={e => set('budget_max', e.target.value)}
                    placeholder="e.g. 150000" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap:'12px', justifyContent: 'flex-end', paddingTop: '16px' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ minWidth: '200px' }}>
              {loading ? 'Saving...' : hasProfile ? 'Update Profile' : 'Save & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
