// ── controllers/reviewController.js ──
const Review = require('../models/Review');
const Product = require('../models/Product');

// POST /api/reviews/submit — public
const submitReview = async (req, res) => {
  try {
    const { name, rating, message, productId, uid, orderId, images, video } = req.body;
    if (!name || !rating || !message)
      return res.status(400).json({ success: false, message: 'Required fields missing.' });
    
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });

    const review = await Review.create({ 
      name, 
      rating: Number(rating), 
      message, 
      productId: productId || null, 
      uid, 
      orderId,
      images: images || [],
      video: video || null,
      status: 'pending' // Default to pending until admin approval
    });

    res.json({ success: true, data: review });
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
    const reviews = await Review.find({}).sort({ createdAt: -1 });
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
    const product = await Product.findById(review.productId);
    if (product) {
      const allReviewsForProduct = await Review.find({ productId: review.productId, status: 'approved' });
      const totalReviews = allReviewsForProduct.length;
      const avgStars = allReviewsForProduct.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
      
      product.stars = parseFloat(avgStars.toFixed(1));
      product.reviews = totalReviews;
      await product.save();
    }

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
    const product = await Product.findById(review.productId);
    if (product) {
       const allReviews = await Review.find({ productId: review.productId, status: 'approved' });
       const total = allReviews.length;
       const avg = total > 0 ? allReviews.reduce((s,r)=>s+r.rating,0)/total : 0;
       product.stars = parseFloat(avg.toFixed(1));
       product.reviews = total;
       await product.save();
    }

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