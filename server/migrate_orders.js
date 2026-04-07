const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

const updateOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await Order.find({ displayId: { $exists: false } });
        console.log(`Found ${orders.length} orders to update.`);
        
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        for (const o of orders) {
            let dId = 'ST-';
            for (let i = 0; i < 6; i++) dId += chars.charAt(Math.floor(Math.random() * chars.length));
            o.displayId = dId;
            o.paymentMethod = 'Razorpay'; // Default for old ones
            await o.save();
        }
        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

updateOrders();
