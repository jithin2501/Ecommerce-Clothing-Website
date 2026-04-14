// server/routers/clientRoutes.js
// ⚠️  Renamed from authRoutes.js → clientRoutes.js
//     because server/routers/authRouter.js already exists.

const express    = require('express');
const router     = express.Router();
const clientCtrl = require('../controllers/clientController');
const { clientProtect } = require('../middleware/authMiddleware');

// Public client auth endpoints (called from Login.jsx)
// Note: Ideally these should also verify tokens, but we'll focus on data protection first
router.post('/google',        clientCtrl.googleLogin);
router.post('/phone',         clientCtrl.phoneLogin);
router.post('/sync-cart',     clientCtrl.syncCart);
router.post('/sync-wishlist', clientCtrl.syncWishlist);

// Profile management endpoints (Protected)
router.get('/profile/:uid',   clientProtect, clientCtrl.getProfile);
router.put('/profile/:uid',   clientProtect, clientCtrl.updateProfile);
router.delete('/delete/:uid', clientProtect, clientCtrl.deleteAccount);

// Address management endpoints (Protected)
router.get('/addresses/:uid',          clientProtect, clientCtrl.getAddresses);
router.post('/addresses/:uid',         clientProtect, clientCtrl.addAddress);
router.put('/addresses/:uid/:addrId',  clientProtect, clientCtrl.updateAddress);
router.delete('/addresses/:uid/:addrId', clientProtect, clientCtrl.deleteAddress);

module.exports = router;