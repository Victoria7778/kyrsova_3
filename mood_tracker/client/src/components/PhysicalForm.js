import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  Button, 
  Chip, 
  Stack,
  Paper
} from '@mui/material';

const PhysicalForm = ({ onSuccess }) => {
  const [energyLevel, setEnergyLevel] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [note, setNote] = useState('');

  const symptomsList = [
    { id: 'fatigue', label: 'Втома', value: 'втома' },
    { id: 'headache', label: 'Головний біль', value: 'головний біль' },
    { id: 'cold', label: 'Застуда', value: 'застуда' },
    { id: 'muscle_pain', label: 'Біль у м’язах', value: 'біль у м’язах' },
    { id: 'nausea', label: 'Нудота', value: 'нудота' },
    { id: 'insomnia', label: 'Безсоння', value: 'безсоння' },
    { id: 'fever', label: 'Температура', value: 'температура' },
    { id: 'dizziness', label: 'Запаморочення', value: 'запаморочення' }
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
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', color: '#ff7eb3', mb: 3, fontWeight: 500 }}>
        Фізичне самопочуття
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          
          {/* Рівень енергії */}
          <Box>
            <Typography variant="body2" sx={{ color: '#95a5a6', mb: 1, textAlign: 'center' }}>
              Рівень енергії: {energyLevel}/10
            </Typography>
            <Slider
              value={energyLevel}
              min={1}
              max={10}
              step={1}
              onChange={(e, newValue) => setEnergyLevel(newValue)}
              sx={{ 
                color: '#ff7eb3',
                '& .MuiSlider-thumb': {
                  bgcolor: '#fff',
                  border: '2px solid currentColor',
                }
              }}
            />
          </Box>

          {/* Симптоми */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5, color: '#2c3e50' }}>
              Симптоми:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1,
              maxHeight: '160px',
              overflowY: 'auto',
              p: 1,
              bgcolor: '#fffafb',
              borderRadius: '16px',
              border: '1px solid #fff0f3'
            }}>
              {symptomsList.map((s) => (
                <Chip
                  key={s.id}
                  label={s.label}
                  onClick={() => handleSymptomToggle(s.value)}
                  variant={selectedSymptoms.includes(s.value) ? "filled" : "outlined"}
                  sx={{
                    borderRadius: '10px',
                    borderColor: '#ff7eb3',
                    bgcolor: selectedSymptoms.includes(s.value) ? '#ff7eb3' : 'transparent',
                    color: selectedSymptoms.includes(s.value) ? '#fff' : '#ff7eb3',
                    '&:hover': {
                      bgcolor: selectedSymptoms.includes(s.value) ? '#ff5c9d' : '#fff0f3',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Додаткові нотатки */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Зауваження"
            placeholder="Наприклад, назва ліків..."
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
          />

          {/* Кнопка збереження */}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              py: 1.8, 
              bgcolor: '#ff7eb3', 
              borderRadius: '12px', 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 8px 20px rgba(255, 126, 179, 0.3)',
              '&:hover': { 
                bgcolor: '#ff5c9d',
                boxShadow: '0 10px 25px rgba(255, 126, 179, 0.4)' 
              }
            }}
          >
            Зберегти стан здоров'я
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PhysicalForm;