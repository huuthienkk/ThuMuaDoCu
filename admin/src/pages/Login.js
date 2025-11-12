// admin/src/pages/Login.js - THÊM DEBUG CHI TIẾT
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔄 [1] Attempting login with:', formData);
      
      const res = await api.post('/auth/login', formData);
      console.log('✅ [2] Login response:', res.data);
      
      const { user, token } = res.data;

      // Kiểm tra role admin
      if (user.role !== 'admin') {
        console.log('❌ [3] User is not admin. Role:', user.role);
        setError('Truy cập bị từ chối. Chỉ admin mới được phép.');
        return;
      }

      console.log('✅ [4] User is admin, saving to localStorage...');
      
      // Lưu token và user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Kiểm tra xem đã lưu thành công chưa
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      console.log('💾 [5] Saved token:', savedToken ? 'YES' : 'NO');
      console.log('💾 [6] Saved user:', savedUser ? 'YES' : 'NO');
      
      if (savedToken && savedUser) {
        console.log('🚀 [7] Login successful, navigating to dashboard...');
        navigate('/admin/dashboard');
      } else {
        console.log('❌ [8] Failed to save to localStorage');
        setError('Lỗi lưu thông tin đăng nhập');
      }
      
    } catch (error) {
      console.error('❌ [ERROR] Login error:', error);
      console.log('🔍 Error response:', error.response?.data);
      
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Lock color="primary" sx={{ fontSize: 40 }} />
          </Box>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            Demo: admin@example.com / admin123
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;