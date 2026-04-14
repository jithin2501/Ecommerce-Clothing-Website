// server/routers/clientRoutes.js
// ⚠️  Renamed from authRoutes.js → clientRoutes.js
//     because server/routers/authRouter.js already exists.

const express    = require('express');
const router     = express.Router();
const clientCtrl = require('../controllers/clientController');
const { verifyFirebaseToken, ensureUidMatch } = require('../middleware/authMiddleware');

router.use(verifyFirebaseToken);
router.use(ensureUidMatch);

// Public client auth endpoints (called from Login.jsx)
router.post('/google',        clientCtrl.googleLogin);
router.post('/phone',         clientCtrl.phoneLogin);
router.post('/sync-cart',     clientCtrl.syncCart);
router.post('/sync-wishlist', clientCtrl.syncWishlist);

// Profile management endpoints
router.get('/profile/:uid',   clientCtrl.getProfile);
router.put('/profile/:uid',   clientCtrl.updateProfile);
router.delete('/delete/:uid', clientCtrl.deleteAccount);

// Address management endpoints
router.get('/addresses/:uid',          clientCtrl.getAddresses);
router.post('/addresses/:uid',         clientCtrl.addAddress);
router.put('/addresses/:uid/:addrId',  clientCtrl.updateAddress);
router.delete('/addresses/:uid/:addrId', clientCtrl.deleteAddress);

module.exports = router;