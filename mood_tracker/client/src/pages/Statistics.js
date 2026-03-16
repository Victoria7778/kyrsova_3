import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, ToggleButton, ToggleButtonGroup, 
  Card, CardContent, CircularProgress, Fade, Grid 
} from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart 
} from 'recharts';
import { TrendingUp, BrainCircuit, Zap, Moon, LayoutList, BarChart3 } from 'lucide-react';

import CorrelationChart from '../components/CorrelationChart';
import EventImpactChart from '../components/EventImpactChart';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('week'); 
  const [loading, setLoading] = useState(true);
  
  const [sleepCorrelation, setSleepCorrelation] = useState(null);
  const [energyCorrelation, setEnergyCorrelation] = useState(null);
  const [eventImpact, setEventImpact] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("Авторизація відсутня");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const API_BASE = "http://localhost:5000/api";

      try {
        const [statsRes, sleepRes, energyRes, eventRes] = await Promise.all([
          axios.get(`${API_BASE}/mood/stats?period=${period}`, { headers }),
          axios.get(`${API_BASE}/analytics/my-correlation`, { headers }),
          axios.get(`${API_BASE}/analytics/energy-correlation`, { headers }),
          axios.get(`${API_BASE}/analytics/event-impact`, { headers })
        ]);

        setData(statsRes.data);
        setSleepCorrelation(sleepRes.data);
        setEnergyCorrelation(energyRes.data);
        setEventImpact(eventRes.data);

      } catch (err) {
        console.error("Помилка завантаження аналітики:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [period]);

  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) setPeriod(newPeriod);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TrendingUp color="#9d8df1" size={35} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', letterSpacing: '-0.5px' }}>
            Центр Аналітики
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          sx={{ bgcolor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <ToggleButton value="day" sx={{ px: 3 }}>День</ToggleButton>
          <ToggleButton value="week" sx={{ px: 3 }}>Тиждень</ToggleButton>
          <ToggleButton value="month" sx={{ px: 3 }}>Місяць</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10, gap: 2 }}>
          <CircularProgress sx={{ color: '#9d8df1' }} />
          <Typography color="text.secondary">Готуємо ваші звіти...</Typography>
        </Box>
      ) : (
        <Fade in={!loading} timeout={800}>
          <Box>
            <Card sx={{ borderRadius: 5, boxShadow: '0 10px 40px rgba(157, 141, 241, 0.08)', mb: 6, border: '1px solid #f0f0ff' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <BarChart3 size={24} color="#9d8df1" /> Загальна динаміка настрою
                </Typography>
                <Box sx={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="#9d8df1" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#9d8df1', stroke: '#fff', strokeWidth: 3 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <BrainCircuit color="#9d8df1" size={32} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
                  Глибока аналітика залежностей
                </Typography>
              </Box>

              <Grid container spacing={6}>
                {/* 2. СОН (ШИРОКИЙ) */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Moon size={20} color="#6a5acd" />
                    <Typography variant="subtitle1" fontWeight="700" color="text.primary">Якість сну та емоційний стан</Typography>
                  </Box>
                  {sleepCorrelation && (
                    <CorrelationChart 
                      data={sleepCorrelation.chartData} 
                      interpretation={sleepCorrelation.interpretation}
                      score={sleepCorrelation.correlationScore}
                      type="sleep"
                    />
                  )}
                </Grid>

                {/* 3. ЕНЕРГІЯ (ШИРОКА) */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Zap size={20} color="#ff4081" />
                    <Typography variant="subtitle1" fontWeight="700" color="text.primary">Фізичний ресурс та рівень енергії</Typography>
                  </Box>
                  {energyCorrelation && (
                    <CorrelationChart 
                      data={energyCorrelation.chartData} 
                      interpretation={energyCorrelation.interpretation}
                      score={energyCorrelation.score}
                      type="energy"
                    />
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayoutList size={22} color="#4caf50" />
                    <Typography variant="subtitle1" fontWeight="700" color="text.primary">Вплив щоденних активностей</Typography>
                  </Box>
                  {eventImpact && (
                    <EventImpactChart 
                      data={eventImpact.chartData} 
                      interpretation={eventImpact.interpretation} 
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default Statistics;