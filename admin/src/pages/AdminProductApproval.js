// admin/src/components/AdminProductApproval.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import api from '../services/api';

const AdminProductApproval = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  // Lấy danh sách sản phẩm chờ duyệt
  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/products/pending?page=${page + 1}&limit=${rowsPerPage}&search=${search}`);
      
      setProducts(response.data.products);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      setError('Không thể tải danh sách sản phẩm chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/products/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
    fetchStats();
  }, [page, rowsPerPage, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApprove = async (productId, productTitle) => {
    const result = await Swal.fire({
      title: 'Xác nhận duyệt?',
      text: `Bạn có chắc muốn duyệt sản phẩm "${productTitle}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Duyệt',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/products/${productId}/approve`);
        
        Swal.fire('Đã duyệt!', 'Sản phẩm đã được duyệt thành công.', 'success');
        fetchPendingProducts();
        fetchStats();
      } catch (error) {
        console.error('Error approving product:', error);
        Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể duyệt sản phẩm.', 'error');
      }
    }
  };

  const handleReject = (product) => {
    setSelectedProduct(product);
    setRejectionReason('');
    setRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      Swal.fire('Lỗi!', 'Vui lòng nhập lý do từ chối', 'error');
      return;
    }

    try {
      await api.patch(`/admin/products/${selectedProduct._id}/reject`, {
        rejectionReason
      });
      
      Swal.fire('Đã từ chối!', 'Sản phẩm đã bị từ chối.', 'success');
      setRejectDialog(false);
      fetchPendingProducts();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting product:', error);
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể từ chối sản phẩm.', 'error');
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setViewDialog(true);
  };

  const refreshData = () => {
    fetchPendingProducts();
    fetchStats();
  };

  if (loading && !products.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        ⏳ Duyệt Sản phẩm
      </Typography>

      {/* Thống kê */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.totalProducts}
                </Typography>
                <Typography variant="body2">
                  Tổng sản phẩm
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.pendingProducts}
                </Typography>
                <Typography variant="body2">
                  Chờ duyệt
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.approvedProducts}
                </Typography>
                <Typography variant="body2">
                  Đã duyệt
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.rejectedProducts}
                </Typography>
                <Typography variant="body2">
                  Đã từ chối
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Thanh công cụ */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshData}
          >
            Làm mới
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <Typography variant="body2" color="text.secondary">
            {total} sản phẩm chờ duyệt
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bảng sản phẩm */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hình ảnh</strong></TableCell>
              <TableCell><strong>Tên sản phẩm</strong></TableCell>
              <TableCell><strong>Giá</strong></TableCell>
              <TableCell><strong>Danh mục</strong></TableCell>
              <TableCell><strong>Người đăng</strong></TableCell>
              <TableCell><strong>Ngày đăng</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {search ? 'Không tìm thấy sản phẩm phù hợp' : 'Không có sản phẩm nào chờ duyệt'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Box
                      component="img"
                      src={`http://localhost:5000/uploads/${product.image}`}
                      alt={product.title}
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                      {product.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.seller?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.seller?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(product.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewProduct(product)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Duyệt sản phẩm">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleApprove(product._id, product.title)}
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Từ chối">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleReject(product)}
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} trong tổng ${count}`
        }
      />

      {/* Dialog xem chi tiết */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Chi tiết sản phẩm chờ duyệt
        </DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
              <Box flex={1}>
                <Box
                  component="img"
                  src={`http://localhost:5000/uploads/${selectedProduct.image}`}
                  alt={selectedProduct.title}
                  sx={{
                    width: '100%',
                    maxHeight: 300,
                    objectFit: 'cover',
                    borderRadius: 2
                  }}
                />
              </Box>
              <Box flex={2}>
                <Typography variant="h6" gutterBottom>
                  {selectedProduct.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {selectedProduct.description}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(selectedProduct.price)}
                </Typography>
                <Chip 
                  label={selectedProduct.category} 
                  color="secondary" 
                  sx={{ mb: 2 }}
                />
                <Box mt={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Người đăng: {selectedProduct.seller?.name} ({selectedProduct.seller?.email})
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ngày đăng: {new Date(selectedProduct.createdAt).toLocaleString('vi-VN')}
                  </Typography>
                  <Chip 
                    label="Chờ duyệt" 
                    color="warning" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog từ chối */}
      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Từ chối sản phẩm
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Sản phẩm: <strong>{selectedProduct?.title}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do từ chối *"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Nhập lý do từ chối sản phẩm..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog(false)}>Hủy</Button>
          <Button 
            onClick={confirmReject} 
            color="error"
            variant="contained"
            disabled={!rejectionReason.trim()}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductApproval;