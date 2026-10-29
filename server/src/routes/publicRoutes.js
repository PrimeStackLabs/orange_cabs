const express = require('express');
const router = express.Router();

const Package = require('../models/Package');
const Vehicle = require('../models/Vehicle');
const Review = require('../models/Review');
const Gallery = require('../models/Gallery');
const Offer = require('../models/Offer');
const BusinessSettings = require('../models/BusinessSettings');
const enquiryRoutes = require('./enquiryRoutes');

// Mount public enquiry router alias
router.use('/enquiry', enquiryRoutes);
router.use('/enquiries', enquiryRoutes);

// Public active packages
router.get('/packages', async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, packages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public active fleet
router.get('/fleet', async (req, res) => {
  try {
    const fleet = await Vehicle.find({ isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, fleet });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public reviews / testimonials
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ isFeatured: -1, createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public active gallery
router.get('/gallery', async (req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true }).sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, gallery });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public active offers
router.get('/offers', async (req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    }).sort({ displayOrder: 1 });
    return res.status(200).json({ success: true, offers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Public business settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({});
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
