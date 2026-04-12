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
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>Documentation Manifest</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Compile these physical assets prior to verification stage execution.</p>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {docs.map((d, i) => (
            <div key={i} className="card card-sm" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding: '24px' }}>
              <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--navy)', color: 'var(--white)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--navy)', marginBottom: '4px' }}>{d.name}</div>
                  <div className="text-muted" style={{ fontSize:'13px', fontWeight: 500 }}>{d.note}</div>
                </div>
              </div>
              <div style={{ color: 'var(--gray-300)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}