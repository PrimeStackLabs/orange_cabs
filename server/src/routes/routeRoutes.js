import express from 'express';
import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute
} from '../controllers/routeController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRoutes);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createRoute);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updateRoute);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deleteRoute);

export default router;
