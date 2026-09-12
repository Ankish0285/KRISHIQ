import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;