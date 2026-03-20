// ── routes/reviewRoutes.js ──
// Mount in server.js: app.use('/api/reviews', reviewRoutes);

const express = require('express');
const Review  = require('../models/Review');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

// ── Auth middleware (reuse your existing admin check) ──
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ── PUBLIC: Submit a review (QR code lands here) ──
// POST /api/reviews/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, rating, message } = req.body;
    if (!name || !rating || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });
    }
    const review = await Review.create({ name, rating: Number(rating), message });
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── PUBLIC: Get only approved reviews (for frontend) ──
// GET /api/reviews/approved
router.get('/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ── ADMIN: Get all reviews ──
// GET /api/reviews/admin
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ── ADMIN: Approve a review ──
// PATCH /api/reviews/admin/:id/approve
router.patch('/admin/:id/approve', verifyAdmin, async (req, res) => {
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
});

// ── ADMIN: Unapprove a review ──
// PATCH /api/reviews/admin/:id/unapprove
router.patch('/admin/:id/unapprove', verifyAdmin, async (req, res) => {
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
});

// ── ADMIN: Delete a review ──
// DELETE /api/reviews/admin/:id
router.delete('/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;