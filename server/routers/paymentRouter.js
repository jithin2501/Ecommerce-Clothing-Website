const express = require('express');
const router = express.Router();
const paymentCtrl = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');

const protect = authMiddleware.protect;
const superAdminOnly = authMiddleware.superAdminOnly;

// Rate-limited: stops Razorpay quota abuse and fake order flooding
router.post('/create-order', paymentLimiter, paymentCtrl.createOrder);
router.post('/verify-payment', paymentLimiter, paymentCtrl.verifyPayment);
router.post('/calculate-summary', paymentLimiter, paymentCtrl.calculateSummary);

// Admin-only — protected by JWT, no extra rate limit needed
router.get('/orders', protect, superAdminOnly, paymentCtrl.getAllOrders);
router.get('/user-orders/:userId', paymentCtrl.getUserOrders);
router.get('/track/:orderId', paymentCtrl.syncTrackingStatus);
router.post('/manual-sync-sr/:orderId', protect, superAdminOnly, paymentCtrl.manualSyncToShiprocket);

module.exports = router;