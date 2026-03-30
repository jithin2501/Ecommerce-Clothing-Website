// server/models/ClientUser.js
// ⚠️  Renamed from User.js → ClientUser.js
//     because server/models/User.js already exists (your admin user model).

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String },
  name:      { type: String },
  img:       { type: String },
  price:     { type: Number },
  size:      { type: String },
  color:     { type: String },
  qty:       { type: Number, default: 1 },
  addedAt:   { type: Date,   default: Date.now },
}, { _id: false });

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: String },
  name:      { type: String },
  img:       { type: String },
  price:     { type: String },
  category:  { type: String },
  addedAt:   { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId:  { type: String },
  items:    [cartItemSchema],
  total:    { type: Number },
  status:   { type: String, default: 'placed' },
  placedAt: { type: Date,   default: Date.now },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  id:       String,
  fullName: String,
  mobile:   String,
  pincode:  String,
  locality: String,
  address:  String,
  city:     String,
  state:    String,
  landmark: String,
  altPhone: String,
  type:     String,
  name:     String,
  phone:    String,
  line1:    String,
  line2:    String,
  isDefault:{ type: Boolean, default: false },
}, { _id: false });

const clientUserSchema = new mongoose.Schema({
  uid:       { type: String, required: true, unique: true },  // Firebase UID
  loginType: { type: String, enum: ['google', 'phone'], required: true },

  name:   { type: String, default: '' },
  email:  { type: String, default: '' },
  phone:  { type: String, default: '' },
  photo:  { type: String, default: '' },
  gender: { type: String, default: '' },

  addresses: { type: [addressSchema],      default: [] },
  wishlist:  { type: [wishlistItemSchema], default: [] },
  orders:    { type: [orderSchema],        default: [] },

  // Abandoned cart — items added to cart but never purchased
  cart:      { type: [cartItemSchema],     default: [] },

  lastSeen:  { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: false });

module.exports = mongoose.model('ClientUser', clientUserSchema);