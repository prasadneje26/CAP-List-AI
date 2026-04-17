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

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setStudent(r.data.data?.student || null))
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])

  const handlePwChange = async e => {
    e.preventDefault()
    setPwError(''); setPwSuccess('')
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
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

  if (fetching) return <div className="page-loader"><div className="spinner" /></div>

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'720px' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>My Profile</h1>
            <p className="text-muted">Manage your account details and academic preferences.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--gray-300)' }}>
            Sign Out
          </button>
        </div>

        {/* Account Info */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>Account Information</h3>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '700' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Row label="Full Name"  value={user?.name} />
            <Row label="Email"      value={user?.email} />
            <Row label="Account Role" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} />
          </div>
        </div>

        {/* Academic Profile */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>Academic Profile</h3>
            <Link to="/input" className="btn btn-outline btn-sm">Edit Profile</Link>
          </div>

          {student ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InfoBox label="Percentile" value={`${student.percentile}%`} icon="📊" />
              <InfoBox label="Exam Type"  value={student.exam_type} icon="📝" />
              <InfoBox label="Category"   value={student.category} icon="🏷️" />
              <InfoBox label="Gender"     value={student.gender || 'Not set'} icon="👤" />
              <InfoBox label="College Type" value={student.college_type || 'Any'} icon="🏛️" />
              <InfoBox label="Max Fees"   value={formatFees(student.budget_max)} icon="💰" />
              <div style={{ gridColumn: 'span 2' }}>
                <InfoBox label="Branch Preferences" value={formatBranches(student.branch_preferences)} icon="🎓" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <InfoBox label="Preferred Locations" value={formatBranches(student.location_preferences)} icon="📍" />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p className="text-muted" style={{ marginBottom: '20px' }}>No academic profile found. Create one to get your CAP predictions.</p>
              <Link to="/input" className="btn btn-primary">Complete Academic Profile</Link>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="card">
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-sans)', fontWeight: '700', marginBottom:'24px', paddingBottom: '16px', borderBottom: '1px solid var(--gray-200)' }}>
            Change Password
          </h3>

          {pwError   && <div className="alert alert-error" style={{ marginBottom: '20px' }}>{pwError}</div>}
          {pwSuccess && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{pwSuccess}</div>}

          <form onSubmit={handlePwChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Enter current password" required />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input type="password" value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="Min 8 chars, with upper, lower & number" required minLength={8} />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Repeat new password" required minLength={8} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={pwLoading} style={{ minWidth: '160px' }}>
                {pwLoading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '8px 0' }}>
      <span style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.5px', color: 'var(--gray-500)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '15px' }}>{value}</span>
    </div>
  )
}

function InfoBox({ label, value, icon }) {
  return (
    <div style={{ background: 'var(--gray-100)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-500)', fontWeight: 600, marginBottom: '6px' }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '14px', lineHeight: 1.4 }}>{value}</div>
    </div>
  )
}
