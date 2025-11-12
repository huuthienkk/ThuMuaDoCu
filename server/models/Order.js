// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    }
  },
  shippingAddress: {
    address: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String 
    },
    district: { 
      type: String 
    },
    ward: { 
      type: String 
    }
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1
    }
  }],
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'banking'], 
    default: 'cod' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  subTotal: { 
    type: Number, 
    required: true 
  },
  shippingFee: { 
    type: Number, 
    default: 0 
  },
  totalAmount: { 
    type: Number, 
    required: true 
  },
  note: { 
    type: String 
  },
  rejectionReason: { 
    type: String 
  },
  trackingNumber: {
    type: String
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Tạo index để tìm kiếm nhanh
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.userId': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);