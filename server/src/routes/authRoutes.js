import express from 'express';
import { registerUser, loginUser, loginWithOtp, getProfile, updateProfile } from '../controllers/authController.js';
import { protectUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login-otp', loginWithOtp);
router.get('/profile', protectUser, getProfile);
router.put('/profile', protectUser, updateProfile);

export default router;
