import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Users,
  Activity 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    if (window.confirm("Ви впевнені, що хочете вийти?")) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const menuItems = [];

  if (userRole === 'admin') {
    menuItems.push(
      { name: 'Головна', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Адмін-панель', path: '/admin', icon: <ShieldCheck size={20} color="#ff4d4d" /> },
      { name: 'Аудит підключень', path: '/audit', icon: <Activity size={20} color="#ff9f43" /> }
    );
  } else {
    menuItems.push(
      { name: 'Головна', path: '/', icon: <LayoutDashboard size={20} /> },
      { name: 'Статистика', path: '/stats', icon: <BarChart3 size={20} /> },
      { name: 'Історія', path: '/history', icon: <History size={20} /> }
    );

    if (userRole === 'psychologist') {
      menuItems.push({ 
        name: 'Мої пацієнти', 
        path: '/patients', 
        icon: <Users size={20} color="#9d8df1" /> 
      });
    }
  }

  menuItems.push({ name: 'Налаштування', path: '/settings', icon: <Settings size={20} /> });

  return (
    <aside style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>Moodly</h2>

        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navBtn,
                  ...(isActive && styles.activeBtn),
                }}
              >
                <span style={styles.icon}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={18} style={{ marginRight: '10px' }} />
          Вийти
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    backgroundColor: '#fff',
    borderRight: '1px solid rgba(157, 141, 241, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '30px 20px',
    boxSizing: 'border-box',
    boxShadow: '4px 0 20px rgba(157, 141, 241, 0.05)',
  },
  logo: {
    fontSize: '24px',
    color: '#9d8df1',
    marginBottom: '40px',
    fontWeight: '600',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    background: 'transparent',
    color: '#5f6c7b',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  activeBtn: {
    backgroundColor: '#f3f0ff',
    color: '#9d8df1',
  },
  icon: {
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
  },
  footer: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '20px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 15px',
    backgroundColor: '#fffcfc',
    color: '#ff4d4d',
    border: '1px solid #ffebeb',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: '0.2s',
  }
};

export default Sidebar;