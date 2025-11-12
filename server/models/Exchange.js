const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  fromProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  toProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  responseMessage: {
    type: String,
    trim: true
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index để tối ưu query
ExchangeSchema.index({ fromUser: 1, createdAt: -1 });
ExchangeSchema.index({ toUser: 1, createdAt: -1 });
ExchangeSchema.index({ status: 1 });

module.exports = mongoose.model('Exchange', ExchangeSchema);