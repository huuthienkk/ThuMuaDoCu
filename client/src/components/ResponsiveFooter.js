import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Phone,
  Email,
  ExpandMore
} from '@mui/icons-material';

const ResponsiveFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a237e',
        color: 'white',
        mt: 8
      }}
    >
      <Container maxWidth="lg">
        {/* Mobile Accordion Footer */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Accordion sx={{ backgroundColor: 'transparent', color: 'white', boxShadow: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ffd54f' }}>
                🛒 TRAO ĐỔI ĐỒ CŨ
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Link href="/" color="inherit" underline="hover">
                  Trang chủ
                </Link>
                <Link href="/add" color="inherit" underline="hover">
                  Đăng sản phẩm
                </Link>
                <Link href="/cart" color="inherit" underline="hover">
                  Giỏ hàng
                </Link>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Desktop Footer */}
        <Box sx={{ display: { xs: 'none', md: 'block' }, py: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={4}>
            {/* Logo & Description */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#ffd54f' }}>
                🛒 TRAO ĐỔI ĐỒ CŨ
              </Typography>
              <Typography variant="body2">
                Mua bán đồ cũ an toàn - Tiết kiệm - Nhanh chóng
              </Typography>
            </Box>

            {/* Contact Info */}
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone fontSize="small" />
                <Typography variant="body2">1900 1234</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email fontSize="small" />
                <Typography variant="body2">support@traodoidocu.vn</Typography>
              </Box>
            </Stack>

            {/* Social Media */}
            <Stack direction="row" spacing={1} sx={{ flex: 1, justifyContent: 'flex-end' }}>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: 'white' }}>
                <Instagram />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.3)',
            py: 2,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2">
            © {currentYear} Trao Đổi Đồ Cũ. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default ResponsiveFooter;