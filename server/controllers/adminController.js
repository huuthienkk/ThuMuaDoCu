// controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// 🟢 Lấy thống kê tổng quan
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    
    const totalProducts = await Product.countDocuments();
    const approvedProducts = await Product.countDocuments({ status: 'approved' });
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const rejectedProducts = await Product.countDocuments({ status: 'rejected' });
    
    // Thống kê đơn hàng
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const confirmedOrders = await Order.countDocuments({ status: 'confirmed' });
    const shippingOrders = await Order.countDocuments({ status: 'shipping' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Tính tổng doanh thu
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalProducts,
      approvedProducts,
      pendingProducts,
      rejectedProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy thống kê',
      error: error.message 
    });
  }
};

// 🟢 Quản lý users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    let query = {};

    // Tìm kiếm theo tên hoặc email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo role
    if (role) {
      query.role = role;
    }

    // Lọc theo trạng thái
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách users'
    });
  }
};

// 🟢 Lấy chi tiết user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Lấy sản phẩm của user
    const products = await Product.find({ seller: req.params.id })
      .select('title price category status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    // Lấy đơn hàng của user
    const orders = await Order.find({ 'customer.userId': req.params.id })
      .select('orderNumber totalAmount status createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        totalProducts: await Product.countDocuments({ seller: req.params.id }),
        totalOrders: await Order.countDocuments({ 'customer.userId': req.params.id }),
        products,
        orders
      }
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin user'
    });
  }
};

// 🟢 Tạo user mới
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || 'user',
      isActive: isActive !== undefined ? isActive : true
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo user'
    });
  }
};

// 🟢 Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    const updateData = { name, email, role, isActive };
    
    // Chỉ cập nhật password nếu có
    if (password) {
      updateData.password = password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật user thành công',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật user'
    });
  }
};

// 🟢 Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Không cho xóa chính mình
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa tài khoản của chính mình'
      });
    }

    // Xóa các sản phẩm của user
    await Product.deleteMany({ seller: req.params.id });
    
    // Xóa các đơn hàng của user
    await Order.deleteMany({ 'customer.userId': req.params.id });

    // Xóa user
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa user'
    });
  }
};

// 🟢 Quản lý sản phẩm - Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const category = req.query.category || '';
    const skip = (page - 1) * limit;

    let query = {};

    // Tìm kiếm theo tiêu đề hoặc mô tả
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    // Lọc theo danh mục
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    // Lấy danh sách categories duy nhất
    const categories = await Product.distinct('category', query);

    res.json({
      success: true,
      products,
      categories,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sản phẩm'
    });
  }
};

// 🟢 Lấy sản phẩm chờ duyệt
exports.getPendingProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = { status: 'pending' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get pending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sản phẩm chờ duyệt'
    });
  }
};

// 🟢 Duyệt sản phẩm
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    product.status = 'approved';
    product.approvedAt = new Date();
    product.approvedBy = req.user._id;
    product.rejectionReason = '';

    await product.save();

    res.json({
      success: true,
      message: 'Đã duyệt sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi duyệt sản phẩm'
    });
  }
};

// 🟢 Từ chối sản phẩm
exports.rejectProduct = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập lý do từ chối'
      });
    }

    product.status = 'rejected';
    product.rejectionReason = rejectionReason;
    product.approvedAt = new Date();
    product.approvedBy = req.user._id;

    await product.save();

    res.json({
      success: true,
      message: 'Đã từ chối sản phẩm',
      product
    });
  } catch (error) {
    console.error('Reject product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi từ chối sản phẩm'
    });
  }
};

// 🟢 Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = { title, description, price, category };
    
    if (image) {
      updateData.image = image;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật sản phẩm'
    });
  }
};

// 🟢 Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa sản phẩm'
    });
  }
};

// 🟢 Lấy thống kê sản phẩm
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: 'pending' });
    const approvedProducts = await Product.countDocuments({ status: 'approved' });
    const rejectedProducts = await Product.countDocuments({ status: 'rejected' });

    // Thống kê theo danh mục
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        pendingProducts,
        approvedProducts,
        rejectedProducts,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê sản phẩm'
    });
  }
};