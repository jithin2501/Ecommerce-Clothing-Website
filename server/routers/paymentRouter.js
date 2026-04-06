const express = require('express');
const router  = express.Router();
const paymentCtrl = require('../controllers/paymentController');

// Route to create a Razorpay order
router.post('/create-order', paymentCtrl.createOrder);

// Route to verify Razorpay payment signature
router.post('/verify-payment', paymentCtrl.verifyPayment);

// Route to fetch all orders (for Admin)
router.get('/orders', paymentCtrl.getAllOrders);

module.exports = router;
