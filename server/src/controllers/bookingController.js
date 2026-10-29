const Booking = require('../models/Booking');
const { formatBookingWhatsAppMessage } = require('../utils/whatsappHelper');

// In-memory fallback if MongoDB is not reachable
const inMemoryBookings = [];

/**
 * @desc Create new booking enquiry
 * @route POST /api/bookings
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      tripType,
      tripTypeLabel,
      pickupLocation,
      destination,
      travelDate,
      pickupTime,
      preferredVehicle,
      passengerCount,
      returnDate,
      additionalStops,
      luggageInfo,
      additionalInstructions,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !phoneNumber ||
      !tripType ||
      !pickupLocation ||
      !destination ||
      !travelDate ||
      !preferredVehicle
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Name, Phone, Trip Type, Pickup, Destination, Date, and Vehicle.',
      });
    }

    // Validate 10-digit phone
    const cleanPhone = String(phoneNumber).replace(/\s+/g, '');
    const phoneRegex = /^(?:\+?91[\-\s]?)?[6789]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number.',
      });
    }

    // Validate travel date is not past
    const parsedDate = new Date(travelDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Travel date cannot be in the past.',
      });
    }

    const d = new Date();
    const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `SKB-${dateStr}-${randomHex}`;

    const bookingPayload = {
      bookingReference,
      fullName: fullName.trim(),
      phoneNumber: cleanPhone,
      tripType,
      tripTypeLabel: tripTypeLabel || tripType,
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      travelDate: parsedDate,
      pickupTime: pickupTime ? pickupTime.trim() : '',
      preferredVehicle: preferredVehicle.trim(),
      passengerCount: passengerCount ? Number(passengerCount) : 1,
      returnDate: returnDate ? new Date(returnDate) : null,
      additionalStops: additionalStops ? additionalStops.trim() : '',
      luggageInfo: luggageInfo ? luggageInfo.trim() : '',
      additionalInstructions: additionalInstructions ? additionalInstructions.trim() : '',
      status: 'enquiry_received',
      fareConfirmed: false,
    };

    let savedBooking;
    let dbPersisted = true;

    try {
      savedBooking = await Booking.create(bookingPayload);
      // Auto-upsert customer record
      try {
        const Customer = require('../models/Customer');
        await Customer.findOneAndUpdate(
          { phoneNumber: cleanPhone },
          {
            $set: {
              name: fullName.trim(),
              lastTripDate: parsedDate,
            },
            $inc: { totalBookings: 1 },
          },
          { upsert: true, new: true }
        );
      } catch (custErr) {
        console.warn('Customer auto-upsert error:', custErr.message);
      }

      // Auto-mirror to Enquiry so it immediately shows in the Admin Enquiries inbox as well
      try {
        const Enquiry = require('../models/Enquiry');
        await Enquiry.create({
          enquiryReference: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: fullName.trim(),
          phoneNumber: cleanPhone,
          tripType: tripTypeLabel || tripType,
          pickupLocation: pickupLocation.trim(),
          destination: destination.trim(),
          preferredDate: parsedDate,
          preferredVehicle: preferredVehicle.trim(),
          message: additionalInstructions || `Booking ref: ${bookingReference}`,
          source: 'website_form',
          status: 'new',
          convertedBookingId: savedBooking._id,
        });
      } catch (enqErr) {
        console.warn('Enquiry auto-mirror error:', enqErr.message);
      }
    } catch (dbErr) {
      console.warn('[Booking DB Warning] Saving to in-memory fallback:', dbErr.message);
      dbPersisted = false;
      savedBooking = {
        ...bookingPayload,
        _id: 'temp_' + Date.now(),
        createdAt: new Date(),
      };
      inMemoryBookings.push(savedBooking);
    }

    // Generate WhatsApp deep link
    const waResult = formatBookingWhatsAppMessage(savedBooking);

    return res.status(201).json({
      success: true,
      message: 'Booking enquiry received. Availability and exact fare will be confirmed by Vicky.',
      dbPersisted,
      booking: savedBooking,
      whatsappUrl: waResult.url,
      whatsappText: waResult.rawText,
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error while processing booking enquiry.',
    });
  }
};

/**
 * @desc Get all bookings
 * @route GET /api/bookings
 */
exports.getBookings = async (req, res) => {
  try {
    let bookings = [];
    try {
      bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    } catch (dbErr) {
      bookings = inMemoryBookings.slice().reverse();
    }
    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings.',
    });
  }
};

/**
 * @desc Get single booking by reference ID
 * @route GET /api/bookings/:reference
 */
exports.getBookingByRef = async (req, res) => {
  try {
    const { reference } = req.params;
    let booking = null;
    try {
      booking = await Booking.findOne({ bookingReference: reference });
    } catch (err) {
      booking = inMemoryBookings.find((b) => b.bookingReference === reference);
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `Booking reference ${reference} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving booking details.',
    });
  }
};
