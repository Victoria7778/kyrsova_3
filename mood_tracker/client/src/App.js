import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoodEntry from './pages/MoodEntry';
import Settings from './pages/Settings';
import History from './pages/History';


const AppLayout = ({ children }) => {
  // Використовуємо стан для токена
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Слухаємо зміни в localStorage (це спрацює при логіні/логауті)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Перевіряємо токен кожні 500мс (простий хак для миттєвого оновлення)
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  if (!token) {
    return <div style={{ width: '100%', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ 
        marginLeft: '240px', 
        width: 'calc(100% - 240px)', 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa' 
      }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-mood" element={<MoodEntry />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;