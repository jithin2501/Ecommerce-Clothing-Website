const axios = require('axios');

let shiprocketToken = null;
let tokenExpiry = null;

/**
 * ── Authenticate with Shiprocket ──
 * Returns a valid JWT token
 */
async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.error('⚠️ Shiprocket credentials not found in environment variables.');
    return { success: false, error: 'Credentials missing in .env' };
  }

  // Reuse token if valid
  if (shiprocketToken && tokenExpiry && new Date() < tokenExpiry) {
    return shiprocketToken;
  }

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    });

    if (response.data && response.data.token) {
      shiprocketToken = response.data.token;
      // Tokens are usually valid for 10 days, setting a safe 9-day buffer
      tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
      return { success: true, token: shiprocketToken };
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('❌ Failed to authenticate with Shiprocket:', errMsg);
    return { success: false, error: `Login failed: ${errMsg}` };
  }
}

/**
 * ── Create Shiprocket Order ──
 * Pushes standard order to Shiprocket
 */
exports.createOrder = async (orderData) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) throw new Error(auth.error);
    const token = auth.token;

    // Default weight/dimensions since it depends on product type, adjust as needed or fetch from DB
    const state = orderData.shippingAddress.state || 
                  (orderData.shippingAddress.city === 'Bengaluru' ? 'Karnataka' : 'Karnataka'); // Default to Karnataka as safety for this shop

    const shiprocketOrderPayload = {
      order_id: orderData.displayId,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Home',
      billing_customer_name: orderData.shippingAddress.name || 'Guest',
      billing_last_name: '',
      billing_address: orderData.shippingAddress.street || orderData.shippingAddress.address || 'Address',
      billing_city: orderData.shippingAddress.city || 'City',
      billing_pincode: orderData.shippingAddress.pincode || '000000',
      billing_state: state,
      billing_country: 'India',
      billing_email: orderData.userEmail || 'customer@gmail.com',
      billing_phone: orderData.shippingAddress.phone || orderData.shippingAddress.mobile || '9999999999',
      shipping_is_billing: true,
      order_items: orderData.items.map(item => ({
        name: item.name,
        sku: item.sku || item.productId || item._id || 'SKU-001',
        units: item.qty || 1,
        selling_price: item.price,
      })),
      payment_method: 'Prepaid',
      sub_total: orderData.amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      shiprocketOrderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    // Shiprocket returns status_code: 1 for success. 0 for validation/other errors.
    if (response.data.status_code === 1) {
      console.log('✅ Shiprocket Order Created successfully:', response.data.order_id);
      return {
        success: true,
        shiprocketOrderId: response.data.order_id,
        shiprocketShipmentId: response.data.shipment_id
      };
    } else {
      const errorMsg = response.data.message || 'Validation error from Shiprocket';
      const detail = response.data.errors ? JSON.stringify(response.data.errors) : '';
      console.error('❌ Shiprocket rejection for Order:', orderData.displayId, errorMsg, detail);
      return { 
        success: false, 
        error: `${errorMsg}${detail ? ': ' + detail : ''}` 
      };
    }
  } catch (error) {
    const apiError = error.response?.data;
    let errorMessage = apiError?.message || error.message;

    if (apiError?.errors) {
      errorMessage += ": " + JSON.stringify(apiError.errors);
    }

    console.error('❌ Shiprocket Technical Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * ── Generate Tracking Link ──
 */
exports.generateTrackingLink = (shipmentId) => {
  return `https://shiprocket.co/tracking/${shipmentId}`;
};

/**
 * Fetch live tracking info from Shiprocket
 */
exports.getTrackingDetails = async (shipmentId) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) return { success: false, error: auth.error };
    const token = auth.token;

    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return { success: true, data: response.data.tracking_data };
  } catch (error) {
    console.error('❌ Error fetching tracking details:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};
