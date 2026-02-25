import React, { useState } from 'react';
import axios from 'axios';

const PhysicalForm = ({ onSuccess }) => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [note, setNote] = useState('');

  const symptomsList = [
    { id: 'fatigue', label: 'Втома 🔋', value: 'втома' },
    { id: 'headache', label: 'Головний біль 🤕', value: 'головний біль' },
    { id: 'cold', label: 'Застуда 🤧', value: 'застуда' },
    { id: 'muscle_pain', label: 'Біль у м’язах 💪', value: 'біль у м’язах' },
    { id: 'nausea', label: 'Нудота 🤢', value: 'нудота' },
    { id: 'insomnia', label: 'Безсоння 👁️', value: 'безсоння' },
    { id: 'fever', label: 'Температура 🌡️', value: 'температура' },
    { id: 'dizziness', label: 'Запаморочення 🌀', value: 'запаморочення' }
  ];

  const handleSymptomToggle = (value) => {
    if (selectedSymptoms.includes(value)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== value));
    } else {
      setSelectedSymptoms([...selectedSymptoms, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const data = { 
      energyLevel,
      symptoms: selectedSymptoms,
      note,
      date: new Date().toISOString()
    };

    try {
      await axios.post('http://localhost:5000/api/mood/physical', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при збереженні фізичного стану');
    }
  };

  return (
    <div style={{ padding: '5px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Фізичне самопочуття</h2>
      
      <form onSubmit={handleSubmit}>
      
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Рівень енергії: {energyLevel}/10
          </label>
          <input 
            type="range" min="1" max="10" 
            value={energyLevel} 
            onChange={(e) => setEnergyLevel(e.target.value)} 
            style={{ width: '100%', accentColor: '#e74c3c', cursor: 'pointer' }} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
            Симптоми (можна декілька):
          </label>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px',
            maxHeight: '200px',
            overflowY: 'auto',
            paddingRight: '5px'
          }}>
            {symptomsList.map((s) => (
              <div 
                key={s.id} 
                onClick={() => handleSymptomToggle(s.value)}
                style={{
                  padding: '12px 10px',
                  borderRadius: '12px',
                  border: '1px solid #eee',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: '0.2s',
                  backgroundColor: selectedSymptoms.includes(s.value) ? '#fff5f5' : '#fcfcfc',
                  borderColor: selectedSymptoms.includes(s.value) ? '#e74c3c' : '#eee',
                  boxShadow: selectedSymptoms.includes(s.value) ? '0 2px 8px rgba(231, 76, 60, 0.15)' : 'none'
                }}
              >
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <textarea 
          placeholder="Додаткові зауваження (наприклад, назва ліків)" 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          style={{ 
            width: '100%', padding: '12px', borderRadius: '10px', 
            border: '1px solid #ddd', minHeight: '60px', marginBottom: '20px',
            boxSizing: 'border-box', fontFamily: 'inherit'
          }} 
        />

        <button type="submit" style={{ 
          width: '100%', padding: '15px', backgroundColor: '#e74c3c', 
          color: 'white', border: 'none', borderRadius: '12px', 
          cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' 
        }}>
          Зберегти стан здоров'я
        </button>
      </form>
    </div>
  );
};

export default PhysicalForm;