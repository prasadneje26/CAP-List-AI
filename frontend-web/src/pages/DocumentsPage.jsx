import { useState } from 'react'

const docs = [
  { name:'MHT-CET / JEE Scorecard', note:'Official hall ticket + result printout', required: true },
  { name:'10th Marksheet (SSC)', note:'Original + 2 self-attested copies', required: true },
  { name:'12th Marksheet (HSC)', note:'Original + 2 self-attested copies', required: true },
  { name:'School Leaving Certificate', note:'Original required from last attended school', required: true },
  { name:'Category Certificate', note:'Non-creamy layer certificate if OBC/EWS', required: false },
  { name:'Domicile / Nationality Certificate', note:'Maharashtra domicile is mandatory for state quota', required: true },
  { name:'Aadhaar Card', note:'Self-attested photocopy for identity verification', required: true },
  { name:'Passport Photos', note:'6 recent photos, white background, formal attire', required: true },
  { name:'Migration Certificate', note:'Required only if from another state board', required: false },
  { name:'GAP Certificate', note:'Affidavit on stamp paper if gap year(s) exist', required: false },
]

const TIPS = [
  'Keep all originals in a separate folder — submission requires originals plus copies.',
  'Category certificates must be issued by the competent authority and be non-creamy layer valid.',
  'Check the DTE Maharashtra portal for the exact document verification schedule.',
  'Carry extra passport photos — different colleges may retain a copy during verification.',
]

export default function DocumentsPage() {
  const [checked, setChecked] = useState(() =>
    Object.fromEntries(docs.map((_, i) => [i, false]))
  )

  const toggle = i => setChecked(c => ({ ...c, [i]: !c[i] }))
  const collected = Object.values(checked).filter(Boolean).length

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom:'8px' }}>Document Checklist</h1>
          <p className="text-muted" style={{ fontSize: '16px' }}>Track and prepare all documents required for CAP verification.</p>
        </div>

        {/* Progress bar */}
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '15px', color: 'var(--navy)' }}>
              Collection Progress
            </span>
            <span style={{ fontWeight: 700, color: collected === docs.length ? 'var(--success)' : 'var(--navy)', fontSize: '15px' }}>
              {collected} / {docs.length} documents
            </span>
          </div>
          <div style={{ height: '8px', background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(collected / docs.length) * 100}%`,
              background: collected === docs.length ? 'var(--success)' : 'var(--navy)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease'
            }} />
          </div>
          {collected === docs.length && (
            <div style={{ marginTop: '12px', color: 'var(--success)', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              All documents collected — you are ready for verification!
            </div>
          )}
        </div>

        {/* Document list */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom: '32px' }}>
          {docs.map((d, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                display:'flex', alignItems:'center', gap:'20px',
                padding: '20px 24px', borderRadius: 'var(--radius-md)',
                border: `2px solid ${checked[i] ? 'var(--success)' : 'var(--gray-200)'}`,
                background: checked[i] ? '#ECFDF5' : 'var(--white)',
                cursor:'pointer', textAlign:'left', width:'100%',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)',
              }}>
              {/* Checkbox */}
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                borderRadius: '8px', border: `2px solid ${checked[i] ? 'var(--success)' : 'var(--gray-300)'}`,
                background: checked[i] ? 'var(--success)' : 'var(--white)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--transition)',
              }}>
                {checked[i] && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                )}
              </div>

              {/* Number badge */}
              <div style={{
                width: '36px', height: '36px', flexShrink: 0,
                background: checked[i] ? 'var(--success)' : 'var(--navy)',
                color: 'var(--white)', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '13px',
                transition: 'var(--transition)',
              }}>
                {String(i+1).padStart(2,'0')}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', color: checked[i] ? 'var(--success)' : 'var(--navy)', marginBottom: '3px', textDecoration: checked[i] ? 'line-through' : 'none', transition: 'var(--transition)' }}>
                  {d.name}
                  {!d.required && (
                    <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 600, background: '#FFFBEB', color: 'var(--warning)', border: '1px solid #FCD34D', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}>
                      If applicable
                    </span>
                  )}
                </div>
                <div style={{ fontSize:'13px', color:'var(--gray-500)', fontWeight: 500 }}>{d.note}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
          <h3 style={{ fontSize: '16px', fontFamily: 'var(--font-sans)', fontWeight: '700', color: '#1D4ED8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Important Tips
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '16px' }}>
            {TIPS.map((tip, i) => (
              <li key={i} style={{ fontSize: '14px', color: '#1E40AF', lineHeight: 1.5 }}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
