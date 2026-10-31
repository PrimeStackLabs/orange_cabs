import express from 'express';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createCoupon);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updateCoupon);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deleteCoupon);

export default router;
