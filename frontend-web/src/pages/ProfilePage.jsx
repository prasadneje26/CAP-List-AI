import { useAuth } from '../context/AuthContext.jsx'
import { Link }    from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuth()
  
  return (
    <div className="page">
      <div className="container" style={{ maxWidth:'600px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>User Identity</h1>
          <p className="text-muted">Manage system access and authentication context.</p>
        </div>
        
        <div className="card" style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <Row label="Account Name"  value={user?.name || 'Unregistered'} />
          <Row label="Primary Email" value={user?.email || 'N/A'} />
          <Row label="Access Role"  value={user?.role || 'Standard'} />
          
          <div style={{ height: '1px', background: 'var(--gray-200)', margin: '8px 0' }}></div>
          
          <Link to="/input" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
            Modify Academic Parameters
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.5px', color: 'var(--gray-500)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '15px' }}>{value}</span>
    </div>
  )
}