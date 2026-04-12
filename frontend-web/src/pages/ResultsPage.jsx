// ============================================================
// File: frontend-web/src/pages/ResultsPage.jsx
// ============================================================

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
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1>Your CAP List</h1>
            <p className="text-muted">{predictions.length} colleges in your preference order</p>
          </div>
          <PDFDownloadButton />
        </div>

        <div style={{ display:'flex', gap:'12px', marginBottom:'24px', alignItems:'center', flexWrap:'wrap' }}>
          <div className="tabs" style={{ maxWidth:'360px' }}>
            {['all','Dream','Target','Safe'].map(f => (
              <button key={f} className={`tab-btn ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f==='all'?'All':f}
              </button>
            ))}
          </div>
          <span className="text-muted" style={{ fontSize:'13px' }}>{shown.length} shown</span>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px', color:'var(--gray-2)' }}>
            No results yet. Run a prediction from the Dashboard.
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {shown.map((p, i) => (
              <div key={i} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                <div style={{ minWidth:'32px', paddingTop:'18px', textAlign:'right', color:'var(--gray-3)', fontSize:'13px', fontWeight:600 }}>
                  {p.cap_order}
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
