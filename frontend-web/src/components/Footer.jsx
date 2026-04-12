// ============================================================
// File: frontend-web/src/components/Footer.jsx
// ============================================================

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <span style={styles.brand}>◈ CAPAI</span>
        <span style={styles.copy}>
          Maharashtra Engineering Admission Counseling · For guidance only ·{' '}
          <a href="https://dtemaharashtra.gov.in" target="_blank" rel="noreferrer"
             style={{ color: 'var(--amber)' }}>
            Official DTE Portal ↗
          </a>
        </span>
        <span style={styles.version}>v1.0.0</span>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background:   'rgba(0,0,0,0.3)',
    borderTop:    '1px solid rgba(255,255,255,0.06)',
    height:       '56px',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
    height: '100%', display: 'flex', alignItems: 'center', gap: '16px',
  },
  brand:   { fontFamily: 'var(--font-display)', color: 'var(--amber)', fontSize: '16px' },
  copy:    { fontSize: '12px', color: 'var(--gray-3)', flex: 1, textAlign: 'center' },
  version: { fontSize: '11px', color: 'var(--gray-3)' },
}
