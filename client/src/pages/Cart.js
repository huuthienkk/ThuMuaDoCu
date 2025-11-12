import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  IconButton,
  TextField,
  Paper,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Tooltip,
  Fade
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  ArrowBack,
  LocalShipping,
  Security,
  Replay,
  FavoriteBorder,
  Share
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const QuantityBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
  },
});

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [loading, setLoading] = useState(false);

  // Lấy giỏ hàng từ localStorage
  useEffect(() => {
    const loadCart = () => {
      const items = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(items);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    // Giả lập delay để có trải nghiệm mượt mà
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setSnackbar({ open: true, message: 'Đã cập nhật số lượng', severity: 'success' });
    window.dispatchEvent(new Event('cartUpdated'));
    setLoading(false);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setDeleteDialog({ open: false, item: null });
    setSnackbar({ open: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng', severity: 'info' });
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Xóa tất cả sản phẩm
  const clearCart = () => {
    localStorage.setItem('cart', JSON.stringify([]));
    setCartItems([]);
    setSnackbar({ open: true, message: 'Đã xóa tất cả sản phẩm', severity: 'info' });
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Thêm vào danh sách yêu thích
  const addToWishlist = (item) => {
    setSnackbar({ open: true, message: 'Đã thêm vào danh sách yêu thích', severity: 'success' });
  };

  // Tính tổng tiền
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Tính tổng số sản phẩm
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Tính phí vận chuyển (giả lập)
  const shippingFee = totalAmount > 500000 ? 0 : 30000;

  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Fade in={true} timeout={800}>
          <Box>
            <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom color="text.secondary">
              Giỏ hàng của bạn đang trống
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
              Hãy khám phá và thêm những sản phẩm yêu thích vào giỏ hàng!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/')}
              sx={{ mt: 2, px: 4, py: 1.5 }}
              startIcon={<ArrowBack />}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Tiếp tục mua sắm
        </Button>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          🛒 Giỏ hàng của bạn
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" color="primary">
            {totalItems} sản phẩm
          </Typography>
          <Chip 
            label={`${cartItems.length} loại sản phẩm`} 
            variant="outlined" 
            size="small" 
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Danh sách sản phẩm */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Sản phẩm đã chọn
            </Typography>
            <Button 
              color="error" 
              startIcon={<Delete />}
              onClick={clearCart}
              disabled={loading}
            >
              Xóa tất cả
            </Button>
          </Box>

          {cartItems.map((item, index) => (
            <Fade in={true} timeout={500} key={item._id}>
              <StyledCard sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Hình ảnh */}
                  <Grid item xs={12} sm={3}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.title}
                      sx={{ 
                        borderRadius: 2,
                        objectFit: 'cover'
                      }}
                    />
                  </Grid>
                  
                  {/* Thông tin sản phẩm */}
                  <Grid item xs={12} sm={4}>
                    <CardContent sx={{ p: 0 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {item.title}
                      </Typography>
                      <Typography color="primary" fontWeight="bold" fontSize="1.1rem">
                        {item.price.toLocaleString()} ₫
                      </Typography>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ textDecoration: 'line-through' }}
                        >
                          {item.originalPrice.toLocaleString()} ₫
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Người bán: {item.seller?.name || 'Unknown Seller'}
                      </Typography>
                      {item.inStock !== false && (
                        <Chip 
                          label="Còn hàng" 
                          color="success" 
                          size="small" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Grid>

                  {/* Điều chỉnh số lượng */}
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Số lượng
                      </Typography>
                      <QuantityBox>
                        <Tooltip title="Giảm số lượng">
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={loading || item.quantity <= 1}
                          >
                            <Remove />
                          </IconButton>
                        </Tooltip>
                        
                        <StyledTextField
                          value={item.quantity}
                          size="small"
                          sx={{ width: 60 }}
                          inputProps={{ 
                            style: { textAlign: 'center' },
                            min: 1,
                            type: 'number'
                          }}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0) {
                              updateQuantity(item._id, value);
                            }
                          }}
                          disabled={loading}
                        />
                        
                        <Tooltip title="Tăng số lượng">
                          <IconButton 
                            size="small" 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Add />
                          </IconButton>
                        </Tooltip>
                      </QuantityBox>
                    </Box>
                  </Grid>

                  {/* Thành tiền và hành động */}
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography fontWeight="bold" fontSize="1.1rem" color="primary">
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                        <Tooltip title="Xóa">
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => setDeleteDialog({ open: true, item })}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Thêm vào yêu thích">
                          <IconButton 
                            color="secondary" 
                            size="small"
                            onClick={() => addToWishlist(item)}
                          >
                            <FavoriteBorder />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </StyledCard>
            </Fade>
          ))}
        </Grid>

        {/* Tổng thanh toán */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 100, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Tổng thanh toán
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography>Tạm tính ({totalItems} sản phẩm):</Typography>
                <Typography>{totalAmount.toLocaleString()} ₫</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography>Phí vận chuyển:</Typography>
                <Typography>
                  {shippingFee === 0 ? (
                    <span style={{ color: 'green' }}>MIỄN PHÍ</span>
                  ) : (
                    `${shippingFee.toLocaleString()} ₫`
                  )}
                </Typography>
              </Box>

              {totalAmount < 500000 && (
                <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
                  🎉 Mua thêm {(500000 - totalAmount).toLocaleString()} ₫ để được miễn phí vận chuyển
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Tổng cộng:</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {(totalAmount + shippingFee).toLocaleString()} ₫
                </Typography>
              </Box>
            </Box>

            {/* Ưu đãi và bảo mật */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocalShipping fontSize="small" color="action" />
                <Typography variant="body2">
                  Giao hàng nhanh trong 2 giờ
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security fontSize="small" color="action" />
                <Typography variant="body2">
                  Thanh toán an toàn & bảo mật
                </Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={() => navigate('/checkout')}
              sx={{ mb: 1.5, py: 1.5 }}
              disabled={loading}
            >
              Tiến hành thanh toán
            </Button>
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate('/')}
              startIcon={<Replay />}
            >
              Tiếp tục mua sắm
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa "{deleteDialog.item?.title}" khỏi giỏ hàng?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            Hủy
          </Button>
          <Button 
            color="error" 
            onClick={() => removeFromCart(deleteDialog.item?._id)}
            startIcon={<Delete />}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;