// admin/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Thêm interceptor để tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔐 API Request Interceptor:');
    console.log('   URL:', config.url);
    console.log('   Token:', token ? 'PRESENT' : 'MISSING');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   ✅ Added Authorization header');
    } else {
      console.log('   ❌ No token available');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Xử lý response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.config?.url);
    console.log('   Error details:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Clearing localStorage and redirecting');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;