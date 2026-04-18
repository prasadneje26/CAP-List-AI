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
    { to: '/dashboard',  label: 'Dashboard' },
    { to: '/input',      label: 'Academic'  },
    { to: '/results',    label: 'CAP List'  },
    { to: '/compare',    label: 'Compare'   },
    { to: '/mentorship', label: 'Mentorship'},
    { to: '/documents',  label: 'Documents' },
  ] : []

  const isActive = (to) => pathname === to || pathname.startsWith(to + '/')

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-auth  { display: none !important; }
          .nav-hamburger     { display: flex !important; }
          .nav-mobile-menu   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger   { display: none !important; }
          .nav-mobile-menu { display: none !important; }
          .nav-desktop-links { display: flex !important; }
          .nav-desktop-auth  { display: flex !important; }
        }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? 'var(--gray-300)' : 'var(--gray-200)'}`,
        height: 64, transition: 'all 0.25s ease',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 20px',
          height: '100%', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 8, textDecoration: 'none' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.5px' }}>
              CAP<em style={{ fontStyle: 'italic', color: 'var(--amber-dark)' }}>AI</em>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-desktop-links" style={{ gap: 2, flex: 1 }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '6px 11px', borderRadius: 'var(--radius-full)',
                fontSize: 13.5, fontWeight: isActive(to) ? 600 : 500,
                color: isActive(to) ? 'var(--navy)' : 'var(--gray-600)',
                background: isActive(to) ? 'var(--gray-200)' : 'transparent',
                transition: 'var(--transition)', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="nav-desktop-auth" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {user ? (
              <>
                <Link to="/feedback" style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--gray-600)', fontWeight: 500, transition: 'var(--transition)', textDecoration: 'none' }}>
                  Feedback
                </Link>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 10px 4px 4px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--gray-200)', background: 'var(--white)', transition: 'var(--transition)', textDecoration: 'none' }}>
                  <div style={{ width: 27, height: 27, borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--gray-300)', fontSize: 13 }}>Sign Out</button>
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
            className="nav-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{
              marginLeft: 'auto', background: menuOpen ? 'var(--gray-100)' : 'none',
              border: '1.5px solid var(--gray-200)', borderRadius: 8,
              padding: '7px 9px', cursor: 'pointer', color: 'var(--navy)',
              alignItems: 'center', justifyContent: 'center',
              transition: 'var(--transition)',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="nav-mobile-menu animate-slideDown" style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
          background: 'var(--white)', borderBottom: '1px solid var(--gray-200)',
          flexDirection: 'column', gap: 0, boxShadow: 'var(--shadow-lg)',
          maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
        }}>
          {/* User info if logged in */}
          {user && (
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--gray-50)' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{user.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{user.email}</div>
              </div>
            </div>
          )}

          {/* Nav links */}
          <div style={{ padding: '8px 12px' }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                display: 'block', padding: '12px 14px', borderRadius: 10,
                fontSize: 15, fontWeight: 600, textDecoration: 'none',
                color: isActive(to) ? 'var(--navy)' : 'var(--gray-700)',
                background: isActive(to) ? 'var(--gray-100)' : 'transparent',
                marginBottom: 2,
              }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Auth actions */}
          <div style={{ padding: '12px 20px 20px', borderTop: '1px solid var(--gray-100)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {user ? (
              <>
                <Link to="/profile" className="btn btn-outline btn-full" style={{ textDecoration: 'none' }}>My Profile</Link>
                <Link to="/feedback" className="btn btn-ghost btn-full" style={{ textDecoration: 'none' }}>Give Feedback</Link>
                <button onClick={handleLogout} className="btn btn-danger btn-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-full" style={{ textDecoration: 'none' }}>Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-full" style={{ textDecoration: 'none' }}>Create Free Account</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
