const jwt = require('jsonwebtoken');
const AdminUser = require('../models/adminUserModel');
const redisClient = require('../conf/redisClient'); // ← shared Redis client

// L-01 FIX: protect now rejects blacklisted tokens and re-checks isActive on
// every request, so logout and account deactivation take effect immediately.
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }

  // L-01 FIX: Reject tokens whose jti appears in the Redis blacklist.
  if (decoded.jti) {
    const isBlacklisted = await redisClient.get(`blacklist:${decoded.jti}`);
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Token has been revoked.' });
    }
  }

  // L-01 FIX: Re-fetch the user so a deactivated account is blocked immediately,
  // not just at next login.
  const user = await AdminUser.findById(decoded.id).select('isActive role');
  if (!user || !user.isActive) {
    return res.status(403).json({ success: false, message: 'Account is deactivated.' });
  }

  req.admin = decoded;
  next();
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
  }
  next();
};

module.exports = { protect, superAdminOnly };