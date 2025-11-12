// admin/src/components/EditProduct.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardMedia
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowBack, Save, CloudUpload } from '@mui/icons-material';
import Swal from 'sweetalert2';
import api from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  // Danh mục mẫu - bạn có thể thay thế bằng API lấy danh mục
  const sampleCategories = [
    'Điện tử',
    'Điện thoại',
    'Laptop',
    'Máy tính bảng',
    'Phụ kiện',
    'Đồ gia dụng',
    'Thời trang',
    'Sách',
    'Thể thao',
    'Khác'
  ];

  // Lấy thông tin sản phẩm
  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching product details for ID:', id);
      
      const response = await api.get(`/admin/products/${id}`);
      const product = response.data;
      
      console.log('✅ Product data:', product);
      
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
      });
      setCurrentImage(product.image);
      setCategories(sampleCategories);
      
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      setError('Không thể tải thông tin sản phẩm');
      Swal.fire('Lỗi!', 'Không thể tải thông tin sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Lỗi!', 'Kích thước ảnh không được vượt quá 5MB', 'error');
        return;
      }
      
      // Kiểm tra định dạng file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire('Lỗi!', 'Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, WebP)', 'error');
        return;
      }
      
      setImage(file);
    }
  };

// Trong handleSubmit function của EditProduct.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  if (!formData.title.trim() || !formData.description.trim() || 
      !formData.price || !formData.category.trim()) {
    Swal.fire('Lỗi!', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
    return;
  }

  if (parseFloat(formData.price) <= 0) {
    Swal.fire('Lỗi!', 'Giá sản phẩm phải lớn hơn 0', 'error');
    return;
  }

  setSaving(true);
  setError('');

  try {
    console.log('🚀 Updating product...');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    
    if (image) {
      data.append('image', image);
    }

    console.log('📦 Form data:');
    for (let [key, value] of data.entries()) {
      console.log(`   ${key}:`, value);
    }

    const response = await api.put(`/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Update response:', response.data);
    
    Swal.fire({
      title: 'Thành công!',
      text: 'Sản phẩm đã được cập nhật',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      navigate('/admin/products');
    });

  } catch (error) {
    console.error('❌ Update error:', error);
    console.error('❌ Error response:', error.response?.data);
    
    const errorMessage = error.response?.data?.message || 'Không thể cập nhật sản phẩm';
    setError(errorMessage);
    Swal.fire('Lỗi!', errorMessage, 'error');
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải thông tin sản phẩm...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/admin/products"
          startIcon={<ArrowBack />}
          sx={{ mr: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">
          ✏️ Chỉnh sửa Sản phẩm
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns={{ md: '1fr 1fr' }} gap={4}>
            {/* Cột trái: Form */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Thông tin sản phẩm
              </Typography>

              <TextField
                fullWidth
                label="Tên sản phẩm *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Mô tả *"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
              />

              <TextField
                fullWidth
                label="Giá (VNĐ) *"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                inputProps={{ min: 0, step: 1000 }}
                required
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Danh mục *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Danh mục *"
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Upload ảnh mới */}
              <Box mt={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Hình ảnh sản phẩm
                </Typography>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {image ? `Đã chọn: ${image.name}` : 'Chọn ảnh mới'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                
                <Typography variant="caption" color="text.secondary">
                  Để trống nếu không muốn thay đổi ảnh. Hỗ trợ: JPEG, JPG, PNG, WebP (tối đa 5MB)
                </Typography>
              </Box>
            </Box>

            {/* Cột phải: Preview */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Xem trước
              </Typography>

              {/* Hiển thị ảnh */}
              <Card sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={
                    image 
                      ? URL.createObjectURL(image)
                      : currentImage
                      ? `http://localhost:5000/uploads/${currentImage}`
                      : '/placeholder-image.jpg'
                  }
                  alt="Preview"
                  sx={{ objectFit: 'cover' }}
                />
              </Card>

              {/* Thông tin preview */}
              <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  {formData.title || 'Tên sản phẩm'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {formData.description || 'Mô tả sản phẩm...'}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" color="primary">
                    {formData.price 
                      ? new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(formData.price)
                      : '0 ₫'
                    }
                  </Typography>
                  
                  {formData.category && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        px: 2, 
                        py: 0.5, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        borderRadius: 1
                      }}
                    >
                      {formData.category}
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box display="flex" gap={2} justifyContent="flex-end" mt={4}>
            <Button
              variant="outlined"
              component={Link}
              to="/admin/products"
              disabled={saving}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              type="submit"
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProduct;