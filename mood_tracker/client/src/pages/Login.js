import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', email);
      
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при вході');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>З поверненням! 👋</h2>
        <p style={styles.subtitle}>Увійдіть у свій акаунт Mood Tracker</p>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Електронна пошта</label>
            <input 
              type="email" 
              placeholder="example@ukma.edu.ua" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Увійти</button>
        </form>
        
        <p style={styles.footerText}>
          Ще не маєте акаунту? <span onClick={() => navigate('/register')} style={styles.link}>Зареєструватися</span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  },
  card: {
    backgroundColor: '#fff', padding: '40px', borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center'
  },
  title: { fontSize: '28px', color: '#2d3436', marginBottom: '10px' },
  subtitle: { color: '#636e72', marginBottom: '30px', fontSize: '14px' },
  form: { textAlign: 'left' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#2d3436' },
  input: {
    width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #dfe6e9',
    fontSize: '16px', outline: 'none', transition: 'border-color 0.3s', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
    backgroundColor: '#4a90e2', color: '#fff', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', transition: 'background 0.3s', marginTop: '10px'
  },
  footerText: { marginTop: '25px', fontSize: '14px', color: '#636e72' },
  link: { color: '#4a90e2', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;