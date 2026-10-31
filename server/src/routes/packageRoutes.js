import express from 'express';
import {
  getPackages,
  getPackageBySlug,
  createPackage,
  updatePackage,
  deletePackage
} from '../controllers/packageController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPackages);
router.get('/:slug', getPackageBySlug);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createPackage);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updatePackage);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deletePackage);

export default router;
