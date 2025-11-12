const express = require('express');
const router = express.Router();
const Exchange = require('../models/Exchange');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// 🎯 Gửi đề xuất trao đổi
router.post('/propose', auth, async (req, res) => {
  try {
    const { fromProductId, toProductId, message } = req.body;
    const userId = req.user.id;

    // Kiểm tra sản phẩm tồn tại
    const fromProduct = await Product.findById(fromProductId);
    const toProduct = await Product.findById(toProductId);

    if (!fromProduct || !toProduct) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra sản phẩm thuộc về người dùng
    if (fromProduct.seller.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không sở hữu sản phẩm này' });
    }

    // Kiểm tra không trao đổi với chính mình
    if (fromProduct.seller.toString() === toProduct.seller.toString()) {
      return res.status(400).json({ message: 'Không thể trao đổi với chính mình' });
    }

    // Kiểm tra đề xuất trùng
    const existingExchange = await Exchange.findOne({
      fromProduct: fromProductId,
      toProduct: toProductId,
      status: 'pending'
    });

    if (existingExchange) {
      return res.status(400).json({ message: 'Đề xuất trao đổi đã tồn tại' });
    }

    // Tạo đề xuất mới
    const exchange = new Exchange({
      fromProduct: fromProductId,
      toProduct: toProductId,
      fromUser: userId,
      toUser: toProduct.seller,
      message: message,
      status: 'pending'
    });

    await exchange.save();

    // Populate thông tin để trả về
    await exchange.populate('fromProduct toProduct fromUser toUser');

    res.status(201).json({
      message: 'Đề xuất trao đổi đã được gửi thành công',
      exchange
    });

  } catch (error) {
    console.error('Lỗi khi gửi đề xuất:', error);
    res.status(500).json({ message: 'Lỗi server khi gửi đề xuất' });
  }
});

// 🎯 Lấy đề xuất trao đổi của tôi (gửi đi và nhận về)
router.get('/my-offers', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const exchanges = await Exchange.find({
      $or: [
        { fromUser: userId }, // Đề xuất tôi gửi
        { toUser: userId }    // Đề xuất tôi nhận
      ]
    })
    .populate('fromProduct', 'title image price category seller')
    .populate('toProduct', 'title image price category seller')
    .populate('fromUser', 'name email')
    .populate('toUser', 'name email')
    .sort({ createdAt: -1 });

    res.json(exchanges);

  } catch (error) {
    console.error('Lỗi khi lấy đề xuất:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đề xuất' });
  }
});

// 🎯 Phản hồi đề xuất (chấp nhận/từ chối)
router.put('/:id/respond', auth, async (req, res) => {
  try {
    const { response, message } = req.body; // response: 'accepted', 'rejected'
    const exchangeId = req.params.id;
    const userId = req.user.id;

    const exchange = await Exchange.findById(exchangeId);

    if (!exchange) {
      return res.status(404).json({ message: 'Đề xuất không tồn tại' });
    }

    // Kiểm tra người dùng có quyền phản hồi
    if (exchange.toUser.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền phản hồi đề xuất này' });
    }

    // Kiểm tra trạng thái hiện tại
    if (exchange.status !== 'pending') {
      return res.status(400).json({ message: 'Đề xuất đã được xử lý' });
    }

    // Cập nhật trạng thái
    exchange.status = response;
    exchange.responseMessage = message;
    exchange.respondedAt = new Date();

    await exchange.save();
    await exchange.populate('fromProduct toProduct fromUser toUser');

    res.json({
      message: `Đã ${response === 'accepted' ? 'chấp nhận' : 'từ chối'} đề xuất trao đổi`,
      exchange
    });

  } catch (error) {
    console.error('Lỗi khi phản hồi đề xuất:', error);
    res.status(500).json({ message: 'Lỗi server khi phản hồi đề xuất' });
  }
});

// 🎯 Lấy sản phẩm có thể trao đổi (của người khác)
router.get('/available-products', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const products = await Product.find({
      seller: { $ne: userId }, // Không phải sản phẩm của mình
      status: 'approved'
    }).populate('seller', 'name email rating');

    res.json(products);

  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy sản phẩm' });
  }
});

module.exports = router;