const BusinessSettings = require('../models/BusinessSettings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({
        businessName: 'SKB Tour and Travels',
        ownerName: 'Vicky',
        primaryPhone: '7338140524',
        alternatePhone: '9035897960',
        whatsappNumber: '917338140524',
        contactEmail: 'vickymegha903@gmail.com',
        locationArea: 'Airport area',
        pinCode: '560300',
      });
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create(req.body);
    } else {
      settings = await BusinessSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
