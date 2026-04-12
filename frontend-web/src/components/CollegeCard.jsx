export default function CollegeCard({ college }) {
  const cls = college.classification
  
  let clsStyles = { bg: 'var(--success)', border: 'var(--success)', text: 'var(--navy)' };
  if (cls === 'Dream')  clsStyles = { bg: '#FEF2F2', border: 'var(--danger)', text: 'var(--danger)' };
  if (cls === 'Target') clsStyles = { bg: '#FFFBEB', border: 'var(--warning)', text: 'var(--warning)' };
  if (cls === 'Safe')   clsStyles = { bg: '#ECFDF5', border: 'var(--success)', text: 'var(--success)' };

  return (
    <div className="card card-sm" style={{ borderTop: `4px solid ${clsStyles.border}`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
        <div style={{ paddingRight: '16px' }}>
          <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize:'16px', marginBottom:'4px', color: 'var(--navy)' }}>
            {college.college_name || college.name}
          </h4>
          <div className="text-muted" style={{ fontSize:'13px', fontWeight: 500 }}>{college.branch}</div>
        </div>
        <span className="badge" style={{ backgroundColor: clsStyles.bg, color: clsStyles.text, border: `1px solid ${clsStyles.border}` }}>
          {cls}
        </span>
      </div>

      <div style={{ display:'flex', gap:'20px', flexWrap:'wrap', background: 'var(--gray-100)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
        <Stat label="Cutoff Req." value={`${college.cutoff_percentile}%`} />
        <Stat label="Model Prob." value={college.admission_probability ? `${college.admission_probability}%` : 'N/A'} />
        <Stat label="Variance"    value={college.gap !== undefined ? `${college.gap > 0 ? '+' : ''}${college.gap}` : 'N/A'} 
              color={college.gap > 0 ? 'var(--success)' : (college.gap < 0 ? 'var(--danger)' : 'inherit')} />
        {college.annual_fees && (
          <Stat label="Capital" value={`₹${Math.round(college.annual_fees/1000)}K`} />
        )}
      </div>

      {college.strategy_note && (
        <div style={{ marginTop:'auto', fontSize:'13px', color:'var(--gray-700)', lineHeight:1.5, background: 'rgba(255,183,3,0.1)', padding: '12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--amber)' }}>
          <strong style={{ color: 'var(--navy)', marginRight: '4px' }}>Strategic Directive:</strong>
          {college.strategy_note}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize:'11px', color:'var(--gray-500)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom: '2px', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize:'14px', fontWeight: 700, color: color || 'var(--navy)' }}>{value}</div>
    </div>
  )
}