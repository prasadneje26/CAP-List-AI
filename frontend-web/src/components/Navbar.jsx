import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()
  const navigate         = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user ? [
    { to: '/dashboard',  label: 'Dashboard', icon: '⬛' },
    { to: '/input',      label: 'Academic',  icon: '📝' },
    { to: '/results',    label: 'CAP List',  icon: '📋' },
    { to: '/compare',    label: 'Compare',   icon: '⚖️' },
    { to: '/mentorship', label: 'Mentorship',icon: '🎓' },
    { to: '/documents',  label: 'Documents', icon: '📄' },
  ] : []

  const isActive = (to) => pathname === to || pathname.startsWith(to + '/')

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--gray-300)' : 'var(--gray-200)'}`,
        height: 68, transition: 'all 0.25s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 24px',
          height: '100%', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--navy)', color: 'var(--white)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
              CAP<em style={{ fontStyle: 'italic', color: 'var(--amber-dark)' }}>AI</em>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hide-mobile" style={{ display: 'flex', gap: 2, flex: 1 }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '7px 12px', borderRadius: 'var(--radius-full)',
                fontSize: 13.5, fontWeight: isActive(to) ? 600 : 500,
                color: isActive(to) ? 'var(--navy)' : 'var(--gray-600)',
                background: isActive(to) ? 'var(--gray-200)' : 'transparent',
                transition: 'var(--transition)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!isActive(to)) e.target.style.background = 'var(--gray-100)' }}
              onMouseLeave={e => { if (!isActive(to)) e.target.style.background = 'transparent' }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side auth */}
          <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {user ? (
              <>
                <Link to="/feedback" style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-sm)',
                  fontSize: 13, color: 'var(--gray-600)', fontWeight: 500,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--navy)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray-600)'}
                >
                  Feedback
                </Link>
                <Link to="/profile" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px 5px 5px',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid var(--gray-200)',
                  background: 'var(--white)',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--navy)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-lighter) 100%)',
                    color: 'var(--white)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 12, fontWeight: 700,
                  }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm"
                  style={{ borderColor: 'var(--gray-300)', fontSize: 13 }}>
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--navy)', fontSize: 13 }}>Sign in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              display: 'none',
              marginLeft: 'auto', background: 'none', border: '1.5px solid var(--gray-200)',
              borderRadius: 8, padding: '7px 9px', cursor: 'pointer', color: 'var(--navy)',
            }}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="animate-slideDown" style={{
          position: 'fixed', top: 68, left: 0, right: 0, zIndex: 99,
          background: 'var(--white)', borderBottom: '1px solid var(--gray-200)',
          padding: '16px 20px', display: 'none', flexDirection: 'column', gap: 4,
          boxShadow: 'var(--shadow-lg)',
        }}>
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} style={{
              display: 'block', padding: '12px 16px', borderRadius: 8,
              fontSize: 15, fontWeight: 600,
              color: isActive(to) ? 'var(--navy)' : 'var(--gray-700)',
              background: isActive(to) ? 'var(--gray-100)' : 'transparent',
            }}>{label}</Link>
          ))}
          <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 8, paddingTop: 12 }}>
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline btn-full">Sign Out</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Link to="/login" className="btn btn-outline btn-full">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .hide-desktop { display: flex !important; }
        }
        @media (min-width: 769px) {
          .hide-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}
