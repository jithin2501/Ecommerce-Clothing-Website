// routers/qrReviewRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');

router.post('/submit', ctrl.submitQRReview);
router.get('/approved', ctrl.getApprovedQRReviews);

// Admin
router.get('/admin', protect, ctrl.getAllQRReviews);
router.patch('/admin/:id/approve', protect, ctrl.approveQRReview);
router.patch('/admin/:id/unapprove', protect, ctrl.unapproveQRReview);
router.delete('/admin/:id', protect, ctrl.deleteQRReview);

module.exports = router;