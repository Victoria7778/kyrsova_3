import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Avatar, Button, Stack, CircularProgress, Alert
} from '@mui/material';
import { 
  Users, 
  UserCheck, 
  ClipboardList, 
  Stethoscope,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

const PsychologistDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPatients: 0, activeToday: 0 });
  const [displayName] = useState(localStorage.getItem('userName') || 'Лікар');

  useEffect(() => {
    const fetchPsychoData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Запит на отримання пацієнтів (маршрут, який ми обговорювали раніше)
        const res = await axios.get('http://localhost:5000/api/psychologist/my-patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          totalPatients: res.data.length,
          activeToday: res.data.filter(p => p.hasEntryToday).length // якщо додамо таку перевірку
        });
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження даних психолога");
        setLoading(false);
      }
    };
    fetchPsychoData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#f3f0ff', width: 56, height: 56, borderRadius: '16px' }}>
            <Stethoscope size={28} color="#9d8df1" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Кабінет спеціаліста
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', fontWeight: 300 }}>
              Вітаємо, {displayName}. Моніторинг стану ваших пацієнтів.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* STATS */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: '24px', border: '1px solid rgba(157, 141, 241, 0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: '#9d8df115', mr: 2 }}><Users color="#9d8df1" /></Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>{stats.totalPatients}</Typography>
                <Typography variant="caption" color="text.secondary">УСЬОГО ПАЦІЄНТІВ</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: '24px', border: '1px solid rgba(157, 141, 241, 0.1)' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: '#2ecc7115', mr: 2 }}><UserCheck color="#2ecc71" /></Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>{stats.activeToday}</Typography>
                <Typography variant="caption" color="text.secondary">АКТИВНІ СЬОГОДНІ</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500 }}>Швидкий доступ</Typography>
      <Stack spacing={2}>
        <Button 
          fullWidth
          onClick={() => navigate('/patients')}
          sx={{
            p: 2.5, borderRadius: '20px', justifyContent: 'space-between',
            bgcolor: 'white', border: '1px solid #f1f4ff', color: '#2c3e50', textTransform: 'none',
            '&:hover': { borderColor: '#9d8df1', bgcolor: '#fbfaff' }
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <ClipboardList size={20} color="#9d8df1" />
            <Typography>Список моїх пацієнтів</Typography>
          </Stack>
          <ChevronRight size={18} color="#cbd5e1" />
        </Button>
      </Stack>
    </Container>
  );
};

export default PsychologistDashboard;