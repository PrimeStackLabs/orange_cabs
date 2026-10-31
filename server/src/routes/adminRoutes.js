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
