const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const Customer = require('../models/Customer');
const { WHATSAPP_PHONE } = require('../utils/whatsappHelper');

/**
 * @desc Public endpoint to create an enquiry from website / WhatsApp click
 * @route POST /api/enquiries
 */
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      email,
      tripType,
      pickupLocation,
      destination,
      preferredDate,
      preferredVehicle,
      message,
      source = 'whatsapp_click',
    } = req.body;

    if (!customerName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone number are required.',
      });
    }

    const cleanPhone = String(phoneNumber).replace(/\D/g, '');
    const validPhone = cleanPhone.length >= 10 ? cleanPhone.slice(-10) : cleanPhone;

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const enquiryReference = `ENQ-${randomNum}`;

    const parsedDate = preferredDate ? new Date(preferredDate) : null;

    const enquiry = await Enquiry.create({
      enquiryReference,
      customerName: customerName.trim(),
      phoneNumber: validPhone,
      email: email ? email.trim() : '',
      tripType: tripType || 'General Enquiry',
      pickupLocation: pickupLocation ? pickupLocation.trim() : '',
      destination: destination ? destination.trim() : '',
      preferredDate: parsedDate,
      preferredVehicle: preferredVehicle ? preferredVehicle.trim() : '',
      message: message ? message.trim() : '',
      source: source || 'whatsapp_click',
      status: 'new',
    });

    // Auto-upsert into Customers collection so customer is immediately stored in Admin Panel
    try {
      await Customer.findOneAndUpdate(
        { phoneNumber: validPhone },
        {
          $set: {
            name: customerName.trim(),
            email: email ? email.trim() : '',
            lastTripDate: parsedDate || new Date(),
          },
          $setOnInsert: {
            totalBookings: 0,
            status: 'active',
          },
        },
        { upsert: true, new: true }
      );
    } catch (custErr) {
      console.warn('[Enquiry] Customer upsert warning:', custErr.message);
    }

    // Format WhatsApp prefilled message
    let waText = `*NEW TRAVEL ENQUIRY — SKB TOUR AND TRAVELS*\n`;
    waText += `Ref: *${enquiryReference}*\n`;
    waText += `─────────────────────────\n`;
    waText += `*Name:* ${customerName.trim()}\n`;
    waText += `*Phone:* ${validPhone}\n`;
    if (preferredVehicle) waText += `*Vehicle:* ${preferredVehicle}\n`;
    if (tripType) waText += `*Trip Type:* ${tripType}\n`;
    if (pickupLocation) waText += `*Pickup:* ${pickupLocation}\n`;
    if (destination) waText += `*Destination:* ${destination}\n`;
    if (parsedDate && !isNaN(parsedDate)) {
      waText += `*Date:* ${parsedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
    }
    if (message) waText += `*Details:* ${message}\n`;
    waText += `─────────────────────────\n`;
    waText += `Hello Vicky, I would like to check availability and rate for this enquiry.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(waText)}`;

    return res.status(201).json({
      success: true,
      message: 'Enquiry successfully logged in admin panel.',
      enquiry,
      whatsappUrl,
    });
  } catch (error) {
    console.error('Error creating public enquiry:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit enquiry.',
    });
  }
});

/**
 * @desc Public/resilient endpoint to list recent enquiries
 * @route GET /api/enquiries
 */
router.get('/', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(50).lean();
    return res.status(200).json({
      success: true,
      enquiries,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
