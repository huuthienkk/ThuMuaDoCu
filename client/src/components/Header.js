import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Typography,
  Divider,
  Button,
  AppBar,
  Toolbar,
  Container,
  InputBase,
  alpha,
  styled
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToApp from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import Inventory from '@mui/icons-material/Inventory';
import Notifications from '@mui/icons-material/Notifications';
import Message from '@mui/icons-material/Message';

// Styled components - ĐÃ SỬA LỖI ...
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // ✅ ĐÃ SỬA: Thêm ... trước theme.spacing(4)
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '400px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '500px',
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [messageCount, setMessageCount] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Effect để theo dõi thay đổi giỏ hàng
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    setAnchorEl(null);
    navigate('/');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      sx={{ mt: 1 }}
    >
      <MenuItem onClick={handleMenuClose}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#1e88e5',
              width: 40,
              height: 40
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
        <AccountCircle sx={{ mr: 2 }} />
        Hồ sơ của tôi
      </MenuItem>
      
      <MenuItem onClick={() => { navigate('/my-products'); handleMenuClose(); }}>
        <Inventory sx={{ mr: 2 }} />
        Sản phẩm của tôi
      </MenuItem>
      
      <MenuItem onClick={() => { navigate('/add'); handleMenuClose(); }}>
        <AddIcon sx={{ mr: 2 }} />
        Đăng sản phẩm
      </MenuItem>
      
      <Divider />
      
      <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
        <ExitToApp sx={{ mr: 2 }} />
        Đăng xuất
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1e88e5', boxShadow: 3 }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit'
            }}
            component={Link}
            to="/"
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' },
                background: 'linear-gradient(45deg, #ffffff, #e3f2fd)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              🛒 Trao Đổi Đồ Cũ
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                display: { xs: 'block', sm: 'none' },
              }}
            >
              🛒 TĐĐC
            </Typography>
          </Box>

          {/* Search Bar - Only show on desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </Search>
          </Box>

          {/* Navigation Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Mobile Search Icon */}
            <IconButton 
              size="large" 
              color="inherit"
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>

            {/* Cart Icon */}
            <IconButton 
              size="large" 
              color="inherit"
              component={Link}
              to="/cart"
              sx={{
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Notifications Icon */}
            <IconButton 
              size="large" 
              color="inherit"
              sx={{
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Messages Icon */}
            <IconButton 
              size="large" 
              color="inherit"
              sx={{
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <Badge badgeContent={messageCount} color="error">
                <Message />
              </Badge>
            </IconButton>

            {user ? (
              <>
                {/* User Avatar & Menu */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: '#1565c0',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              /* Login/Register Buttons */
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/register"
                  sx={{
                    backgroundColor: '#ffd54f',
                    color: '#1e88e5',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#ffca28'
                    }
                  }}
                >
                  Đăng ký
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Secondary Navigation Bar */}
        <Toolbar 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            justifyContent: 'center',
            gap: 3,
            py: 1,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontWeight: isActiveLink('/') ? 'bold' : 'normal',
              borderBottom: isActiveLink('/') ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Trang chủ
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/my-products"
            sx={{
              fontWeight: isActiveLink('/categories') ? 'bold' : 'normal',
              borderBottom: isActiveLink('/categories') ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Sản Phẩm Của Tôi
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/trending"
            sx={{
              fontWeight: isActiveLink('/trending') ? 'bold' : 'normal',
              borderBottom: isActiveLink('/trending') ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Sản phẩm Hot
          </Button>
          
          <Button
            color="inherit"
            component={Link}
            to="/exchange"
            sx={{
              fontWeight: isActiveLink('/promotions') ? 'bold' : 'normal',
              borderBottom: isActiveLink('/promotions') ? '2px solid white' : 'none',
              borderRadius: 0
            }}
          >
            Trao Đổi
          </Button>
          
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/add"
              startIcon={<AddIcon />}
              sx={{
                fontWeight: isActiveLink('/add') ? 'bold' : 'normal',
                borderBottom: isActiveLink('/add') ? '2px solid white' : 'none',
                borderRadius: 0
              }}
            >
              Đăng bán
            </Button>
          )}
        </Toolbar>
      </Container>

      {/* User Menu */}
      {renderMenu}
    </AppBar>
  );
};

export default Header;