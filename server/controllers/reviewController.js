// ── controllers/reviewController.js ──
const Review = require('../models/Review');
const Product = require('../models/Product');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');
const mongoose = require('mongoose');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (file, folder = 'reviews') => {
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

/**
 * ── Helper: Update Product Aggregate Stats ──
 */
const updateProductStats = async (productId) => {
  if (!productId || productId === 'null' || productId === 'undefined' || !mongoose.Types.ObjectId.isValid(productId)) return;
  const product = await Product.findById(productId);
  if (!product) return;

  const allReviewsForProduct = await Review.find({ productId, status: 'approved' });
  const totalReviews = allReviewsForProduct.length;
  const avgStars = totalReviews > 0 
    ? allReviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;
  
  product.stars = parseFloat(avgStars.toFixed(1));
  product.reviews = totalReviews;
  await product.save();
};

// POST /api/reviews/submit — public
const submitReview = async (req, res) => {
  try {
    const { name, rating, message, productId, uid, orderId } = req.body;
    if (!name || !rating || !message)
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });

    // Handle File Uploads to S3
    const imageURLs = [];
    let videoURL = null;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToS3(file);
        if (file.mimetype.startsWith('video/')) {
          videoURL = url;
        } else {
          imageURLs.push(url);
        }
      }
    }

    // AUTO-APPROVE Product Reviews, KEEP QR Reviews Pending
    const status = productId ? 'approved' : 'pending';

    const review = await Review.create({ 
      name, 
      rating: Number(rating), 
      message, 
      productId: productId || null, 
      uid, 
      orderId,
      images: imageURLs,
      video: videoURL,
      status
    });

    // If auto-approved, update product rating immediately
    if (status === 'approved') {
      await updateProductStats(productId);
    }

    res.json({ success: true, data: review, autoApproved: status === 'approved' });
  } catch (error) {
    console.error("Review submit error:", error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/reviews/product/:productId — public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId, status: 'approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/reviews/approved — public
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/reviews/admin — admin
const getAllReviews = async (req, res) => {
  try {
    // ONLY show QR reviews (where productId is missing) in the general review management
    const reviews = await Review.find({ 
      $or: [
        { productId: null }, 
        { productId: { $exists: false } }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

// PATCH /api/reviews/admin/:id/approve — admin
const approveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false });

    // Update Product Stats if approved
    await updateProductStats(review.productId);

    res.json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false });
  }
};

// PATCH /api/reviews/admin/:id/unapprove — admin
const unapproveReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: 'pending' },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false });

    // Re-calc product stats
    await updateProductStats(review.productId);

    res.json({ success: true, data: review });
  } catch {
    res.status(500).json({ success: false });
  }
};

// DELETE /api/reviews/admin/:id — admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false });
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};

// GET /api/reviews/user/:uid — public
const getUserReviews = async (req, res) => {
  try {
    const { uid } = req.params;
    const reviews = await Review.find({ uid }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
};

module.exports = { submitReview, getProductReviews, getUserReviews, getApprovedReviews, getAllReviews, approveReview, unapproveReview, deleteReview };