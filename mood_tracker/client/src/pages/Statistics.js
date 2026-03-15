import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, ToggleButton, ToggleButtonGroup, 
  Card, CardContent, CircularProgress, Fade, Grid 
} from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart 
} from 'recharts';
import { BarChart3, TrendingUp, BrainCircuit, Zap, Moon } from 'lucide-react';
import CorrelationChart from '../components/CorrelationChart';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('week'); 
  const [loading, setLoading] = useState(true);
  
  
  const [sleepCorrelation, setSleepCorrelation] = useState(null);
  const [energyCorrelation, setEnergyCorrelation] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const statsRes = await axios.get(`http://localhost:5000/api/mood/stats?period=${period}`, { headers });
        setData(statsRes.data);

        const sleepRes = await axios.get(`http://localhost:5000/api/analytics/my-correlation`, { headers });
        setSleepCorrelation(sleepRes.data);

        const energyRes = await axios.get(`http://localhost:5000/api/analytics/energy-correlation`, { headers });
        setEnergyCorrelation(energyRes.data);

      } catch (err) {
        console.error("Помилка завантаження даних аналітики:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [period]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { mood, feeling, comment } = payload[0].payload;
      return (
        <Card sx={{ 
          minWidth: 160, 
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
          borderRadius: '12px',
          border: 'none'
        }}>
          <CardContent sx={{ p: 1.5 }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9d8df1', fontWeight: 800, mt: 0.5 }}>
              🎭 Настрій: {mood}/10
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Стан:</strong> {feeling || 'Не вказано'}
            </Typography>
            {comment && (
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary', display: 'block', mt: 0.5 }}>
                "{comment}"
              </Typography>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrendingUp color="#9d8df1" size={32} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>
            Центр Аналітики
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          sx={{ bgcolor: 'white', borderRadius: '14px', p: 0.5, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
        >
          <ToggleButton value="day" sx={{ border: 'none', borderRadius: '10px !important', px: 3 }}>День</ToggleButton>
          <ToggleButton value="week" sx={{ border: 'none', borderRadius: '10px !important', px: 3 }}>Тиждень</ToggleButton>
          <ToggleButton value="month" sx={{ border: 'none', borderRadius: '10px !important', px: 3 }}>Місяць</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Fade in={!loading}>
        <Box>
          <Card sx={{ borderRadius: '24px', boxShadow: '0 10px 40px rgba(157, 141, 241, 0.06)', border: '1px solid rgba(157, 141, 241, 0.1)', mb: 6 }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChart3 size={22} color="#9d8df1" /> Динаміка вашого настрою
              </Typography>
              
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#9d8df1" 
                      strokeWidth={4} 
                      dot={{ r: 6, fill: '#9d8df1', stroke: '#fff', strokeWidth: 3 }} 
                      activeDot={{ r: 8, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <BrainCircuit color="#9d8df1" size={32} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
                Глибока аналітика залежностей
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Moon size={18} color="#6a5acd" />
                   <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Вплив відпочинку</Typography>
                </Box>
                {sleepCorrelation ? (
                  <CorrelationChart 
                    data={sleepCorrelation.chartData} 
                    interpretation={sleepCorrelation.interpretation}
                    score={sleepCorrelation.correlationScore}
                    type="sleep"
                  />
                ) : <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress size={20} /></Box>}
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                   <Zap size={18} color="#ff4081" />
                   <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">Фізичний ресурс</Typography>
                </Box>
                {energyCorrelation ? (
                  <CorrelationChart 
                    data={energyCorrelation.chartData} 
                    interpretation={energyCorrelation.interpretation}
                    score={energyCorrelation.score}
                    type="energy"
                  />
                ) : (
                  <Box sx={{ p: 6, textAlign: 'center', border: '2px dashed #eee', borderRadius: 8, bgcolor: '#fafafa' }}>
                    <Typography variant="body2" color="text.disabled">
                      Дані про енергію завантажуються або відсутні
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Fade>

      {loading && (
        <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress sx={{ color: '#9d8df1' }} />
        </Box>
      )}
    </Box>
  );
};

export default Statistics;