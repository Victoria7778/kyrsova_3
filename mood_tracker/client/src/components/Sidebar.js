import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Ви впевнені, що хочете вийти?")) {
      localStorage.clear();
      navigate('/login');
      window.location.reload(); // Щоб скинути всі стейти додатка
    }
  };

  const menuItems = [
    { name: 'Головна', path: '/', icon: '🏠' },
    { name: 'Мій стан', path: '/add-mood', icon: '🎭' },
    { name: 'Статистика', path: '/stats', icon: '📊' },
    { name: 'Історія', path: '/history', icon: '📅' },
    { name: 'Налаштування', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Moodly</h2>
      
      <nav style={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              ...styles.navBtn,
              backgroundColor: location.pathname === item.path ? '#e1ecf8' : 'transparent',
              color: location.pathname === item.path ? '#4a90e2' : '#5f6c7b',
            }}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      {/* Кнопка виходу внизу */}
      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <span style={{ marginRight: '10px' }}></span> Вийти
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    height: '100vh',
    backgroundColor: '#fff',
    borderRight: '1px solid #eee',
    position: 'fixed',
    left: 0,
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 100,
  },
  logo: {
    fontSize: '24px',
    color: '#4a90e2',
    marginBottom: '40px',
    textAlign: 'center',
    fontWeight: '800',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1, // Займає весь доступний простір, штовхаючи футер вниз
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.2s',
    textAlign: 'left',
  },
  footer: {
    marginTop: 'auto', // Притискає кнопку до низу
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#fff5f5',
    color: '#ff4d4d',
    border: '1px solid #ffc1c1',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.2s',
  }
};

export default Sidebar;