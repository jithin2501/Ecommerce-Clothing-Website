const shiprocketService = require('../services/shiprocket');

exports.checkPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid pincode format' });
    }

    const result = await shiprocketService.checkServiceability(pincode);
    res.json(result);
  } catch (error) {
    console.error("checkPincode error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
