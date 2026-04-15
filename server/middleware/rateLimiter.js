// server/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// ── Helper to build a consistent limiter ──
const make = (max, windowMinutes, message) =>
    rateLimit({
        windowMs: windowMinutes * 60 * 1000,
        max,
        standardHeaders: true,   // Return RateLimit-* headers so clients know their status
        legacyHeaders: false,     // Disable the old X-RateLimit-* headers
        message: { success: false, message },
    });

// Admin login — strictest: 5 attempts per 15 min
// Prevents brute-force on the superadmin password
const adminLoginLimiter = make(
    5, 15,
    'Too many login attempts. Please try again in 15 minutes.'
);

// Client OTP login — 10 attempts per 15 min
// Firebase already rate-limits OTP sends, but this covers our own endpoint too
const clientAuthLimiter = make(
    10, 15,
    'Too many authentication requests. Please try again in 15 minutes.'
);

// Payment creation — 20 requests per 15 min per IP
// Stops Razorpay quota abuse and fake order flooding
const paymentLimiter = make(
    20, 15,
    'Too many payment requests. Please slow down and try again shortly.'
);

// General API fallback — generous, just stops runaway scrapers
const generalLimiter = make(
    200, 15,
    'Too many requests from this IP. Please try again later.'
);

module.exports = { adminLoginLimiter, clientAuthLimiter, paymentLimiter, generalLimiter };