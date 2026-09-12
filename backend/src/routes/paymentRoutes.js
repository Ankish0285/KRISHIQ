import { Router } from 'express';
import { createPaymentOrder, getPaymentById, verifyPayment } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getPaymentById);

export default router;