// File: frontend-web/src/pages/DocumentsPage.jsx
const docs = [
  { name:'MHT-CET / JEE Scorecard', note:'Official hall ticket + result' },
  { name:'10th Marksheet (SSC)', note:'Original + 2 self-attested copies' },
  { name:'12th Marksheet (HSC)', note:'Original + 2 copies' },
  { name:'School Leaving Certificate', note:'Original required' },
  { name:'Category Certificate', note:'Non-creamy layer if OBC/EWS' },
  { name:'Domicile / Nationality Certificate', note:'Maharashtra domicile mandatory' },
  { name:'Aadhaar Card', note:'For identity verification' },
  { name:'Passport Photos', note:'6 recent photos, white background' },
  { name:'Migration Certificate', note:'If from another board' },
  { name:'GAP Certificate', note:'If applicable — affidavit on stamp paper' },
]
export default function DocumentsPage() {
  return (
    <div className="page"><div className="container">
      <h1 style={{ marginBottom:'8px' }}>Required Documents</h1>
      <p className="text-muted" style={{ marginBottom:'32px' }}>Keep these ready before CAP rounds begin.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {docs.map((d, i) => (
          <div key={i} className="card card-sm" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
              <span style={{ color:'var(--amber)', fontWeight:700 }}>{String(i+1).padStart(2,'0')}</span>
              <div>
                <div style={{ fontWeight:500 }}>{d.name}</div>
                <div className="text-muted" style={{ fontSize:'12px' }}>{d.note}</div>
              </div>
            </div>
            <span style={{ fontSize:'18px' }}>✓</span>
          </div>
        ))}
      </div>
    </div></div>
  )
}
