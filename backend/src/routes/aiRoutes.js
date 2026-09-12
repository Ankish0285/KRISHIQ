import { Router } from 'express';
import { getAiRecommendations, getDemandForecast, getPriceInsights } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/recommendations', getAiRecommendations);
router.get('/price/:productId', getPriceInsights);
router.get('/demand', getDemandForecast);

export default router;