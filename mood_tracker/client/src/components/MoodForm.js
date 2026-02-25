import React, { useState } from 'react';
import axios from 'axios';

const MoodForm = ({ onSuccess }) => { 
  const [moodScore, setMoodScore] = useState(5);
  const [feelingType, setFeelingType] = useState('спокій');
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = { moodScore, feelingType, comment };

    try {
      await axios.post('http://localhost:5000/api/mood/add', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при збереженні');
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Як ви почуваєтесь?</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '25px', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>Оцінка: {moodScore}/10</label>
          <input type="range" min="1" max="10" value={moodScore} 
                 onChange={(e) => setMoodScore(e.target.value)} 
                 style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <select value={feelingType} onChange={(e) => setFeelingType(e.target.value)} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}>
            <option value="спокій">Спокій 🧘</option>
            <option value="піднесено">Піднесено ✨</option>
            <option value="стрес">Стрес 🔥</option>
            <option value="заплутаність">Заплутаність 🤔</option>
            <option value="втома">Втома 😴</option>
          </select>
        </div>

        <textarea placeholder="Що на думці?" 
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px', marginBottom: '20px', boxSizing: 'border-box' }} />

        <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#4a90e2', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default MoodForm;