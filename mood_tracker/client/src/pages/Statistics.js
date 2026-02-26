import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, ToggleButton, ToggleButtonGroup, 
  Card, CardContent, CircularProgress, Fade 
} from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart 
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('day'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/mood/stats?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Помилка завантаження статистики", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
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
          minWidth: 150, 
          boxShadow: '0 8px 20px rgba(157, 141, 241, 0.15)', 
          borderRadius: '12px',
          border: '1px solid #f3f0ff'
        }}>
          <CardContent sx={{ p: '12px !important' }}>
            <Typography variant="caption" fontWeight="bold" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9d8df1', fontWeight: 800, mt: 0.5 }}>
              🎭 Настрій: {mood}/10
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
              <strong>Стан:</strong> {feeling}
            </Typography>
            {comment && (
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.disabled' }}>
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
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>
      {/* HEADER */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrendingUp color="#9d8df1" size={28} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
            Динаміка настрою
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={handlePeriodChange}
          size="small"
          sx={{ 
            backgroundColor: 'white', 
            borderRadius: '12px',
            '& .MuiToggleButton-root': {
              px: 2,
              borderRadius: '10px !important',
              border: 'none',
              fontWeight: 600,
              textTransform: 'none',
              '&.Mui-selected': {
                backgroundColor: '#f3f0ff',
                color: '#9d8df1',
              }
            }
          }}
        >
          <ToggleButton value="day">День</ToggleButton>
          <ToggleButton value="week">Тиждень</ToggleButton>
          <ToggleButton value="month">Місяць</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* CHART CARD */}
      <Fade in={!loading}>
        <Card sx={{ 
          borderRadius: '24px', 
          boxShadow: '0 10px 40px rgba(157, 141, 241, 0.06)',
          border: '1px solid rgba(157, 141, 241, 0.1)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: '#9d8df1' }} />
              </Box>
            ) : (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#9d8df1" 
                      strokeWidth={4} 
                      dot={{ r: 5, fill: '#9d8df1', stroke: '#fff', strokeWidth: 2 }} 
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      animationDuration={1200} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Statistics;