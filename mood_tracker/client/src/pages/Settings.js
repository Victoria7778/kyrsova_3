import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Alert,
  Divider,
  Fade
} from '@mui/material';
import {
  User,
  Mail,
  Edit2,
  Check,
  Settings as SettingsIcon,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

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
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem('userName', res.data.name);
      setUserData({ ...userData, name: res.data.name });
      setIsEditingName(false);
      setMessage({ text: "Ім'я оновлено успішно!", type: 'success' });
      
      // Сповіщення інших компонентів про зміну імені
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Помилка оновлення', type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/auth/change-password',
        passwords,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditingPassword(false);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage({ text: 'Пароль змінено успішно!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Помилка доступу', type: 'error' });
    }
  };

  const sectionStyle = {
    p: 3,
    borderRadius: '24px',
    bgcolor: 'white',
    boxShadow: '0 10px 30px rgba(157, 141, 241, 0.05)',
    border: '1px solid rgba(157, 141, 241, 0.1)',
    mb: 3
  };

  const inputProps = {
    sx: { borderRadius: '16px' }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* HEADER */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ p: 1.5, bgcolor: '#f3f0ff', borderRadius: '16px' }}>
          <SettingsIcon size={28} color="#9d8df1" />
        </Box>
        <Typography variant="h4" fontWeight={500} color="#2c3e50">
          Налаштування
        </Typography>
      </Stack>

      {/* MESSAGES */}
      {message.text && (
        <Fade in={!!message.text}>
          <Alert 
            severity={message.type} 
            sx={{ mb: 3, borderRadius: '16px' }}
            onClose={() => setMessage({ text: '', type: '' })}
          >
            {message.text}
          </Alert>
        </Fade>
      )}

      {/* SECTION: PERSONAL INFO */}
      <Paper elevation={0} sx={sectionStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <User size={20} color="#9d8df1" />
            <Typography variant="h6" fontWeight={500}>Персональні дані</Typography>
          </Stack>
          {!isEditingName && (
            <IconButton onClick={() => setIsEditingName(true)} size="small" sx={{ bgcolor: '#f8fafc' }}>
              <Edit2 size={16} color="#9d8df1" />
            </IconButton>
          )}
        </Stack>

        {isEditingName ? (
          <Box component="form" onSubmit={handleUpdateName}>
            <TextField
              fullWidth
              label="Ваше ім'я"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={inputProps}
              required
              autoFocus
            />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" sx={{ bgcolor: '#9d8df1', borderRadius: '12px', textTransform: 'none', '&:hover': { bgcolor: '#8a7ae0' } }}>
                Зберегти
              </Button>
              <Button onClick={() => setIsEditingName(false)} variant="text" color="inherit" sx={{ textTransform: 'none' }}>
                Скасувати
              </Button>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Ім'я</Typography>
              <Typography variant="body1" fontWeight={400} color="#2c3e50">{userData.name || 'Не вказано'}</Typography>
            </Box>
            <Divider sx={{ borderStyle: 'dashed' }} />
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Email</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Mail size={14} color="#94a3b8" />
                <Typography variant="body1" color="#2c3e50">{userData.email}</Typography>
              </Stack>
            </Box>
          </Stack>
        )}
      </Paper>

      {/* SECTION: SECURITY */}
      <Paper elevation={0} sx={sectionStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldCheck size={20} color="#ff7eb3" />
            <Typography variant="h6" fontWeight={500}>Безпека</Typography>
          </Stack>
          {!isEditingPassword && (
            <Button 
              size="small" 
              variant="outlined" 
              onClick={() => setIsEditingPassword(true)}
              sx={{ borderRadius: '10px', textTransform: 'none', color: '#ff7eb3', borderColor: '#ff7eb3' }}
            >
              Змінити пароль
            </Button>
          )}
        </Stack>

        {isEditingPassword ? (
          <Box component="form" onSubmit={handleChangePassword}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="password"
                label="Поточний пароль"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                InputProps={inputProps}
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Новий пароль"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                InputProps={inputProps}
                required
              />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#ff7eb3', '&:hover': { bgcolor: '#f06292' }, borderRadius: '12px', textTransform: 'none' }}>
                  Оновити пароль
                </Button>
                <Button onClick={() => setIsEditingPassword(false)} variant="text" color="inherit" sx={{ textTransform: 'none' }}>
                  Скасувати
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <Check size={16} color="#2ecc71" />
            <Typography variant="body2" color="text.secondary" fontWeight={300}>Ваш акаунт захищено паролем</Typography>
          </Stack>
        )}
      </Paper>

      {/* SECTION: SPECIALISTS */}
      <Paper elevation={0} sx={{ ...sectionStyle, borderStyle: 'dashed', bgcolor: '#f8fafc', mb: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Stethoscope size={20} color="#94a3b8" />
          <Typography variant="h6" fontWeight={500} color="#94a3b8">Ваш Психолог</Typography>
        </Stack>
        <Typography variant="body2" color="text.disabled" fontWeight={300}>
          Модуль спеціалістів буде доступний у версії 2.0. Ви зможете ділитися своєю статистикою з лікарем.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Settings;