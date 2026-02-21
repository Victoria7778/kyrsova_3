import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MoodEntry = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [feelingType, setFeelingType] = useState('спокій');
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = {
      moodScore,
      feelingType,
      comment,
    };

    try {
      await axios.post('http://localhost:5000/api/mood/add', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Настрій зафіксовано!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при збереженні');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto', backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Як ви почуваєтесь зараз?</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Оцінка: {moodScore}/10</label>
          <input type="range" min="1" max="10" value={moodScore} 
                 onChange={(e) => setMoodScore(e.target.value)} 
                 style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Ваш стан:</label>
          <select value={feelingType} onChange={(e) => setFeelingType(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}>
            <option value="спокій">Спокій 🧘</option>
            <option value="піднесено">Піднесено ✨</option>
            <option value="стрес">Стрес 🔥</option>
            <option value="заплутаність">Заплутаність 🤔</option>
            <option value="втома">Втома 😴</option>
          </select>
        </div>

        <textarea placeholder="Що на думці? (необов'язково)" 
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '100px', marginBottom: '20px', boxSizing: 'border-box' }} />

        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
          Зберегти настрій
        </button>
      </form>
    </div>
  );
};

export default MoodEntry;