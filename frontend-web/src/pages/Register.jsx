import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]   = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/input')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div style={styles.top}>
          <div style={styles.logoMark}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h2 style={{ fontSize: '28px', margin:'16px 0 8px' }}>Create account</h2>
          <p className="text-muted" style={{ fontSize:'15px' }}>Free access to advanced CAP analytics</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div className="form-group">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="e.g. Arjun Sharma" required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Secure password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 8 chars" required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Creating profile...' : 'Start Building Profile'}
          </button>
        </form>

        <div style={styles.foot}>
          <span className="text-muted">Already have an account?</span>{' '}
          <Link to="/login" style={{ color:'var(--navy)', fontWeight: '600' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'calc(100vh - 200px)', padding:'40px 24px' },
  card: { padding:'48px', width:'100%', maxWidth:'440px', boxShadow: 'var(--shadow-lg)' },
  top:  { textAlign:'center', marginBottom:'32px' },
  logoMark: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', background: 'var(--gray-100)', color: 'var(--navy)', borderRadius: '16px' },
  form: { display:'flex', flexDirection:'column', gap:'12px', marginBottom:'32px' },
  foot: { textAlign:'center', fontSize:'14px', paddingTop: '24px', borderTop: '1px solid var(--gray-200)' },
}