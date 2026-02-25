import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { 
        email, 
        password, 
        name 
      });
      alert('Реєстрація успішна!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при реєстрації');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Реєстрація 🧘</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Ваше ім'я (як до вас звертатися?)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={styles.input}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={styles.input}
        />
        <input 
          type="password" 
          placeholder="Пароль (мін. 8 симв., цифра, велика літера)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Зареєструватися
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        Вже маєте акаунт? <span onClick={() => navigate('/login')} style={{ color: '#4a90e2', cursor: 'pointer' }}>Увійти</span>
      </p>
    </div>
  );
};

const styles = {
  input: { display: 'block', width: '100%', marginBottom: '15px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;