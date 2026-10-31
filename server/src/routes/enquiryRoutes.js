import express from 'express';
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry
} from '../controllers/enquiryController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public contact form
router.post('/', createEnquiry);

// Admin endpoints
router.get('/', verifyAdminToken, getEnquiries);
router.get('/admin/all', verifyAdminToken, getEnquiries);
router.patch('/:id', verifyAdminToken, updateEnquiryStatus);
router.put('/:id', verifyAdminToken, updateEnquiryStatus);
router.put('/admin/:id', verifyAdminToken, updateEnquiryStatus);
router.delete('/:id', verifyAdminToken, deleteEnquiry);

export default router;
