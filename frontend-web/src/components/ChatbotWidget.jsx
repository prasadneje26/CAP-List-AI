import { useState, useRef, useEffect } from 'react'
import { chatbotService } from '../services/chatbotService'

const QUICK_CHIPS = [
  'What cutoff can I expect for CS at COEP?',
  'Am I eligible for TFWS seat?',
  'Best colleges for 90 percentile OBC?',
  'How does CAP round preference work?',
  'Difference between aided and unaided colleges?',
]

export default function ChatbotWidget() {
  const [open,    setOpen]    = useState(false)
  const [msgs,    setMsgs]    = useState([
    { role: 'assistant', content: 'Hi! I\'m your CAP counselor 👋\nAsk me anything about Maharashtra engineering admissions — cutoffs, categories, strategy, or specific colleges.' }
  ])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showChips, setShowChips] = useState(true)
  const endRef   = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, open])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100) }, [open])

  const send = async (text) => {
    const content = text || input.trim()
    if (!content || loading) return
    setShowChips(false)
    const userMsg = { role: 'user', content }
    setMsgs(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await chatbotService.ask(content, msgs)
      setMsgs(m => [...m, { role: 'assistant', content: res.response }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Unable to connect to the AI server right now. Please try again in a moment.' }])
    } finally { setLoading(false) }
  }

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const reset = () => {
    setMsgs([{ role: 'assistant', content: 'Hi! I\'m your CAP counselor 👋\nAsk me anything about Maharashtra engineering admissions.' }])
    setShowChips(true)
    setInput('')
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 200,
          width: 58, height: 58, borderRadius: '50%',
          background: open ? 'var(--gray-700)' : 'var(--navy)',
          color: 'var(--white)', border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(10,25,47,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: open ? 'rotate(45deg)' : 'none',
        }}
        title="AI Counselor"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>

      {/* Unread badge when closed */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: 76, right: 26, zIndex: 201,
          width: 16, height: 16, borderRadius: '50%',
          background: 'var(--success)', border: '2px solid var(--white)',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      )}

      {/* Chat window */}
      {open && (
        <div className="animate-scale" style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 200,
          width: 390, height: 560,
          background: 'var(--white)', border: '1px solid var(--gray-200)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 40px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px', background: 'var(--navy)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)' }}>CAP AI Counselor</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Active · Powered by AI</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={reset} title="New chat" style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4, borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              </button>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4, borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--gray-50)' }}>
            {msgs.map((m, i) => (
              <div key={i} className="animate-slideUp" style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8 }}>
                {m.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, marginTop: 4 }}>
                    🤖
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  borderRadius: 14, fontSize: 13.5, lineHeight: 1.55,
                  background: m.role === 'user' ? 'var(--navy)' : 'var(--white)',
                  color: m.role === 'user' ? 'var(--white)' : 'var(--gray-800)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--gray-200)',
                  borderBottomRightRadius: m.role === 'user' ? 4 : 14,
                  borderBottomLeftRadius: m.role === 'assistant' ? 4 : 14,
                  boxShadow: 'var(--shadow-xs)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
                <div style={{
                  padding: '12px 16px', background: 'var(--white)', borderRadius: 14, borderBottomLeftRadius: 4,
                  border: '1px solid var(--gray-200)', display: 'flex', gap: 5, alignItems: 'center',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--navy)', opacity: 0.5, display: 'block' }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick chips */}
            {showChips && msgs.length === 1 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Quick questions</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {QUICK_CHIPS.map((chip, i) => (
                    <button key={i} onClick={() => send(chip)} style={{
                      padding: '6px 12px', borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--gray-300)', background: 'var(--white)',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer', color: 'var(--gray-700)',
                      transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = 'var(--navy)'; e.target.style.color = 'var(--navy)' }}
                    onMouseLeave={e => { e.target.style.borderColor = 'var(--gray-300)'; e.target.style.color = 'var(--gray-700)' }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 14px', borderTop: '1px solid var(--gray-200)',
            display: 'flex', gap: 8, background: 'var(--white)', flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask about colleges, cutoffs, strategy..."
              style={{
                flex: 1, background: 'var(--gray-100)', border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)', color: 'var(--navy)',
                padding: '9px 14px', fontSize: 13.5, fontFamily: 'var(--font-sans)', outline: 'none',
                transition: 'var(--transition)',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--navy)'; e.target.style.background = 'var(--white)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--gray-200)'; e.target.style.background = 'var(--gray-100)' }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '0 14px', borderRadius: 10, flexShrink: 0 }}
            >
              {loading ? (
                <div className="spinner spinner-sm" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
