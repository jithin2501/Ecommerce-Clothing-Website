const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Order = require('./models/Order');

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Check orders from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const orders = await Order.find({ createdAt: { $gte: sevenDaysAgo } }).sort({ createdAt: -1 }).lean();
    console.log('--- ALL RECENT ORDERS ---');
    orders.forEach(o => {
      console.log(`Date: ${o.createdAt.toISOString().slice(0,10)} | ID: ${o.displayId} | Status: ${o.status} | SR_ID: ${o.shiprocketOrderId || 'N/A'} | Error: ${o.shiprocketError || 'None'}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkOrders();
