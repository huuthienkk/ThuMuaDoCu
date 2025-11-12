// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Thêm interceptor để tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 CLIENT API Request Interceptor:');
    console.log('   URL:', config.url);
    console.log('   Token:', token ? 'PRESENT' : 'MISSING');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✅ Added Authorization header');
    } else {
      console.log('   ⚠️ No token - some requests may fail');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Client Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Xử lý response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ CLIENT API Response Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ CLIENT API Response Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;