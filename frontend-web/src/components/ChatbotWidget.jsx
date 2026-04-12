import { useState, useRef, useEffect } from 'react'
import { chatbotService } from '../services/chatbotService'

export default function ChatbotWidget() {
  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState([{ role:'assistant', content:'Counseling Interface Active. State your admission parameters or query.' }])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, open])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = { role:'user', content: input }
    setMsgs(m => [...m, userMsg])
    setInput(''); setLoading(true)
    try {
      const res = await chatbotService.ask(input, msgs)
      setMsgs(m => [...m, { role:'assistant', content: res.response }])
    } catch {
      setMsgs(m => [...m, { role:'assistant', content:'Network latency detected. Unable to reach language model. Please retry.' }])
    } finally { setLoading(false) }
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={fab}>
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {open && (
        <div style={chatWindow}>
          <div style={chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
              <strong style={{ color: 'var(--white)', fontSize: '15px' }}>CAP Oracle Bot</strong>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--gray-400)', cursor: 'pointer' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={msgList}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom:'16px' }}>
                <div style={{
                  maxWidth:'85%', padding:'12px 16px', borderRadius:'12px', fontSize:'14px', lineHeight:1.5,
                  background: m.role === 'user' ? 'var(--navy)' : 'var(--gray-100)',
                  color: m.role === 'user' ? 'var(--white)' : 'var(--navy)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--gray-200)',
                  borderBottomRightRadius: m.role === 'user' ? '4px' : '12px',
                  borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '12px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:'flex', gap:'6px', padding:'12px', background: 'var(--gray-100)', borderRadius: '12px', borderBottomLeftRadius: '4px', width: 'fit-content', border: '1px solid var(--gray-200)' }}>
                {[0,1,2].map(i => <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'var(--navy)', opacity: 0.5, animation:`bounce 1s ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={inputRow}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Query parameters..."
              style={{ flex:1, background:'var(--gray-100)', border:'1px solid var(--gray-300)', borderRadius:'var(--radius-sm)', color:'var(--navy)', padding:'10px 14px', fontSize:'14px', fontFamily: 'var(--font-sans)', outline: 'none' }}
            />
            <button onClick={send} disabled={loading} className="btn btn-primary" style={{ padding: '0 16px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </>
  )
}

const fab = {
  position:'fixed', bottom:'32px', right:'32px', zIndex:200,
  width:'60px', height:'60px', borderRadius:'50%',
  background:'var(--navy)', color:'var(--white)',
  border:'none', cursor:'pointer',
  boxShadow:'var(--shadow-lg)',
  display:'flex', alignItems:'center', justifyContent:'center',
  transition: 'var(--transition)'
}
const chatWindow = {
  position:'fixed', bottom:'108px', right:'32px', zIndex:200,
  width:'380px', height:'540px',
  background:'var(--white)', border:'1px solid var(--gray-300)',
  borderRadius:'var(--radius-lg)', boxShadow:'0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  display:'flex', flexDirection:'column', overflow:'hidden',
}
const chatHeader = {
  padding:'16px 20px', background:'var(--navy)',
  display:'flex', justifyContent:'space-between', alignItems:'center',
}
const msgList = {
  flex:1, overflowY:'auto', padding:'20px',
  background: 'var(--white)'
}
const inputRow = {
  padding:'16px', borderTop:'1px solid var(--gray-200)',
  display:'flex', gap:'8px', background: 'var(--white)'
}