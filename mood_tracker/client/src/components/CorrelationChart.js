import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';

const CorrelationChart = ({ data, interpretation, score, type = "sleep" }) => {

  const isEnergy = type === "energy";
  const mainColor = isEnergy ? "#ff4081" : "#6a5acd"; 
  const barColor = isEnergy ? "#f48fb1" : "#9c27b0";

  return (
    <Card sx={{ mt: 3, p: 1, borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #eee' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ color: mainColor, mb: 1 }}>
          {isEnergy ? "Взаємозв'язок: Енергія та Настрій" : "Взаємозв'язок: Сон та Настрій"}
        </Typography>
        
        <Box sx={{ height: 380, width: '100%', mt: 2 }}>
          <ResponsiveContainer>
            <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={barColor} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={barColor} stopOpacity={0.2}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fontSize: 11}} tickFormatter={(str) => str.split('-').slice(1).reverse().join('.')} />

              <YAxis yAxisId="left" domain={[0, isEnergy ? 10 : 12]} tick={{fontSize: 11}} label={{ value: isEnergy ? 'Рівень енергії' : 'Години сну', angle: -90, position: 'insideLeft', fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{fontSize: 11}} label={{ value: 'Настрій', angle: 90, position: 'insideRight', fontSize: 12 }} />
              
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              
              <Bar 
                yAxisId="left" 
                dataKey={isEnergy ? "energyLevel" : "sleepHours"} 
                name={isEnergy ? "Енергія (1-10)" : "Сон (год)"} 
                fill="url(#colorFill)" 
                barSize={24} 
                radius={[6, 6, 0, 0]} 
              />

              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey={isEnergy ? "mood" : "avgMood"} 
                name="Середній настрій" 
                stroke={mainColor} 
                strokeWidth={4} 
                dot={{ r: 5, fill: mainColor, strokeWidth: 2, stroke: "#fff" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 3, p: 2.5, bgcolor: isEnergy ? 'rgba(255, 64, 129, 0.05)' : 'rgba(106, 90, 205, 0.05)', borderRadius: 3, borderLeft: `6px solid ${mainColor}` }}>
          <Typography variant="subtitle2" sx={{ color: mainColor, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800, mb: 0.5 }}>
            Результат аналізу
          </Typography>
          <Typography variant="body1">
            {interpretation} <Box component="span" sx={{ fontWeight: 'bold', color: mainColor }}> (r = {score})</Box>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CorrelationChart;