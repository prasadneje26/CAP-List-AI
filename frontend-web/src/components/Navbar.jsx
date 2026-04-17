import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()
  const navigate         = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user
    ? [
        { to: '/dashboard',  label: 'Dashboard' },
        { to: '/input',      label: 'Academic' },
        { to: '/results',    label: 'CAP List' },
        { to: '/compare',    label: 'Compare' },
        { to: '/mentorship', label: 'Mentorship' },
        { to: '/documents',  label: 'Documents' },
      ]
    : []

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <div style={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span style={styles.logoText}>CAP<em style={{fontStyle:'italic',color:'var(--amber-dark)'}}>AI</em></span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to} to={to}
              style={{
                ...styles.link,
                ...(pathname === to ? styles.linkActive : {}),
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div style={styles.auth}>
          {user ? (
            <>
              <Link to="/profile" style={styles.greeting}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)' }}>{user.name?.split(' ')[0]}</span>
              </Link>
              <Link to="/feedback" className="btn btn-ghost btn-sm" style={{ color: 'var(--gray-600)' }}>Feedback</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'var(--gray-300)' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm" style={{ color: 'var(--navy)' }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position:   'sticky', top: 0, zIndex: 100,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--gray-200)',
    height: '72px',
  },
  inner: {
    maxWidth:   '1200px', margin: '0 auto', padding: '0 24px',
    height:     '100%', display: 'flex', alignItems: 'center', gap: '24px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  logoMark: { color: 'var(--navy)', display: 'flex', alignItems: 'center' },
  logoText:  { fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: '700', color: 'var(--navy)', letterSpacing: '-0.5px' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    padding: '7px 13px', borderRadius: 'var(--radius-full)', fontSize: '14px', fontWeight: '500',
    color: 'var(--gray-600)', transition: 'var(--transition)',
  },
  linkActive: { color: 'var(--navy)', background: 'var(--gray-200)', fontWeight: '600' },
  auth: { display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 },
  greeting: { display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' },
}
