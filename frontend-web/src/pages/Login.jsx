import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  { icon: '⚡', text: 'AI cutoff prediction with 95%+ accuracy' },
  { icon: '🎯', text: 'Dream / Target / Safe classification' },
  { icon: '📋', text: 'Optimized 30-college CAP preference list' },
  { icon: '🤖', text: 'Instant AI counseling chatbot' },
]

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      {/* Left panel — dark feature panel */}
      <div className="hide-mobile" style={{
        width: '42%', flexShrink: 0,
        background: 'linear-gradient(160deg, #0A192F 0%, #112240 50%, #0D2137 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,183,3,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,183,3,0.06)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
              CAP<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>AI</em>
            </span>
          </div>

          <h2 style={{ color: 'var(--white)', fontSize: 30, fontFamily: 'var(--font-display)', marginBottom: 14, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Your AI-powered<br />college counselor
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 40, lineHeight: 1.65 }}>
            Join thousands of Maharashtra engineering aspirants who used data-driven AI to secure their dream college.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,183,3,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 56, padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: 12 }}>
              "The CAP list generator saved me so much stress. I got COEP Computer — my first choice!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--navy-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--white)' }}>R</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Riya Sharma</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>97.8% · OPEN · COEP 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', background: 'var(--gray-50)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 30, letterSpacing: '-0.5px', marginBottom: 8 }}>Welcome back</h2>
            <p className="text-muted" style={{ fontSize: 15 }}>Sign in to your CAP counseling portal</p>
          </div>

          {error && (
            <div className="alert alert-error animate-slideDown">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email address</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handle} placeholder="you@example.com" required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handle}
                  placeholder="Enter your password" required
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0,
                }}>
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <span style={{ fontSize: 12.5, color: 'var(--gray-500)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <><div className="spinner spinner-sm" style={{ borderTopColor: 'rgba(255,255,255,0.7)' }} /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, padding: '20px 0', borderTop: '1px solid var(--gray-200)' }}>
            <span className="text-muted" style={{ fontSize: 14 }}>Don't have an account?</span>{' '}
            <Link to="/register" style={{ color: 'var(--navy)', fontWeight: 700, fontSize: 14 }}>Create free account →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
