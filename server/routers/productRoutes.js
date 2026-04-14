// ── routers/productRoutes.js ──
const express  = require('express');
const multer   = require('multer');
const { protect } = require('../middleware/authMiddleware');

const {
  getProducts, getFeaturedProducts, getAdminProducts,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

const uploadSingle = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large. Maximum size is 20 MB.'
        : err.message || 'File upload error.';
      return res.status(400).json({ success: false, message: msg });
    }
    next();
  });
};

// ── Public ──
router.get('/',         getProducts);
router.get('/featured', getFeaturedProducts);

// ── Admin ──
router.get   ('/admin',     protect, getAdminProducts);
router.post  ('/admin',     protect, uploadSingle, createProduct);
router.patch ('/admin/:id', protect, (req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) return next();
  uploadSingle(req, res, next);
}, updateProduct);
router.delete('/admin/:id', protect, deleteProduct);

module.exports = router;