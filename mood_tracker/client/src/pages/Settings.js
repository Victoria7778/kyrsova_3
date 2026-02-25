import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [userData, setUserData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || ''
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [newName, setNewName] = useState(userData.name);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

 const handleUpdateName = async (e) => {
  e.preventDefault();
  if (!window.confirm("Зберегти нове ім'я?")) return;

  const token = localStorage.getItem('token');
  try {
    const res = await axios.put(
      'http://localhost:5000/api/auth/update-profile', 
      { name: newName }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    localStorage.setItem('userName', res.data.name);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.name = res.data.name;
    localStorage.setItem('user', JSON.stringify(user));

    setUserData({ ...userData, name: res.data.name });
    setIsEditingName(false);
    setMessage({ text: 'Ім’я оновлено успішно!', type: 'success' });
  } catch (err) {
    setMessage({ text: err.response?.data?.message || 'Помилка', type: 'error' });
  }
};

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!window.confirm("Змінити пароль?")) return;

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/auth/change-password', 
        passwords, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditingPassword(false);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage({ text: 'Пароль змінено!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Помилка', type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Налаштування ⚙️</h1>

      {message.text && (
        <div style={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
          {message.text}
        </div>
      )}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3>Персональні дані</h3>
          {!isEditingName && (
            <button onClick={() => setIsEditingName(true)} style={styles.editBtn}>Змінити Ім’я</button>
          )}
        </div>

        {isEditingName ? (
          <form onSubmit={handleUpdateName} style={styles.form}>
            <input 
              type="text" 
              value={newName} 
              onChange={(e) => setNewName(e.target.value)} 
              style={styles.input}
              required
            />
            <div style={styles.btnGroup}>
              <button type="submit" style={styles.saveBtn}>Зберегти</button>
              <button type="button" onClick={() => setIsEditingName(false)} style={styles.cancelBtn}>Скасувати</button>
            </div>
          </form>
        ) : (
          <div style={styles.infoRow}>
            <p><strong>Ім’я:</strong> {userData.name || 'Не вказано'}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3>Безпека</h3>
          {!isEditingPassword && (
            <button onClick={() => setIsEditingPassword(true)} style={styles.editBtn}>Змінити пароль</button>
          )}
        </div>

        {isEditingPassword ? (
          <form onSubmit={handleChangePassword} style={styles.form}>
            <input 
              type="password" 
              placeholder="Поточний пароль" 
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              style={styles.input}
              required
            />
            <input 
              type="password" 
              placeholder="Новий пароль" 
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              style={styles.input}
              required
            />
            <div style={styles.btnGroup}>
              <button type="submit" style={styles.saveBtn}>Оновити</button>
              <button type="button" onClick={() => setIsEditingPassword(false)} style={styles.cancelBtn}>Скасувати</button>
            </div>
          </form>
        ) : (
          <p style={styles.infoText}>Пароль встановлено</p>
        )}
      </section>

      <section style={styles.section}>
        <h3>Ваш Психолог 🩺</h3>
        <p style={styles.infoText}>Модуль спеціалістів буде доступний у версії 2.0</p>
      </section>
    </div>
  );
};

const styles = {
  container: { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial' },
  title: { color: '#2c3e50', marginBottom: '30px' },
  section: { 
    backgroundColor: 'white', padding: '25px', borderRadius: '20px', 
    marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
  },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  editBtn: { 
    padding: '6px 15px', fontSize: '12px', cursor: 'pointer', 
    backgroundColor: '#f1f5f9', border: '1px solid #cbd5e0', borderRadius: '6px' 
  },
  infoRow: { color: '#34495e', lineHeight: '1.6' },
  infoText: { color: '#7f8c8d', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' },
  btnGroup: { display: 'flex', gap: '10px' },
  saveBtn: { padding: '8px 20px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  cancelBtn: { padding: '8px 20px', backgroundColor: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  successMsg: { padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px' },
  errorMsg: { padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px' }
};

export default Settings;