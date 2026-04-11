const express = require('express');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const {
  submitReview, getProductReviews, getUserReviews, getApprovedReviews, getAllReviews,
  approveReview, unapproveReview, deleteReview,
} = require('../controllers/reviewController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

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
router.post('/submit',             upload.array('attachments', 5), submitReview);
router.get ('/product/:productId', getProductReviews);
router.get ('/user/:uid',          getUserReviews);
router.get ('/approved',           getApprovedReviews);

// ── Admin ──
router.get   ('/admin',                verifyAdmin, getAllReviews);
router.patch ('/admin/:id/approve',    verifyAdmin, approveReview);
router.patch ('/admin/:id/unapprove',  verifyAdmin, unapproveReview);
router.delete('/admin/:id',            verifyAdmin, deleteReview);

module.exports = router;