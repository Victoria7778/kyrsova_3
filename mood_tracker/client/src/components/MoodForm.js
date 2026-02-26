import React, { useState } from 'react';
import axios from 'axios';
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
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ textAlign: 'center', color: '#9d8df1', mb: 3, fontWeight: 500 }}>
        Як ви почуваєтесь?
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Вибір оцінки настрою */}
          <Box>
            <Typography variant="body2" sx={{ color: '#95a5a6', mb: 1, textAlign: 'center' }}>
              Оцінка настрою: {moodScore}/10
            </Typography>
            <Slider
              value={moodScore}
              min={1}
              max={10}
              step={1}
              onChange={(e, newValue) => setMoodScore(newValue)}
              sx={{ 
                color: '#9d8df1',
                '& .MuiSlider-thumb': {
                  bgcolor: '#fff',
                  border: '2px solid currentColor',
                }
              }}
            />
          </Box>

          {/* Вибір стану */}
          <FormControl fullWidth>
            <InputLabel id="feeling-select-label">Ваш стан</InputLabel>
            <Select
              labelId="feeling-select-label"
              value={feelingType}
              label="Ваш стан"
              onChange={(e) => setFeelingType(e.target.value)}
              sx={{ borderRadius: '15px' }}
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
            rows={3}
            label="Що на думці?"
            variant="outlined"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
          />

          {/* Кнопка збереження */}
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ 
              py: 1.8, 
              bgcolor: '#9d8df1', 
              borderRadius: '12px', 
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: '0 8px 20px rgba(157, 141, 241, 0.3)',
              '&:hover': { bgcolor: '#8a7ae0' }
            }}
          >
            Зберегти
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default MoodForm;