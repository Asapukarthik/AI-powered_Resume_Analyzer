import express from 'express';
import { registerUser, loginUser, getMe, googleLogin, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/google', googleLogin);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', protect, resendVerification);

export default router;
