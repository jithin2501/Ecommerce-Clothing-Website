const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

// Max 5 login attempts per 15 min — blocks brute-force on admin password
router.post('/login', adminLoginLimiter, login);

// L-01 FIX: Logout blacklists the caller's token so it cannot be reused.
router.post('/logout', protect, logout);

module.exports = router;