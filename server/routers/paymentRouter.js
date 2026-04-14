const express = require('express');
const router  = express.Router();
const paymentCtrl = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const protect = authMiddleware.protect;
const superAdminOnly = authMiddleware.superAdminOnly;
const clientProtect = authMiddleware.clientProtect;

// Route to create a Razorpay order
router.post('/create-order', paymentCtrl.createOrder);

// Route to verify Razorpay payment signature
router.post('/verify-payment', paymentCtrl.verifyPayment);

// Route to calculate order summary server-side
router.post('/calculate-summary', paymentCtrl.calculateSummary);

// Route to fetch all orders (for Admin)
router.get('/orders', protect, superAdminOnly, paymentCtrl.getAllOrders);

// Route to fetch orders for a specific user (Protected)
router.get('/user-orders/:userId', clientProtect, paymentCtrl.getUserOrders);

// Route to sync tracking status with Shiprocket (Existing info)
router.get('/track/:orderId', paymentCtrl.syncTrackingStatus);

// NEW: Route to manually push a missing order to Shiprocket
router.post('/manual-sync-sr/:orderId', protect, superAdminOnly, paymentCtrl.manualSyncToShiprocket);

module.exports = router;
