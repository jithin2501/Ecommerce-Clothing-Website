// routers/productReviewRoutes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const ctrl = require('../controllers/productReviewController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Public
router.post('/submit', upload.array('attachments', 5), ctrl.submitProductReview);
router.get('/product/:productId', ctrl.getByProduct);
router.get('/user/:uid', ctrl.getByUser);
router.get('/client', ctrl.getByClientUids); // ?uids=uid1,uid2

// Admin protected
router.delete('/:id', protect, ctrl.deleteProductReview);

module.exports = router;