const AdminUser = require('../models/adminUserModel');

// ── GET /api/users  — list all admin users
const getAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── POST /api/users  — create new admin
const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const exists = await AdminUser.findOne({ username: username.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Username already exists.' });
    }

    const user = await AdminUser.create({
      username: username.toLowerCase(),
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created.',
      data: { _id: user._id, username: user.username, role: user.role, isActive: user.isActive },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── PATCH /api/users/:id/toggle  — activate/deactivate
const toggleUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate superadmin.' });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot delete superadmin.' });
    }
    await AdminUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAllUsers, createUser, toggleUser, deleteUser };