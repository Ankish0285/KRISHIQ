import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, sendOtp, sendSignupOtp, verifySignupOtp, verifyLoginOtp, sendPasswordResetOtp, verifyPasswordResetOtp, resetPasswordWithOtp, getCurrentUser, logoutUser, updateProfile, uploadProfileImage } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { uploadProfileImage as uploadProfileImageFile } from '../middleware/uploadMiddleware.js';

const router = Router();
const otpRequestLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	standardHeaders: true,
	legacyHeaders: false,
	message: { success: false, message: 'Too many OTP requests. Please try again later.' },
});
const otpVerifyLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	standardHeaders: true,
	legacyHeaders: false,
	message: { success: false, message: 'Too many OTP attempts. Please request a new OTP later.' },
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', otpRequestLimiter, sendOtp);
router.post('/signup/send-otp', otpRequestLimiter, sendSignupOtp);
router.post('/signup/verify-otp', otpVerifyLimiter, verifySignupOtp);
router.post('/verify-otp', otpVerifyLimiter, verifyLoginOtp);
router.post('/forgot-password', otpRequestLimiter, sendPasswordResetOtp);
router.post('/forgot-password/verify-otp', otpVerifyLimiter, verifyPasswordResetOtp);
router.post('/forgot-password/reset', otpVerifyLimiter, resetPasswordWithOtp);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logoutUser);
router.patch('/profile', authenticateToken, updateProfile);
router.post('/profile/image', authenticateToken, uploadProfileImageFile, uploadProfileImage);

export default router;