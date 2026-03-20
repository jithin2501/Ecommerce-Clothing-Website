// ── routers/productRoutes.js ──
// Mount in server.js: app.use('/api/products', productRoutes);

const express  = require('express');
const multer   = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const jwt      = require('jsonwebtoken');
const Product  = require('../models/Product');
const router   = express.Router();

// ── S3 client ──
const REGION = process.env.AWS_REGION;
const BUCKET = process.env.AWS_S3_BUCKET;

const s3 = new S3Client({
  region: REGION,
  endpoint: `https://s3.${REGION}.amazonaws.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ── Multer (memory storage — stream straight to S3) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

// ── Upload helper ──
const uploadToS3 = async (file) => {
  const ext  = file.originalname.split('.').pop();
  const key  = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket:             BUCKET,
    Key:                key,
    Body:               file.buffer,
    ContentType:        file.mimetype,
    ContentDisposition: 'inline',
  }));
  // path-style URL works with all regions including ap-south-2
  return `https://s3.${REGION}.amazonaws.com/${BUCKET}/${key}`;
};

// ── Delete helper ──
const deleteFromS3 = async (url) => {
  try {
    // handle both path-style and virtual-hosted URLs
    const key = url.includes('.amazonaws.com/') 
      ? url.split('.amazonaws.com/').pop().replace(`${BUCKET}/`, '')
      : null;
    if (key) await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch { /* ignore */ }
};

// ── Auth middleware ──
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ success: false });
  try {
    req.user = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ────────────────────────────────────────────────
// PUBLIC ROUTES
// ────────────────────────────────────────────────

// GET /api/products?ageGroup=newborn  — frontend product grid
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.ageGroup) filter.ageGroup = req.query.ageGroup;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ────────────────────────────────────────────────
// ADMIN ROUTES
// ────────────────────────────────────────────────

// GET /api/products/admin  — all products for admin panel
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch {
    res.status(500).json({ success: false });
  }
});

// POST /api/products/admin  — create product with image upload
router.post('/admin', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required.' });
    const imgUrl = await uploadToS3(req.file);
    const { name, category, price, oldPrice, ageGroup, age, color, badge, sustainability } = req.body;
    const product = await Product.create({
      name, category, price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      ageGroup, age, color: color || '',
      img: imgUrl,
      badge: badge || null,
      sustainability: sustainability === 'true',
    });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/admin/:id  — update product (image optional)
router.patch('/admin/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    const { name, category, price, oldPrice, ageGroup, age, color, badge, sustainability, isActive } = req.body;
    if (name)        product.name        = name;
    if (category)    product.category    = category;
    if (price)       product.price       = Number(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (ageGroup)    product.ageGroup    = ageGroup;
    if (age)         product.age         = age;
    if (color !== undefined)    product.color    = color;
    if (badge !== undefined)    product.badge    = badge || null;
    if (sustainability !== undefined) product.sustainability = sustainability === 'true';
    if (isActive !== undefined) product.isActive = isActive === 'true';

    // Replace image if new one uploaded
    if (req.file) {
      await deleteFromS3(product.img);
      product.img = await uploadToS3(req.file);
    }

    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/admin/:id
router.delete('/admin/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false });
    await deleteFromS3(product.img);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;