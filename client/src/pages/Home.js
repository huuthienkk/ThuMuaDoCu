import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 👈 thư viện animation
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi tải sản phẩm:', err));
  }, []);

  // 🔍 Lọc sản phẩm theo từ khóa và danh mục
  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || p.category.toLowerCase() === category.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div>
      {/* 🌄 Banner lớn */}
      <Box
        sx={{
          height: '400px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          mb: 6,
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h3" fontWeight="bold">
            Trao Đổi Đồ Cũ – Giá Tốt, Uy Tín & Nhanh Chóng
          </Typography>
          <Typography variant="h6" mt={2}>
            Nơi bạn có thể bán những món đồ không dùng nữa và tìm những thứ mình cần
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 3 }}
            onClick={() => navigate('/add')}
          >
            Đăng sản phẩm ngay 🚀
          </Button>
        </motion.div>
      </Box>

      <Container sx={{ py: 5 }}>
        {/* 🏷 Tiêu đề */}
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          🛍️ Khám Phá Sản Phẩm
        </Typography>

        {/* 🔍 Thanh tìm kiếm & lọc */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <TextField
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300, backgroundColor: '#fff', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            label="Danh mục"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ width: 200, backgroundColor: '#fff', borderRadius: 1 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* 🧱 Lưới sản phẩm */}
        <Grid container spacing={3}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 4,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="180"
                      image={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.title}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ mb: 1 }}
                      >
                        {product.description}
                      </Typography>
                      <Typography color="primary" fontWeight="bold" mt={1}>
                        💰 {product.price.toLocaleString()} ₫
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📦 {product.category}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Typography align="center" width="100%" mt={5}>
              Không tìm thấy sản phẩm nào phù hợp 😢
            </Typography>
          )}
        </Grid>
      </Container>

      {/* 🌙 Footer */}
      <Box
        sx={{
          mt: 8,
          py: 4,
          backgroundColor: '#1e88e5',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          <StoreIcon /> Trao Đổi Đồ Cũ
        </Typography>
        <Typography variant="body1">
          Mua bán đồ cũ an toàn – Tiết kiệm – Nhanh chóng
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Typography variant="body2">
            📞 Hỗ trợ: 0123 456 789
          </Typography>
          <Typography variant="body2">
            ✉️ Email: support@traodoidocu.vn
          </Typography>
        </Box>
        <Typography variant="caption" display="block" mt={2}>
          © 2025 Trao Đổi Đồ Cũ. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;
