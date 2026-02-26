import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('userRole')
  });

  useEffect(() => {
    const updateAuth = () => {
      setAuthStatus({
        token: localStorage.getItem('token'),
        role: localStorage.getItem('userRole')
      });
    };

    window.addEventListener('storage', updateAuth);
    const interval = setInterval(updateAuth, 1000); 

    return () => {
      window.removeEventListener('storage', updateAuth);
      clearInterval(interval);
    };
  }, []);

  if (!authStatus.token) {
    return (
      <main style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8f9ff' }}>
        {children}
      </main>
    );
  }

  return (
    <div style={layoutStyles.wrapper}>
      <Sidebar userRole={authStatus.role} />
      <main style={layoutStyles.mainContent}>
        {children}
      </main>
    </div>
  );
};

const layoutStyles = {
  wrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9ff' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowX: 'hidden' }
};

export default AppLayout;