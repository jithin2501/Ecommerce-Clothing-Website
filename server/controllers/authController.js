const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AdminUser = require('../models/adminUserModel');
const redisClient = require('../conf/redisClient'); // ← shared Redis client

const seedSuperAdmin = async () => {
  const exists = await AdminUser.findOne({ role: 'superadmin' });
  if (!exists) {
    await AdminUser.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: 'superadmin',
      isActive: true,
    });
    console.log('Superadmin account created.');
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await AdminUser.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    // L-01 FIX: Include a unique jti so individual tokens can be blacklisted.
    const jti = crypto.randomUUID();
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, jti },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ success: true, token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// L-01 FIX: Logout handler — blacklists the token's jti for its remaining TTL.
const logout = async (req, res) => {
  try {
    // req.admin is set by the protect middleware (token already verified).
    const { jti, exp } = req.admin;

    if (jti) {
      const ttl = exp - Math.floor(Date.now() / 1000); // seconds remaining
      if (ttl > 0) {
        // Store jti in Redis; key expires automatically when the token would have.
        await redisClient.set(`blacklist:${jti}`, '1', { EX: ttl });
      }
    }

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { login, logout, seedSuperAdmin };