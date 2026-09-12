import { Router } from 'express';
import {
  getDemandData,
  getEarnings,
  getFarmerProfile,
  getInventory,
  getNotifications,
  getOrders,
  upsertFarmerProfile,
} from '../controllers/farmerController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, authorizeRoles('farmer'));
router.get('/profile', getFarmerProfile);
router.put('/profile', upsertFarmerProfile);
router.get('/inventory', getInventory);
router.get('/orders', getOrders);
router.get('/earnings', getEarnings);
router.get('/demand', getDemandData);
router.get('/notifications', getNotifications);

export default router;