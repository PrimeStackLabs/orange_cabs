import express from 'express';
import {
  getServices,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getServices);
router.post('/', verifyAdminToken, createService);
router.put('/:id', verifyAdminToken, updateService);
router.delete('/:id', verifyAdminToken, deleteService);

export default router;
