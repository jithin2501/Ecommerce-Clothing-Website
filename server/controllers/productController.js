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
    const products = await Product.find(filter).sort({ createdAt: -1 });
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
    const products = await Product.find({ isActive: true, featuredIn: section }).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/products/admin — all products for admin panel
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
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
      try { return JSON.parse(field[0]); } catch (e) {}
    }
    return field;
  }
  // Case 2: Stringified JSON array from frontend
  if (typeof field === 'string' && field.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {}
  }
  // Case 3: Single string value
  return typeof field === 'string' && field.trim() ? [field.trim()] : (field ? [field] : []);
};

// POST /api/products/admin — create product
const createProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    let { name, category, subCategory, price, oldPrice, ageGroup, age, color, badge, sustainability } = req.body;

    // Handle array fields sent via FormData
    category = parseArrayField(category);
    subCategory = parseArrayField(subCategory);
    ageGroup = parseArrayField(ageGroup);

    const imgUrl = await uploadToS3(req.file, ageGroup[0] || 'other');
    const product = await Product.create({
      name, 
      category,
      subCategory,
      price:    Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      ageGroup,
      age,
      color:    color || '',
      img:      imgUrl,
      badge:    badge || null,
      sustainability: sustainability === 'true',
    });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/products/admin/:id — update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    let { name, category, subCategory, price, oldPrice, ageGroup, age, color, badge, sustainability, isActive, featuredIn } = req.body;

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
    if (color !== undefined) product.color = color;
    if (badge !== undefined) product.badge = badge || null;
    if (sustainability !== undefined) product.sustainability = sustainability === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';

    // featuredIn: array from JSON body, or stringified from FormData
    if (featuredIn !== undefined) {
      product.featuredIn = Array.isArray(featuredIn)
        ? featuredIn
        : JSON.parse(featuredIn);
    }

    if (req.file) {
      await deleteFromS3(product.img);
      product.img = await uploadToS3(req.file, ageGroup || product.ageGroup);
    }

    await product.save();
    res.json({ success: true, data: product });
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