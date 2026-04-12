// ============================================================
// File: frontend-web/src/components/ChatbotWidget.jsx
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { chatbotService } from '../services/chatbotService'

export default function ChatbotWidget() {
  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState([{ role:'assistant', content:'Hi! I\'m your CAP counselor. Ask me anything about Maharashtra admissions.' }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content: input }
    setMsgs(m => [...m, userMsg])
    setInput(''); setLoading(true)
    try {
      const res = await chatbotService.ask(input, msgs)
      setMsgs(m => [...m, { role:'assistant', content: res.response }])
    } catch {
      setMsgs(m => [...m, { role:'assistant', content:'Sorry, I\'m having trouble connecting. Try again in a moment.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* FAB button */}
      <button onClick={() => setOpen(o => !o)} style={fab}>
        {open ? '✕' : '🤖'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={chatWindow}>
          <div style={chatHeader}>
            <strong>AI CAP Counselor</strong>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>Online</span>
          </div>

          <div style={msgList}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom:'10px' }}>
                <div style={{
                  maxWidth:'80%', padding:'10px 14px', borderRadius:'12px', fontSize:'13px', lineHeight:1.5,
                  background: m.role === 'user' ? 'var(--amber)' : 'rgba(255,255,255,0.08)',
                  color: m.role === 'user' ? 'var(--navy)' : 'var(--white)',
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:'4px', padding:'10px 14px' }}>
                {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--gray-2)', animation:`bounce 1s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={inputRow}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about cutoffs, CAP rounds…"
              style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'6px', color:'var(--white)', padding:'9px 12px', fontSize:'13px' }}
            />
            <button onClick={send} disabled={loading} className="btn btn-primary btn-sm">
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>
    </>
  )
}

const fab = {
  position:'fixed', bottom:'28px', right:'28px', zIndex:200,
  width:'52px', height:'52px', borderRadius:'50%',
  background:'var(--amber)', color:'var(--navy)',
  border:'none', fontSize:'22px', cursor:'pointer',
  boxShadow:'0 4px 20px rgba(245,166,35,0.4)',
  display:'flex', alignItems:'center', justifyContent:'center',
}
const chatWindow = {
  position:'fixed', bottom:'92px', right:'28px', zIndex:200,
  width:'340px', height:'480px',
  background:'var(--navy-card)', border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:'16px', boxShadow:'0 16px 48px rgba(0,0,0,0.5)',
  display:'flex', flexDirection:'column', overflow:'hidden',
}
const chatHeader = {
  padding:'14px 16px', background:'var(--navy-mid)',
  display:'flex', justifyContent:'space-between', alignItems:'center',
  borderBottom:'1px solid rgba(255,255,255,0.07)',
}
const msgList = {
  flex:1, overflowY:'auto', padding:'14px',
}
const inputRow = {
  padding:'10px', borderTop:'1px solid rgba(255,255,255,0.07)',
  display:'flex', gap:'8px',
}
