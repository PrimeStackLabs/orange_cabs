import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/fleetController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';
import { receiveVehicleImage } from '../middleware/vehicleImageUpload.js';
import { uploadVehicleImage } from '../controllers/vehicleImageController.js';

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post(
  '/upload-image',
  protectAdmin,
  requireRole(['Super Admin', 'Manager']),
  receiveVehicleImage,
  uploadVehicleImage
);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createVehicle);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updateVehicle);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deleteVehicle);

export default router;
