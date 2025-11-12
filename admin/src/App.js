// admin/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AdminLogin from './pages/Login';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts'; // 👈 THÊM IMPORT
import AdminLayout from './components/AdminLayout';
import EditProduct from './components/EditProduct';
import AdminProductApproval from './pages/AdminProductApproval';
import OrderManagement from './pages/OrderManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route Component với debug
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('🛡️ ProtectedRoute Check:');
  console.log('   Token:', token ? 'PRESENT' : 'MISSING');
  console.log('   User:', user);
  console.log('   User Role:', user.role);
  console.log('   Is Admin?', user.role === 'admin');
  
  if (!token) {
    console.log('❌ Redirecting: No token');
    return <Navigate to="/admin/login" replace />;
  }
  
  if (user.role !== 'admin') {
    console.log('❌ Redirecting: Not admin. Role:', user.role);
    return <Navigate to="/admin/login" replace />;
  }
  
  console.log('✅ Access granted to admin area');
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<AdminProducts />} /> {/* 👈 THÊM ROUTE */}
            <Route path="orders" element={<OrderManagement />} />
            <Route path="products/approval" element={<AdminProductApproval />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="" element={<Navigate to="dashboard" />} />
          </Route>
          <Route path="/" element={<Navigate to="/admin/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;