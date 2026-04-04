const ClientUser = require('../models/ClientUser');
const Review     = require('../models/Review');

/* ─────────────────────────────────────────────────────────────────
   HELPER — generate next CUST-XXXXX id
───────────────────────────────────────────────────────────────── */
async function nextCustomerId() {
  // Count total documents and pad to 5 digits
  const count = await ClientUser.countDocuments();
  return `CUST-${String(count + 1).padStart(5, '0')}`;
}

/* ─────────────────────────────────────────────────────────────────
   HELPER — find by uid OR by contact field (deduplication)
   Returns the existing user or null.
───────────────────────────────────────────────────────────────── */
async function findExistingUser(uid, contactField, contactValue) {
  // 1. Exact UID match (returning customer, same provider)
  let user = await ClientUser.findOne({ uids: uid });
  if (user) return { user, isNew: false, uidAlreadyLinked: true };

  // 2. Match by contact info (same person, different provider)
  if (contactValue) {
    user = await ClientUser.findOne({ [contactField]: contactValue });
    if (user) return { user, isNew: false, uidAlreadyLinked: false };
  }

  return { user: null, isNew: true, uidAlreadyLinked: false };
}

/* ─────────────────────────────────────────────────────────────────
   Google Login / Register
───────────────────────────────────────────────────────────────── */
exports.googleLogin = async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    const { user: existing, isNew, uidAlreadyLinked } = await findExistingUser(uid, 'email', email || null);

    let user;

    if (isNew) {
      // Brand-new customer — create fresh profile
      const customerId = await nextCustomerId();
      user = await ClientUser.create({
        uids:       [uid],
        customerId,
        loginTypes: ['google'],
        name, email, photo,
        lastSeen:   new Date(),
      });
      console.log('🆕 Created new Google customer:', customerId);

    } else if (!uidAlreadyLinked) {
      // Same person, new Google UID (linked from phone account)
      existing.uids.push(uid);
      if (!existing.loginTypes.includes('google')) existing.loginTypes.push('google');
      existing.name     = name  || existing.name;
      existing.email    = email || existing.email;
      existing.photo    = photo || existing.photo;
      existing.lastSeen = new Date();
      await existing.save();
      user = existing;
      console.log('🔗 Linked Google UID to existing customer:', existing.customerId);

    } else {
      // Returning customer, same Google account
      existing.name     = name  || existing.name;
      existing.email    = email || existing.email;
      existing.photo    = photo || existing.photo;
      existing.lastSeen = new Date();
      await existing.save();
      user = existing;
      console.log('🔄 Updated returning Google customer:', existing.customerId);
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ googleLogin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Phone (OTP) Login / Register
───────────────────────────────────────────────────────────────── */
exports.phoneLogin = async (req, res) => {
  try {
    const { uid, name, phone } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    const { user: existing, isNew, uidAlreadyLinked } = await findExistingUser(uid, 'phone', phone || null);

    let user;

    if (isNew) {
      const customerId = await nextCustomerId();
      user = await ClientUser.create({
        uids:       [uid],
        customerId,
        loginTypes: ['phone'],
        name: name || '',
        phone,
        lastSeen: new Date(),
      });
      console.log('🆕 Created new Phone customer:', customerId);

    } else if (!uidAlreadyLinked) {
      // Same person, new Phone UID (linked from Google account)
      existing.uids.push(uid);
      if (!existing.loginTypes.includes('phone')) existing.loginTypes.push('phone');
      existing.name     = name  || existing.name;
      existing.phone    = phone || existing.phone;
      existing.lastSeen = new Date();
      await existing.save();
      user = existing;
      console.log('🔗 Linked Phone UID to existing customer:', existing.customerId);

    } else {
      // Returning customer, same phone number
      existing.name     = name  || existing.name;
      existing.phone    = phone || existing.phone;
      existing.lastSeen = new Date();
      await existing.save();
      user = existing;
      console.log('🔄 Updated returning Phone customer:', existing.customerId);
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ phoneLogin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Sync Cart
───────────────────────────────────────────────────────────────── */
exports.syncCart = async (req, res) => {
  try {
    const { uid, cart } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    await ClientUser.findOneAndUpdate({ uids: uid }, { cart, lastSeen: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ syncCart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Sync Wishlist
───────────────────────────────────────────────────────────────── */
exports.syncWishlist = async (req, res) => {
  try {
    const { uid, wishlist } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    await ClientUser.findOneAndUpdate({ uids: uid }, { wishlist, lastSeen: new Date() });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ syncWishlist error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Get Profile
───────────────────────────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await ClientUser.findOne({ uids: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ getProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Update Profile
───────────────────────────────────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, phone, gender } = req.body;

    const updates = { lastSeen: new Date() };
    if (name   !== undefined) updates.name   = name;
    if (email  !== undefined) updates.email  = email;
    if (phone  !== undefined) updates.phone  = phone;
    if (gender !== undefined) updates.gender = gender;

    const updatedUser = await ClientUser.findOneAndUpdate(
      { uids: uid },
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

/* ─────────────────────────────────────────────────────────────────
   Delete Account
───────────────────────────────────────────────────────────────── */
exports.deleteAccount = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await ClientUser.findOneAndDelete({ uids: uid });
    if (!result) return res.status(404).json({ error: 'User not found' });

    // Clean up reviews
    await Review.deleteMany({ uid: { $in: result.uids } });

    console.log(`🗑️ Deleted customer ${result.customerId} (UIDs: ${result.uids.join(', ')})`);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    console.error('❌ deleteAccount error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Address Management
───────────────────────────────────────────────────────────────── */
exports.getAddresses = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ uids: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    console.error('❌ getAddresses error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ uids: req.params.uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }
    user.addresses.push(req.body);
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
    const user = await ClientUser.findOne({ uids: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    const addrIndex = user.addresses.findIndex(a => String(a.id || a._id) === String(addrId));
    if (addrIndex === -1) return res.status(404).json({ error: 'Address not found' });

    user.addresses[addrIndex] = { ...user.addresses[addrIndex].toObject(), ...req.body };
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
    const user = await ClientUser.findOne({ uids: uid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.addresses = user.addresses.filter(a => String(a.id || a._id) !== String(addrId));
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('❌ deleteAddress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};