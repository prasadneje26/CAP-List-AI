import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['var(--danger)', 'var(--danger)', 'var(--warning)', 'var(--warning)', 'var(--success)']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  if (!password) return null
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5, alignItems: 'center' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : 'var(--gray-200)', transition: 'background 0.3s' }} />
        ))}
        <span style={{ fontSize: 11, fontWeight: 700, color: colors[score], marginLeft: 6, whiteSpace: 'nowrap' }}>{labels[score]}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 12px' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: 11, fontWeight: 500, color: c.ok ? 'var(--success)' : 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]   = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/input')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
      {/* Left dark panel */}
      <div className="hide-mobile" style={{
        width: '42%', flexShrink: 0,
        background: 'linear-gradient(160deg, #0A192F 0%, #112240 50%, #0D2137 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(255,183,3,0.08)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--white)' }}>
              CAP<em style={{ fontStyle: 'italic', color: 'var(--amber)' }}>AI</em>
            </span>
          </div>

          <h2 style={{ color: 'var(--white)', fontSize: 30, fontFamily: 'var(--font-display)', marginBottom: 14, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Get started — it's<br />completely free.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 44, lineHeight: 1.65 }}>
            Join thousands of Maharashtra engineering aspirants who used AI to secure their dream college.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { step: '1', title: 'Create account', desc: 'Takes 30 seconds, no credit card', active: true },
              { step: '2', title: 'Enter your marks', desc: 'Percentile, category, branch prefs' },
              { step: '3', title: 'Get your CAP list', desc: 'AI-optimized college list instantly' },
            ].map((s, i) => (
              <div key={i} className="animate-slideUp" style={{ animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: s.active ? 'var(--amber)' : 'rgba(255,255,255,0.08)',
                  border: s.active ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: s.active ? 'var(--navy)' : 'rgba(255,255,255,0.4)',
                }}>
                  {s.step}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.active ? 'var(--white)' : 'rgba(255,255,255,0.5)', marginBottom: 2 }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — register form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--gray-50)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 30, letterSpacing: '-0.5px', marginBottom: 8 }}>Create your account</h2>
            <p className="text-muted" style={{ fontSize: 15 }}>Free forever. No credit card required.</p>
          </div>

          {error && (
            <div className="alert alert-error animate-slideDown">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handle} placeholder="Your full name" required autoComplete="name" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email address</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@example.com" required autoComplete="email" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPw ? 'text' : 'password'}
                  value={form.password} onChange={handle}
                  placeholder="Min 8 characters" required minLength={8}
                  autoComplete="new-password" style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 0 }}>
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <p style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.55 }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? (
                <><div className="spinner spinner-sm" style={{ borderTopColor: 'rgba(255,255,255,0.7)' }} /> Creating account...</>
              ) : 'Create Free Account →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, padding: '20px 0', borderTop: '1px solid var(--gray-200)' }}>
            <span className="text-muted" style={{ fontSize: 14 }}>Already have an account?</span>{' '}
            <Link to="/login" style={{ color: 'var(--navy)', fontWeight: 700, fontSize: 14 }}>Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
