import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, LabelList 
} from 'recharts';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

const EventImpactChart = ({ data, interpretation }) => {
  const colors = ['#9c27b0', '#2196f3', '#4caf50', '#ff9800', '#f44336', '#3f51b5', '#e91e63'];

  const sorted = data && data.length > 0 ? [...data].sort((a, b) => b.avgMood - a.avgMood) : [];
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  const getAdviceData = () => {
    if (!data || data.length === 0) return { text: interpretation, color: '#475569', icon: <Lightbulb size={20} color="white" /> };
    
    if (best.avgMood > 7.5) {
      return {
        text: `Ваш основний ресурс — це "${best.category}". Дні з цією активністю мають найвищий рівень емоційного благополуччя.`,
        color: '#2e7d32',
        bgcolor: '#edf7ed',
        icon: <CheckCircle2 size={20} color="white" />
      };
    }
    if (worst.avgMood < 4.5) {
      return {
        text: `Помічено негативний вплив категорії "${worst.category}". Це може бути зоною емоційного виснаження.`,
        color: '#d32f2f',
        bgcolor: '#fdeded',
        icon: <AlertTriangle size={20} color="white" />
      };
    }
    return { text: interpretation, color: '#1e293b', bgcolor: '#f8fafc', icon: <Lightbulb size={20} color="white" /> };
  };

  const advice = getAdviceData();

  return (
    <Card sx={{ borderRadius: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', overflow: 'visible' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="800" sx={{ color: '#2c3e50' }}>
             Вплив життєвих активностей
          </Typography>
          <Chip label="Аналіз середніх значень" size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
        </Box>
        
        <Box sx={{ height: 400, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ left: 60, right: 60, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f5f5f5" />
              <XAxis type="number" domain={[0, 10]} hide />
              <YAxis 
                dataKey="category" 
                type="category" 
                width={120} 
                tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(157, 141, 241, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} балів`, 'Середній настрій']}
              />
              <Bar 
                dataKey="avgMood" 
                radius={[0, 10, 10, 0]} 
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    fillOpacity={entry.category === best?.category ? 1 : 0.7} 
                  />
                ))}
                <LabelList 
                  dataKey="avgMood" 
                  position="right" 
                  style={{ fill: '#475569', fontWeight: 800, fontSize: '13px' }} 
                  formatter={(val) => `${val.toFixed(1)} / 10`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ 
          mt: 4, 
          p: 3, 
          bgcolor: advice.bgcolor || '#f8fafc', 
          borderRadius: 4, 
          border: `1px solid ${advice.color}22`,
          display: 'flex',
          gap: 2,
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ 
            bgcolor: advice.color === '#1e293b' ? '#9d8df1' : advice.color, 
            p: 1.2, 
            borderRadius: 2, 
            display: 'flex',
            alignItems: 'center',
            height: 'fit-content'
          }}>
            {advice.icon}
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight="800" color={advice.color} gutterBottom>
              Системний висновок:
            </Typography>
            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>
              {advice.text}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventImpactChart;