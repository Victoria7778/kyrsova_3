import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  Link,
  Avatar
} from '@mui/material';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { 
        email, 
        password, 
        name 
      });
      alert('Реєстрація успішна!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Помилка при реєстрації');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9ff 0%, #f3f0ff 100%)',
      p: 2
    }}>
      <Container maxWidth="xs">
        <Card sx={{ 
          borderRadius: '32px', 
          boxShadow: '0 20px 60px rgba(157, 141, 241, 0.15)',
          border: '1px solid rgba(157, 141, 241, 0.1)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
            <Avatar sx={{ 
              bgcolor: '#9d8df1', 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 8px 20px rgba(157, 141, 241, 0.3)'
            }}>
              <UserPlus size={32} color="white" />
            </Avatar>

            <Typography variant="h4" sx={{ fontWeight: 500, color: '#2c3e50', mb: 1 }}>
              Створити акаунт
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', mb: 4, fontWeight: 300 }}>
              Приєднуйтесь до спільноти Mood Tracker
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField 
                  fullWidth
                  label="Ваше ім'я"
                  placeholder="Як до вас звертатися?"
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{ sx: { borderRadius: '16px' } }}
                />

                <TextField 
                  fullWidth
                  label="Електронна пошта"
                  type="email"
                  placeholder="example@ukma.edu.ua"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{ sx: { borderRadius: '16px' } }}
                />
                
                <TextField 
                  fullWidth
                  label="Пароль"
                  type="password"
                  placeholder="Мінімум 8 символів"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  helperText="Пароль має містити цифру та велику літеру"
                  InputProps={{ sx: { borderRadius: '16px' } }}
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    py: 2, 
                    mt: 1,
                    borderRadius: '16px', 
                    bgcolor: '#9d8df1',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    boxShadow: '0 10px 25px rgba(157, 141, 241, 0.4)',
                    '&:hover': { 
                      bgcolor: '#8a7ae0',
                      boxShadow: '0 12px 30px rgba(157, 141, 241, 0.5)'
                    }
                  }}
                >
                  Зареєструватися
                </Button>
              </Stack>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 4, color: '#95a5a6', fontWeight: 300 }}>
              Вже маєте акаунт?{' '}
              <Link 
                onClick={() => navigate('/login')} 
                sx={{ 
                  color: '#9d8df1', 
                  cursor: 'pointer', 
                  fontWeight: 500, 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Увійти
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;