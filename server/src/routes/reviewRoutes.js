import express from 'express';
import {
  getApprovedReviews,
  submitReview,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getApprovedReviews);
router.post('/', submitReview);
router.get('/admin/all', protectAdmin, getAllReviewsAdmin);
router.put('/admin/:id', protectAdmin, updateReviewStatus);
router.delete('/admin/:id', protectAdmin, deleteReview);

export default router;
