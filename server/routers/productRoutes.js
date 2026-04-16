const express = require('express');
const router = express.Router();
const multer  = require('multer');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const { uploadToS3, deleteFromS3 } = require('../conf/s3');

// ── Multer Setup ──
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Match Nginx/Express limits
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

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

// ── Shared Parsing Logic for Multipart Form ──
const parseBody = (body) => {
  const result = { ...body };
  Object.keys(result).forEach(key => {
    try {
      // If it looks like JSON (array or object), parse it
      if (typeof result[key] === 'string' && (result[key].startsWith('[') || result[key].startsWith('{'))) {
        result[key] = JSON.parse(result[key]);
      }
    } catch (e) {
      // Not JSON, keep as string
    }
  });
  return result;
};

// Admin - Create
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const data = parseBody(req.body);
    
    if (req.file) {
      const firstAgeGroup = Array.isArray(data.ageGroup) ? data.ageGroup[0] : 'Other';
      data.img = await uploadToS3(req.file, firstAgeGroup);
    } else {
      return res.status(400).json({ success: false, message: 'Image is required.' });
    }

    const product = await Product.create(data);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error('Product creation error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin - Update
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const data = parseBody(req.body);
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });

    if (req.file) {
      // Delete old image from S3 if it exists and we're uploading a new one
      if (existing.img) {
        await deleteFromS3(existing.img).catch(() => {});
      }
      const firstAgeGroup = Array.isArray(data.ageGroup) ? data.ageGroup[0] : 'Other';
      data.img = await uploadToS3(req.file, firstAgeGroup);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ success: true, data: product });
  } catch (err) {
    console.error('Product update error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin - Delete
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.img) {
      await deleteFromS3(product.img).catch(() => {});
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;