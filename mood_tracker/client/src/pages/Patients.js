
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Button, TableContainer, Stack } from '@mui/material';
import { User, ChevronRight } from 'lucide-react';

const Patients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/psychologist/my-patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    };
    fetchPatients();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>Мої пацієнти</Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Пацієнт</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Останній настрій</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#9d8df1' }}>{patient.name[0]}</Avatar>
                    <Typography>{patient.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.lastMood || 'Немає даних'}</TableCell>
                <TableCell align="right">
                  <Button variant="text" endIcon={<ChevronRight />}>Деталі</Button>
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