import express from 'express';
import {
  adminLogin,
  getAdminMe,
  getAllAdmins,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../controllers/adminAuthController.js';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';
import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Admin Auth
router.post('/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please wait 15 minutes and try again.' }
}), adminLogin);
router.get('/me', protectAdmin, getAdminMe);
router.get('/users', protectAdmin, requireRole(['Super Admin']), getAllAdmins);
router.post('/users', protectAdmin, requireRole(['Super Admin']), createAdminUser);
router.put('/users/:id', protectAdmin, requireRole(['Super Admin']), updateAdminUser);
router.delete('/users/:id', protectAdmin, requireRole(['Super Admin']), deleteAdminUser);

// Customer account management
router.get('/customers', protectAdmin, async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
});

router.put('/customers/:id/toggle-status', protectAdmin, requireRole(['Super Admin', 'Manager']), async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `Customer account ${user.status === 'active' ? 'activated' : 'blocked'}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Dashboard Analytics
router.get('/dashboard-stats', protectAdmin, getDashboardStats);

// Activity Logs
router.get('/logs', protectAdmin, async (req, res, next) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
});

export default router;
