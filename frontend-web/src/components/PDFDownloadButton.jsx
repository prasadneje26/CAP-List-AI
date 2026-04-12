// File: frontend-web/src/components/PDFDownloadButton.jsx
import { useState } from 'react'
import api from '../services/api'

export default function PDFDownloadButton() {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    setLoading(true)
    try {
      const res = await api.get('/pdf/download', { responseType: 'blob' })
      const url = URL.createObjectURL(new Blob([res.data], { type:'application/pdf' }))
      const a   = document.createElement('a')
      a.href = url; a.download = 'CAP_Report.pdf'; a.click()
      URL.revokeObjectURL(url)
    } catch { alert('Failed to generate PDF. Run a prediction first.') }
    finally { setLoading(false) }
  }

  return (
    <button onClick={download} className="btn btn-outline" disabled={loading}>
      {loading ? '⟳ Generating…' : '📄 Download PDF Report'}
    </button>
  )
}
