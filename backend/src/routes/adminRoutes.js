import { Router } from 'express';
import {
  createAdmin,
  deleteProduct,
  deleteUser,
  getOverview,
  getSettings,
  listAuditLogs,
  listOrders,
  listProducts,
  listUsers,
  updateOrderStatus,
  updateProduct,
  updateSettings,
  updateUser,
  uploadAdminMedia,
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles, requireSuperAdmin } from '../middleware/authMiddleware.js';
import { uploadMedia } from '../middleware/uploadMiddleware.js';

const router = Router();
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/overview', getOverview);
router.get('/users', listUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/products', listProducts);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', listOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/audit-logs', requireSuperAdmin, listAuditLogs);
router.get('/settings', getSettings);
router.patch('/settings', requireSuperAdmin, updateSettings);
router.post('/media', requireSuperAdmin, uploadMedia, uploadAdminMedia);
router.post('/admins', requireSuperAdmin, createAdmin);

export default router;