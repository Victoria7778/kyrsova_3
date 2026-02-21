import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [sleepHours, setSleepHours] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post('http://localhost:5000/api/mood/sleep', 
        { date: today, hours: sleepHours }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Сон записано!');
      setShowSleepModal(false);
      setSleepHours('');
    } catch (err) {
      alert('Помилка: запис за сьогодні вже може існувати');
    }
  };

  // --- СТАН 1: ЛЕНДИНГ ---
  if (!isLoggedIn) {
    return (
      <div style={styles.landingContainer}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Mood Tracker 🧘✨</h1>
          <p style={styles.heroSubtitle}>Почніть розуміти себе краще вже сьогодні.</p>
          <button onClick={() => navigate('/login')} style={styles.primaryBtn}>Увійти в систему</button>
        </div>
      </div>
    );
  }

  // --- СТАН 2: ДАШБОРД ---
  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.welcomeText}>Вітаємо, {userEmail.split('@')[0]}! 👋</h1>
          <p style={styles.dateText}>{new Date().toLocaleDateString('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Вийти</button>
      </header>

      <div style={styles.actionGrid}>
        <button onClick={() => navigate('/add-mood')} style={styles.actionBtn('#4a90e2')}>
          <span style={styles.icon}>🎭</span> Настрій
        </button>
        <button onClick={() => setShowSleepModal(true)} style={styles.actionBtn('#50c878')}>
          <span style={styles.icon}>🛌</span> Сон
        </button>
        <button onClick={() => alert('Події в розробці')} style={styles.actionBtn('#ff9f43')}>
          <span style={styles.icon}>📝</span> Подія
        </button>
      </div>

      {showSleepModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{marginBottom: '20px'}}>Записати сон 🛌</h3>
            <form onSubmit={handleSleepSubmit}>
              <input 
                type="number" 
                placeholder="Години сну" 
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                style={styles.modalInput}
                required
              />
              <div style={styles.modalButtons}>
                <button type="button" onClick={() => setShowSleepModal(false)} style={styles.cancelBtn}>Скасувати</button>
                <button type="submit" style={styles.saveBtn}>Зберегти</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  dashboardContainer: { padding: '40px', maxWidth: '1000px', margin: 'auto', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  welcomeText: { fontSize: '32px', color: '#2c3e50', margin: 0, fontWeight: 'bold' },
  dateText: { color: '#7f8c8d', margin: '5px 0 0 0' },
  logoutBtn: { backgroundColor: '#fff5f5', border: '1px solid #ffc1c1', color: '#ff4d4d', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' },
  
  actionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  
  actionBtn: (color) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '30px',
    backgroundColor: 'white', border: `1px solid #eee`, borderBottom: `4px solid ${color}`, 
    borderRadius: '20px', cursor: 'pointer', transition: '0.3s', fontWeight: 'bold'
  }),
  
  icon: { fontSize: '40px' },

  landingContainer: { 
    height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', 
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4eefb 100%)', textAlign: 'center' 
  },
  heroTitle: { fontSize: '48px', color: '#2c3e50', marginBottom: '20px' },
  heroSubtitle: { fontSize: '20px', color: '#5f6c7b', marginBottom: '40px' },
  primaryBtn: { padding: '15px 40px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', cursor: 'pointer' },

  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '350px', textAlign: 'center'
  },
  modalInput: {
    width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box'
  },
  modalButtons: { display: 'flex', gap: '10px' },
  cancelBtn: { flex: 1, padding: '10px', backgroundColor: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  saveBtn: { flex: 1, padding: '10px', backgroundColor: '#50c878', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Home;