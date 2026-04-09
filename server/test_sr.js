const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function testShiprocket() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  console.log('Testing with Email:', email);

  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email,
      password
    });
    console.log('✅ LOGIN SUCCESS. Token received.');
    
    // Test fetch pickup locations
    const token = response.data.token;
    const locRes = await axios.get('https://apiv2.shiprocket.in/v1/external/settings/getallpickups', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('--- PICKUP LOCATIONS ---');
    console.log(JSON.stringify(locRes.data.data.shipping_address, null, 2));

  } catch (error) {
    console.error('❌ LOGIN FAILED');
    console.error(error.response?.data || error.message);
  } finally {
    process.exit();
  }
}

testShiprocket();
