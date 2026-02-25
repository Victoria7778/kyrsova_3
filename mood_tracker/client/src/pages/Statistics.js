import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart 
} from 'recharts';

const Statistics = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('day'); 

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/mood/stats?period=${period}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Помилка завантаження статистики", err);
      }
    };
    fetchStats();
  }, [period]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { mood, feeling, comment } = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: 'white', padding: '12px', borderRadius: '12px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: 'none' 
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: '0', color: '#4a90e2', fontWeight: 'bold' }}>🎭 Настрій: {mood}/10</p>
          <p style={{ margin: '5px 0 0', fontSize: '14px' }}><strong>Стан:</strong> {feeling}</p>
          {comment && <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#7f8c8d' }}>"{comment}"</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Динаміка настрою 📈</h2>
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          {['day', 'week', 'month'].map((p) => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding: '6px 12px', border: 'none', borderRadius: '8px', cursor: 'pointer',
              backgroundColor: period === p ? 'white' : 'transparent',
              fontWeight: period === p ? 'bold' : 'normal'
            }}>
              {p === 'day' ? 'День' : p === 'week' ? 'Тиждень' : 'Місяць'}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} />
            <YAxis domain={[0, 10]} tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#4a90e2" 
              strokeWidth={4} 
              dot={{ r: 6, fill: '#4a90e2', stroke: '#fff', strokeWidth: 2 }} 
              animationDuration={1500} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistics;