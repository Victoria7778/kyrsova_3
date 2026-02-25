
export const sharedStyles = {
  container: { 
    padding: '40px 30px 40px 30px', 
    flex: 0.8, 
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '100vh',
    overflowX: 'hidden', 
    backgroundColor: 'transparent'
  },
  
  header: { 
    marginBottom: '35px', 
    width: '100%',
    textAlign: 'left'
  },

  title: { 
    color: '#2c3e50', 
    margin: 0, 
    fontWeight: '800', 
    fontSize: '28px',
    letterSpacing: '-0.5px'
  },

  subtitle: { 
    color: '#95a5a6', 
    marginTop: '6px',
    fontSize: '15px'
  },

  contentLayout: { 
    display: 'grid', 
  
    gridTemplateColumns: 'minmax(320px, 360px) 1fr minmax(300px, 340px)', 
    gap: '25px', 
    width: '100%',
    alignItems: 'flex-start',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 10px 30px rgba(157, 141, 241, 0.08)',
    padding: '20px',
    boxSizing: 'border-box'
  },

  calendarCard: {
    width: '100%',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
  },

  physCard: {
    padding: '25px',
    minHeight: '520px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  tileDot: { 
    width: '6px', 
    height: '6px', 
    backgroundColor: '#9d8df1', 
    borderRadius: '50%', 
    margin: '6px auto 0',
    boxShadow: '0 0 8px rgba(157, 141, 241, 0.4)'
  },

  symptomTag: { 
    backgroundColor: '#f3f0ff', 
    color: '#9d8df1', 
    padding: '6px 14px', 
    borderRadius: '12px', 
    fontSize: '13px', 
    fontWeight: '600',
    display: 'inline-block'
  },

  // Службові тексти в картках
  cardLabel: { 
    fontSize: '11px', 
    fontWeight: '800', 
    color: '#b2bec3', 
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};