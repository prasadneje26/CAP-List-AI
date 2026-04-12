// ============================================================
// File: frontend-web/src/components/CollegeCard.jsx
// ============================================================

export default function CollegeCard({ college }) {
  const cls = college.classification
  const clsColor = cls === 'Dream' ? '#f87171' : cls === 'Target' ? '#fbbf24' : '#4ade80'

  return (
    <div className="card card-sm" style={{ borderLeft: `3px solid ${clsColor}`, transition:'transform 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
        <div>
          <div style={{ fontWeight:600, fontSize:'14px', marginBottom:'2px' }}>{college.college_name || college.name}</div>
          <div className="text-muted" style={{ fontSize:'12px' }}>{college.branch}</div>
        </div>
        <span className={`badge badge-${cls?.toLowerCase()}`}>{cls}</span>
      </div>

      <div style={{ display:'flex', gap:'16px', flexWrap:'wrap' }}>
        <Stat label="Cutoff" value={`${college.cutoff_percentile}%`} />
        <Stat label="Chance" value={college.admission_probability ? `${college.admission_probability}%` : '—'} />
        <Stat label="Gap"    value={college.gap !== undefined ? `${college.gap > 0 ? '+' : ''}${college.gap}` : '—'} />
        {college.rating && <Stat label="Rating" value={`${college.rating}/10`} />}
        {college.annual_fees && (
          <Stat label="Fees" value={`₹${Math.round(college.annual_fees/1000)}K/yr`} />
        )}
      </div>

      {college.strategy_note && (
        <p style={{ marginTop:'10px', fontSize:'12px', color:'var(--gray-2)', lineHeight:1.5, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'10px' }}>
          {college.strategy_note}
        </p>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:'10px', color:'var(--gray-3)', textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
      <div style={{ fontSize:'13px', fontWeight:600 }}>{value}</div>
    </div>
  )
}
