const jwt        = require('jsonwebtoken');
const AdminUser  = require('../models/adminUserModel');

// ── Seed superadmin from .env if not exists
const seedSuperAdmin = async () => {
  const exists = await AdminUser.findOne({ role: 'superadmin' });
  if (!exists) {
    await AdminUser.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: 'superadmin',
      isActive: true,
    });
    console.log('Superadmin seeded from .env');
  }
};

// ── POST /api/auth/login
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

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ success: true, token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { login, seedSuperAdmin };