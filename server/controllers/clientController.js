const ClientUser = require('../models/ClientUser');
const Review = require('../models/Review');

/* ─────────────────────────────────────────────────────────────────
   HELPER — generate next CUST-XXXXX id
───────────────────────────────────────────────────────────────── */
async function nextCustomerId() {
  const count = await ClientUser.countDocuments();
  return `CUST-${String(count + 1).padStart(5, '0')}`;
}

/* ─────────────────────────────────────────────────────────────────
   Google Login / Register
   Lookup is ONLY by Firebase UID — never by email.
   A Google user and a Phone user with the same email stay separate.
───────────────────────────────────────────────────────────────── */
exports.googleLogin = async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    // Only match by UID — no cross-provider contact lookup
    let user = await ClientUser.findOne({ uids: uid });

    if (!user) {
      // Brand-new Google customer
      const customerId = await nextCustomerId();
      user = await ClientUser.create({
        uids: [uid],
        customerId,
        loginTypes: ['google'],
        name: name || '',
        email: email || '',
        photo: photo || '',
        lastSeen: new Date(),
      });
      console.log('🆕 Created new Google customer:', customerId);
    } else {
      // Returning Google customer — refresh profile fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (photo) user.photo = photo;
      user.lastSeen = new Date();
      await user.save();
      console.log('🔄 Updated returning Google customer:', user.customerId);
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('❌ googleLogin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ─────────────────────────────────────────────────────────────────
   Phone (OTP) Login / Register
   Lookup is ONLY by Firebase UID — never by phone number.
   A Phone user and a Google user with the same number stay separate.
───────────────────────────────────────────────────────────────── */
exports.phoneLogin = async (req, res) => {
  try {
    const { uid, name, phone } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    // Only match by UID — no cross-provider contact lookup
    let user = await ClientUser.findOne({ uids: uid });

    if (!user) {
      // Brand-new Phone customer
      const customerId = await nextCustomerId();
      user = await ClientUser.create({
        uids: [uid],
        customerId,
        loginTypes: ['phone'],
        name: name || '',
        phone: phone || '',
        lastSeen: new Date(),
      });
      console.log('🆕 Created new Phone customer:', customerId);
    } else {
      // Returning Phone customer — refresh profile fields
      if (name) user.name = name;
      if (phone) user.phone = phone;
      user.lastSeen = new Date();
      await user.save();
      console.log('🔄 Updated returning Phone customer:', user.customerId);
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
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
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
    user.markModified('addresses'); // Force Mongoose to see the nested change
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
    user.markModified('addresses'); // Force Mongoose to see the nested change
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

    const addressToDelete = user.addresses.find(a => String(a.id || a._id) === String(addrId));
    const wasDefault = addressToDelete?.isDefault;

    user.addresses = user.addresses.filter(a => String(a.id || a._id) !== String(addrId));

    // If we deleted the default, and there are other addresses, make the first one the new default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    user.markModified('addresses');
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error('❌ deleteAddress error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};