import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { 
  Container, Typography, Paper, Table, TableBody, 
  TableCell, TableHead, TableRow, Avatar, Button, 
  TableContainer, Stack 
} from '@mui/material';
import { ChevronRight } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/psychologist/my-patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(res.data);
      } catch (err) {
        console.error("Помилка при завантаженні пацієнтів:", err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
        Мої пацієнти
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Пацієнт</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Активність сьогодні</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#9d8df1', width: 36, height: 36 }}>
                      {patient.name ? patient.name[0] : 'U'}
                    </Avatar>
                    <Typography variant="body2">{patient.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell variant="body2">{patient.email}</TableCell>
                <TableCell>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1.5, py: 0.5, borderRadius: '8px',
                      bgcolor: patient.hasEntryToday ? '#e8f5e9' : '#f5f5f5',
                      color: patient.hasEntryToday ? '#2e7d32' : '#757575'
                    }}
                  >
                    {patient.hasEntryToday ? 'Запис додано' : 'Немає записів'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="text" 
                    size="small"
                    onClick={() => navigate(`/patient/${patient._id}`)} 
                    endIcon={<ChevronRight size={16} />}
                    sx={{ color: '#9d8df1', textTransform: 'none' }}
                  >
                    Деталі
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Patients;