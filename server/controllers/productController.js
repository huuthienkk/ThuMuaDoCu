const Product = require('../models/Product');
const path = require('path');

exports.addProduct = async (req, res) => {
  try {
    const { title, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: 'Vui lòng chọn hình ảnh!' });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      image,
      seller: req.user._id // lấy từ token
    });

    await newProduct.save();
    res.status(201).json({ message: 'Đăng sản phẩm thành công!', product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// ✅ Hàm lấy danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Không thể lấy danh sách sản phẩm', error });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// 🟦 Lấy danh sách sản phẩm của người bán hiện tại
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('seller', 'name email');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// 🟢 Lấy sản phẩm của người dùng hiện tại
exports.getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ token sau khi xác thực
    const products = await Product.find({ seller: userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tải sản phẩm của bạn.' });
  }
};
