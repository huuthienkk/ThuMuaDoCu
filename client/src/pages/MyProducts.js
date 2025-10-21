import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // 🧭 Lấy lại token và user mỗi khi component mount
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // 🔁 Hàm load danh sách sản phẩm theo người dùng hiện tại
  const loadMyProducts = async () => {
    if (!token) {
      Swal.fire('Thông báo', 'Vui lòng đăng nhập để xem sản phẩm của bạn!', 'warning');
      navigate('/login');
      return;
    }

    try {
      const res = await api.get('/products/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      Swal.fire('Lỗi', 'Không thể tải sản phẩm của bạn!', 'error');
      console.error(err);
    }
  };

  // 🚀 Gọi API mỗi khi user hoặc token thay đổi
  useEffect(() => {
    loadMyProducts();
  }, [token, user?._id]); // dependency quan trọng

  // ❌ Xóa sản phẩm
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Xác nhận xóa?',
      text: 'Bạn có chắc muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire('Đã xóa!', 'Sản phẩm đã được xóa thành công.', 'success');
          loadMyProducts(); // reload sau khi xóa
        } catch (error) {
          Swal.fire('Lỗi!', 'Không thể xóa sản phẩm.', 'error');
        }
      }
    });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" fontWeight="bold" color="primary" gutterBottom>
        🧾 Sản phẩm của tôi
      </Typography>

      {products.length === 0 ? (
        <Typography align="center" mt={4} color="text.secondary">
          Bạn chưa đăng sản phẩm nào.  
          <Button onClick={() => navigate('/add')} sx={{ ml: 1 }}>Đăng ngay!</Button>
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={`http://localhost:5000/uploads/${p.image}`}
                  alt={p.title}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {p.title}
                  </Typography>
                  <Typography color="primary" fontWeight="bold">
                    {p.price.toLocaleString()} ₫
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-around' }}>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/product/${p._id}`)}>
                    Xem
                  </Button>
                  <Button variant="contained" color="error" size="small" onClick={() => handleDelete(p._id)}>
                    Xóa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyProducts;
