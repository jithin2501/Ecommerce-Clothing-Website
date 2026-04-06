const crypto = require('crypto');
const razorpay = require('../conf/razorpay');
const Order = require('../models/Order');

/**
 * ── Create Razorpay Order ──
 * Generates an order ID that the frontend uses to open the payment modal.
 */
exports.createOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ success: false, error: 'Razorpay not configured' });
  }
  try {
    const { 
      amount, 
      userId, 
      items, 
      shippingAddress, 
      currency = 'INR', 
      receipt = `rcpt_${Date.now()}` 
    } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, error: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise (1 INR = 100 paise)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    // Save initial order record as pending
    await Order.create({
      orderId: order.id,
      userId,
      amount,
      currency,
      items,
      shippingAddress,
      status: 'pending'
    });

    res.json({
      success: true,
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error('❌ Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
  }
};

/**
 * ── Verify Razorpay Payment ──
 * Validates the payment signature sent by the frontend to confirm it's legitimate.
 */
exports.verifyPayment = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ success: false, error: 'Razorpay not configured' });
  }
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSignature) {
      console.log('✅ Razorpay Payment Verified:', razorpay_payment_id);
      
      // Mark as success
      await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: 'success', paymentId: razorpay_payment_id }
      );

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      console.error('⚠️ Razorpay Signature Mismatch');
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

  } catch (error) {
    console.error('❌ Razorpay Verify Payment Error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
};

/**
 * ── Get All Orders (Admin) ──
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};
