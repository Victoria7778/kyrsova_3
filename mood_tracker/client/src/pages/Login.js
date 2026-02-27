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
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userEmail', res.data.user.email);
      localStorage.setItem('userRole', res.data.user.role); 
      localStorage.setItem('userName', res.data.user.name);
      
      localStorage.setItem('userId', res.data.user.id || res.data.user._id); 

      window.dispatchEvent(new Event('storage'));

      const role = res.data.user.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'psychologist') {
        navigate('/psycho-dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      // Виводимо помилку, якщо пароль або пошта невірні
      alert(err.response?.data?.message || 'Помилка при вході. Перевірте дані.');
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
              <LogIn size={32} color="white" />
            </Avatar>

            <Typography variant="h4" sx={{ fontWeight: 500, color: '#2c3e50', mb: 1 }}>
              З поверненням!
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', mb: 4, fontWeight: 300 }}>
              Увійдіть у свій акаунт Moodly
            </Typography>
            
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={3}>
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
                  placeholder="••••••••"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{ sx: { borderRadius: '16px' } }}
                />

                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  sx={{ 
                    py: 2, 
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
                  Увійти
                </Button>
              </Stack>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 4, color: '#95a5a6', fontWeight: 300 }}>
              Ще не маєте акаунту?{' '}
              <Link 
                onClick={() => navigate('/register')} 
                sx={{ 
                  color: '#9d8df1', 
                  cursor: 'pointer', 
                  fontWeight: 500, 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Зареєструватися
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;