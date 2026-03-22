// ── controllers/reviewController.js ──
const Review = require('../models/Review');

// POST /api/reviews/submit — public
const submitReview = async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    if (!name || !rating || !message)
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });
    const review = await Review.create({ name, rating: Number(rating), message });
    res.json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/reviews/approved — public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/reviews/admin — admin
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

// PATCH /api/reviews/admin/:id/approve — admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false });
    res.json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false });
  }
};

// PATCH /api/reviews/admin/:id/unapprove — admin
const unapproveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'pending' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false });
    res.json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false });
  }
};

// DELETE /api/reviews/admin/:id — admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

module.exports = { submitReview, getApprovedReviews, getAllReviews, approveReview, unapproveReview, deleteReview };