// File: frontend-web/src/pages/ProfilePage.jsx
import { useAuth } from '../context/AuthContext.jsx'
import { Link }    from 'react-router-dom'
export default function ProfilePage() {
  const { user } = useAuth()
  return (
    <div className="page"><div className="container" style={{ maxWidth:'600px' }}>
      <h1 style={{ marginBottom:'24px' }}>Your Profile</h1>
      <div className="card" style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
        <Row label="Name"  value={user?.name} />
        <Row label="Email" value={user?.email} />
        <Row label="Role"  value={user?.role} />
        <hr className="divider" />
        <Link to="/input" className="btn btn-primary">Edit Academic Profile →</Link>
      </div>
    </div></div>
  )
}
function Row({ label, value }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span className="text-muted" style={{ fontSize:'13px', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</span>
      <span style={{ fontWeight:500 }}>{value}</span>
    </div>
  )
}
