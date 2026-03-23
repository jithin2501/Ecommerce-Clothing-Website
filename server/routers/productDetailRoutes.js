// ── routers/productDetailRoutes.js ──
const express = require('express');
const multer  = require('multer');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

const {
  getProductDetail,
  getAdminProductDetail,
  upsertProductDetail,
  deleteProductDetail,
} = require('../controllers/productDetailController');

// ── Multer: accept up to 7 image files named image_0 … image_6 ──
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

const imageFields = [0, 1, 2, 3, 4, 5, 6].map(i => ({ name: `image_${i}`, maxCount: 1 }));

const uploadGallery = (req, res, next) => {
  upload.fields(imageFields)(req, res, (err) => {
    if (err) {
      const msg = err.code === 'LIMIT_FILE_SIZE'
        ? 'An image is too large. Maximum size is 20 MB.'
        : err.message || 'File upload error.';
      return res.status(400).json({ success: false, message: msg });
    }
    next();
  });
};

// ── Auth middleware (reuse same pattern as productRoutes) ──
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

// ── Public ──
// GET /api/product-details/:productId
router.get('/:productId', getProductDetail);

// ── Admin ──
// GET    /api/product-details/admin/:productId
router.get('/admin/:productId',    verifyAdmin, getAdminProductDetail);
// POST   /api/product-details/admin/:productId  (create or update)
router.post('/admin/:productId',   verifyAdmin, uploadGallery, upsertProductDetail);
// DELETE /api/product-details/admin/:productId
router.delete('/admin/:productId', verifyAdmin, deleteProductDetail);

module.exports = router;