import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Chip, Avatar, CircularProgress, Alert, Stack
} from '@mui/material';
import { Activity } from 'lucide-react';

const AuditConnections = () => {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchAudit = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/audit-connections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Не вдалося завантажити дані аудиту');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: '#ff9f43', width: 56, height: 56 }}>
          <Activity size={32} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={600} color="#2c3e50">
            Аудит підключень
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Моніторинг зв'язків між психологами та пацієнтами
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f4ff' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Психолог</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Навантаження</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Підключені пацієнти</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditData.map((psycho) => (
              <TableRow key={psycho._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#9d8df1' }}>{psycho.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{psycho.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{psycho.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${psycho.patients?.length || 0} пацієнтів`} 
                    color={psycho.patients?.length > 5 ? "warning" : "success"}
                    variant="filled"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {psycho.patients && psycho.patients.length > 0 ? (
                      psycho.patients.map((p) => (
                        <Chip 
                          key={p._id} 
                          label={p.name || p.email} 
                          variant="outlined" 
                          size="small" 
                          sx={{ borderRadius: '8px' }} 
                        />
                      ))
                    ) : (
                      <Typography variant="caption" color="text.secondary">Пацієнти не підключені</Typography>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AuditConnections;