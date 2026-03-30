const ClientUser = require('../models/ClientUser');
const Review = require('../models/Review');

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

/* ── Get Profile ── */
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await ClientUser.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ getProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Update Profile ── */
exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, phone, gender } = req.body;
    
    // We update fields dynamically to allow partial updates
    const updates = { lastSeen: new Date() };
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (gender !== undefined) updates.gender = gender; // Note: Ensure ClientUser schema supports gender if saving it

    const updatedUser = await ClientUser.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true }
    );
    
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('❌ updateProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Delete Account ── */
exports.deleteAccount = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await ClientUser.findOneAndDelete({ uid });
    if (!result) return res.status(404).json({ error: 'User not found' });
    
    // Also cleanup reviews written by this user
    await Review.deleteMany({ uid });

    console.log(`🗑️ Deleted ClientUser and their Reviews from DB: ${uid}`);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ deleteAccount error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── Address Management ── */
exports.getAddresses = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    console.error('❌ getAddresses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const newAddress = req.body;
    
    if (newAddress.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push(newAddress);
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('❌ addAddress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { uid, addrId } = req.params;
    const user = await ClientUser.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    const addrIndex = user.addresses.findIndex(a => String(a.id || a._id) === String(addrId));
    if (addrIndex === -1) return res.status(404).json({ error: 'Address not found' });

    user.addresses[addrIndex] = { ...user.addresses[addrIndex], ...req.body };
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('❌ updateAddress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { uid, addrId } = req.params;
    const user = await ClientUser.findOne({ uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.addresses = user.addresses.filter(a => String(a.id || a._id) !== String(addrId));
    await user.save();
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('❌ deleteAddress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};