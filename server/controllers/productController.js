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

// POST /api/products/admin — create product
const createProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    let { name, category, subCategory, price, oldPrice, ageGroup, age, color, badge, sustainability } = req.body;

    // Handle array fields sent via FormData
    try { category = JSON.parse(category); } catch (e) {}
    try { subCategory = JSON.parse(subCategory); } catch (e) {}
    try { ageGroup = JSON.parse(ageGroup); } catch (e) {}

    const imgUrl = await uploadToS3(req.file, Array.isArray(ageGroup) ? ageGroup[0] : ageGroup);
    const product = await Product.create({
      name, 
      category: Array.isArray(category) ? category : [category],
      subCategory: Array.isArray(subCategory) ? subCategory : (subCategory ? [subCategory] : []),
      price:    Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      ageGroup: Array.isArray(ageGroup) ? ageGroup : [ageGroup],
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
    
    if (category) {
        try { category = JSON.parse(category); } catch (e) {}
        product.category = Array.isArray(category) ? category : [category];
    }
    if (subCategory !== undefined) {
        try { subCategory = JSON.parse(subCategory); } catch (e) {}
        product.subCategory = Array.isArray(subCategory) ? subCategory : (subCategory ? [subCategory] : []);
    }
    if (price) product.price = Number(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
    
    if (ageGroup) {
        try { ageGroup = JSON.parse(ageGroup); } catch (e) {}
        product.ageGroup = Array.isArray(ageGroup) ? ageGroup : [ageGroup];
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