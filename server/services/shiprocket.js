const axios = require('axios');

let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.error('⚠️ Shiprocket credentials not found in environment variables.');
    return { success: false, error: 'Credentials missing in .env' };
  }

  if (shiprocketToken && tokenExpiry && new Date() < tokenExpiry) {
    return { success: true, token: shiprocketToken };
  }

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    });

    if (response.data && response.data.token) {
      shiprocketToken = response.data.token;

      tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
      return { success: true, token: shiprocketToken };
    }
  } catch (error) {
    const errMsg = error.response?.data?.message || error.message;
    console.error('❌ Failed to authenticate with Shiprocket:', errMsg);
    return { success: false, error: `Login failed: ${errMsg}` };
  }
}

exports.createOrder = async (orderData) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) throw new Error(auth.error);
    const token = auth.token;

    const state = orderData.shippingAddress.state || 'Karnataka';

    const shiprocketOrderPayload = {
      order_id: orderData.displayId,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Home',
      billing_customer_name: orderData.shippingAddress.name || 'Guest',
      billing_last_name: '',
      billing_address: orderData.shippingAddress.street || orderData.shippingAddress.address || 'Address',
      billing_city: orderData.shippingAddress.city || 'City',
      billing_pincode: String(orderData.shippingAddress.pincode || '560001'),
      billing_state: state,
      billing_country: 'India',
      billing_email: orderData.userEmail || 'customer@gmail.com',
      billing_phone: String(orderData.shippingAddress.phone || orderData.shippingAddress.mobile || '9999999999'),
      shipping_is_billing: true,
      order_items: orderData.items.map(item => ({
        name: item.name,
        sku: item.sku || item.productId || item._id?.toString() || 'SKU-001',
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

    if (response.data.status_code === 1) {

      return {
        success: true,
        shiprocketOrderId: response.data.order_id,
        shiprocketShipmentId: response.data.shipment_id
      };
    } else {
      const errorMsg = response.data.message || 'Validation error from Shiprocket';
      const detail = response.data.errors ? JSON.stringify(response.data.errors) : '';
      console.error('❌ Shiprocket rejected order:', orderData.displayId, errorMsg, detail);
      return {
        success: false,
        error: `${errorMsg}${detail ? ': ' + detail : ''}`
      };
    }
  } catch (error) {
    const apiError = error.response?.data;
    let errorMessage = apiError?.message || error.message;
    if (apiError?.errors) {
      errorMessage += ': ' + JSON.stringify(apiError.errors);
    }
    console.error('❌ Shiprocket Technical Error:', errorMessage);
    return { success: false, error: errorMessage };
  }
};

exports.generateTrackingLink = (shipmentId) => {
  return `https://shiprocket.co/tracking/${shipmentId}`;
};

exports.getTrackingByOrderId = async (orderId) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) return { success: false, error: auth.error };
    const token = auth.token;

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${orderId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data && response.data[orderId]) {
      return {
        success: true,
        data: response.data[orderId].tracking_data,
        isOrderLevel: true
      };
    }

    return { success: false, error: 'No tracking data found for this Order ID' };
  } catch (error) {
    console.error('❌ Shiprocket Order Tracking Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

exports.checkServiceability = async (deliveryPincode) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) return { success: false, error: auth.error };
    const token = auth.token;

    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || '560092';

    const codUrl = `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&cod=1&weight=0.5`;

    let res = await axios.get(codUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    let data = res.data;

    let available = data.data?.available_courier_companies || [];

    if (available.length === 0) {

      const prepaidUrl = `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&cod=0&weight=0.5`;
      res = await axios.get(prepaidUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      data = res.data;
      available = data.data?.available_courier_companies || [];
    }

    return {
      success: data.status === 200,
      serviceable: data.status === 200 && available.length > 0,
      data: data.data
    };
  } catch (error) {
    const apiError = error.response?.data;
    console.error("Shiprocket Serviceability Error:", apiError || error.message);
    return { success: false, serviceable: false, message: apiError?.message || error.message };
  }
};

exports.getTrackingDetails = async (shipmentId) => {
  try {
    const auth = await getShiprocketToken();
    if (!auth.success) return { success: false, error: auth.error };
    const token = auth.token;

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, data: response.data.tracking_data };
  } catch (error) {
    console.error('❌ Shiprocket Shipment Tracking Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};