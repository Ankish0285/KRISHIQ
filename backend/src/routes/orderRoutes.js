import { Router } from 'express';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', authorizeRoles('admin', 'farmer', 'fpo', 'logistics'), updateOrderStatus);
router.post('/:id/cancel', cancelOrder);

export default router;