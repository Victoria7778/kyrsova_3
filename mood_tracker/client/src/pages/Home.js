import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Typography, Grid, Card, CardContent, Button, 
  Avatar, IconButton, Modal, TextField, Fade, Stack, MenuItem 
} from '@mui/material';
import { 
  Activity, Moon, Calendar, HeartPulse, 
  LogOut, PlusCircle, ChevronRight, User 
} from 'lucide-react'; 
import MoodForm from '../components/MoodForm';
import PhysicalForm from '../components/PhysicalForm';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));
  
  const [todayMood, setTodayMood] = useState(null);
  const [todaySleep, setTodaySleep] = useState(null);
  const [todayPhysical, setTodayPhysical] = useState(null);

  const [modalType, setModalType] = useState(null); 
  const [sleepHours, setSleepHours] = useState('');
  const [eventData, setEventData] = useState({ title: '', category: 'навчання' });

  const getDisplayName = () => {
    const savedName = localStorage.getItem('userName');
    const userJson = JSON.parse(localStorage.getItem('user') || '{}');
    const email = localStorage.getItem('userEmail') || '';
    return savedName || userJson.name || email.split('@')[0] || 'Користувач';
  };

  const [displayName] = useState(getDisplayName());

  const fetchTodayData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const [moodRes, sleepRes, physRes] = await Promise.all([
        axios.get('http://localhost:5000/api/mood/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/mood/sleep/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/mood/physical/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setTodayMood(moodRes.data.find(m => m.date.startsWith(today)));
      setTodaySleep(sleepRes.data.find(s => s.date.startsWith(today)));
      setTodayPhysical(physRes.data.find(p => p.date.startsWith(today)));
    } catch (err) {
      console.error("Помилка завантаження даних:", err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchTodayData();
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
 
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post('http://localhost:5000/api/mood/sleep', 
        { date: today, hours: sleepHours }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalType(null);
      setSleepHours('');
      fetchTodayData();
    } catch (err) {
      alert('Помилка при записі сну');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/mood/event', 
        eventData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalType(null);
      setEventData({ title: '', category: 'навчання' });
      fetchTodayData();
    } catch (err) {
      alert('Помилка при додаванні події');
    }
  };

  if (!isLoggedIn) return null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1000, mx: 'auto', boxSizing: 'border-box' }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            bgcolor: '#9d8df1', width: 56, height: 56, borderRadius: '18px',
            boxShadow: '0 8px 20px rgba(157, 141, 241, 0.2)' 
          }}>
            <User size={28} color="white" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Вітаємо, {displayName}!
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', textTransform: 'capitalize', fontWeight: 300 }}>
              {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'short' })}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={handleLogout} sx={{ bgcolor: 'white', p: 1.5, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <LogOut size={20} color="#95a5a6" />
        </IconButton>
      </Box>

      {/* STATUS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Настрій', val: todayMood ? `${todayMood.moodScore}/10` : '--', icon: <Activity size={20} />, col: '#9d8df1' },
          { label: 'Сон', val: todaySleep ? `${todaySleep.hours}г` : '--', icon: <Moon size={20} />, col: '#b8aff5' },
          { label: 'Енергія', val: todayPhysical ? `${todayPhysical.energyLevel}/10` : '--', icon: <HeartPulse size={20} />, col: '#ff7eb3' }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card sx={{ 
              borderRadius: '24px', textAlign: 'center', 
              boxShadow: '0 10px 30px rgba(157, 141, 241, 0.08)', 
              border: '1px solid rgba(255,255,255,0.4)' 
            }}>
              <CardContent sx={{ py: 3 }}>
                <Avatar sx={{ bgcolor: item.col, mx: 'auto', mb: 1.5, width: 44, height: 44, borderRadius: '12px' }}>
                  {item.icon}
                </Avatar>
                <Typography variant="caption" sx={{ fontWeight: 400, color: '#b2bec3', textTransform: 'uppercase', letterSpacing: 1 }}>
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 400, mt: 0.5, color: '#2c3e50' }}>{item.val}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* BIG ACTION BUTTON */}
      <Box sx={{ mb: 4 }}>
        <Button 
          fullWidth
          onClick={() => setModalType('mood')}
          sx={{
            p: 4, borderRadius: '24px', justifyContent: 'space-between',
            background: 'linear-gradient(90deg, #9d8df1 0%, #b8aff5 100%)',
            boxShadow: '0 15px 30px rgba(157, 141, 241, 0.3)',
            color: 'white', textTransform: 'none',
            '&:hover': { background: 'linear-gradient(90deg, #8a7ae0 0%, #a69ce6 100%)' }
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar sx={{ bgcolor: 'white', width: 55, height: 55 }}>
              <PlusCircle size={30} color="#9d8df1" />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 400 }}>Як ти сьогодні?</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 300 }}>Додай новий запис у щоденник</Typography>
            </Box>
          </Stack>
          <ChevronRight />
        </Button>
      </Box>

      {/* QUICK ACTIONS */}
      <Grid container spacing={3}>
        {[
          { label: 'Записати сон', icon: <Moon size={22} />, type: 'sleep', col: '#b8aff5' },
          { label: 'Додати подію', icon: <Calendar size={22} />, type: 'event', col: '#ff9f43' },
          { label: 'Стан здоров\'я', icon: <HeartPulse size={22} />, type: 'physical', col: '#ff7eb3' }
        ].map((action, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Button
              fullWidth
              onClick={() => setModalType(action.type)}
              sx={{
                py: 3, borderRadius: '24px',
                bgcolor: 'white', color: '#2c3e50', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': { border: '1px solid #9d8df1', bgcolor: '#fbfaff' }
              }}
            >
              <Box sx={{ color: action.col, display: 'flex' }}>{action.icon}</Box>
              <Typography variant="body1" sx={{ fontWeight: 400 }}>{action.label}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* UNIVERSAL MODAL */}
      <Modal open={!!modalType} onClose={() => setModalType(null)} closeAfterTransition>
        <Fade in={!!modalType}>
          <Box sx={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 420 }, bgcolor: 'white', borderRadius: '28px',
            boxShadow: 24, p: 4, outline: 'none'
          }}>
            <IconButton onClick={() => setModalType(null)} sx={{ position: 'absolute', right: 16, top: 16 }}>
              <Typography variant="h6">✕</Typography>
            </IconButton>

            {modalType === 'mood' && <MoodForm onSuccess={() => { setModalType(null); fetchTodayData(); }} />}
            {modalType === 'physical' && <PhysicalForm onSuccess={() => { setModalType(null); fetchTodayData(); }} />}

            {modalType === 'sleep' && (
              <Box component="form" onSubmit={handleSleepSubmit} sx={{ p: 1 }}>
                <Typography variant="h6" sx={{ color: '#9d8df1', textAlign: 'center', mb: 3, fontWeight: 500 }}>
                  Записати сон
                </Typography>
                <TextField
                  fullWidth type="number" label="Кількість годин"
                  value={sleepHours} onChange={(e) => setSleepHours(e.target.value)}
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} required
                />
                <Stack direction="row" spacing={2}>
                  <Button fullWidth onClick={() => setModalType(null)} variant="outlined" sx={{ borderRadius: '12px' }}>Назад</Button>
                  <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: '#9d8df1', borderRadius: '12px' }}>Зберегти</Button>
                </Stack>
              </Box>
            )}

            {modalType === 'event' && (
              <Box component="form" onSubmit={handleEventSubmit} sx={{ p: 1 }}>
                <Typography variant="h6" sx={{ color: '#ff9f43', textAlign: 'center', mb: 3, fontWeight: 500 }}>
                  Додати подію
                </Typography>
                <TextField
                  fullWidth label="Назва події"
                  value={eventData.title} onChange={(e) => setEventData({...eventData, title: e.target.value})}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }} required
                />
                <TextField
                  fullWidth select label="Категорія"
                  value={eventData.category} onChange={(e) => setEventData({...eventData, category: e.target.value})}
                  sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '15px' } }}
                >
                  <MenuItem value="навчання">Навчання 📚</MenuItem>
                  <MenuItem value="відпочинок">Відпочинок 🏝️</MenuItem>
                  <MenuItem value="робота">Робота 💼</MenuItem>
                  <MenuItem value="здоров'я">Здоров'я 🏥</MenuItem>
                </TextField>
                <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: '#ff9f43', borderRadius: '12px' }}>Додати</Button>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Home;