import express from 'express';
import {
  handleChatMessage,
  getSessionHistory,
  getAllChatSessionsAdmin
} from '../controllers/chatController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', handleChatMessage);
router.get('/session/:sessionId', getSessionHistory);
router.get('/admin/sessions', protectAdmin, getAllChatSessionsAdmin);

export default router;
