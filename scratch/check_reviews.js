const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const Review = require('../server/models/Review');
const ClientUser = require('../server/models/ClientUser');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('--- Reviews ---');
  const reviews = await Review.find({}).lean();
  reviews.forEach(r => {
    console.log(`Review by: ${r.name}, UID: ${r.uid}, ProductId: ${r.productId}`);
  });

  console.log('\n--- ClientUsers ---');
  const users = await ClientUser.find({}).lean();
  users.forEach(u => {
    console.log(`User: ${u.name}, CustomerID: ${u.customerId}, UIDs: ${u.uids.join(', ')}`);
  });

  process.exit();
}

check();
