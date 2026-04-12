export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <span style={styles.brand}>CAP<em style={{fontStyle:'italic',color:'var(--amber-dark)'}}>AI</em></span>
        <span style={styles.copy}>
          Maharashtra Engineering Admission Counseling · For guidance only ·{' '}
          <a href="https://dtemaharashtra.gov.in" target="_blank" rel="noreferrer"
             style={{ color: 'var(--navy)', fontWeight: '500', textDecoration: 'underline', textDecorationColor: 'var(--gray-400)' }}>
            Official DTE Portal
          </a>
        </span>
        <span style={styles.version}>v1.0.0</span>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background:   'var(--white)',
    borderTop:    '1px solid var(--gray-200)',
    padding:      '32px 0',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
    display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
  },
  brand:   { fontFamily: 'var(--font-display)', color: 'var(--navy)', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' },
  copy:    { fontSize: '14px', color: 'var(--gray-600)', flex: 1, textAlign: 'center' },
  version: { fontSize: '13px', color: 'var(--gray-400)' },
}