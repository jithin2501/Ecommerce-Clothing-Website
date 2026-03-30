const ClientUser = require('../models/ClientUser');

/* ── GET all clients (paginated + filtered) ── */
exports.getAllClients = async (req, res) => {
  try {
    const { loginType, search, dateFilter, page = 1, limit = 20 } = req.query;
    const query = {};

    if (loginType && loginType !== 'all') query.loginType = loginType;
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (dateFilter && dateFilter !== 'all') {
      const now = new Date();
      if (dateFilter === 'joined-today') query.createdAt = { $gte: new Date(now.setHours(0,0,0,0)) };
      else if (dateFilter === 'joined-week') query.createdAt = { $gte: new Date(now.setDate(now.getDate() - 7)) };
      else if (dateFilter === 'joined-month') query.createdAt = { $gte: new Date(now.setMonth(now.getMonth() - 1)) };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await ClientUser.countDocuments(query);
    console.log('📋 getAllClients called, total found:', total);
    const users = await ClientUser.find(query)
      .sort({ lastSeen: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, total, page: Number(page), users });
  } catch (err) {
    console.error('❌ getAllClients error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── GET single client detail ── */
exports.getClientDetail = async (req, res) => {
  try {
    const user = await ClientUser.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ error: 'Client not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

/* ── GET dashboard stats ── */
exports.getStats = async (req, res) => {
  try {
    const total    = await ClientUser.countDocuments();
    const google   = await ClientUser.countDocuments({ loginType: 'google' });
    const phone    = await ClientUser.countDocuments({ loginType: 'phone' });
    const withCart = await ClientUser.countDocuments({ 'cart.0': { $exists: true } });
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const newToday = await ClientUser.countDocuments({ createdAt: { $gte: today } });
    console.log('📊 getStats called, total clients:', total);

    res.json({ success: true, stats: { total, google, phone, withCart, newToday } });
  } catch (err) {
    console.error('❌ getStats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};