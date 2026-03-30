const ClientUser = require('../models/ClientUser');

/* ── Google Login / Register ── */
exports.googleLogin = async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;
    console.log('✅ Google login hit:', { uid, name, email });
    if (!uid) return res.status(400).json({ error: 'uid required' });

    let user = await ClientUser.findOne({ uid });
    if (!user) {
      console.log('🆕 Creating new client user:', email);
      user = await ClientUser.create({ uid, loginType: 'google', name, email, photo });
    } else {
      console.log('🔄 Updating existing client user:', email);
      user.name     = name  || user.name;
      user.email    = email || user.email;
      user.photo    = photo || user.photo;
      user.lastSeen = new Date();
      await user.save();
    }

    console.log('💾 Client saved to DB:', user._id);
    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ googleLogin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Phone (OTP) Login / Register ── */
exports.phoneLogin = async (req, res) => {
  try {
    const { uid, name, phone } = req.body;
    console.log('✅ Phone login hit:', { uid, name, phone });
    if (!uid) return res.status(400).json({ error: 'uid required' });

    let user = await ClientUser.findOne({ uid });
    if (!user) {
      console.log('🆕 Creating new phone user:', phone);
      user = await ClientUser.create({ uid, loginType: 'phone', name, phone });
    } else {
      console.log('🔄 Updating existing phone user:', phone);
      user.name     = name  || user.name;
      user.phone    = phone || user.phone;
      user.lastSeen = new Date();
      await user.save();
    }

    console.log('💾 Client saved to DB:', user._id);
    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ phoneLogin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Sync Cart ── */
exports.syncCart = async (req, res) => {
  try {
    const { uid, cart } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    console.log('🛒 Syncing cart for uid:', uid);
    await ClientUser.findOneAndUpdate({ uid }, { cart, lastSeen: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ syncCart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Sync Wishlist ── */
exports.syncWishlist = async (req, res) => {
  try {
    const { uid, wishlist } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    console.log('❤️  Syncing wishlist for uid:', uid);
    await ClientUser.findOneAndUpdate({ uid }, { wishlist, lastSeen: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ syncWishlist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};