import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Container, Typography, Card, Paper, IconButton, 
  Stack, CircularProgress, Grid, Alert, AlertTitle, Divider
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { ArrowLeft, TrendingUp, AlertTriangle, Moon, Zap, LayoutList, BrainCircuit } from 'lucide-react';

import CorrelationChart from '../components/CorrelationChart';
import EventImpactChart from '../components/EventImpactChart';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    sleep: null,
    energy: null,
    events: null
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const API_URL = "http://localhost:5000/api";

      try {
        const res = await axios.get(`${API_URL}/psychologist/patient-stats/${patientId}`, { headers });
        const moodData = res.data.moods || [];
        const formattedMoods = moodData.map(m => ({
          date: new Date(m.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
          score: m.moodScore
        }));
        setData({ ...res.data, moods: formattedMoods });

        const analyticsRes = await axios.get(`${API_URL}/analytics/patient-analysis/${patientId}`, { headers });
        setAnalytics(analyticsRes.data);

      } catch (err) {
        console.error("Помилка завантаження даних пацієнта:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  const isAlertStatus = data?.moods?.length > 0 && data.moods[data.moods.length - 1].score < 4;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/patients')} sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={600} color="#2c3e50">Картка аналітики: {data?.name || 'Пацієнт'}</Typography>
          <Typography variant="body2" color="text.secondary">Професійний моніторинг стану</Typography>
        </Box>
      </Stack>

      {/* ALERT SECTION */}
      {isAlertStatus && (
        <Alert severity="error" icon={<AlertTriangle />} sx={{ mb: 4, borderRadius: '16px', border: '1px solid #ff4d4d' }}>
          <AlertTitle>Критичний стан</AlertTitle>
          Останні показники нижче норми. Рекомендується призначити позачергову консультацію.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* ГРАФІК 1: ДИНАМІКА НАСТРОЮ */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid #f1f4ff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{ p: 1, bgcolor: '#f3f0ff', borderRadius: '10px' }}>
                <TrendingUp color="#9d8df1" size={20} />
              </Box>
              <Typography variant="h6" fontWeight={600}>Часова шкала настрою</Typography>
            </Stack>
            
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.moods || []}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9d8df1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9d8df1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f4ff" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95a5a6' }} />
                  <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#95a5a6' }} />
                  <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <ReferenceLine y={3} stroke="#ff4d4d" strokeDasharray="5 5" label={{ value: 'Критично', fill: '#ff4d4d', fontSize: 10 }} />
                  <Area type="monotone" dataKey="score" stroke="#9d8df1" strokeWidth={4} fill="url(#colorMood)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* ГЛИБОКА АНАЛІТИКА (КЛЮЧОВІ КОРЕЛЯЦІЇ) */}
        <Grid item xs={12}>
          <Box sx={{ mt: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <BrainCircuit color="#9d8df1" size={28} />
            <Typography variant="h5" fontWeight={700} color="#2c3e50">Клінічні кореляції</Typography>
          </Box>
          
          <Grid container spacing={3}>
            {/* Вплив сну */}
            <Grid item xs={12} md={6}>
               <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Moon size={18} color="#6a5acd" />
                  <Typography variant="subtitle2" color="text.secondary">Кореляція: Сон / Настрій</Typography>
               </Stack>
               {analytics.sleep ? (
                 <CorrelationChart 
                    data={analytics.sleep.chartData} 
                    score={analytics.sleep.correlationScore} 
                    interpretation={analytics.sleep.interpretation}
                    type="sleep"
                 />
               ) : <CircularProgress size={20} />}
            </Grid>

            {/* Вплив енергії */}
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Zap size={18} color="#ff4081" />
                  <Typography variant="subtitle2" color="text.secondary">Кореляція: Ресурс / Настрій</Typography>
               </Stack>
               {analytics.energy ? (
                 <CorrelationChart 
                    data={analytics.energy.chartData} 
                    score={analytics.energy.score} 
                    interpretation={analytics.energy.interpretation}
                    type="energy"
                 />
               ) : <CircularProgress size={20} />}
            </Grid>

            {/* Вплив категорій подій */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, mt: 2 }}>
                  <LayoutList size={18} color="#4caf50" />
                  <Typography variant="subtitle2" color="text.secondary">Аналіз поведінкових факторів</Typography>
               </Stack>
               {analytics.events ? (
                 <EventImpactChart 
                    data={analytics.events.chartData} 
                    interpretation={analytics.events.interpretation} 
                 />
               ) : <CircularProgress size={20} />}
            </Grid>
          </Grid>
        </Grid>

        {/* НОТАТКА ПРО КОНФІДЕНЦІЙНІСТЬ */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '16px', p: 3, bgcolor: '#fff4e5', border: '1px solid #ffe2b3' }}>
             <Typography variant="body2" color="#663c00" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
               <AlertTriangle size={16} /> Примітка для спеціаліста: Коментарі пацієнта приховані згідно з угодою про конфіденційність. Використовуйте кореляційні тренди для виявлення патернів поведінки.
             </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDetails;