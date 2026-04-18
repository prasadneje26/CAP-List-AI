import { useState } from 'react'
import api from '../services/api'

const CARD_ICONS = {
  visa: '💳',
  mastercard: '💳',
  default: '💳',
}

function formatCard(value) {
  return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
}

function formatExpiry(value) {
  const v = value.replace(/\D/g, '').slice(0, 4)
  return v.length >= 3 ? `${v.slice(0,2)}/${v.slice(2)}` : v
}

export default function PaymentModal({ plan, onSuccess, onClose }) {
  const [step, setStep] = useState('confirm') // confirm | form | processing | done
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [error, setError] = useState('')

  const handlePay = async () => {
    setError('')
    if (plan.price > 0) {
      if (!card.name.trim()) return setError('Please enter the cardholder name')
      const raw = card.number.replace(/\s/g, '')
      if (raw.length < 13) return setError('Please enter a valid card number')
      if (card.expiry.length < 5) return setError('Please enter a valid expiry date')
      if (card.cvv.length < 3) return setError('Please enter a valid CVV')
    }

    setStep('processing')
    try {
      const { data: intentData } = await api.post('/payment/create-intent', { plan_id: plan.id, amount: plan.price })

      if (intentData.data.simulated) {
        // Simulate slight delay for demo
        await new Promise(r => setTimeout(r, 1800))
        await api.post('/payment/confirm', {
          payment_intent_id: intentData.data.payment_intent_id || 'free',
          plan_id: plan.id,
        })
        setStep('done')
        setTimeout(() => onSuccess(plan.id, intentData.data.payment_intent_id || 'free'), 1200)
      } else {
        // Real Stripe flow would go here
        // For now treat as simulated
        await new Promise(r => setTimeout(r, 1800))
        setStep('done')
        setTimeout(() => onSuccess(plan.id, intentData.data.payment_intent_id), 1200)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
      setStep('form')
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box animate-scale">
        {/* Header */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--gray-200)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="section-label" style={{ marginBottom: 4 }}>Payment</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>
              {plan.name} Plan
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--gray-100)', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-600)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Processing state */}
        {step === 'processing' && (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 20px', width: 48, height: 48, borderWidth: 4 }} />
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--navy)', marginBottom: 8 }}>
              {plan.price === 0 ? 'Activating your free session...' : 'Processing payment...'}
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>Please wait, do not close this window</div>
          </div>
        )}

        {/* Done state */}
        {step === 'done' && (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', border: '2px solid var(--success-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--navy)', marginBottom: 8 }}>
              {plan.price === 0 ? 'Free session activated!' : 'Payment successful!'}
            </div>
            <div style={{ color: 'var(--gray-500)', fontSize: 14 }}>You can now book your mentorship session.</div>
          </div>
        )}

        {/* Confirm / form state */}
        {(step === 'confirm' || step === 'form') && (
          <div style={{ padding: 24 }}>
            {/* Plan summary */}
            <div style={{ background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{plan.name} Plan</div>
                  <div style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 2 }}>{plan.description}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--navy)' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </div>
                  {plan.price > 0 && (
                    <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>{plan.billing}</div>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: 16, padding: '10px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Card form for paid plans */}
            {plan.price > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>CARD DETAILS</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
                </div>

                <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: 'var(--white)', border: '1.5px solid var(--gray-300)', borderRadius: 10, padding: '0 12px', alignItems: 'center', height: 48 }}>
                  <span style={{ fontSize: 18 }}>💳</span>
                  <input
                    type="text" inputMode="numeric" placeholder="Card number"
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    maxLength={19}
                    style={{ border: 'none', outline: 'none', flex: 1, fontSize: 15, fontFamily: 'monospace', letterSpacing: 1, background: 'transparent', color: 'var(--gray-900)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray-300)', borderRadius: 10, padding: '0 12px', height: 44, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text" inputMode="numeric" placeholder="MM/YY"
                      value={card.expiry}
                      onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                      maxLength={5}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, background: 'transparent', color: 'var(--gray-900)' }}
                    />
                  </div>
                  <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray-300)', borderRadius: 10, padding: '0 12px', height: 44, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text" inputMode="numeric" placeholder="CVV"
                      value={card.cvv}
                      onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
                      maxLength={4}
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, background: 'transparent', color: 'var(--gray-900)' }}
                    />
                  </div>
                </div>

                <div style={{ background: 'var(--white)', border: '1.5px solid var(--gray-300)', borderRadius: 10, padding: '0 12px', height: 44, display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <input
                    type="text" placeholder="Name on card"
                    value={card.name}
                    onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, background: 'transparent', color: 'var(--gray-900)' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--gray-500)', fontSize: 12 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Secured by 256-bit SSL encryption
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                    <span style={{ background: 'var(--info-bg)', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700, color: 'var(--info)' }}>VISA</span>
                    <span style={{ background: '#FFF3E0', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700, color: '#E65100' }}>MC</span>
                    <span style={{ background: '#F3E5F5', borderRadius: 4, padding: '1px 5px', fontSize: 10, fontWeight: 700, color: '#7B1FA2' }}>AMEX</span>
                  </span>
                </div>

                {process.env.NODE_ENV !== 'production' && (
                  <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 8, padding: '8px 12px', marginTop: 12, fontSize: 12, color: '#92400E' }}>
                    🧪 <strong>Demo Mode:</strong> Payment is simulated. No real charges will be made. Use any card details.
                  </div>
                )}
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={handlePay}
              style={{ justifyContent: 'center' }}
            >
              {plan.price === 0 ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Activate Free Session
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Pay ₹{plan.price}
                </>
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 10 }}>
              By proceeding you agree to our Terms of Service.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
