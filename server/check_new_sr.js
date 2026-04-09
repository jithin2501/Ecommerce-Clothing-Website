const axios = require('axios');
require('dotenv').config();

async function test() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  console.log('Testing Email:', email);
  
  try {
    const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', { email, password });
    console.log('✅ SUCCESS! Token:', res.data.token.substring(0, 10) + '...');
  } catch (err) {
    console.error('❌ FAILED:', err.response?.data || err.message);
  } finally {
    process.exit();
  }
}
test();
