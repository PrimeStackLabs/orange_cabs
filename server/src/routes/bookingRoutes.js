import express from 'express';
import {
  createBooking,
  trackBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  assignDriverAndVehicle,
  deleteBooking
} from '../controllers/bookingController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public: Create booking modal submission & Live Tracking
router.post('/', createBooking);
router.post('/track', trackBooking);

// Admin endpoints (require auth)
router.get('/', verifyAdminToken, getBookings);
router.get('/:id', verifyAdminToken, getBookingById);
router.patch('/:id/status', verifyAdminToken, updateBookingStatus);
router.patch('/:id/assign', verifyAdminToken, assignDriverAndVehicle);
router.delete('/:id', verifyAdminToken, deleteBooking);

export default router;
