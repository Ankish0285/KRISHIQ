import { Router } from 'express';
import { createReview, listPublicReviews } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/public', listPublicReviews);
router.post('/', authenticateToken, createReview);

export default router;