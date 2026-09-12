import { Router } from 'express';
import { getFpoProfile, getInventory, getMembers, getOrders, upsertFpoProfile } from '../controllers/fpoController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, authorizeRoles('fpo'));
router.get('/profile', getFpoProfile);
router.put('/profile', upsertFpoProfile);
router.get('/members', getMembers);
router.get('/inventory', getInventory);
router.get('/orders', getOrders);

export default router;