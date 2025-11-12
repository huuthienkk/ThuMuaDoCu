import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  TextField,
  Button,
  Stack
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
  Phone,
  LocationOn,
  Send
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a237e',
        color: 'white',
        mt: 8,
        pt: 6,
        pb: 3
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Column 1: Thông tin công ty */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffd54f' }}>
              🛒 TRAO ĐỔI ĐỒ CŨ
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Nền tảng mua bán, trao đổi đồ cũ uy tín hàng đầu Việt Nam. 
              Giúp bạn tìm thấy những món đồ chất lượng với giá cả phải chăng.
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
                size="small"
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  backgroundColor: '#03a9f4',
                  '&:hover': { backgroundColor: '#0288d1' }
                }}
                size="small"
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  backgroundColor: '#e91e63',
                  '&:hover': { backgroundColor: '#c2185b' }
                }}
                size="small"
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton 
                sx={{ 
                  color: 'white', 
                  backgroundColor: '#f44336',
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
                size="small"
              >
                <YouTube fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Column 2: Liên kết nhanh */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              LIÊN KẾT NHANH
            </Typography>
            <Stack spacing={1}>
              <Link href="/" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                📍 Trang chủ
              </Link>
              <Link href="/add" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                🚀 Đăng sản phẩm
              </Link>
              <Link href="/my-products" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                📦 Sản phẩm của tôi
              </Link>
              <Link href="/cart" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                🛒 Giỏ hàng
              </Link>
              <Link href="/about" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                ℹ️ Về chúng tôi
              </Link>
            </Stack>
          </Grid>

          {/* Column 3: Danh mục phổ biến */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              DANH MỤC
            </Typography>
            <Stack spacing={1}>
              <Link href="/category/electronics" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                📱 Điện tử & Công nghệ
              </Link>
              <Link href="/category/furniture" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                🛋️ Nội thất & Gia dụng
              </Link>
              <Link href="/category/fashion" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                👕 Thời trang & Phụ kiện
              </Link>
              <Link href="/category/books" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                📚 Sách & Văn phòng phẩm
              </Link>
              <Link href="/category/sports" color="inherit" underline="hover" sx={{ cursor: 'pointer' }}>
                ⚽ Thể thao & Giải trí
              </Link>
            </Stack>
          </Grid>

          {/* Column 4: Liên hệ & Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              LIÊN HỆ
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, color: '#ffd54f' }} />
                <Typography variant="body2">
                  123 Nguyễn Văn Linh, Quận 7, TP.HCM
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, color: '#ffd54f' }} />
                <Typography variant="body2">
                  1900 1234
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: '#ffd54f' }} />
                <Typography variant="body2">
                  support@traodoidocu.vn
                </Typography>
              </Box>
            </Stack>

            {/* Newsletter Subscription */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold' }}>
                ĐĂNG KÝ NHẬN TIN
              </Typography>
              <Box sx={{ display: 'flex', mt: 1 }}>
                <TextField
                  placeholder="Email của bạn"
                  variant="outlined"
                  size="small"
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: '4px 0 0 4px'
                    }
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '0 4px 4px 0',
                    backgroundColor: '#ffd54f',
                    color: '#1a237e',
                    '&:hover': {
                      backgroundColor: '#ffc107'
                    },
                    minWidth: 'auto',
                    px: 2
                  }}
                >
                  <Send fontSize="small" />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.3)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" align="center">
            © {currentYear} Trao Đổi Đồ Cũ. Tất cả quyền được bảo lưu.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2" sx={{ cursor: 'pointer' }}>
              Chính sách bảo mật
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2" sx={{ cursor: 'pointer' }}>
              Điều khoản sử dụng
            </Link>
            <Link href="/contact" color="inherit" underline="hover" variant="body2" sx={{ cursor: 'pointer' }}>
              Liên hệ
            </Link>
          </Box>
        </Box>

        {/* Trust Badges */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            mt: 3,
            pt: 2,
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🔒 Bảo mật giao dịch
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🚚 Giao hàng toàn quốc
          </Typography>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💰 Giá cả minh bạch
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;