const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const {
  submitReview, getApprovedReviews, getAllReviews,
  approveReview, unapproveReview, deleteReview,
} = require('../controllers/reviewController');

// ── Auth middleware ──
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ── Public ──
router.post('/submit',   submitReview);
router.get('/approved',  getApprovedReviews);

// ── Admin ──
router.get   ('/admin',                verifyAdmin, getAllReviews);
router.patch ('/admin/:id/approve',    verifyAdmin, approveReview);
router.patch ('/admin/:id/unapprove',  verifyAdmin, unapproveReview);
router.delete('/admin/:id',            verifyAdmin, deleteReview);

module.exports = router;