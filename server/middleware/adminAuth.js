// server/middleware/adminAuth.js
const adminAuth = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Không có quyền truy cập' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Truy cập bị từ chối. Yêu cầu quyền admin' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = adminAuth;