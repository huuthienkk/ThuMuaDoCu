// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware started');
    
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
      console.log('📨 Token from Bearer header:', token ? '✓ Received' : '✗ Missing');
    } else {
      token = req.header('Authorization')?.replace('Bearer ', '');
      console.log('📨 Token from Auth header:', token ? '✓ Received' : '✗ Missing');
    }

    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ 
        message: 'Không có token, truy cập bị từ chối' 
      });
    }

    console.log('🔑 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    console.log('✅ Token decoded:', decoded);
    
    // 👇 SỬA CHỖ NÀY - TÌM CẢ userId VÀ id
    const userId = decoded.userId || decoded.id;
    console.log('👤 Finding user with ID:', userId);
    
    if (!userId) {
      console.log('❌ No user ID found in token');
      return res.status(401).json({ 
        message: 'Token không hợp lệ: thiếu user ID' 
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database for ID:', userId);
      return res.status(404).json({ 
        message: 'Người dùng không tồn tại!' 
      });
    }

    console.log('✅ User found:', user.email);
    
    if (user.isActive === false) {
      console.log('❌ User account is inactive');
      return res.status(403).json({ 
        message: 'Tài khoản của bạn đã bị vô hiệu hóa' 
      });
    }

    req.user = user;
    console.log('✅ Auth successful, proceeding to next middleware');
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token không hợp lệ' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token đã hết hạn' 
      });
    }
    
    res.status(401).json({ 
      message: 'Xác thực thất bại!', 
      error: error.message 
    });
  }
};

module.exports = auth;