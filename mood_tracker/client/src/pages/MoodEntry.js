import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  Button, 
  MenuItem, 
  Stack,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';

const MoodEntry = ({ onSuccess }) => {
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
      
      if (onSuccess) {
        onSuccess(); // Закриваємо модалку, якщо компонент всередині неї
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при збереженні');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, fontWeight: 500, color: '#2c3e50' }}>
        Як ви почуваєтесь зараз?
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* Слайдер оцінки настрою */}
          <Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#95a5a6', textAlign: 'center' }}>
              Оцінка стану: {moodScore} з 10
            </Typography>
            <Slider
              value={moodScore}
              min={1}
              max={10}
              step={1}
              onChange={(e, newValue) => setMoodScore(newValue)}
              sx={{ 
                color: '#9d8df1',
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                  '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                    boxShadow: 'inherit',
                  },
                },
              }}
            />
          </Box>

          {/* Вибір типу відчуття */}
          <FormControl fullWidth>
            <InputLabel id="feeling-label">Ваш стан</InputLabel>
            <Select
              labelId="feeling-label"
              value={feelingType}
              label="Ваш стан"
              onChange={(e) => setFeelingType(e.target.value)}
              sx={{ borderRadius: '16px' }}
            >
              <MenuItem value="спокій">Спокій</MenuItem>
              <MenuItem value="піднесено">Піднесено</MenuItem>
              <MenuItem value="стрес">Стрес</MenuItem>
              <MenuItem value="заплутаність">Заплутаність</MenuItem>
              <MenuItem value="втома">Втома</MenuItem>
            </Select>
          </FormControl>

          {/* Коментар */}
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Що на думці?"
            label="Коментар"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}
          />

          {/* Кнопка збереження */}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              py: 2, 
              borderRadius: '16px', 
              bgcolor: '#9d8df1',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 10px 25px rgba(157, 141, 241, 0.3)',
              '&:hover': { 
                bgcolor: '#8a7ae0',
                boxShadow: '0 12px 30px rgba(157, 141, 241, 0.4)'
              }
            }}
          >
            Зберегти настрій
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MoodEntry;