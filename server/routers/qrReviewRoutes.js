// routers/qrReviewRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const ctrl = require('../controllers/qrReviewController');

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

// Public
router.post('/submit', ctrl.submitQRReview);
router.get('/approved', ctrl.getApprovedQRReviews);

// Admin
router.get('/admin', verifyAdmin, ctrl.getAllQRReviews);
router.patch('/admin/:id/approve', verifyAdmin, ctrl.approveQRReview);
router.patch('/admin/:id/unapprove', verifyAdmin, ctrl.unapproveQRReview);
router.delete('/admin/:id', verifyAdmin, ctrl.deleteQRReview);

module.exports = router;