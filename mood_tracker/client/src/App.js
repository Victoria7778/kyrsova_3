import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from './components/AppLayout';

// Сторінки
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoodEntry from './pages/MoodEntry';
import Settings from './pages/Settings';
import History from './pages/History';
import Statistics from './pages/Statistics'; 
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard'; 
import AuditConnections from './pages/AuditConnections';
import Patients from './pages/Patients';
import PsychologistDashboard from './pages/PsychologistDashboard';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const syncRole = () => {
      const role = localStorage.getItem('userRole');
      setUserRole(role);
      setIsInitialized(true); 
    };

    syncRole();

    window.addEventListener('storage', syncRole);
    const interval = setInterval(syncRole, 1000);

    return () => {
      window.removeEventListener('storage', syncRole);
      clearInterval(interval);
    };
  }, []);

  if (!isInitialized) return null;

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Публічні маршрути */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Головна тепер знову ТІЛЬКИ для щоденника користувача */}
          <Route path="/" element={<Home />} />
          
          {/* Захист сторінок щоденника */}
          <Route 
            path="/add-mood" 
            element={userRole !== 'admin' ? <MoodEntry /> : <Navigate to="/admin-dashboard" replace />} 
          />
          <Route 
            path="/history" 
            element={userRole !== 'admin' ? <History /> : <Navigate to="/admin-dashboard" replace />} 
          />
          <Route 
            path="/stats" 
            element={userRole !== 'admin' ? <Statistics /> : <Navigate to="/admin-dashboard" replace />} 
          />

          <Route path="/settings" element={<Settings />} />

          {/* Маршрути Адміна (виділені окремо) */}
          <Route 
            path="/admin-dashboard" 
            element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/admin" 
            element={userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/audit" 
            element={userRole === 'admin' ? <AuditConnections /> : <Navigate to="/" replace />} 
          />
          <Route 
           path="/patients" 
           element={userRole === 'psychologist' ? <Patients /> : <Navigate to="/" />} 
          />
          <Route 
           path="/psycho-dashboard" 
           element={userRole === 'psychologist' ? <PsychologistDashboard /> : <Navigate to="/" replace />} 
          />

          {/* Редірект для всього іншого */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;