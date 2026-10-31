import express from 'express';
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver
} from '../controllers/driverController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protectAdmin, getDrivers);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createDriver);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updateDriver);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deleteDriver);

export default router;
