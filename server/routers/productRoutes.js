// ── routers/productRoutes.js ──
const express  = require('express');
const multer   = require('multer');
const jwt      = require('jsonwebtoken');
const router   = express.Router();

const {
  getProducts, getFeaturedProducts, getAdminProducts,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

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
router.get('/',          getProducts);
router.get('/featured',  getFeaturedProducts);

// ── Admin ──
router.get   ('/admin',     verifyAdmin, getAdminProducts);
router.post  ('/admin',     verifyAdmin, upload.single('image'), createProduct);
router.patch ('/admin/:id', verifyAdmin, (req, res, next) => {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('application/json')) {
    // JSON body — already parsed by express.json() in server.js
    return next();
  }
  // multipart/form-data — parse with multer
  upload.single('image')(req, res, next);
}, updateProduct);
router.delete('/admin/:id', verifyAdmin, deleteProduct);

module.exports = router;