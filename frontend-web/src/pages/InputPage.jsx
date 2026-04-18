import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Artificial Intelligence & Data Science',
  'Computer Science & Engineering (AI)',
  'Data Science',
  'Robotics & Automation',
]
const CATEGORIES = ['OPEN', 'OBC', 'SC', 'ST', 'EWS', 'TFWS', 'PWD']
const LOCATIONS  = ['Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Nagpur', 'Kolhapur', 'Sangli', 'Solapur', 'Latur']
const UNIVERSITIES = [
  'Savitribai Phule Pune University',
  'University of Mumbai',
  'Rashtrasant Tukadoji Maharaj Nagpur University',
  'Dr. Babasaheb Ambedkar Marathwada University',
  'North Maharashtra University',
  'Shivaji University',
  'Autonomous Institute',
]

const STEPS = [
  { id: 'academic', label: 'Academic Details', icon: '📝' },
  { id: 'branches', label: 'Branch Preferences', icon: '🎓' },
  { id: 'filters',  label: 'Preferences & Filters', icon: '⚙️' },
]

export default function InputPage() {
  const navigate    = useNavigate()
  const [step,      setStep]      = useState(0)
  const [form,      setForm]      = useState({
    percentile: '', exam_type: 'CET', category: 'OPEN', gender: '',
    home_university: '', branch_preferences: [], location_preferences: [],
    college_type: 'Any', budget_max: '',
  })
  const [loading,    setLoading]    = useState(false)
  const [fetching,   setFetching]   = useState(true)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [hasProfile, setHasProfile] = useState(false)

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

  const nextStep = () => {
    if (step === 0 && !form.percentile) { setError('Please enter your percentile.'); return }
    if (step === 0 && (parseFloat(form.percentile) < 0 || parseFloat(form.percentile) > 100)) { setError('Percentile must be between 0 and 100.'); return }
    setError('')
    setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true)
    const payload = {
      ...form,
      percentile: parseFloat(form.percentile),
      budget_max: form.budget_max ? parseInt(form.budget_max) : null,
      gender:     form.gender || undefined,
      home_university: form.home_university || undefined,
    }
    try {
      if (hasProfile) {
        await api.put('/student/profile', payload)
      } else {
        await api.post('/student/create', payload)
        setHasProfile(true)
      }
      setSuccess('Profile saved! Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 1400)
    } catch (err) {
      if (!hasProfile && err.response?.status === 409) {
        try {
          await api.put('/student/profile', payload)
          setHasProfile(true)
          setSuccess('Profile updated! Redirecting to dashboard...')
          setTimeout(() => navigate('/dashboard'), 1400)
        } catch (e2) { setError(e2.response?.data?.message || 'Save failed.') }
      } else {
        setError(err.response?.data?.message || 'Save failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  if (fetching) return <div className="page-loader"><div className="spinner" /><p className="text-muted" style={{ marginTop: 16 }}>Loading your profile...</p></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        {/* Page header */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label">{hasProfile ? 'Update Details' : 'New Profile'}</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 10, letterSpacing: '-0.5px' }}>
            {hasProfile ? 'Update Your Academic Profile' : 'Build Your Academic Profile'}
          </h1>
          <p className="text-muted" style={{ fontSize: 15 }}>
            Fill in your details accurately — our AI uses them to match you with the right colleges.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40, gap: 0 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div
                onClick={() => i < step && setStep(i)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: i < step ? 'pointer' : 'default' }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: i === step ? 'var(--navy)' : i < step ? 'var(--success)' : 'var(--gray-200)',
                  color: i <= step ? 'var(--white)' : 'var(--gray-500)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, transition: 'all 0.25s ease',
                }}>
                  {i < step ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : i + 1}
                </div>
                <div className="hide-mobile">
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: i === step ? 'var(--navy)' : i < step ? 'var(--success)' : 'var(--gray-400)', whiteSpace: 'nowrap' }}>{s.label}</div>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--success)' : 'var(--gray-200)', margin: '0 8px', transition: 'background 0.4s ease' }} />
              )}
            </div>
          ))}
        </div>

        {error   && <div className="alert alert-error animate-slideDown">{error}</div>}
        {success && <div className="alert alert-success animate-slideDown">{success}</div>}

        <form onSubmit={submit}>

          {/* ── Step 0: Academic Details ── */}
          {step === 0 && (
            <div className="card animate-fadeIn">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                📝 Academic Details
              </h3>
              <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 24 }}>
                Your core exam details used for cutoff matching.
              </p>

              <div className="grid-2" style={{ gap: 20 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Percentile *</label>
                  <input type="number" min="0" max="100" step="0.01"
                    value={form.percentile} onChange={e => set('percentile', e.target.value)}
                    placeholder="e.g. 94.50" required />
                  <div className="input-hint">Enter your MHT-CET or JEE percentile (0–100)</div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Exam Type *</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    {['CET', 'JEE'].map(t => (
                      <button key={t} type="button"
                        onClick={() => set('exam_type', t)}
                        style={{
                          flex: 1, padding: '10px 16px', borderRadius: 'var(--radius-md)',
                          border: `2px solid ${form.exam_type === t ? 'var(--navy)' : 'var(--gray-300)'}`,
                          background: form.exam_type === t ? 'var(--navy)' : 'var(--white)',
                          color: form.exam_type === t ? 'var(--white)' : 'var(--gray-700)',
                          fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'var(--transition)',
                        }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Reservation Category *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {CATEGORIES.map(c => (
                      <button key={c} type="button"
                        onClick={() => set('category', c)}
                        style={{
                          padding: '7px 14px', borderRadius: 'var(--radius-full)', fontSize: 13,
                          fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                          borderColor: form.category === c ? 'var(--navy)' : 'var(--gray-300)',
                          background: form.category === c ? 'var(--navy)' : 'var(--white)',
                          color: form.category === c ? 'var(--white)' : 'var(--gray-600)',
                          transition: 'var(--transition)',
                        }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Gender</label>
                  <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                    <option value="">Prefer not to say</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, gridColumn: 'span 2' }}>
                  <label>Home University</label>
                  <select value={form.home_university} onChange={e => set('home_university', e.target.value)}>
                    <option value="">Select your university (optional)</option>
                    {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <div className="input-hint">Used for home university quota eligibility matching</div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Branch Preferences ── */}
          {step === 1 && (
            <div className="card animate-fadeIn">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                🎓 Branch Preferences
              </h3>
              <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 8 }}>
                Select branches in your preferred order. Numbers indicate priority — first selected is highest priority.
              </p>
              {form.branch_preferences.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginRight: 4 }}>Order:</span>
                  {form.branch_preferences.map((b, i) => (
                    <span key={`sel-${i}`} style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)' }}>
                      {i + 1}. {b.split(' ').slice(0, 3).join(' ')}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {BRANCHES.map(b => {
                  const idx = form.branch_preferences.indexOf(b)
                  const selected = idx !== -1
                  return (
                    <button type="button" key={b}
                      onClick={() => toggleArr('branch_preferences', b)}
                      style={{
                        padding: '9px 18px', borderRadius: 'var(--radius-full)', fontSize: 13.5,
                        fontWeight: 600, cursor: 'pointer', border: '2px solid',
                        borderColor: selected ? 'var(--navy)' : 'var(--gray-300)',
                        background: selected ? 'var(--navy)' : 'var(--white)',
                        color: selected ? 'var(--white)' : 'var(--gray-600)',
                        transition: 'var(--transition)',
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}>
                      {selected && (
                        <span style={{ background: 'var(--amber)', color: 'var(--navy)', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                          {idx + 1}
                        </span>
                      )}
                      {b}
                    </button>
                  )
                })}
              </div>
              {form.branch_preferences.length === 0 && (
                <p style={{ marginTop: 16, fontSize: 13, color: 'var(--warning)', fontWeight: 500 }}>
                  ⚠️ Select at least one branch for the best predictions.
                </p>
              )}
            </div>
          )}

          {/* ── Step 2: Filters ── */}
          {step === 2 && (
            <div className="card animate-fadeIn">
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                ⚙️ Preferences & Filters
              </h3>
              <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 24 }}>
                These are optional but improve the quality of your college matches.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8, display: 'block' }}>
                    Preferred Locations
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {LOCATIONS.map(l => (
                      <button type="button" key={l}
                        onClick={() => toggleArr('location_preferences', l)}
                        style={{
                          padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: 13.5,
                          fontWeight: 600, cursor: 'pointer', border: '1.5px solid',
                          borderColor: form.location_preferences.includes(l) ? 'var(--amber-dark)' : 'var(--gray-300)',
                          background: form.location_preferences.includes(l) ? 'var(--amber)' : 'var(--white)',
                          color: form.location_preferences.includes(l) ? 'var(--navy)' : 'var(--gray-600)',
                          transition: 'var(--transition)',
                        }}>
                        {form.location_preferences.includes(l) && '✓ '}{l}
                      </button>
                    ))}
                  </div>
                  {form.location_preferences.length === 0 && (
                    <p className="input-hint" style={{ marginTop: 6 }}>Leave empty to include all locations</p>
                  )}
                </div>

                <div className="grid-2" style={{ gap: 20 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>College Type</label>
                    <select value={form.college_type} onChange={e => set('college_type', e.target.value)}>
                      {['Any', 'Government', 'Aided', 'Unaided'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <div className="input-hint">Government seats have lower fees</div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Max Annual Fees (₹)</label>
                    <input type="number" value={form.budget_max}
                      onChange={e => set('budget_max', e.target.value)}
                      placeholder="e.g. 150000" min={0} />
                    <div className="input-hint">Leave blank for no fee limit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              {step > 0 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep(s => s - 1)}>
                  ← Back
                </button>
              )}
            </div>

            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep} style={{ minWidth: 160 }}>
                Next: {STEPS[step + 1].label} →
              </button>
            ) : (
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ minWidth: 200 }}>
                {loading ? (
                  <><div className="spinner spinner-sm" style={{ borderTopColor: 'rgba(255,255,255,0.7)' }} /> Saving...</>
                ) : (
                  <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> {hasProfile ? 'Update Profile' : 'Save & Generate List'}</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
