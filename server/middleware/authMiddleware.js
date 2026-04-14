const jwt = require('jsonwebtoken');
const admin = require('../conf/firebase-admin');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.admin?.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
  }
  next();
};

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization required (Bearer Token)' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase verify error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid or expired Firebase token' });
  }
};

const ensureUidMatch = (req, res, next) => {
  const targetUid = req.params.uid || req.body.uid;
  if (targetUid && req.firebaseUser.uid !== targetUid) {
    return res.status(403).json({ success: false, error: 'Unauthorized: Identity mismatch (Potential tampering).' });
  }
  next();
};

module.exports = { protect, superAdminOnly, verifyFirebaseToken, ensureUidMatch };