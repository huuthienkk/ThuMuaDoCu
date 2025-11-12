// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');

// 🟢 Tạo đơn hàng mới
router.post('/', authMiddleware, createOrder);

// 🟢 Lấy đơn hàng của user
router.get('/my-orders', authMiddleware, getUserOrders);

// 🟢 Lấy chi tiết đơn hàng
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;