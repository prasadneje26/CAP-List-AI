// ============================================================
// File: frontend-web/src/pages/Register.jsx
// ============================================================

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
      <div style={styles.card}>
        <div style={styles.top}>
          <span style={styles.logoMark}>◈</span>
          <h2 style={{ margin:'12px 0 4px' }}>Create your account</h2>
          <p className="text-muted" style={{ fontSize:'14px' }}>Free — no credit card needed</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <div className="form-group">
            <label>Full name</label>
            <input name="name" value={form.name} onChange={handle} placeholder="Arjun Sharma" required />
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 8 chars, A-Z, a-z, 0-9" required minLength={8} />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account…' : 'Get Started →'}
          </button>
        </form>

        <p style={styles.foot}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--amber)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrap: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'80vh', padding:'24px' },
  card: { background:'var(--navy-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--radius-lg)', padding:'40px', width:'100%', maxWidth:'400px' },
  top:  { textAlign:'center', marginBottom:'28px' },
  logoMark: { fontSize:'32px', color:'var(--amber)' },
  form: { display:'flex', flexDirection:'column', gap:'16px', marginBottom:'20px' },
  foot: { textAlign:'center', fontSize:'14px', color:'var(--gray-2)' },
}
