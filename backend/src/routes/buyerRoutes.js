import { Router } from 'express';
import { getBuyerProfile, upsertBuyerProfile } from '../controllers/buyerController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, authorizeRoles('buyer'));
router.get('/profile', getBuyerProfile);
router.put('/profile', upsertBuyerProfile);

export default router;