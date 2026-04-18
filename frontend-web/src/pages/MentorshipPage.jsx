import { useState, useEffect } from 'react'
import api from '../services/api'
import PaymentModal from '../components/PaymentModal.jsx'

const STATUS_CONFIG = {
  confirmed: { bg: 'var(--success-bg)', color: 'var(--success)', border: 'var(--success-border)', label: 'Confirmed' },
  pending:   { bg: 'var(--warning-bg)', color: 'var(--warning)', border: 'var(--warning-border)', label: 'Pending' },
  completed: { bg: 'var(--info-bg)',    color: 'var(--info)',    border: 'var(--info-border)',    label: 'Completed' },
  cancelled: { bg: 'var(--danger-bg)', color: 'var(--danger)', border: 'var(--danger-border)', label: 'Cancelled' },
}

const TOPICS = [
  'CAP strategy', 'TFWS seat maximization', 'Branch vs. college tradeoff',
  'Round 1 vs. Round 2', 'Fee structure guidance', 'Home university advantage',
]

const PLAN_COLORS = {
  free:     { bg: 'var(--gray-50)',   border: 'var(--gray-300)', badge: null, text: 'var(--gray-700)' },
  standard: { bg: '#EFF6FF',          border: 'var(--info)',     badge: 'Most Popular', text: 'var(--info)' },
  pro:      { bg: 'var(--navy)',      border: 'var(--navy)',     badge: 'Best Value',   text: 'var(--white)' },
}

function PlanCard({ plan, selected, onSelect }) {
  const isPro = plan.id === 'pro'
  const isSelected = selected?.id === plan.id

  return (
    <div
      onClick={() => onSelect(plan)}
      style={{
        border: `2px solid ${isSelected ? (isPro ? 'var(--amber)' : 'var(--navy)') : (isPro ? 'rgba(255,255,255,0.2)' : 'var(--gray-200)')}`,
        borderRadius: 16, padding: 20, cursor: 'pointer', position: 'relative',
        background: isPro ? 'var(--navy)' : (isSelected ? 'var(--gray-50)' : 'var(--white)'),
        transition: 'all 0.2s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-xs)',
      }}
    >
      {plan.badge && (
        <div style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          background: isPro ? 'var(--amber)' : 'var(--navy)',
          color: isPro ? 'var(--navy)' : 'var(--white)',
          padding: '2px 12px', borderRadius: 'var(--radius-full)', fontSize: 10,
          fontWeight: 700, letterSpacing: '0.5px', whiteSpace: 'nowrap',
        }}>{plan.badge}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: isPro ? 'var(--white)' : 'var(--navy)', marginBottom: 2 }}>{plan.name}</div>
          <div style={{ fontSize: 12, color: isPro ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)' }}>{plan.description}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: isPro ? 'var(--amber)' : 'var(--navy)', lineHeight: 1 }}>
            {plan.price === 0 ? 'Free' : `₹${plan.price}`}
          </div>
          {plan.price > 0 && <div style={{ fontSize: 10, color: isPro ? 'rgba(255,255,255,0.5)' : 'var(--gray-400)', marginTop: 2 }}>{plan.billing}</div>}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: isPro ? 'rgba(255,255,255,0.8)' : 'var(--gray-600)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isPro ? 'var(--amber)' : 'var(--success)'} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            {f}
          </div>
        ))}
      </div>

      {isSelected && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: isPro ? 'var(--amber)' : 'var(--navy)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          Selected
        </div>
      )}
    </div>
  )
}

export default function MentorshipPage() {
  const [mentors,       setMentors]      = useState([])
  const [sessions,      setSessions]     = useState([])
  const [plans,         setPlans]        = useState([])
  const [form,          setForm]         = useState({ mentor_id: '', session_date: '', topic: '', duration_minutes: 30 })
  const [msg,           setMsg]          = useState({ text: '', type: '' })
  const [loading,       setLoading]      = useState(false)
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [selectedPlan,   setSelectedPlan]   = useState(null)
  const [confirmedPlan,  setConfirmedPlan]  = useState(null) // plan paid/activated
  const [showPayment,    setShowPayment]    = useState(false)
  const [activeTab,      setActiveTab]      = useState('book') // book | sessions

  useEffect(() => {
    api.get('/mentorship/mentors').then(r => setMentors(r.data.data?.mentors || [])).catch(() => {})
    api.get('/mentorship/my').then(r => setSessions(r.data.data?.sessions || [])).catch(() => {})
    api.get('/payment/plans').then(r => setPlans(r.data.data?.plans || [])).catch(() => {})
  }, [])

  const selectMentor = (m) => {
    setSelectedMentor(m)
    setForm(f => ({ ...f, mentor_id: m.id }))
  }

  const handlePlanSelect = (plan) => setSelectedPlan(plan)

  const handleProceedToPayment = () => {
    if (!selectedPlan) return setMsg({ text: 'Please select a plan first.', type: 'error' })
    setMsg({ text: '', type: '' })
    setShowPayment(true)
  }

  const handlePaymentSuccess = (planId, paymentIntentId) => {
    setShowPayment(false)
    setConfirmedPlan({ id: planId, paymentIntentId })
    setMsg({ text: `Plan activated! You can now book your session.`, type: 'success' })
  }

  const book = async e => {
    e.preventDefault()
    if (!confirmedPlan) return setMsg({ text: 'Please select and activate a plan first.', type: 'error' })
    setLoading(true)
    setMsg({ text: '', type: '' })
    try {
      await api.post('/mentorship/book', {
        ...form,
        plan_type: confirmedPlan.id,
        payment_intent_id: confirmedPlan.paymentIntentId,
      })
      setMsg({ text: 'Session booked! Your mentor will confirm shortly.', type: 'success' })
      const r = await api.get('/mentorship/my')
      setSessions(r.data.data?.sessions || [])
      setForm({ mentor_id: '', session_date: '', topic: '', duration_minutes: 30 })
      setSelectedMentor(null)
      setSelectedPlan(null)
      setConfirmedPlan(null)
      setActiveTab('sessions')
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Booking failed. Please try again.', type: 'error' })
    } finally { setLoading(false) }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 36 }} className="animate-fadeIn">
          <div className="section-label">1:1 Guidance</div>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', marginBottom: 10, letterSpacing: '-0.5px' }}>Alumni Mentorship</h1>
          <p className="text-muted" style={{ fontSize: 15, maxWidth: 560 }}>
            Book 1:1 sessions with seniors who got into your target colleges. Real strategy, not guesswork.
          </p>
        </div>

        {/* Mobile tab switcher — hidden above 900px (two-column layout) */}
        <div className="mentorship-tabs" style={{ marginBottom: 28 }}>
          <div className="tabs">
            <button className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`} onClick={() => setActiveTab('book')}>Book Session</button>
            <button className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>
              My Sessions{sessions.length > 0 ? ` (${sessions.length})` : ''}
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="layout-two-col">

          {/* ── LEFT COLUMN ─────────────────────────────────────── */}
          <div className={activeTab === 'sessions' ? 'mobile-tab-hide' : ''}>

            {/* STEP 1 — Pick a Plan */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: confirmedPlan ? 'var(--success)' : 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {confirmedPlan ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : '1'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>Choose Your Plan</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Select a mentorship plan that suits your needs</div>
                </div>
                {confirmedPlan && (
                  <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Activated</span>
                )}
              </div>

              {confirmedPlan ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--success-bg)', borderRadius: 10, border: '1px solid var(--success-border)', marginTop: 12 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--success)' }}>
                      {plans.find(p => p.id === confirmedPlan.id)?.name || confirmedPlan.id} Plan Active
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--success)', opacity: 0.8 }}>You can now book your session below</div>
                  </div>
                  <button onClick={() => { setConfirmedPlan(null); setSelectedPlan(null) }} className="btn btn-sm" style={{ marginLeft: 'auto', color: 'var(--gray-500)', padding: '4px 8px' }}>Change</button>
                </div>
              ) : (
                <>
                  {plans.length === 0 ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
                      <div className="spinner" />
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginTop: 16, marginBottom: 16 }}>
                      {plans.map(p => <PlanCard key={p.id} plan={p} selected={selectedPlan} onSelect={handlePlanSelect} />)}
                    </div>
                  )}

                  {selectedPlan && (
                    <button
                      className={`btn btn-full ${selectedPlan.id === 'pro' ? 'btn-amber' : 'btn-primary'}`}
                      onClick={handleProceedToPayment}
                      style={{ marginTop: 4 }}
                    >
                      {selectedPlan.price === 0 ? (
                        <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Activate Free Session</>
                      ) : (
                        <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Pay ₹{selectedPlan.price} — Continue</>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* STEP 2 — Choose Mentor */}
            <div className="card" style={{ marginBottom: 24, opacity: confirmedPlan ? 1 : 0.55, pointerEvents: confirmedPlan ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: selectedMentor ? 'var(--success)' : 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {selectedMentor ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : '2'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>Choose a Mentor</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Pick a senior who got into your target college</div>
                </div>
              </div>

              {mentors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray-500)', fontSize: 14 }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>👨‍🏫</div>
                  No mentors available yet. Check back soon!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {mentors.map(m => (
                    <div key={m.id} onClick={() => selectMentor(m)}
                      style={{
                        padding: 16, borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s',
                        border: `2px solid ${selectedMentor?.id === m.id ? 'var(--navy)' : 'var(--gray-200)'}`,
                        background: selectedMentor?.id === m.id ? 'var(--navy)' : 'var(--white)',
                      }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: selectedMentor?.id === m.id ? 'rgba(255,183,3,0.2)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: selectedMentor?.id === m.id ? 'var(--amber)' : 'var(--navy)', flexShrink: 0 }}>
                          {m.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: selectedMentor?.id === m.id ? 'var(--white)' : 'var(--navy)', marginBottom: 1 }}>{m.name}</div>
                          <div style={{ fontSize: 11.5, color: selectedMentor?.id === m.id ? 'rgba(255,255,255,0.6)' : 'var(--gray-500)' }}>{m.college || 'Verified Alumni'}</div>
                          {m.branch && <div style={{ fontSize: 11, color: selectedMentor?.id === m.id ? 'var(--amber)' : 'var(--amber-dark)', fontWeight: 600 }}>{m.branch}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* STEP 3 — Book */}
            <div className="card" style={{ opacity: (confirmedPlan && selectedMentor) ? 1 : 0.5, pointerEvents: (confirmedPlan && selectedMentor) ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--navy)' }}>Schedule Your Session</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {selectedMentor ? `Booking with ${selectedMentor.name}` : 'Choose mentor first'}
                  </div>
                </div>
              </div>

              {msg.text && (
                <div className={`alert animate-slideDown ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: 20 }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={book} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Session Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={form.session_date}
                    onChange={e => setForm(f => ({ ...f, session_date: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Discussion Topic *</label>
                  <input
                    value={form.topic}
                    onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                    placeholder="What do you want to discuss?"
                    required
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {TOPICS.map(t => (
                      <button key={t} type="button" onClick={() => setForm(f => ({ ...f, topic: t }))}
                        className="chip" style={{ fontSize: 11.5, padding: '4px 10px' }}
                        data-active={form.topic === t ? 'true' : undefined}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Duration</label>
                  <select value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) }))}>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading
                    ? <><div className="spinner spinner-sm" /> Booking...</>
                    : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Confirm Booking</>
                  }
                </button>
              </form>
            </div>
          </div>

          {/* ── RIGHT COLUMN — My Sessions ──────────────────────── */}
          <div className={`sidebar-sticky ${activeTab === 'book' ? 'mobile-tab-hide' : 'mobile-tab-show'}`}>
            <div className="hide-mobile" style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>
                My Sessions
                {sessions.length > 0 && <span className="badge badge-navy" style={{ marginLeft: 8 }}>{sessions.length}</span>}
              </h3>
            </div>

            {sessions.length === 0 ? (
              <div style={{ padding: '40px 16px', textAlign: 'center', background: 'var(--white)', borderRadius: 16, border: '1px dashed var(--gray-300)' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>No sessions booked yet.<br/>Book your first 1:1 with a mentor!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {sessions.map((s, i) => {
                  const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.pending
                  return (
                    <div key={i} className="card card-sm animate-slideUp" style={{ animationDelay: `${i * 0.08}s`, borderLeft: `4px solid ${sc.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.mentor_name || 'Mentor'}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--gray-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.topic}</div>
                        </div>
                        <span className="badge" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontSize: 9.5, flexShrink: 0, marginLeft: 8 }}>
                          {sc.label}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--gray-500)', fontWeight: 500 }}>
                        📅 {new Date(s.session_date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                      {s.plan_type && s.plan_type !== 'free' && (
                        <span className="badge badge-amber" style={{ marginTop: 8, fontSize: 9 }}>{s.plan_type} plan</span>
                      )}
                      {s.meeting_link && (
                        <a href={s.meeting_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: 10, width: '100%', justifyContent: 'center', textDecoration: 'none' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                          Join Meeting
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  )
}
