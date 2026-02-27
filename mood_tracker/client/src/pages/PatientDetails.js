import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, Container, Typography, Card, Paper, IconButton, 
  Stack, CircularProgress, Grid, Alert, AlertTitle 
} from '@mui/material';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { ArrowLeft, TrendingUp, AlertTriangle } from 'lucide-react';

const PatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/psychologist/patient-stats/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Перевіряємо наявність масиву moods
        const moodData = res.data.moods || [];

        const formattedMoods = moodData.map(m => ({
          // Форматуємо дату для осі X
          date: new Date(m.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
          score: m.moodScore
        }));

        setData({ ...res.data, moods: formattedMoods });
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  // Перевірка на критичний стан (останній настрій менше 4)
  const isAlertStatus = data?.moods?.length > 0 && data.moods[data.moods.length - 1].score < 4;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate('/patients')} sx={{ bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={20} />
        </IconButton>
        <Box>
          <Typography variant="h5" fontWeight={600} color="#2c3e50">Аналітика: {data?.name || 'Пацієнт'}</Typography>
          <Typography variant="body2" color="text.secondary">Анонімізовані показники стану</Typography>
        </Box>
      </Stack>

      {isAlertStatus && (
        <Alert severity="error" icon={<AlertTriangle />} sx={{ mb: 4, borderRadius: '16px' }}>
          <AlertTitle>Зверніть увагу</AlertTitle>
          Останні показники настрою пацієнта вказують на потенційне погіршення стану.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: '24px', minHeight: '450px', border: '1px solid #f1f4ff' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box sx={{ p: 1, bgcolor: '#f3f0ff', borderRadius: '10px' }}>
                  <TrendingUp color="#9d8df1" size={20} />
                </Box>
                <Typography variant="h6" fontWeight={500}>Динаміка настрою</Typography>
              </Stack>
            </Stack>

            {/* Задаємо фіксовану висоту контейнеру, щоб Recharts не видавав помилку */}
            <Box sx={{ height: 350, width: '100%', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.moods || []}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9d8df1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9d8df1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f4ff" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#95a5a6' }} 
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#95a5a6' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                  />
                  <ReferenceLine y={3} stroke="#ff4d4d" strokeDasharray="5 5" label={{ value: 'Критично', position: 'right', fill: '#ff4d4d', fontSize: 10 }} />
                  
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    name="Настрій"
                    stroke="#9d8df1" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: '24px', p: 3, bgcolor: '#fbfaff', border: '1px solid #f1f4ff', boxShadow: 'none' }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Політика конфіденційності</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
              Текстові коментарі пацієнта приховані для забезпечення безпечного простору. Аналізуйте стан за числовими трендами.
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDetails;