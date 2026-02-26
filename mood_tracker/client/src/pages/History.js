import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { 
  Box, Container, Typography, Grid, Paper, Stack, Chip, 
  CircularProgress, Avatar, Divider
} from '@mui/material';
import { 
  Activity, Moon, Calendar as CalendarIcon, 
  HeartPulse, Clock, Info, Zap
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyData, setHistoryData] = useState({ mood: [], sleep: [], events: [], physical: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [moodRes, sleepRes, eventRes, physRes] = await Promise.all([
          axios.get('http://localhost:5000/api/mood/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/mood/sleep/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/mood/events/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/mood/physical/all', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })) 
        ]);

        setHistoryData({
          mood: moodRes.data,
          sleep: sleepRes.data,
          events: eventRes.data,
          physical: physRes.data 
        });
        setLoading(false);
      } catch (err) {
        console.error("Помилка завантаження історії:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-CA'); 
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const currentTileDate = formatDate(date);
    const hasData = [
      historyData.mood.some(m => m.date && formatDate(m.date) === currentTileDate),
      historyData.sleep.some(s => s.date === currentTileDate),
      historyData.events.some(e => e.date && formatDate(e.date) === currentTileDate),
      historyData.physical.some(p => p.date && formatDate(p.date) === currentTileDate)
    ].some(Boolean);
    
    return hasData ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: '2px' }}>
        <Box sx={{ width: '4px', height: '4px', bgcolor: '#9d8df1', borderRadius: '50%' }} />
      </Box>
    ) : null;
  };

  const selectedDateStr = formatDate(selectedDate);
  const dailyMoods = historyData.mood.filter(m => formatDate(m.date) === selectedDateStr);
  const dailySleep = historyData.sleep.find(s => s.date === selectedDateStr);
  const dailyEvents = historyData.events.filter(e => formatDate(e.date) === selectedDateStr);
  const dailyPhys = historyData.physical.filter(p => formatDate(p.date) === selectedDateStr);

  const columnScrollStyles = {
    flex: 1, 
    overflowY: 'auto', 
    pr: 1,
    '&::-webkit-scrollbar': { width: '5px' },
    '&::-webkit-scrollbar-thumb': { bgcolor: '#f3f0ff', borderRadius: '10px' }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#9d8df1' }} />
    </Box>
  );

  return (
    <Container maxWidth={false} sx={{ py: 3, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* HEADER */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 500, color: '#2c3e50' }}>Мій щоденник</Typography>
        <Chip 
          label={selectedDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })} 
          sx={{ bgcolor: '#f3f0ff', color: '#9d8df1', fontWeight: 500 }} 
        />
      </Stack>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        
        {/* КОЛОНКА 1: КАЛЕНДАР ТА ПОДІЇ */}
        <Grid item xs={12} md={3.5} sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: '24px', border: '1px solid #f1f4ff' }}>
            <Calendar onChange={setSelectedDate} value={selectedDate} tileContent={tileContent} locale="uk-UA" />
          </Paper>

          <Paper elevation={0} sx={{ p: 2, flex: 1, borderRadius: '24px', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: '1px solid #f1f4ff', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
              <Avatar sx={{ bgcolor: '#fff8f1', width: 32, height: 32 }}><CalendarIcon size={16} color="#ff9f43" /></Avatar>
              <Typography variant="subtitle2" fontWeight={500}>Події дня</Typography>
            </Stack>
            <Box sx={columnScrollStyles}>
              {dailyEvents.length > 0 ? (
                <Stack spacing={1}>
                  {dailyEvents.map((e, i) => (
                    <Box key={i} sx={{ p: 1.5, bgcolor: '#fffaf5', borderRadius: '12px', borderLeft: '4px solid #ff9f43' }}>
                      <Typography variant="body2" fontWeight={400}>{e.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{e.category || 'Загальне'}</Typography>
                    </Box>
                  ))}
                </Stack>
              ) : <Typography variant="caption" color="text.disabled">Сьогодні без подій</Typography>}
            </Box>
          </Paper>
        </Grid>

        {/* КОЛОНКА 2: ЖУРНАЛ НАСТРОЮ (ОНОВЛЕНО ФОН) */}
        <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', borderRadius: '24px', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: '1px solid #f1f4ff', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
              <Avatar sx={{ bgcolor: '#f3f0ff', width: 40, height: 40 }}><Activity size={24} color="#9d8df1" /></Avatar>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>Журнал настрою</Typography>
            </Stack>

            <Box sx={columnScrollStyles}>
              {dailyMoods.length > 0 ? (
                <Stack spacing={2}>
                  {dailyMoods.map((m, i) => (
                    <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: '20px', border: '1px solid #f1f4ff', bgcolor: '#fafbff' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box>
                          <Typography variant="body1" fontWeight={500} color="#2c3e50">{m.feelingType}</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Clock size={14} color="#94a3b8" />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(m.date).toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}
                            </Typography>
                          </Stack>
                        </Box>
                        <Chip label={`${m.moodScore}/10`} sx={{ bgcolor: '#9d8df1', color: '#fff', fontWeight: 500, borderRadius: '10px' }} />
                      </Stack>
                      {m.comment && (
                        <Typography variant="body2" sx={{ color: '#5f6c7b', fontStyle: 'italic', bgcolor: '#fff', p: 1.5, borderRadius: '12px', mt: 1, border: '1px solid #f1f4ff' }}>
                          "{m.comment}"
                        </Typography>
                      )}
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Stack alignItems="center" justifyContent="center" sx={{ height: '100%', opacity: 0.3 }}>
                  <Info size={48} />
                  <Typography variant="body1">Журнал настрою порожній</Typography>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* КОЛОНКА 3: ФІЗИЧНИЙ СТАН */}
        <Grid item xs={12} md={3.5} sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
          <Paper elevation={0} sx={{ p: 2.5, height: '100%', borderRadius: '24px', display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: '1px solid #f1f4ff', overflow: 'hidden' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2.5}>
              <Avatar sx={{ bgcolor: '#fff0f3', width: 32, height: 32 }}><HeartPulse size={16} color="#ff7eb3" /></Avatar>
              <Typography variant="subtitle2" fontWeight={500}>Фізичний стан</Typography>
            </Stack>
            
            <Stack direction="row" spacing={2} mb={3}>
               <Box sx={{ flex: 1, p: 2, bgcolor: '#f8f9ff', borderRadius: '16px', textAlign: 'center' }}>
                  <Moon size={18} color="#b8aff5" style={{ marginBottom: '4px' }} />
                  <Typography variant="h5" fontWeight={500}>{dailySleep ? `${dailySleep.hours}г` : '--'}</Typography>
                  <Typography variant="caption" color="text.secondary">Сон</Typography>
               </Box>
               <Box sx={{ flex: 1, p: 2, bgcolor: '#fff0f3', borderRadius: '16px', textAlign: 'center' }}>
                  <Zap size={18} color="#ff7eb3" style={{ marginBottom: '4px' }} />
                  <Typography variant="h5" fontWeight={500}>{dailyPhys[0] ? `${dailyPhys[0].energyLevel}/10` : '--'}</Typography>
                  <Typography variant="caption" color="text.secondary">Енергія</Typography>
               </Box>
            </Stack>

            <Divider sx={{ mb: 2 }} />
            
            <Box sx={columnScrollStyles}>
              <Typography variant="caption" fontWeight={500} color="text.secondary" sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase' }}>Деталі здоров'я</Typography>
              {dailyPhys.length > 0 ? (
                <Stack spacing={1.5}>
                  {dailyPhys.map((p, i) => {
                    const hasContent = p.stressLevel !== undefined || 
                                       p.sleepQuality !== undefined || 
                                       (p.symptoms && p.symptoms.length > 0);

                    if (!hasContent) return null;

                    return (
                      <Box key={i} sx={{ p: 2, borderRadius: '16px', border: '1px solid #f1f4ff', bgcolor: '#fafbff' }}>
                        <Stack direction="row" spacing={1} mb={hasContent ? 1.5 : 0} flexWrap="wrap" gap={1}>
                          {p.stressLevel !== undefined && (
                            <Chip label={`Стрес: ${p.stressLevel}`} size="small" variant="outlined" color="primary" sx={{ fontWeight: 400 }} />
                          )}
                          {p.sleepQuality !== undefined && (
                            <Chip label={`Сон: ${p.sleepQuality}`} size="small" variant="outlined" color="secondary" sx={{ fontWeight: 400 }} />
                          )}
                        </Stack>
                        {p.symptoms && p.symptoms.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {p.symptoms.map((s, si) => (
                              <Chip key={si} label={s} size="small" sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0', fontSize: '11px', fontWeight: 400 }} />
                            ))}
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              ) : <Typography variant="caption" color="text.disabled">Записів немає</Typography>}
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
};

export default History;