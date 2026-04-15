const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { adminLoginLimiter } = require('../middleware/rateLimiter');

// Max 5 login attempts per 15 min — blocks brute-force on admin password
router.post('/login', adminLoginLimiter, login);

module.exports = router;