// admin/src/pages/OrderManagement.js
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
  Grid,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Trạng thái đơn hàng
  const orderStatuses = {
    pending: { label: 'Chờ xác nhận', color: 'warning' },
    confirmed: { label: 'Đã xác nhận', color: 'info' },
    shipping: { label: 'Đang giao hàng', color: 'primary' },
    completed: { label: 'Đã hoàn thành', color: 'success' },
    cancelled: { label: 'Đã hủy', color: 'error' }
  };

  // Lấy danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Sửa URL endpoint cho đúng
      const response = await api.get('/admin/orders');
      
      // Kiểm tra cấu trúc response
      console.log('Orders response:', response.data);
      
      // Xử lý response khác nhau
      if (response.data.orders) {
        setOrders(response.data.orders || []);
        setTotal(response.data.pagination?.total || response.data.orders.length || 0);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data || []);
        setTotal(response.data.length || 0);
      } else {
        setOrders([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng');
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê
  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/orders/stats');
      console.log('Stats response:', response.data);
      setStats(response.data.stats || response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({});
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [page, rowsPerPage, search, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Xem chi tiết đơn hàng
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setViewDialog(true);
  };

  // Chỉnh sửa trạng thái đơn hàng
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditDialog(true);
  };

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (newStatus) => {
    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        status: newStatus
      });
      
      Swal.fire('Thành công!', 'Đã cập nhật trạng thái đơn hàng', 'success');
      setEditDialog(false);
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error updating order status:', error);
      Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể cập nhật trạng thái', 'error');
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (order) => {
    const result = await Swal.fire({
      title: 'Xác nhận hủy đơn hàng?',
      text: `Bạn có chắc muốn hủy đơn hàng #${order.orderNumber || order._id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Hủy đơn hàng',
      cancelButtonText: 'Thoát'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/orders/${order._id}/status`, {
          status: 'cancelled'
        });
        
        Swal.fire('Đã hủy!', 'Đơn hàng đã được hủy thành công', 'success');
        fetchOrders();
        fetchStats();
      } catch (error) {
        console.error('Error cancelling order:', error);
        Swal.fire('Lỗi!', error.response?.data?.message || 'Không thể hủy đơn hàng', 'error');
      }
    }
  };

  const refreshData = () => {
    fetchOrders();
    fetchStats();
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setFilterAnchor(null);
  };

  // Lọc sản phẩm
  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    const matchesSearch = search ? 
      (order.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
       order.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
       order.customer?.email?.toLowerCase().includes(search.toLowerCase())) : true;
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading && !orders.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải đơn hàng...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📦 Quản lý Đơn hàng
      </Typography>

      {/* Thống kê */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={2.4}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.pending || 0}
                </Typography>
                <Typography variant="body2">
                  Chờ xác nhận
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.confirmed || 0}
                </Typography>
                <Typography variant="body2">
                  Đã xác nhận
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.shipping || 0}
                </Typography>
                <Typography variant="body2">
                  Đang giao hàng
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.completed || 0}
                </Typography>
                <Typography variant="body2">
                  Đã hoàn thành
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={2.4}>
            <Card sx={{ bgcolor: 'error.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {stats.cancelled || 0}
                </Typography>
                <Typography variant="body2">
                  Đã hủy
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
            placeholder="Tìm kiếm theo mã đơn hàng, tên KH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={(e) => setFilterAnchor(e.currentTarget)}
          >
            Bộ lọc
          </Button>

          <Menu
            anchorEl={filterAnchor}
            open={Boolean(filterAnchor)}
            onClose={() => setFilterAnchor(null)}
          >
            <MenuItem sx={{ minWidth: 200 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {Object.entries(orderStatuses).map(([value, config]) => (
                    <MenuItem key={value} value={value}>
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MenuItem>
            <MenuItem onClick={clearFilters}>
              <Typography color="primary">Xóa bộ lọc</Typography>
            </MenuItem>
          </Menu>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshData}
          >
            Làm mới
          </Button>
        </Box>

        {/* Hiển thị bộ lọc đang active */}
        {(search || statusFilter) && (
          <Box mt={1} display="flex" gap={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Bộ lọc:
            </Typography>
            {search && (
              <Chip
                label={`Tìm: "${search}"`}
                size="small"
                onDelete={() => setSearch('')}
              />
            )}
            {statusFilter && (
              <Chip
                label={`Trạng thái: ${orderStatuses[statusFilter]?.label}`}
                size="small"
                onDelete={() => setStatusFilter('')}
              />
            )}
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bảng đơn hàng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Mã đơn hàng</strong></TableCell>
              <TableCell><strong>Khách hàng</strong></TableCell>
              <TableCell><strong>Sản phẩm</strong></TableCell>
              <TableCell><strong>Tổng tiền</strong></TableCell>
              <TableCell><strong>Trạng thái</strong></TableCell>
              <TableCell><strong>Ngày đặt</strong></TableCell>
              <TableCell><strong>Thao tác</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!Array.isArray(paginatedOrders) || paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {search || statusFilter ? 'Không tìm thấy đơn hàng phù hợp' : 'Không có đơn hàng nào'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      #{order.orderNumber || order._id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {order.customer?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customer?.email || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {Array.isArray(order.items) ? `${order.items.length} sản phẩm` : '0 sản phẩm'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Array.isArray(order.items) && order.items.length > 0 
                          ? `${order.items[0]?.title || order.items[0]?.product?.title || 'Sản phẩm'}${order.items.length > 1 ? ` và ${order.items.length - 1} sản phẩm khác` : ''}`
                          : 'Không có sản phẩm'
                        }
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="primary">
                      {order.totalAmount 
                        ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(order.totalAmount)
                        : '0 ₫'
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={orderStatuses[order.status]?.label || order.status || 'pending'}
                      color={orderStatuses[order.status]?.color || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('vi-VN') : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleViewOrder(order)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cập nhật trạng thái">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditOrder(order)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {order.status !== 'cancelled' && order.status !== 'completed' && (
                        <Tooltip title="Hủy đơn hàng">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleCancelOrder(order)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
        count={filteredOrders.length}
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
          Chi tiết đơn hàng #{selectedOrder?.orderNumber || selectedOrder?._id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Thông tin khách hàng */}
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Thông tin khách hàng
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Họ tên:</strong> {selectedOrder.customer?.name || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography><strong>Số điện thoại:</strong> {selectedOrder.customer?.phone || selectedOrder.shippingAddress?.phone || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography><strong>Địa chỉ giao hàng:</strong> {selectedOrder.shippingAddress?.address || 'N/A'}</Typography>
                </Grid>
              </Grid>

              {/* Sản phẩm */}
              <Typography variant="h6" gutterBottom>
                Sản phẩm ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
              </Typography>
              {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Sản phẩm</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Đơn giá</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              {item.image && (
                                <Box
                                  component="img"
                                  src={`http://localhost:5000/uploads/${item.image}`}
                                  alt={item.title}
                                  sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                                />
                              )}
                              <Typography variant="body2">
                                {item.title || item.product?.title || 'Sản phẩm'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">{item.quantity || 0}</TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.price || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format((item.price || 0) * (item.quantity || 0))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">Không có sản phẩm</Typography>
              )}

              {/* Tổng tiền */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Box sx={{ minWidth: 200 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tạm tính:</Typography>
                    <Typography>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedOrder.subTotal || 0)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedOrder.shippingFee || 0)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Giảm giá:</Typography>
                    <Typography color="error">
                      -{new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedOrder.discount || 0)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography><strong>Tổng cộng:</strong></Typography>
                    <Typography variant="h6" color="primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(selectedOrder.totalAmount || 0)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cập nhật trạng thái */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Đơn hàng: <strong>#{selectedOrder.orderNumber || selectedOrder._id}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Khách hàng: {selectedOrder.customer?.name || 'N/A'}
              </Typography>
              
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Trạng thái mới</InputLabel>
                <Select
                  value={selectedOrder.status || 'pending'}
                  label="Trạng thái mới"
                  onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                >
                  {Object.entries(orderStatuses).map(([value, config]) => (
                    <MenuItem key={value} value={value}>
                      <Chip 
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {config.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Hủy</Button>
          <Button 
            onClick={() => handleUpdateStatus(selectedOrder?.status)}
            variant="contained"
            color="primary"
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;