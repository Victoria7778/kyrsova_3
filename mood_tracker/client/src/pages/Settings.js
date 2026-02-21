import React, { useState } from 'react';

const Settings = () => {
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', fontFamily: "'Segoe UI', sans-serif" }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>Налаштування ⚙️</h1>

      <div style={styles.grid}>
        {/* Секція Акаунта */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Персональні дані</h3>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{userEmail}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Статус акаунта</span>
            <span style={styles.value}><span style={styles.badge}>Active</span></span>
          </div>
          <button style={styles.actionBtn}>Змінити пароль</button>
        </section>

        {/* Секція Сповіщень та Теми */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Налаштування інтерфейсу</h3>
          <div style={styles.row}>
            <span>Надсилати нагадування про записи</span>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)} 
              style={styles.checkbox}
            />
          </div>
          <div style={styles.row}>
            <span>Темна тема</span>
            <span style={{color: '#95a5a6', fontSize: '14px'}}>Незабаром...</span>
          </div>
        </section>

        {/* Секція Безпеки */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Безпека та конфіденційність</h3>
          <p style={{color: '#7f8c8d', fontSize: '14px', marginBottom: '15px'}}>
            Ваші дані шифруються за допомогою токенів JWT для безпечного зберігання в базі даних.
          </p>
          <button style={styles.dangerBtn}>Видалити всі дані про настрій</button>
        </section>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'flex', flexDirection: 'column', gap: '25px' },
  card: { 
    backgroundColor: 'white', padding: '25px', borderRadius: '15px', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #edf2f7' 
  },
  cardTitle: { marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#34495e', borderBottom: '1px solid #f8f9fa', paddingBottom: '10px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  label: { color: '#7f8c8d', fontWeight: '500' },
  value: { color: '#2c3e50', fontWeight: '600' },
  badge: { backgroundColor: '#e6fffa', color: '#2c7a7b', padding: '4px 8px', borderRadius: '5px', fontSize: '12px' },
  actionBtn: { padding: '10px 15px', backgroundColor: '#f7fafc', border: '1px solid #cbd5e0', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' },
  dangerBtn: { padding: '10px 15px', backgroundColor: '#fff5f5', border: '1px solid #feb2b2', color: '#c53030', borderRadius: '8px', cursor: 'pointer' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' }
};

export default Settings;