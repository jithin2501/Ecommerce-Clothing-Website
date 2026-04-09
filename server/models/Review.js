const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    uid:       { type: String, default: null },
    name:      { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false },
    orderId:   { type: String }, // To reference the order it came from
    rating:    { type: Number, required: true, min: 1, max: 5 },
    message:   { type: String, required: true, trim: true },
    status:    { type: String, enum: ['pending', 'approved'], default: 'approved' }, // auto-approve for now as requested per user vibe
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);