import React, { useState } from 'react';
import Swal from 'sweetalert2';
import api from '../services/api';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      Swal.fire('Thông báo', 'Bạn cần đăng nhập trước khi đăng sản phẩm!', 'warning');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('image', image);

    try {
      await api.post('/products/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire('🎉 Thành công!', 'Sản phẩm của bạn đã được đăng!', 'success');
      setFormData({ title: '', description: '', price: '', category: '' });
      setImage(null);
    } catch (error) {
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể đăng sản phẩm!', 'error');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          🛒 Đăng sản phẩm mới
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Tên sản phẩm" name="title" value={formData.title} onChange={handleChange} required />
          <TextField label="Mô tả" name="description" multiline rows={3} value={formData.description} onChange={handleChange} required />
          <TextField label="Giá (VNĐ)" type="number" name="price" value={formData.price} onChange={handleChange} required />
          <TextField label="Danh mục" name="category" value={formData.category} onChange={handleChange} required />
          
          <Box>
            <InputLabel>Hình ảnh sản phẩm</InputLabel>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Tải ảnh lên
              <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} required />
            </Button>
            {image && <Typography mt={1}>📷 {image.name}</Typography>}
          </Box>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Đăng sản phẩm
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct;
