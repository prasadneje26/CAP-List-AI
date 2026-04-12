import { useState, useEffect } from 'react'
import { predictionService } from '../services/predictionService'
import CollegeCard from '../components/CollegeCard.jsx'
import PDFDownloadButton from '../components/PDFDownloadButton.jsx'

export default function ResultsPage() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('all')

  useEffect(() => {
    predictionService.getHistory()
      .then(r => setPredictions(r.data?.predictions || []))
      .catch(() => setPredictions([]))
      .finally(() => setLoading(false))
  }, [])

  const shown = filter === 'all' ? predictions : predictions.filter(p => p.classification === filter)

  return (
    <div className="page">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Optimized CAP Sequence</h1>
            <p className="text-muted" style={{ fontSize: '15px' }}>Strictly ordered vector of {predictions.length} institutions based on maximum yield probability.</p>
          </div>
          <PDFDownloadButton />
        </div>

        <div style={{ display:'flex', gap:'16px', marginBottom:'32px', alignItems:'center', flexWrap:'wrap', background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="tabs" style={{ maxWidth:'400px', flex: 1 }}>
            {['all','Dream','Target','Safe'].map(f => (
              <button key={f} className={`tab-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f==='all'?'Master Sequence':f}
              </button>
            ))}
          </div>
          <div style={{ fontSize:'14px', fontWeight: 600, color: 'var(--navy)', background: 'var(--gray-100)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }}>
            Showing {shown.length} records
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--gray-300)' }}>
            <p style={{ color:'var(--gray-500)', fontSize: '16px' }}>Empty result matrix. Execute a diagnostic sequence from the Dashboard.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            {shown.map((p, i) => (
              <div key={i} style={{ display:'flex', gap:'20px', alignItems:'stretch' }}>
                <div style={{ 
                  width:'48px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{ 
                    width: '32px', height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--navy)', color: 'var(--white)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700,
                    marginTop: '20px',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    {p.cap_order}
                  </div>
                  {i !== shown.length - 1 && <div style={{ flex: 1, width: '2px', background: 'var(--gray-200)', marginTop: '8px' }}></div>}
                </div>
                <div style={{ flex:1 }}>
                  <CollegeCard college={{ ...p, college_name: p.college_name }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}