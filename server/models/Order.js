const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  paymentId: { type: String },
  userId: { type: String, required: true },
  userName: { type: String },
  userEmail: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'pending' },
  items: [
    {
      productId: { type: String },
      name: { type: String },
      qty: { type: Number },
      price: { type: String },
      size: { type: String },
      color: { type: String },   // ← added
      img: { type: String },
    }
  ],
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    pincode: String,
    city: String,
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);