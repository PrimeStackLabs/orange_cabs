import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', protectAdmin, requireRole(['Super Admin', 'Manager']), updateSettings);

export default router;
