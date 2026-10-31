import express from 'express';
import {
  getPublicContent,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
  getSettings,
  updateSettings
} from '../controllers/contentController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Public bundle
router.get('/public', getPublicContent);

// FAQs
router.get('/faqs', getFAQs);
router.post('/faqs', verifyAdminToken, createFAQ);
router.put('/faqs/:id', verifyAdminToken, updateFAQ);
router.delete('/faqs/:id', verifyAdminToken, deleteFAQ);

// Testimonials
router.get('/testimonials', getTestimonials);
router.post('/testimonials', verifyAdminToken, createTestimonial);
router.put('/testimonials/:id', verifyAdminToken, updateTestimonial);
router.delete('/testimonials/:id', verifyAdminToken, deleteTestimonial);

// Gallery
router.get('/gallery', getGallery);
router.post('/gallery', verifyAdminToken, createGalleryItem);
router.delete('/gallery/:id', verifyAdminToken, deleteGalleryItem);

// Settings & Content
router.get('/settings', getSettings);
router.put('/settings', verifyAdminToken, updateSettings);

export default router;
