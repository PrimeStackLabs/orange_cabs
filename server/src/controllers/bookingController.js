import Booking from '../models/Booking.js';
import Driver from '../models/Driver.js';
import Vehicle from '../models/Vehicle.js';
import ActivityLog from '../models/ActivityLog.js';

export const generateBookingId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Booking.countDocuments();
  const padded = String(count + 1).padStart(5, '0');
  return `OC-${currentYear}-${padded}`;
};

export const trackBooking = async (req, res, next) => {
  try {
    const { bookingId, phone } = req.body;
    if (!bookingId || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Booking ID and Phone number'
      });
    }

    const cleanInputDigits = phone.replace(/\D/g, '').slice(-10);
    const booking = await Booking.findOne({
      bookingId: { $regex: new RegExp(`^${bookingId.trim()}$`, 'i') }
    })
      .populate('vehicle')
      .populate('driver');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No matching booking found for the provided Booking ID'
      });
    }

    const recordPhoneDigits = (booking.phone || '').replace(/\D/g, '').slice(-10);
    if (cleanInputDigits && recordPhoneDigits !== cleanInputDigits) {
      return res.status(400).json({
        success: false,
        message: 'The mobile number does not match this booking record'
      });
    }

    return res.json({
      success: true,
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const {
      name,
      customerName,
      phone,
      customerPhone,
      email,
      customerEmail,
      pickup,
      pickupCity,
      drop,
      dropCity,
      date,
      pickupDate,
      time,
      pickupTime,
      cabType,
      passengers,
      message,
      notes,
      source
    } = req.body;

    const finalName = name || customerName;
    const finalPhone = phone || customerPhone;
    const finalEmail = email || customerEmail;
    const finalPickup = pickup || pickupCity;
    const finalDrop = drop || dropCity;
    const finalDate = date || pickupDate;
    const finalTime = time || pickupTime;
    const finalCabType = cabType || 'Sedan';
    const finalPassengers = passengers ? Number(passengers) : 1;
    const finalMessage = message || notes || '';

    if (!finalName || !finalPhone || !finalPickup || !finalDrop) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Name, Phone, Pickup and Drop locations'
      });
    }

    const bookingId = await generateBookingId();

    const booking = await Booking.create({
      bookingId,
      name: finalName,
      phone: finalPhone,
      email: finalEmail || `${finalPhone}@guest.orangecab.in`,
      pickup: finalPickup,
      drop: finalDrop,
      date: finalDate || new Date().toISOString().split('T')[0],
      time: finalTime || '10:00 AM',
      cabType: finalCabType,
      passengers: finalPassengers,
      message: finalMessage,
      status: 'Pending',
      source: source || 'Website Modal'
    });

    // Notify connected Admin socket clients
    if (req.app.get('io')) {
      req.app.get('io').emit('new_booking', {
        bookingId: booking.bookingId,
        customerName: booking.name,
        pickup: booking.pickup,
        drop: booking.drop,
        cabType: booking.cabType,
        createdAt: booking.createdAt
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      bookingId: booking.bookingId,
      booking
    });
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { pickup: { $regex: search, $options: 'i' } },
        { drop: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('vehicle')
      .populate('driver')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      bookings
    });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id })
      .populate('vehicle')
      .populate('driver');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status || booking.status;
    if (notes) booking.notes = notes;
    await booking.save();

    await ActivityLog.create({
      admin: req.admin ? req.admin._id : null,
      adminName: req.admin ? req.admin.name : 'System',
      action: 'UPDATE_BOOKING_STATUS',
      details: `Updated booking ${booking.bookingId} to status ${status}`
    });

    return res.json({ success: true, message: 'Status updated', booking });
  } catch (err) {
    next(err);
  }
};

export const assignDriverAndVehicle = async (req, res, next) => {
  try {
    const { driverId, vehicleId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (driverId) booking.driver = driverId;
    if (vehicleId) booking.vehicle = vehicleId;
    booking.status = 'Assigned';
    await booking.save();

    if (driverId) {
      await Driver.findByIdAndUpdate(driverId, { status: 'on_trip', $inc: { totalTrips: 1 } });
    }
    if (vehicleId) {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: 'on_trip' });
    }

    return res.json({ success: true, message: 'Driver and Vehicle assigned', booking });
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
};
