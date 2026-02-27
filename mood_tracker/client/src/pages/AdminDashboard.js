import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, Card, CardContent, 
  Avatar, Button, Stack, CircularProgress, Alert
} from '@mui/material';
import { 
  Users, 
  UsersRound, 
  SmilePlus, 
  BarChart3, 
  LayoutDashboard, 
  Settings2,
  ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPsychologists: 0,
    avgSystemMood: 0,
    recentRegistrations: 0
  });

  const getDisplayName = () => {
    return localStorage.getItem('userName') || 'Адміністратор';
  };

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        setError('Не вдалося завантажити дані статистики');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <CircularProgress sx={{ color: '#9d8df1' }} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box sx={{ mb: 5 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            bgcolor: '#f3f0ff', width: 56, height: 56, borderRadius: '16px'
          }}>
            <LayoutDashboard size={28} color="#9d8df1" />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 500, color: '#2c3e50' }}>
              Панель керування
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', fontWeight: 300 }}>
              Вітаємо, {getDisplayName()}. Огляд активності системи Moodly
            </Typography>
          </Box>
        </Stack>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4, borderRadius: '16px' }}>{error}</Alert>}

      {/* STATS GRID */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Всього користувачів', val: stats.totalUsers, icon: <Users size={22} />, col: '#9d8df1' },
          { label: 'Психологи', val: stats.totalPsychologists, icon: <UsersRound size={22} />, col: '#b8aff5' },
          { label: 'Настрій системи', val: `${stats.avgSystemMood}/10`, icon: <SmilePlus size={22} />, col: '#ff7eb3' },
          { label: 'Нові за тиждень', val: stats.recentRegistrations, icon: <BarChart3 size={22} />, col: '#ff9f43' }
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ 
              borderRadius: '24px', 
              border: '1px solid rgba(157, 141, 241, 0.1)', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              bgcolor: 'white'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{ 
                  bgcolor: stat.col + '15', mx: 'auto', mb: 2, width: 48, height: 48, borderRadius: '12px'
                }}>
                  <Box sx={{ color: stat.col, display: 'flex' }}>{stat.icon}</Box>
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 500, color: '#2c3e50', mb: 0.5 }}>
                  {stat.val}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b2bec3', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 400 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* QUICK ACTIONS */}
      <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, color: '#2c3e50', pl: 1 }}>
        Швидкі дії
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Button 
            fullWidth
            onClick={() => navigate('/admin')}
            sx={{
              p: 2.5, borderRadius: '20px', justifyContent: 'space-between',
              bgcolor: 'white', border: '1px solid #f1f4ff',
              color: '#2c3e50', textTransform: 'none',
              '&:hover': { bgcolor: '#fbfaff', borderColor: '#9d8df1' }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1, bgcolor: '#f3f0ff', borderRadius: '10px' }}>
                <Settings2 size={20} color="#9d8df1" />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 400 }}>Керування ролями</Typography>
            </Stack>
            <ChevronRight size={18} color="#cbd5e1" />
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button 
            fullWidth
            onClick={() => navigate('/audit')}
            sx={{
              p: 2.5, borderRadius: '20px', justifyContent: 'space-between',
              bgcolor: 'white', border: '1px solid #f1f4ff',
              color: '#2c3e50', textTransform: 'none',
              '&:hover': { bgcolor: '#fbfaff', borderColor: '#ff9f43' }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ p: 1, bgcolor: '#fff4eb', borderRadius: '10px' }}>
                <UsersRound size={20} color="#ff9f43" />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 400 }}>Аудит підключень</Typography>
            </Stack>
            <ChevronRight size={18} color="#cbd5e1" />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;