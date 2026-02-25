import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, 
  Moon, 
  Calendar, 
  HeartPulse, 
  LogOut, 
  User, 
  PlusCircle, 
  ChevronRight 
} from 'lucide-react'; 
import MoodForm from '../components/MoodForm';
import PhysicalForm from '../components/PhysicalForm';
import { sharedStyles } from '../styles/SharedStyles';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));
  
  const [todayMood, setTodayMood] = useState(null);
  const [todaySleep, setTodaySleep] = useState(null);
  const [todayPhysical, setTodayPhysical] = useState(null);

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPhysicalModal, setShowPhysicalModal] = useState(false);

  const [sleepHours, setSleepHours] = useState('');
  const [eventData, setEventData] = useState({ title: '', category: 'інше' });

  const getDisplayName = () => {
    const savedName = localStorage.getItem('userName');
    const userJson = JSON.parse(localStorage.getItem('user') || '{}');
    const email = localStorage.getItem('userEmail') || '';
    const finalName = savedName || userJson.name || email.split('@')[0];
    return finalName && finalName !== 'undefined' ? finalName : 'Користувач';
  };

  const [displayName] = useState(getDisplayName());

  const fetchTodayData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [moodRes, sleepRes, physRes] = await Promise.all([
        axios.get('http://localhost:5000/api/mood/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/mood/sleep/all', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/mood/physical/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setTodayMood(moodRes.data.find(m => m.date.startsWith(today)));
      setTodaySleep(sleepRes.data.find(s => s.date.startsWith(today)));
      setTodayPhysical(physRes.data.find(p => p.date.startsWith(today)));
    } catch (err) {
      console.error("Помилка завантаження даних сьогодні:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchTodayData();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleSleepSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post('http://localhost:5000/api/mood/sleep', 
        { date: today, hours: sleepHours }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSleepModal(false);
      setSleepHours('');
      fetchTodayData();
    } catch (err) {
      alert('Помилка при записі сну');
    }
  };

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  return (
    <div style={sharedStyles.container}>
      <header style={sharedStyles.header}>
        <div style={localStyles.userInfo}>
          <div style={localStyles.avatarCircle}><User size={24} color="white" /></div>
          <div>
            <h1 style={sharedStyles.title}>Вітаємо, {displayName}!</h1>
            <p style={sharedStyles.subtitle}>
              {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', weekday: 'short' })}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} style={localStyles.logoutIconButton}>
          <LogOut size={20} />
        </button>
      </header>

      {/* КАРТКИ СТАТУСУ */}
      <div style={localStyles.statusGrid}>
        <div className="glass-card" style={sharedStyles.glassCard}>
          <div style={localStyles.iconCircle('#9d8df1')}><Activity size={18} color="white" /></div>
          <span style={sharedStyles.cardLabel}>Настрій</span>
          <p style={localStyles.cardVal}>{todayMood ? `${todayMood.moodScore}/10` : '--'}</p>
        </div>
        <div className="glass-card" style={sharedStyles.glassCard}>
          <div style={localStyles.iconCircle('#b8aff5')}><Moon size={18} color="white" /></div>
          <span style={sharedStyles.cardLabel}>Сон</span>
          <p style={localStyles.cardVal}>{todaySleep ? `${todaySleep.hours}г` : '--'}</p>
        </div>
        <div className="glass-card" style={sharedStyles.glassCard}>
          <div style={localStyles.iconCircle('#ff7eb3')}><HeartPulse size={18} color="white" /></div>
          <span style={sharedStyles.cardLabel}>Енергія</span>
          <p style={localStyles.cardVal}>{todayPhysical ? `${todayPhysical.energyLevel}/10` : '--'}</p>
        </div>
      </div>

      <div style={localStyles.actionSection}>
        <button onClick={() => setShowMoodModal(true)} style={localStyles.mainActionGradient}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={localStyles.whiteIconCircle}><PlusCircle size={30} color="#9d8df1" /></div>
            <div style={{ textAlign: 'left' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: 'white' }}>Як ти сьогодні?</h2>
              <p style={{ margin: 0, opacity: 0.8, fontSize: '14px', color: 'white' }}>Додай новий запис у щоденник</p>
            </div>
          </div>
          <ChevronRight size={24} color="white" />
        </button>

        <div style={localStyles.secondaryGrid}>
          <button onClick={() => setShowSleepModal(true)} style={localStyles.neomorphBtn}>
            <Moon size={22} color="#9d8df1" />
            <span>Сон</span>
          </button>
          <button onClick={() => setShowEventModal(true)} style={localStyles.neomorphBtn}>
            <Calendar size={22} color="#9d8df1" />
            <span>Подія</span>
          </button>
          <button onClick={() => setShowPhysicalModal(true)} style={localStyles.neomorphBtn}>
            <HeartPulse size={22} color="#9d8df1" />
            <span>Здоров'я</span>
          </button>
        </div>
      </div>

      {/* МОДАЛЬНІ ВІКНА */}
      {(showMoodModal || showPhysicalModal || showSleepModal) && (
        <div style={localStyles.modalOverlay}>
           <div className="glass-card" style={localStyles.modalBox}>
             <button 
               onClick={() => {
                 setShowMoodModal(false);
                 setShowPhysicalModal(false);
                 setShowSleepModal(false);
               }} 
               style={localStyles.closeModalBtn}
             >✕</button>
             
             {showMoodModal && <MoodForm onSuccess={() => { setShowMoodModal(false); fetchTodayData(); }} />}
             {showPhysicalModal && <PhysicalForm onSuccess={() => { setShowPhysicalModal(false); fetchTodayData(); }} />}
             {showSleepModal && (
               <>
                <h3 style={{ color: '#9d8df1', textAlign: 'center', marginBottom: '20px' }}>Записати сон</h3>
                <form onSubmit={handleSleepSubmit}>
                  <input type="number" placeholder="Кількість годин" value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)} style={localStyles.modalInput} required />
                  <div style={localStyles.modalActions}>
                    <button type="button" onClick={() => setShowSleepModal(false)} style={localStyles.cancelBtn}>Назад</button>
                    <button type="submit" style={localStyles.submitBtn}>Зберегти</button>
                  </div>
                </form>
               </>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

const localStyles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '40px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '15px' },
  avatarCircle: { width: '50px', height: '50px', borderRadius: '18px', background: '#9d8df1', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 20px rgba(157, 141, 241, 0.3)' },
  logoutIconButton: { background: 'white', border: 'none', padding: '12px', borderRadius: '15px', cursor: 'pointer', color: '#b2bec3', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', width: '100%', marginBottom: '35px' },
  iconCircle: (color) => ({ width: '36px', height: '36px', borderRadius: '10px', background: color, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '5px' }),
  cardVal: { fontSize: '24px', fontWeight: '800', color: '#2c3e50', margin: '5px 0 0 0' },

  actionSection: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '800px' },
  mainActionGradient: {
    padding: '30px', border: 'none', borderRadius: '24px', cursor: 'pointer',
    background: 'linear-gradient(90deg, #9d8df1 0%, #b8aff5 100%)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 15px 30px rgba(157, 141, 241, 0.3)'
  },
  whiteIconCircle: { width: '55px', height: '55px', borderRadius: '50%', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
  secondaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' },
  neomorphBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '22px',
    backgroundColor: 'white', border: 'none', borderRadius: '20px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.03)', cursor: 'pointer', color: '#2c3e50', fontWeight: '700'
  },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(74, 78, 105, 0.2)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalBox: { width: '420px', position: 'relative', border: 'none', padding: '40px', background: 'white', borderRadius: '24px' },
  closeModalBtn: { position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: '#bdc3c7' },
  modalInput: { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '15px', border: '1px solid #edf0f7', backgroundColor: '#f9faff', fontSize: '16px', outline: 'none', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '12px' },
  cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#f1f3f9', border: 'none', borderRadius: '12px', cursor: 'pointer', color: '#95a5a6', fontWeight: 'bold' },
  submitBtn: { flex: 1, padding: '12px', backgroundColor: '#9d8df1', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }
};

export default Home;