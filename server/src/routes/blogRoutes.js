import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protectAdmin, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.get('/admin/all', protectAdmin, getAllBlogsAdmin);
router.post('/', protectAdmin, requireRole(['Super Admin', 'Manager']), createBlog);
router.put('/:id', protectAdmin, requireRole(['Super Admin', 'Manager']), updateBlog);
router.delete('/:id', protectAdmin, requireRole(['Super Admin']), deleteBlog);

export default router;
