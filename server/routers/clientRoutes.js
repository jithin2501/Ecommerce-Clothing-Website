// server/routers/clientRoutes.js
// ⚠️  Renamed from authRoutes.js → clientRoutes.js
//     because server/routers/authRouter.js already exists.

const express    = require('express');
const router     = express.Router();
const clientCtrl = require('../controllers/clientController');

// Public client auth endpoints (called from Login.jsx)
router.post('/google',        clientCtrl.googleLogin);
router.post('/phone',         clientCtrl.phoneLogin);
router.post('/sync-cart',     clientCtrl.syncCart);
router.post('/sync-wishlist', clientCtrl.syncWishlist);

module.exports = router;