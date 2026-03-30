const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    uid:     { type: String, default: null },
    name:    { type: String, required: true, trim: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true },
    status:  { type: String, enum: ['pending', 'approved'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);