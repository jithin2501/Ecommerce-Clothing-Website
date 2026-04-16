const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Admin - GET the full list for management (MUST BE ABOVE /:id)
router.get('/admin', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Public - Featured sections for homepage (MUST BE ABOVE /:id)
router.get('/featured', async (req, res) => {
  try {
    const { section } = req.query;
    if (!section) return res.status(400).json({ success: false, message: 'Section name is required.' });
    
    // Find products that are active AND marked for this featured section
    const products = await Product.find({ 
      featuredIn: section,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Featured products fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Public - Main products list with optional filtering
router.get('/', async (req, res) => {
  try {
    const { featuredIn, category, ageGroup } = req.query;
    
    let query = { isActive: true };
    
    if (featuredIn) {
      query.featuredIn = featuredIn;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Public products fetch error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Admin - Create, Update, Delete
router.post('/', protect, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;