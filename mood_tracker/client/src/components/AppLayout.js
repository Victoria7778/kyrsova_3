import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!token) {
    return (
      <main style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8f9ff' }}>
        {children}
      </main>
    );
  }

  return (
    <div style={layoutStyles.wrapper}>
      <Sidebar />
      <main style={layoutStyles.mainContent}>
        {children}
      </main>
    </div>
  );
};

const layoutStyles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9ff', 
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    overflowX: 'hidden', 
  }
};

export default AppLayout;