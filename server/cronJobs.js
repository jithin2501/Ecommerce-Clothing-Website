const cron = require('node-cron');
const Order = require('./models/Order');
const shiprocket = require('./services/shiprocket');

const syncUnsyncedOrders = async () => {
    try {
        const unsyncedOrders = await Order.find({
            status: 'success',
            $or: [
                { shiprocketOrderId: { $exists: false } },
                { shiprocketOrderId: null },
                { shiprocketOrderId: '' }
            ]
        });

        if (unsyncedOrders.length === 0) return;

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
                } else {
                    await Order.findByIdAndUpdate(order._id, {
                        shiprocketError: result.error
                    });
                }
            } catch (err) { }
        }
    } catch (err) { }
};

module.exports = function startCronJobs() {
    syncUnsyncedOrders();
    cron.schedule('*/5 * * * *', async () => {
        await syncUnsyncedOrders();
    });
};