// ── models/Product.js ──
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    category:    { type: String, required: true, trim: true },
    price:       { type: Number, required: true },
    oldPrice:    { type: Number, default: null },
    ageGroup:    { type: String, enum: ['newborn', 'toddler', 'junior'], required: true },
    age:         { type: String, required: true },
    color:       { type: String, default: '' },
    img:         { type: String, required: true },
    badge:       { type: String, default: null },
    stars:       { type: Number, default: 0 },
    reviews:     { type: Number, default: 0 },
    sustainability: { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },
    // Which featured sections this product appears in
    featuredIn:  {
      type: [String],
      enum: ['currentFavorites', 'youMightAlsoLike', 'cartAlsoLike'],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);