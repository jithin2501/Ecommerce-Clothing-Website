const crypto = require('crypto');
const razorpay = require('../conf/razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const shiprocketService = require('../services/shiprocket');

const FREE_SHIPPING_THRESHOLD = 136;
const GIFT_WRAP_COST = 6;

/**
 * ── Helper: Calculate Totals ──
 * Centralized logic for subtotal, shipping, and gift wrapping.
 */
const calculateOrderTotals = async (items, giftWrapping) => {
  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Product not found: ${item.name || item.productId}`);
    
    // Check stock
    if (product.stock < (item.qty || 1)) {
      throw new Error(`Sorry, only ${product.stock} units of "${product.name}" are available.`);
    }

    const itemPrice = product.price;
    const itemQty = Number(item.qty) || 1;
    subtotal += itemPrice * itemQty;

    validatedItems.push({
      ...item,
      price: itemPrice
    });
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;
  const giftCost = giftWrapping ? GIFT_WRAP_COST : 0;
  const total = subtotal + shipping + giftCost;

  return { subtotal, shipping, giftCost, total, validatedItems };
};

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
      amount: clientAmount, 
      userId, 
      userName,
      userEmail,
      items, 
      giftWrapping,
      shippingAddress, 
      currency = 'INR', 
      receipt = `rcpt_${Date.now()}` 
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items are required' });
    }

    // ── Server-Side Recalculation ──
    let totals;
    try {
      totals = await calculateOrderTotals(items, giftWrapping);
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    const { total: finalCalculatedAmount, validatedItems } = totals;
    console.log(`💰 Checkout: Client sent ₹${clientAmount}, Server calculated ₹${finalCalculatedAmount}`);

    const options = {
      amount: Math.round(finalCalculatedAmount * 100), 
      currency,
      receipt,
    };

    console.log('📦 Creating Order for body:', req.body);
    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order.id);

    // Generate a unique ID with letters and numbers (e.g. ST-A1B2)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let displayId = 'ST-';
    for (let i = 0; i < 6; i++) displayId += chars.charAt(Math.floor(Math.random() * chars.length));

    // Save initial order record as pending
    await Order.create({
      orderId: order.id,
      displayId,
      userId: userId || 'guest',
      userName: userName || shippingAddress?.name || shippingAddress?.fullName,
      userEmail: userEmail || shippingAddress?.email,
      amount: finalCalculatedAmount,
      currency,
      items: validatedItems,
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
    console.error('❌ Razorpay Create Order Error Detail:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create Razorpay order',
      detail: error.message 
    });
  }
};

/**
 * ── Calculate Order Summary ──
 * Used by the frontend to show "official" totals from the backend.
 */
exports.calculateSummary = async (req, res) => {
  try {
    const { items, giftWrapping } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Items are required' });
    }

    const totals = await calculateOrderTotals(items, giftWrapping);
    res.json({ success: true, ...totals });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
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
      
      // FETCH PAYMENT DETAILS FROM RAZORPAY to get the specific method
      let method = 'Unknown';
      try {
        const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
        method = paymentDetails.method; // e.g. 'upi', 'card', 'netbanking'
      } catch (err) {
        console.error('⚠️ Could not fetch payment method detail from Razorpay:', err);
      }

      // Mark as success and fetch original order info for Shiprocket
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          status: 'success', 
          paymentId: razorpay_payment_id,
          paymentMethod: method 
        },
        { new: true } // Return updated doc
      );

      // Push to Shiprocket
      if (updatedOrder) {
        console.log("--> Attempting Shiprocket Sync for Order:", updatedOrder.displayId);

        // ── Reduce Product Stock ──
        try {
          for (const item of updatedOrder.items) {
            if (item.productId && item.qty) {
              await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock: -Number(item.qty) }
              });
              console.log(`📉 Reduced stock for ${item.productId} by ${item.qty}`);
            }
          }
        } catch (stockError) {
          console.error('⚠️ Stock reduction error:', stockError);
          // We don't fail the whole request if stock reduction fails, but we log it
        }

        const srResponse = await shiprocketService.createOrder(updatedOrder);
        if (srResponse.success) {
          updatedOrder.shiprocketOrderId = srResponse.shiprocketOrderId;
          updatedOrder.shiprocketShipmentId = srResponse.shiprocketShipmentId;
          updatedOrder.trackingLink = shiprocketService.generateTrackingLink(srResponse.shiprocketShipmentId);
          console.log("--> Shiprocket Sync SUCCESS. SR_ORDER_ID:", srResponse.shiprocketOrderId);
        } else {
          // Log the exact rejection reason directly into the database
          updatedOrder.shiprocketError = JSON.stringify(srResponse.error);
          console.log("--> Shiprocket Sync FAILED. Error saved to DB:", srResponse.error);
        }
        await updatedOrder.save();
      }

      return res.json({ success: true, message: 'Payment verified successfully and order pushed to Shiprocket' });
    } else {
      console.error('⚠️ Razorpay Signature Mismatch');
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

  } catch (error) {
    console.error('❌ Razorpay Verify Payment Error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
};

const ClientUser = require('../models/ClientUser');

/**
 * ── Get All Orders (Admin) ──
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    // 1. First, process any "Auto-Repairs" sequentially to avoid Shiprocket rate limits
    // Only attempt auto-repair for orders from the last 24 hours to keep things fast
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const pendingAutoSync = orders.filter(o => o.status === 'success' && !o.shiprocketOrderId && o.createdAt > oneDayAgo);

    if (pendingAutoSync.length > 0) {
      console.log(`🔄 Found ${pendingAutoSync.length} orders for background auto-sync...`);
      for (const o of pendingAutoSync) {
        try {
          console.log(`📦 [Auto-Sync] Processing ${o.displayId}`);
          const srResponse = await shiprocketService.createOrder(o);
          if (srResponse.success) {
            const doc = await Order.findById(o._id);
            doc.shiprocketOrderId = srResponse.shiprocketOrderId;
            doc.shiprocketShipmentId = srResponse.shiprocketShipmentId;
            doc.trackingLink = shiprocketService.generateTrackingLink(srResponse.shiprocketShipmentId);
            await doc.save();
            // Update the local object in our list for the immediate response
            const target = orders.find(orig => orig._id.toString() === o._id.toString());
            if (target) {
              target.shiprocketOrderId = srResponse.shiprocketOrderId;
              target.shiprocketShipmentId = srResponse.shiprocketShipmentId;
              target.trackingStatus = 'NEW';
            }
          }
        } catch (err) {
          console.error(`❌ Auto-sync failed for ${o.displayId}:`, err.message);
        }
      }
    }

    // 2. Then proceed with normal user detail joining
    const joinedData = await Promise.all(orders.map(async (o) => {
      if (o.userId && o.userId !== 'guest') {
        const userDoc = await ClientUser.findOne({ uids: o.userId }).lean();
        if (userDoc) {
          o.user = {
            id: userDoc.customerId || 'N/A', // e.g. CUST-00001
            name: userDoc.name || 'Unknown'
          };
        }
      }
      return o;
    }));

    res.json({ success: true, count: joinedData.length, data: joinedData });
  } catch (error) {
    console.error('❌ getAllOrders error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
};

/**
 * ── Get User's Personal Orders ──
 */
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, error: 'User ID is required' });

    // Only fetch successful/paid orders for the user's history
    const orders = await Order.find({ userId, status: 'success' }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('❌ Get User Orders Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch your orders' });
  }
};

/**
 * ── Sync Tracking Status with Shiprocket ──
 */
exports.syncTrackingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    let tracking = { success: false };

    // 1. Try tracking by Shipment ID (More specific)
    if (order.shiprocketShipmentId) {
      console.log(`🔍 Tracking by Shipment ID: ${order.shiprocketShipmentId}`);
      tracking = await shiprocketService.getTrackingDetails(order.shiprocketShipmentId);
    }

    // 2. Fallback: Try tracking by Order ID (Display ID)
    if (!tracking.success || !tracking.data) {
      console.log(`🔍 Fallback: Tracking by Order ID: ${order.displayId}`);
      tracking = await shiprocketService.getTrackingByOrderId(order.displayId);
    }

    if (tracking.success && tracking.data) {
      const td = tracking.data;
      
      // Update the order with live data
      order.trackingStatus = td.track_status || order.trackingStatus;
      
      const results = {
        success: true,
        trackingStatus: td.track_status,
        courier: td.courier_name || 'Logistic Partner',
        awb: td.awb_code || '',
        // Sort activities by date descending (newest first)
        activities: (td.shipment_track_activities || []).sort((a, b) => new Date(b.date) - new Date(a.date))
      };

      await order.save();
      return res.json(results);
    }

    // Instead of 400, return 200 with success: false for "Quiet" failure (Order too new)
    res.json({ success: false, message: 'Tracking info not yet available from Shiprocket' });
  } catch (error) {
    console.error('❌ Sync Tracking Error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * ── Manual Push to Shiprocket ──
 * Used if the automatic push failed during payment (e.g. env issues)
 */
exports.manualSyncToShiprocket = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ success: false, error: 'Order not found' });
    if (order.shiprocketOrderId) return res.status(400).json({ success: false, error: 'Order already exists in Shiprocket' });

    console.log("--> Manual Sync Attempt for DisplayID:", order.displayId);
    
    const srResponse = await shiprocketService.createOrder(order);
    if (srResponse.success) {
      order.shiprocketOrderId = srResponse.shiprocketOrderId;
      order.shiprocketShipmentId = srResponse.shiprocketShipmentId;
      order.shiprocketError = null; // Clear old error
      order.trackingLink = shiprocketService.generateTrackingLink(srResponse.shiprocketShipmentId);
      await order.save();
      return res.json({ success: true, message: 'Successfully pushed to Shiprocket', srOrderId: srResponse.shiprocketOrderId });
    } else {
      order.shiprocketError = JSON.stringify(srResponse.error);
      await order.save();
      return res.status(400).json({ success: false, error: srResponse.error });
    }
  } catch (error) {
    console.error('❌ Manual Sync Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
