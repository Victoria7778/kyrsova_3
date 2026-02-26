import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import AppLayout from './components/AppLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MoodEntry from './pages/MoodEntry';
import Settings from './pages/Settings';
import History from './pages/History';
import Statistics from './pages/Statistics'; 
import AdminPanel from './pages/AdminPanel';
import AuditConnections from './pages/AuditConnections';

function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const syncRole = () => {
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', syncRole);

    const interval = setInterval(syncRole, 1000);

    return () => {
      window.removeEventListener('storage', syncRole);
      clearInterval(interval);
    };
  }, []);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/add-mood" element={<MoodEntry />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Statistics />} /> 

          <Route 
            path="/admin" 
            element={userRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />} 
          />
          <Route 
            path="/audit" 
            element={userRole === 'admin' ? <AuditConnections /> : <Navigate to="/" />} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;