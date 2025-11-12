import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip,
  Alert,
  Snackbar,
  Pagination,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useConfirm } from 'material-ui-confirm';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });

  const confirm = useConfirm();

  // 🎯 Fetch users
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      showSnackbar('Lỗi khi tải danh sách users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // 🆕 THÊM user mới
  const handleCreateUser = async () => {
    try {
      await api.post('/admin/users', formData);
      showSnackbar('Đã tạo user thành công');
      setOpenDialog(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Lỗi khi tạo user', 'error');
    }
  };

  // ✏️ CẬP NHẬT user
  const handleUpdateUser = async () => {
    try {
      await api.put(`/admin/users/${editingUser._id}`, formData);
      showSnackbar('Đã cập nhật user thành công');
      setOpenDialog(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Lỗi khi cập nhật user', 'error');
    }
  };

  // 🗑️ XÓA user
  const handleDeleteUser = async (user) => {
    try {
      await confirm({
        title: 'Xác nhận xóa',
        description: `Bạn có chắc muốn xóa user "${user.name}"? Tất cả sản phẩm của user này cũng sẽ bị xóa.`,
        confirmationText: 'Xóa',
        cancellationText: 'Hủy'
      });

      await api.delete(`/admin/users/${user._id}`);
      showSnackbar('Đã xóa user thành công');
      fetchUsers();
    } catch (error) {
      if (error !== undefined) {
        showSnackbar(error.response?.data?.message || 'Lỗi khi xóa user', 'error');
      }
    }
  };

  // 👀 Xem chi tiết user
  const handleViewUser = async (user) => {
    try {
      const res = await api.get(`/admin/users/${user._id}`);
      setSelectedUser(res.data);
      setOpenViewDialog(true);
    } catch (error) {
      showSnackbar('Lỗi khi lấy thông tin user', 'error');
    }
  };

  // 🔄 Toggle trạng thái user
  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/admin/users/${user._id}`, {
        isActive: !user.isActive
      });
      showSnackbar(`Đã ${user.isActive ? 'vô hiệu hóa' : 'kích hoạt'} user`);
      fetchUsers();
    } catch (error) {
      showSnackbar('Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true
    });
    setEditingUser(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Không hiển thị password cũ
      role: user.role,
      isActive: user.isActive
    });
    setEditingUser(user);
    setOpenDialog(true);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          👥 Quản lý Người dùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Thêm User
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tìm kiếm theo tên/email"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Vai trò"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Trạng thái"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Đã vô hiệu hóa</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Switch
                      checked={user.isActive}
                      onChange={() => handleToggleStatus(user)}
                      color="success"
                    />
                    <Chip
                      label={user.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                      color={user.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Xem chi tiết">
                    <IconButton onClick={() => handleViewUser(user)} color="info">
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton onClick={() => openEditDialog(user)} color="primary">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}>
                    <IconButton 
                      onClick={() => handleToggleStatus(user)}
                      color={user.isActive ? 'warning' : 'success'}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleDeleteUser(user)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={pagination.pages}
            page={pagination.current}
            onChange={(e, page) => fetchUsers(page)}
            color="primary"
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Chỉnh sửa User' : 'Thêm User Mới'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Họ tên"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingUser}
              helperText={editingUser && "Để trống nếu không muốn thay đổi password"}
            />
            <TextField
              select
              label="Vai trò"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label="Tài khoản đang hoạt động"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={editingUser ? handleUpdateUser : handleCreateUser}
            variant="contained"
          >
            {editingUser ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>Thông tin cơ bản</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Tên:</strong> {selectedUser.user.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Email:</strong> {selectedUser.user.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Vai trò:</strong> {selectedUser.user.role}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    <strong>Trạng thái:</strong> 
                    <Chip 
                      label={selectedUser.user.isActive ? 'Đang hoạt động' : 'Vô hiệu hóa'} 
                      color={selectedUser.user.isActive ? 'success' : 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom mt={3}>
                Sản phẩm đã đăng ({selectedUser.totalProducts})
              </Typography>
              {selectedUser.products.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell>Giá</TableCell>
                        <TableCell>Danh mục</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUser.products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.title}</TableCell>
                          <TableCell>{product.price.toLocaleString()} ₫</TableCell>
                          <TableCell>{product.category}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary">Chưa có sản phẩm nào</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;