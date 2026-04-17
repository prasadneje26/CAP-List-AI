import { useState } from 'react'

const CLS_CONFIG = {
  Dream:  { bg: '#FEF2F2', border: '#EF4444', text: '#EF4444', stroke: '#EF4444', label: 'Dream' },
  Target: { bg: '#FFFBEB', border: '#F59E0B', text: '#F59E0B', stroke: '#F59E0B', label: 'Target' },
  Safe:   { bg: '#ECFDF5', border: '#10B981', text: '#10B981', stroke: '#10B981', label: 'Safe' },
}

function ProbabilityRing({ probability }) {
  const pct   = Math.min(95, Math.max(5, probability || 0))
  const r      = 28
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  const color  = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444'

  return (
    <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
      <svg width="68" height="68" className="prob-ring">
        <circle className="prob-ring-track" cx="34" cy="34" r={r} strokeWidth="5" />
        <circle
          className="prob-ring-fill" cx="34" cy="34" r={r} strokeWidth="5"
          stroke={color}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1 }}>{pct}%</span>
        <span style={{ fontSize: 9, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 }}>prob</span>
      </div>
    </div>
  )
}

export default function CollegeCard({ college }) {
  const [expanded, setExpanded] = useState(false)
  const cls = college.classification
  const cfg = CLS_CONFIG[cls] || CLS_CONFIG.Safe
  const gap = college.gap !== undefined ? parseFloat(college.gap).toFixed(2) : null

  return (
    <div
      className="card card-sm card-hover animate-slideUp"
      style={{
        borderTop: `4px solid ${cfg.border}`,
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'all 0.25s ease',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>
              {cls}
            </span>
            {college.college_type && (
              <span className="badge badge-gray" style={{ fontSize: 10 }}>{college.college_type}</span>
            )}
          </div>
          <h4 style={{
            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15,
            color: 'var(--navy)', lineHeight: 1.3, marginBottom: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {college.college_name || college.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="text-muted" style={{ fontSize: 13, fontWeight: 500 }}>{college.branch}</span>
            {college.location && (
              <>
                <span style={{ color: 'var(--gray-300)' }}>·</span>
                <span style={{ fontSize: 12, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {college.location}
                </span>
              </>
            )}
          </div>
        </div>
        <ProbabilityRing probability={college.admission_probability} />
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'flex', gap: 0, background: 'var(--gray-50)',
        borderRadius: 'var(--radius-sm)', marginTop: 14, overflow: 'hidden',
        border: '1px solid var(--gray-200)',
      }}>
        <StatCell label="Cutoff" value={`${college.cutoff_percentile}%`} />
        <StatCell
          label="Gap"
          value={gap !== null ? `${gap > 0 ? '+' : ''}${gap}` : '—'}
          color={gap > 0 ? 'var(--success)' : gap < 0 ? 'var(--danger)' : undefined}
          border
        />
        {college.annual_fees && (
          <StatCell label="Fees/yr" value={`₹${Math.round(college.annual_fees / 1000)}K`} border />
        )}
        {college.rating && (
          <StatCell label="Rating" value={`${Number(college.rating).toFixed(1)}★`} border />
        )}
      </div>

      {/* Strategy note */}
      {college.strategy_note && (
        <div style={{
          marginTop: 12, fontSize: 12.5, color: 'var(--gray-700)', lineHeight: 1.55,
          background: 'rgba(255,183,3,0.08)', padding: '10px 12px',
          borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--amber)',
        }}>
          <strong style={{ color: 'var(--navy)', marginRight: 4 }}>Strategy:</strong>
          {college.strategy_note}
        </div>
      )}

      {/* Expanded details */}
      {expanded && (
        <div className="animate-slideDown" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--gray-200)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {college.university && (
              <DetailItem icon="🏛️" label="University" value={college.university} />
            )}
            {college.code && (
              <DetailItem icon="🔢" label="DTE Code" value={college.code} />
            )}
            {college.total_seats && (
              <DetailItem icon="🪑" label="Seats" value={college.total_seats} />
            )}
            {college.placement_score && (
              <DetailItem icon="💼" label="Placement" value={`${Number(college.placement_score).toFixed(0)}%`} />
            )}
            {college.is_autonomous !== undefined && (
              <DetailItem icon="🎓" label="Autonomous" value={college.is_autonomous ? 'Yes' : 'No'} />
            )}
            {college.category && (
              <DetailItem icon="🏷️" label="Category" value={college.category} />
            )}
          </div>
          {college.website && (
            <a
              href={college.website.startsWith('http') ? college.website : `https://${college.website}`}
              target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13, fontWeight: 600, color: 'var(--navy)', textDecoration: 'underline' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Visit Website
            </a>
          )}
        </div>
      )}

      {/* Expand hint */}
      <div style={{ marginTop: 10, textAlign: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500 }}>
          {expanded ? '▲ Less info' : '▼ More details'}
        </span>
      </div>
    </div>
  )
}

function StatCell({ label, value, color, border }) {
  return (
    <div style={{
      flex: 1, padding: '8px 10px', textAlign: 'center',
      borderLeft: border ? '1px solid var(--gray-200)' : 'none',
    }}>
      <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: color || 'var(--navy)' }}>{value}</div>
    </div>
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{value}</div>
      </div>
    </div>
  )
}
