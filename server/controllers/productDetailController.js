// ── controllers/productDetailController.js ──
const ProductDetail = require('../models/ProductDetail');
const Product       = require('../models/Product');
const { uploadToS3, deleteFromS3 } = require('../conf/s3');

/* ─────────────────────────────────────────────
   GET /api/product-details/:productId   (public)
   Returns the detail document for a product.
───────────────────────────────────────────── */
const getProductDetail = async (req, res) => {
  try {
    const detail = await ProductDetail.findOne({ product: req.params.productId })
      .populate('product', 'name price oldPrice stars reviews');

    if (!detail) return res.status(404).json({ success: false, message: 'Detail not found.' });
    res.json({ success: true, data: detail });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   GET /api/product-details/admin/:productId   (admin)
───────────────────────────────────────────── */
const getAdminProductDetail = async (req, res) => {
  try {
    const detail = await ProductDetail.findOne({ product: req.params.productId });
    // Return empty shell if not yet created so the form starts blank
    res.json({ success: true, data: detail || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   POST /api/product-details/admin/:productId  (admin)
   Creates or fully replaces the detail document.
   Accepts multipart/form-data with up to 7 image files
   (fields: image_0 … image_6).
───────────────────────────────────────────── */
const upsertProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify the parent product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });

    // Parse JSON fields sent as strings from FormData
    const parse = (key) => {
      const v = req.body[key];
      if (!v) return undefined;
      try { return JSON.parse(v); } catch { return v; }
    };

    const sizes           = parse('sizes')           || [];
    const colors          = parse('colors')          || [];
    const specifications  = parse('specifications')  || [];
    const manufacturerInfo = parse('manufacturerInfo') || [];
    const highlights      = parse('highlights')      || [];
    const description     = req.body.description     || '';
    const deliveryDate    = req.body.deliveryDate     || '';

    // ── Handle gallery images ──
    // req.files is an object: { image_0: [File], image_1: [File], … }
    // existingUrls sent as JSON array from client for slots that already have S3 URLs
    const existingUrls = parse('existingUrls') || [];

    // We'll rebuild galleryImages array by slot index (0–6)
    const galleryImages = [];
    for (let i = 0; i < 7; i++) {
      const fileField = `image_${i}`;
      if (req.files && req.files[fileField] && req.files[fileField][0]) {
        // New upload for this slot
        const url = await uploadToS3(req.files[fileField][0], product.ageGroup);
        galleryImages.push(url);
      } else if (existingUrls[i]) {
        // Keep existing S3 URL
        galleryImages.push(existingUrls[i]);
      }
      // else: slot is empty — skip
    }

    if (galleryImages.length === 0) {
      return res.status(400).json({ success: false, message: 'At least 1 gallery image is required.' });
    }

    // If a detail doc already exists, remove replaced images from S3
    const existing = await ProductDetail.findOne({ product: productId });
    if (existing) {
      for (let i = 0; i < 7; i++) {
        const oldUrl = existing.galleryImages[i];
        if (oldUrl && oldUrl !== galleryImages[i]) {
          // This slot was replaced or removed — delete from S3
          await deleteFromS3(oldUrl).catch(() => {});
        }
      }
    }

    const detail = await ProductDetail.findOneAndUpdate(
      { product: productId },
      {
        product: productId,
        galleryImages,
        sizes,
        colors,
        deliveryDate,
        specifications,
        description,
        manufacturerInfo,
        highlights,
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: detail });
  } catch (err) {
    console.error('upsertProductDetail error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────────
   DELETE /api/product-details/admin/:productId  (admin)
───────────────────────────────────────────── */
const deleteProductDetail = async (req, res) => {
  try {
    const detail = await ProductDetail.findOneAndDelete({ product: req.params.productId });
    if (!detail) return res.status(404).json({ success: false, message: 'Detail not found.' });

    // Clean up all gallery images from S3
    for (const url of detail.galleryImages) {
      await deleteFromS3(url).catch(() => {});
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProductDetail,
  getAdminProductDetail,
  upsertProductDetail,
  deleteProductDetail,
};