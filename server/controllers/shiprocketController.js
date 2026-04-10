const shiprocketService = require('../services/shiprocket');

exports.checkPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    if (!pincode || pincode.length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid pincode format' });
    }

    const result = await shiprocketService.checkServiceability(pincode);
    
    // Extract the earliest delivery date if available
    let estimatedDate = null;
    if (result.serviceable && result.data.available_courier_companies.length > 0) {
      // Find the courier with the earliest ETD
      const couriers = result.data.available_courier_companies;
      const sorted = couriers.filter(c => c.etd).sort((a,b) => new Date(a.etd) - new Date(b.etd));
      if (sorted.length > 0) {
        const dateObj = new Date(sorted[0].etd);
        estimatedDate = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
      }
    }

    res.json({
      ...result,
      estimatedDate
    });
  } catch (error) {
    console.error("checkPincode error:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
