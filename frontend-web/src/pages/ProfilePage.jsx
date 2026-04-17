import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [student,   setStudent]   = useState(null)
  const [fetching,  setFetching]  = useState(true)
  const [pwForm,    setPwForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError,   setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [showPws,   setShowPws]   = useState({})

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setStudent(r.data.data?.student || null))
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const togglePw = (k) => setShowPws(s => ({ ...s, [k]: !s[k] }))

  const handlePwChange = async e => {
    e.preventDefault()
    setPwError(''); setPwSuccess('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    setPwLoading(true)
    try {
      await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwSuccess('Password changed successfully.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.')
    } finally { setPwLoading(false) }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const formatBranches = arr => Array.isArray(arr) && arr.length > 0 ? arr.join(', ') : 'Not set'
  const formatFees = v => v ? `₹${Number(v).toLocaleString('en-IN')} / year` : 'No limit'

  const profileCompletion = student ? [
    !!student.percentile,
    !!student.category,
    !!student.exam_type,
    !!student.branch_preferences?.length,
    !!student.location_preferences?.length,
    !!student.budget_max,
    !!student.home_university,
  ].filter(Boolean).length : 0
  const completionPct = student ? Math.round((profileCompletion / 7) * 100) : 0

  if (fetching) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 740 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="section-label">Account</div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', marginBottom: 6, letterSpacing: '-0.5px' }}>My Profile</h1>
            <p className="text-muted" style={{ fontSize: 14.5 }}>Manage your account and academic preferences.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--gray-300)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>

        {/* Account info card */}
        <div className="card animate-slideUp" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--gray-200)' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-lighter) 100%)',
              color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 2 }}>{user?.name}</div>
              <div style={{ fontSize: 13.5, color: 'var(--gray-500)', marginBottom: 4 }}>{user?.email}</div>
              <span className="badge badge-gray" style={{ fontSize: 10.5 }}>
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
            <Link to="/input" className="btn btn-outline btn-sm">Edit Profile</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <InfoBox label="Email" value={user?.email} icon="📧" />
            <InfoBox label="Account Type" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} icon="🎖️" />
          </div>
        </div>

        {/* Academic profile */}
        <div className="card animate-slideUp delay-1" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--gray-200)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Academic Profile</h3>
              {student && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 100, height: 5, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${completionPct}%`, height: '100%', background: completionPct >= 80 ? 'var(--success)' : completionPct >= 50 ? 'var(--warning)' : 'var(--danger)', borderRadius: 'var(--radius-full)', transition: 'width 0.8s ease' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: completionPct >= 80 ? 'var(--success)' : 'var(--warning)' }}>{completionPct}% complete</span>
                </div>
              )}
            </div>
            <Link to="/input" className="btn btn-primary btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </Link>
          </div>

          {student ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <InfoBox label="Percentile" value={`${student.percentile}%`} icon="📊" highlight />
              <InfoBox label="Exam Type"  value={student.exam_type} icon="📝" />
              <InfoBox label="Category"   value={student.category}  icon="🏷️" />
              <InfoBox label="Gender"     value={student.gender || 'Not specified'} icon="👤" />
              <InfoBox label="College Type" value={student.college_type || 'Any'} icon="🏛️" />
              <InfoBox label="Max Annual Fees" value={formatFees(student.budget_max)} icon="💰" />
              <div style={{ gridColumn: 'span 2' }}>
                <InfoBox label="Branch Preferences" value={formatBranches(student.branch_preferences)} icon="🎓" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <InfoBox label="Preferred Locations" value={formatBranches(student.location_preferences)} icon="📍" />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
              <h4 style={{ fontFamily: 'var(--font-sans)', marginBottom: 8 }}>No academic profile yet</h4>
              <p className="text-muted" style={{ marginBottom: 24, fontSize: 14 }}>Create your profile to get personalized college predictions.</p>
              <Link to="/input" className="btn btn-primary">Complete Academic Profile</Link>
            </div>
          )}
        </div>

        {/* Change password */}
        <div className="card animate-slideUp delay-2">
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
            Change Password
          </h3>
          <p className="text-muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
            Use a strong password with at least 8 characters including letters and numbers.
          </p>

          {pwError   && <div className="alert alert-error animate-slideDown">{pwError}</div>}
          {pwSuccess && <div className="alert alert-success animate-slideDown">{pwSuccess}</div>}

          <form onSubmit={handlePwChange} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
              { key: 'newPassword',     label: 'New Password',     placeholder: 'Minimum 8 characters' },
              { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Repeat new password' },
            ].map(f => (
              <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                <label>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPws[f.key] ? 'text' : 'password'}
                    value={pwForm[f.key]}
                    onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    required minLength={f.key !== 'currentPassword' ? 8 : undefined}
                    style={{ paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => togglePw(f.key)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPws[f.key]
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ minWidth: 180 }}>
                {pwLoading ? <><div className="spinner spinner-sm" /> Updating...</> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Quick links */}
        <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm">← Dashboard</Link>
          <Link to="/results"   className="btn btn-ghost btn-sm">View CAP List</Link>
          <Link to="/feedback"  className="btn btn-ghost btn-sm">Give Feedback</Link>
        </div>
      </div>
    </div>
  )
}

function InfoBox({ label, value, icon, highlight }) {
  return (
    <div style={{
      background: highlight ? 'linear-gradient(135deg, rgba(10,25,47,0.04) 0%, rgba(10,25,47,0.02) 100%)' : 'var(--gray-50)',
      borderRadius: 'var(--radius-sm)', padding: '12px 14px',
      border: highlight ? '1px solid rgba(10,25,47,0.1)' : '1px solid var(--gray-200)',
    }}>
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.7, color: 'var(--gray-400)', fontWeight: 600, marginBottom: 5 }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 14, lineHeight: 1.4 }}>{value}</div>
    </div>
  )
}
