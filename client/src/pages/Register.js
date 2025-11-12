import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      Swal.fire('Thành công!', 'Đăng ký thành công, hãy đăng nhập!', 'success');
      navigate('/login');
    } catch (error) {
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể đăng ký!', 'error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Họ tên" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '400px', margin: '40px auto', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
};

export default Register;
