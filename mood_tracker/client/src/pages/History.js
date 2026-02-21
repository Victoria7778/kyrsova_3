import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [historyData, setHistoryData] = useState({ mood: [], sleep: [], events: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [moodRes, sleepRes] = await Promise.all([
          axios.get('http://localhost:5000/api/mood/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/mood/sleep/all', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setHistoryData({
          mood: moodRes.data,
          sleep: sleepRes.data,
          events: [] 
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
    return d.toLocaleDateString('en-CA'); // Повертає формат YYYY-MM-DD
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const currentTileDate = formatDate(date);
    
    const hasMood = historyData.mood.some(m => m.date && formatDate(m.date) === currentTileDate);
    const hasSleep = historyData.sleep.some(s => s.date === currentTileDate);

    return (
      <div style={styles.tileIcons}>
        {hasMood && <span title="Настрій">🎭</span>}
        {hasSleep && <span title="Сон">🛌</span>}
      </div>
    );
  };

  // Фільтрація даних для відображення під календарем
  const selectedDateStr = formatDate(selectedDate);
  const dailyMoods = historyData.mood.filter(m => formatDate(m.date) === selectedDateStr);
  const dailySleep = historyData.sleep.find(s => s.date === selectedDateStr);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Історія активності 📅</h1>
      
      <div style={styles.contentLayout}>
        <div style={styles.calendarSection}>
          <Calendar 
            onChange={setSelectedDate} 
            value={selectedDate} 
            tileContent={tileContent}
            locale="uk-UA"
          />
        </div>

        <div style={styles.detailsSection}>
          <h3 style={styles.detailsTitle}>Деталі за {selectedDate.toLocaleDateString('uk-UA')}</h3>
          
          {/* Відображення Сну */}
          <div style={styles.detailBlock}>
            <strong>🛌 Сон:</strong> {dailySleep ? `${dailySleep.hours} год. (якість: ${dailySleep.quality})` : 'Записів немає'}
          </div>

          {/* Відображення Настрою */}
          <div style={styles.detailBlock}>
            <strong>🎭 Настрій протягом дня:</strong>
            {dailyMoods.length > 0 ? (
              dailyMoods.map((m, index) => (
                <div key={index} style={styles.moodItem}>
                  <span style={styles.moodScore}>{m.moodScore}/10</span> 
                  <span style={styles.moodType}>{m.feelingType}</span>
                  {m.comment && <p style={styles.moodComment}>"{m.comment}"</p>}
                  <small style={styles.timeLabel}>{new Date(m.date).toLocaleTimeString('uk-UA', {hour: '2-digit', minute:'2-digit'})}</small>
                </div>
              ))
            ) : <p>Записів настрою немає</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '30px', maxWidth: '1100px', fontFamily: 'Arial, sans-serif' },
  title: { color: '#2c3e50', marginBottom: '25px', fontWeight: '800' },
  contentLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' },
  calendarSection: { backgroundColor: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  tileIcons: { display: 'flex', justifyContent: 'center', gap: '2px', fontSize: '12px', marginTop: '5px' },
  detailsSection: { backgroundColor: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', minHeight: '300px' },
  detailsTitle: { marginTop: 0, borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', color: '#34495e' },
  detailBlock: { marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '12px' },
  moodItem: { padding: '10px 0', borderBottom: '1px solid #eee' },
  moodScore: { fontWeight: 'bold', color: '#4a90e2', marginRight: '10px' },
  moodType: { textTransform: 'capitalize', color: '#2c3e50' },
  moodComment: { fontStyle: 'italic', color: '#636e72', margin: '5px 0' },
  timeLabel: { color: '#b2bec3' }
};

export default History;