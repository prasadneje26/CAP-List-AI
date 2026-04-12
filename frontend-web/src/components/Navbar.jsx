// ============================================================
// File: frontend-web/src/components/Navbar.jsx
// ============================================================

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()
  const navigate         = useNavigate()
  const [open, setOpen]  = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const navLinks = user
    ? [
        { to: '/dashboard',  label: 'Dashboard' },
        { to: '/input',      label: 'My Profile' },
        { to: '/results',    label: 'Results' },
        { to: '/mentorship', label: 'Mentorship' },
        { to: '/documents',  label: 'Documents' },
      ]
    : []

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoMark}>◈</span>
          <span style={styles.logoText}>CAP<em style={{fontStyle:'italic',color:'var(--amber)'}}>AI</em></span>
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
              <span style={styles.greeting}>Hi, {user.name?.split(' ')[0]}</span>
              <Link to="/feedback" className="btn btn-ghost btn-sm">Feedback</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign in</Link>
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
    background: 'rgba(13,27,42,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    height: '64px',
  },
  inner: {
    maxWidth:   '1200px', margin: '0 auto', padding: '0 24px',
    height:     '100%', display: 'flex', alignItems: 'center', gap: '32px',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 },
  logoMark: { color: 'var(--amber)', fontSize: '20px' },
  logoText:  { fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '400' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    padding: '6px 12px', borderRadius: '6px', fontSize: '14px',
    color: 'var(--gray-2)', transition: 'var(--transition)',
  },
  linkActive: { color: 'var(--white)', background: 'rgba(255,255,255,0.08)' },
  auth: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' },
  greeting: { fontSize: '13px', color: 'var(--gray-2)', marginRight: '4px' },
}
