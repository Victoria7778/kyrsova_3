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
  Fade,
  Avatar,
  Card
} from '@mui/material';
import {
  User,
  Mail,
  Edit2,
  Settings as SettingsIcon,
  ShieldCheck,
  Info,
  UserPlus,
  Search,
  CheckCircle2,
  Copy
} from 'lucide-react';

const Settings = () => {
  const userRole = localStorage.getItem('userRole');
  // Отримуємо власний ID (знадобиться для психолога)
  const myId = localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id;

  const [userData, setUserData] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || ''
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [psyIdInput, setPsyIdInput] = useState('');
  const [foundPsychologist, setFoundPsychologist] = useState(null);

  const [newName, setNewName] = useState(userData.name);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSearchPsychologist = async () => {
    if (!psyIdInput || psyIdInput.length < 10) {
        setMessage({ text: 'Введіть коректний ID', type: 'error' });
        return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:5000/api/psychologist/find/${psyIdInput}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoundPsychologist(res.data);
      setMessage({ text: '', type: '' });
    } catch (err) {
      setFoundPsychologist(null);
      setMessage({ text: 'Психолога не знайдено', type: 'error' });
    }
  };

  // Остаточне підключення до знайденого психолога
  const handleConnect = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/psychologist/connect', 
        { psychologistId: psyIdInput }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ text: res.data.message, type: 'success' });
      setFoundPsychologist(null);
      setPsyIdInput('');
    } catch (err) {
      setMessage({ text: 'Помилка підключення', type: 'error' });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(myId);
    alert('Ваш ID скопійовано! Надішліть його пацієнту.');
  };

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

  const inputProps = { sx: { borderRadius: '16px' } };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Box sx={{ p: 1.5, bgcolor: '#f3f0ff', borderRadius: '16px' }}>
          <SettingsIcon size={28} color="#9d8df1" />
        </Box>
        <Typography variant="h4" fontWeight={500} color="#2c3e50">Налаштування</Typography>
      </Stack>

      {message.text && (
        <Fade in={!!message.text}>
          <Alert severity={message.type} sx={{ mb: 3, borderRadius: '16px' }} onClose={() => setMessage({ text: '', type: '' })}>
            {message.text}
          </Alert>
        </Fade>
      )}

      {/* РОЗДІЛ: ЗВ'ЯЗОК (Психолог / Пацієнт) */}
      <Paper elevation={0} sx={{ ...sectionStyle, borderStyle: 'solid', borderColor: '#e0dbff', bgcolor: '#fbfaff' }}>
        {userRole === 'psychologist' ? (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <ShieldCheck size={20} color="#9d8df1" />
              <Typography variant="h6" fontWeight={500}>Мій кабінет</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Поділіться цим ID з пацієнтом, щоб він міг підключитися до вас:
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField fullWidth size="small" value={myId} disabled InputProps={inputProps} />
              <Button variant="contained" onClick={copyToClipboard} sx={{ bgcolor: '#9d8df1', borderRadius: '12px' }}>
                <Copy size={18} />
              </Button>
            </Stack>
          </Box>
        ) : userRole === 'user' ? (
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <UserPlus size={20} color="#9d8df1" />
              <Typography variant="h6" fontWeight={500}>Мій психолог</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField 
                fullWidth 
                size="small" 
                placeholder="Введіть ID психолога..." 
                value={psyIdInput}
                onChange={(e) => setPsyIdInput(e.target.value)}
                InputProps={inputProps}
              />
              <Button 
                variant="outlined" 
                onClick={handleSearchPsychologist}
                sx={{ borderRadius: '12px', borderColor: '#9d8df1', color: '#9d8df1' }}
              >
                <Search size={18} />
              </Button>
            </Stack>

            {foundPsychologist && (
              <Fade in={!!foundPsychologist}>
                <Card sx={{ mt: 2, p: 2, borderRadius: '16px', border: '1px solid #e0dbff', boxShadow: 'none' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: '#9d8df1', width: 40, height: 40 }}>{foundPsychologist.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={500}>{foundPsychologist.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{foundPsychologist.email}</Typography>
                      </Box>
                    </Stack>
                    <Button 
                      variant="contained" 
                      onClick={handleConnect}
                      startIcon={<CheckCircle2 size={18} />}
                      sx={{ bgcolor: '#9d8df1', borderRadius: '10px', textTransform: 'none' }}
                    >
                      Підключити
                    </Button>
                  </Stack>
                </Card>
              </Fade>
            )}
          </Box>
        ) : null}
      </Paper>

      {/* ПЕРСОНАЛЬНІ ДАНІ */}
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
            <TextField fullWidth label="Ваше ім'я" value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mb: 2 }} InputProps={inputProps} required autoFocus />
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" sx={{ bgcolor: '#9d8df1', borderRadius: '12px', textTransform: 'none' }}>Зберегти</Button>
              <Button onClick={() => setIsEditingName(false)} variant="text" color="inherit">Скасувати</Button>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase' }}>Ім'я</Typography>
              <Typography variant="body1" color="#2c3e50">{userData.name || 'Не вказано'}</Typography>
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

      {/* БЕЗПЕКА */}
      <Paper elevation={0} sx={sectionStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldCheck size={20} color="#ff7eb3" />
            <Typography variant="h6" fontWeight={500}>Безпека</Typography>
          </Stack>
          {!isEditingPassword && (
            <Button size="small" variant="outlined" onClick={() => setIsEditingPassword(true)} sx={{ borderRadius: '10px', color: '#ff7eb3', borderColor: '#ff7eb3' }}>
              Змінити пароль
            </Button>
          )}
        </Stack>

        {isEditingPassword ? (
          <Box component="form" onSubmit={handleChangePassword}>
            <Stack spacing={2}>
              <TextField fullWidth type="password" label="Поточний пароль" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} InputProps={inputProps} required />
              <TextField fullWidth type="password" label="Новий пароль" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} InputProps={inputProps} required />
              <Stack direction="row" spacing={1}>
                <Button type="submit" variant="contained" sx={{ bgcolor: '#ff7eb3', borderRadius: '12px' }}>Оновити</Button>
                <Button onClick={() => setIsEditingPassword(false)} variant="text" color="inherit">Скасувати</Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Ваш акаунт захищено паролем</Typography>
        )}
      </Paper>

      {userRole === 'admin' && (
        <Paper elevation={0} sx={{ ...sectionStyle, bgcolor: '#f1f4ff', borderStyle: 'dashed', mb: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Info size={20} color="#9d8df1" />
            <Typography variant="h6" fontWeight={500} color="#9d8df1">Режим Адміністратора</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Керування зв'язками доступне через розділ "Аудит підключень".
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Settings;