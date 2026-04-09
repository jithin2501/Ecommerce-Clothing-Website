const cron = require('node-cron');
const Order = require('./models/Order');
const shiprocket = require('./services/shiprocket');

// ── Run immediately on startup to catch any missed orders ──
const syncUnsyncedOrders = async () => {
    try {
        const unsyncedOrders = await Order.find({
            status: 'success',
            shiprocketOrderId: { $exists: false }
        });

        if (unsyncedOrders.length === 0) {
            console.log('✅ No unsynced orders found.');
            return;
        }

        console.log(`🔄 Found ${unsyncedOrders.length} unsynced order(s), pushing to Shiprocket...`);

        for (const order of unsyncedOrders) {
            try {
                const result = await shiprocket.createOrder(order);

                if (result.success) {
                    await Order.findByIdAndUpdate(order._id, {
                        shiprocketOrderId: result.shiprocketOrderId,
                        shiprocketShipmentId: result.shiprocketShipmentId,
                        trackingStatus: 'PROCESSING',
                        trackingLink: shiprocket.generateTrackingLink(result.shiprocketShipmentId)
                    });
                    console.log(`✅ Synced order to Shiprocket: ${order.displayId}`);
                } else {
                    console.warn(`⚠️  Shiprocket rejected order ${order.displayId}:`, result.error);
                }
            } catch (err) {
                console.error(`❌ Error syncing order ${order.displayId}:`, err.message);
            }
        }
    } catch (err) {
        console.error('❌ syncUnsyncedOrders error:', err.message);
    }
};

module.exports = function startCronJobs() {
    console.log('🕐 Cron jobs initialized...');
    
    const email = process.env.SHIPROCKET_EMAIL || 'NOT SET';
    const maskedEmail = email.replace(/^(..)(.*)(@.*)$/, '$1***$3');
    console.log(`📡 Shiprocket sync target: ${maskedEmail}`);

    // ── Run immediately when server starts ──
    // This catches all missed orders right away after deploy
    syncUnsyncedOrders();

    // ── Then run every 5 minutes automatically ──
    cron.schedule('*/5 * * * *', async () => {
        console.log(`⏰ [${new Date().toLocaleTimeString()}] Running Shiprocket sync check...`);
        await syncUnsyncedOrders();
    });
};