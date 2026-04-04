// ── controllers/productController.js ──
const Product = require('../models/Product');
const { uploadToS3, deleteFromS3 } = require('../conf/s3');

// GET /api/products — public product grid
const getProducts = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.ageGroup) {
      const groups = req.query.ageGroup.split(',');
      filter.ageGroup = { $in: groups };
    }
    // .lean() ensures Map fields serialize correctly
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/products/featured?section=currentFavorites — public, for frontend sections
const getFeaturedProducts = async (req, res) => {
  try {
    const { section } = req.query;
    if (!section) return res.status(400).json({ success: false, message: 'section is required.' });
    // .lean() ensures Map fields serialize correctly
    const products = await Product.find({ isActive: true, featuredIn: section }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/products/admin — all products for admin panel
const getAdminProducts = async (req, res) => {
  try {
    // .lean() returns plain JS objects so Mongoose Maps (inventory) serialize correctly via res.json()
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
};

// Helper to handle array fields from FormData
const parseArrayField = (field) => {
  if (!field) return [];
  // Case 1: Already an array (or parsed as one by middleware)
  if (Array.isArray(field)) {
    // If it's an array with one element that looks like JSON stringified array, parse it
    if (field.length === 1 && typeof field[0] === 'string' && field[0].startsWith('[')) {
      try { return JSON.parse(field[0]); } catch (e) { }
    }
    return field;
  }
  // Case 2: Stringified JSON array from frontend
  if (typeof field === 'string' && field.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) { }
  }
  // Case 3: Single string value
  return typeof field === 'string' && field.trim() ? [field.trim()] : (field ? [field] : []);
};

// POST /api/products/admin — create product
const createProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    let { name, category, subCategory, price, oldPrice, ageGroup, age, badge, sustainability, inventory, stock } = req.body;

    // Handle array fields sent via FormData
    category = parseArrayField(category);
    subCategory = parseArrayField(subCategory);
    ageGroup = parseArrayField(ageGroup);

    // Parse inventory (Map/Object)
    let parsedInventory = {};
    if (inventory) {
      try { parsedInventory = typeof inventory === 'string' ? JSON.parse(inventory) : inventory; } catch (e) { }
    }

    const parsedStock = stock !== undefined ? Number(stock) : 0;
    const imgUrl = await uploadToS3(req.file, ageGroup[0] || 'other');
    const product = await Product.create({
      name,
      category,
      subCategory,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      ageGroup,
      age,
      img: imgUrl,
      badge: badge || null,
      sustainability: sustainability === 'true',
      inventory: parsedInventory,
      stock: parsedStock
    });

    // Return as plain object to ensure inventory Map is serialized for React
    res.json({ success: true, data: product.toObject() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/admin/:id — update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    let { name, category, subCategory, price, oldPrice, ageGroup, age, badge, sustainability, isActive, featuredIn, inventory, stock } = req.body;

    if (name) product.name = name;

    if (category !== undefined) {
      product.category = parseArrayField(category);
    }
    if (subCategory !== undefined) {
      product.subCategory = parseArrayField(subCategory);
    }
    if (price) product.price = Number(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;

    if (ageGroup !== undefined) {
      product.ageGroup = parseArrayField(ageGroup);
    }
    if (age) product.age = age;
    if (badge !== undefined) product.badge = badge || null;
    if (sustainability !== undefined) product.sustainability = sustainability === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';
    // Guard against empty string and only update when a real value is sent
    if (stock !== undefined && stock !== '') product.stock = Number(stock);

    // featuredIn: array from JSON body, or stringified from FormData
    if (featuredIn !== undefined) {
      product.featuredIn = Array.isArray(featuredIn)
        ? featuredIn
        : JSON.parse(featuredIn);
    }

    if (inventory !== undefined) {
      try {
        const parsed = typeof inventory === 'string' ? JSON.parse(inventory) : inventory;
        // Only apply if it's a non-empty object — prevents an empty FormData send from wiping stock
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          product.inventory = parsed;
          product.markModified('inventory');
        }
      } catch (e) { }
    }

    if (req.file) {
      await deleteFromS3(product.img);
      // Use the already-parsed ageGroup array (or fall back to the existing one)
      const parsedAgeGroup = ageGroup !== undefined ? parseArrayField(ageGroup) : product.ageGroup;
      product.img = await uploadToS3(req.file, parsedAgeGroup[0] || product.ageGroup[0] || 'other');
    }

    await product.save();
    // Return as plain object for React compatibility with Maps
    res.json({ success: true, data: product.toObject() });
  } catch (err) {
    console.error('updateProduct error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/admin/:id — delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false });
    await deleteFromS3(product.img);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

module.exports = { getProducts, getFeaturedProducts, getAdminProducts, createProduct, updateProduct, deleteProduct };