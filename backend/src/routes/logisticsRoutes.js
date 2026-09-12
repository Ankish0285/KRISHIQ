import { Router } from 'express';
import { assignDeliveryPartner, getDeliveries, updateDeliveryStatus } from '../controllers/logisticsController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken, authorizeRoles('logistics', 'admin'));
router.get('/deliveries', getDeliveries);
router.patch('/deliveries/:id/status', updateDeliveryStatus);
router.patch('/deliveries/:id/assign', assignDeliveryPartner);

export default router;