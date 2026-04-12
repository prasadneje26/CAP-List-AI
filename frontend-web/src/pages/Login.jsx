import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
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
          <h2 style={{ fontSize: '28px', margin: '16px 0 8px' }}>Welcome back</h2>
          <p className="text-muted" style={{ fontSize: '15px' }}>Sign in to your CAP counseling portal</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" value={form.email}
              onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password}
              onChange={handle} placeholder="••••••••" required />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
             <span style={{ fontSize: '13px', color: 'var(--gray-500)', cursor: 'pointer' }}>Forgot password?</span>
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg"
            disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.foot}>
          <span className="text-muted">Don't have an account?</span>{' '}
          <Link to="/register" style={{ color: 'var(--navy)', fontWeight: '600' }}>Create free account</Link>
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