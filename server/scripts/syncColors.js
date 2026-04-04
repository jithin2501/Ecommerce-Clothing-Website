const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const ProductDetail = require('../models/ProductDetail');

const MONGODB_URI = process.env.MONGO_URI;

const sync = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // We use common options, but mainly we just need the connection
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const details = await ProductDetail.find({});
    console.log(`Found ${details.length} product details. Starting sync...`);

    let updatedCount = 0;
    for (const detail of details) {
      if (detail.colors && detail.colors.length > 0) {
        await Product.findByIdAndUpdate(detail.product, {
          colors: detail.colors
        });
        updatedCount++;
      }
    }

    console.log(`Successfully synchronized ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
};

sync();
