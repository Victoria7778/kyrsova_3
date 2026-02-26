import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Container, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, 
  Button, Chip, Avatar, CircularProgress, Alert, Stack
} from '@mui/material';
import { ShieldAlert, UserCheck, UserX, ShieldPlus } from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError('Не вдалося завантажити список користувачів');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    if (newRole === 'admin' && !window.confirm("Ви впевнені? Цей користувач отримає повний доступ до керування системою!")) {
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/admin/update-role', 
        { userId, newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers(); 
    } catch (err) {
      alert('Помилка оновлення ролі');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Avatar sx={{ bgcolor: '#ff4d4f', width: 56, height: 56 }}>
          <ShieldAlert size={32} />
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={600} color="#2c3e50">
            Керування ролями
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Призначення адміністраторів, психологів та верифікація користувачів
          </Typography>
        </Box>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <TableContainer component={Paper} sx={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f4ff' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Користувач</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Роль</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>{user.name || 'Анонім'}</Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    sx={{ 
                      bgcolor: user.role === 'admin' ? '#ff4d4f' : user.role === 'psychologist' ? '#9d8df1' : '#e2e8f0',
                      color: user.role === 'admin' || user.role === 'psychologist' ? '#fff' : '#2c3e50',
                      fontWeight: 500, fontSize: '10px', textTransform: 'uppercase'
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                   
                    {user.role === 'user' && (
                      <>
                        <Button 
                          variant="outlined" size="small" 
                          startIcon={<UserCheck size={14} />}
                          onClick={() => handleUpdateRole(user._id, 'psychologist')}
                          sx={{ borderRadius: '10px', textTransform: 'none', color: '#9d8df1', borderColor: '#9d8df1' }}
                        >
                          Психолог
                        </Button>
                        <Button 
                          variant="outlined" size="small" 
                          startIcon={<ShieldPlus size={14} />}
                          onClick={() => handleUpdateRole(user._id, 'admin')}
                          sx={{ borderRadius: '10px', textTransform: 'none', color: '#ff4d4f', borderColor: '#ff4d4f' }}
                        >
                          Адмін
                        </Button>
                      </>
                    )}

                    {user.role === 'psychologist' && (
                      <>
                        <Button 
                          variant="outlined" size="small" 
                          startIcon={<ShieldPlus size={14} />}
                          onClick={() => handleUpdateRole(user._id, 'admin')}
                          sx={{ borderRadius: '10px', textTransform: 'none', color: '#ff4d4f', borderColor: '#ff4d4f' }}
                        >
                          Адмін
                        </Button>
                        <Button 
                          variant="outlined" size="small" color="error"
                          startIcon={<UserX size={14} />}
                          onClick={() => handleUpdateRole(user._id, 'user')}
                          sx={{ borderRadius: '10px', textTransform: 'none' }}
                        >
                          Зняти роль
                        </Button>
                      </>
                    )}

                    {user.role === 'admin' && user.email !== localStorage.getItem('userEmail') && (
                      <Button 
                        variant="outlined" size="small" color="error"
                        onClick={() => handleUpdateRole(user._id, 'user')}
                        sx={{ borderRadius: '10px', textTransform: 'none' }}
                      >
                        Зняти права адміна
                      </Button>
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

export default AdminPanel;