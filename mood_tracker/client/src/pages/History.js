import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import { 
  Activity, 
  Moon, 
  Calendar as CalendarIcon, 
  HeartPulse, 
  Clock,
  ChevronRight 
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';
import { sharedStyles } from '../styles/SharedStyles';

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

    return hasData ? <div style={sharedStyles.tileDot} /> : null;
  };

  const selectedDateStr = formatDate(selectedDate);
  const dailyMoods = historyData.mood.filter(m => formatDate(m.date) === selectedDateStr);
  const dailySleep = historyData.sleep.find(s => s.date === selectedDateStr);
  const dailyEvents = historyData.events.filter(e => formatDate(e.date) === selectedDateStr);
  const dailyPhys = historyData.physical.filter(p => formatDate(p.date) === selectedDateStr);

  return (
    <div style={sharedStyles.container}>
      <header style={sharedStyles.header}>
        <h1 style={sharedStyles.title}>Історія активності 🗓️</h1>
        <p style={sharedStyles.subtitle}>
          {selectedDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </header>

      <div style={sharedStyles.contentLayout}>
        
        <div style={{ width: '100%' }}>
          <div className="glass-card" style={sharedStyles.calendarCard}>
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              tileContent={tileContent} 
              locale="uk-UA" 
            />
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div className="glass-card" style={sharedStyles.physCard}>
            <div style={sharedStyles.sectionHeader}>
              <HeartPulse size={20} color="#ff7eb3" />
              <h3 style={sharedStyles.sectionTitle}>Фізичний стан</h3>
            </div>
            {dailyPhys.length > 0 ? dailyPhys.map((p, i) => (
              <div key={i} style={sharedStyles.physEntry}>
                <p style={sharedStyles.energyText}>Енергія: <strong>{p.energyLevel}/10</strong></p>
                <div style={sharedStyles.tagWrapper}>
                  {p.symptoms?.map((s, idx) => (
                    <span key={idx} style={sharedStyles.symptomTag}>{s}</span>
                  ))}
                </div>
              </div>
            )) : <p style={sharedStyles.emptyText}>Записів немає</p>}
          </div>
        </div>

        {/* КОЛОНКА 3: АКТИВНІСТЬ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
          
          {/* Сон */}
          <div className="glass-card" style={sharedStyles.actionCard}>
            <div style={sharedStyles.cardTop}>
              <div style={sharedStyles.cardLabel}><Moon size={16} color="#b8aff5" /> Сон</div>
            </div>
            {dailySleep ? (
              <p style={sharedStyles.cardValue}><strong>{dailySleep.hours}г</strong> <small>(якість: {dailySleep.quality})</small></p>
            ) : <p style={sharedStyles.emptyText}>Не вказано</p>}
          </div>

          {/* Події */}
          {dailyEvents.length > 0 ? dailyEvents.map((e, i) => (
            <div key={i} className="glass-card" style={sharedStyles.actionCard}>
              <div style={sharedStyles.cardTop}>
                <div style={sharedStyles.cardLabel}><CalendarIcon size={16} color="#ff9f43" /> Подія</div>
                <ChevronRight size={14} color="#bdc3c7" />
              </div>
              <p style={sharedStyles.cardValue}>{e.title}</p>
              <span style={{ fontSize: '10px', color: '#ff9f43', fontWeight: '800' }}>{e.category}</span>
            </div>
          )) : (
            <div className="glass-card" style={sharedStyles.actionCard}>
               <div style={sharedStyles.cardTop}><CalendarIcon size={16} color="#bdc3c7" /><span style={sharedStyles.cardLabel}>Події</span></div>
               <p style={sharedStyles.emptyText}>Подій не було</p>
            </div>
          )}

          {/* Настрій */}
          {dailyMoods.length > 0 ? dailyMoods.map((m, i) => (
            <div key={i} className="glass-card" style={sharedStyles.actionCard}>
              <div style={sharedStyles.cardTop}>
                <div style={sharedStyles.cardLabel}><Activity size={16} color="#9d8df1" /> Настрій</div>
                <span style={sharedStyles.timeLabel}><Clock size={12}/> {new Date(m.date).toLocaleTimeString('uk-UA', {hour:'2-digit', minute:'2-digit'})}</span>
              </div>
              <p style={sharedStyles.cardValue}><strong>{m.moodScore}/10</strong> — {m.feelingType}</p>
              {m.comment && <p style={sharedStyles.commentText}>"{m.comment}"</p>}
            </div>
          )) : null}
        </div>
      </div>
    </div>
  );
};

export default History;