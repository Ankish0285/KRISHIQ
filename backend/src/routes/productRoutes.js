import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductsByCategory,
  getProductsByFarmer,
  searchProducts,
  updateProduct,
} from '../controllers/productController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';
import { uploadProductImages } from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/search', searchProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/farmer/:farmerId', getProductsByFarmer);
router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticateToken, authorizeRoles('farmer', 'fpo', 'admin'), uploadProductImages, createProduct);
router.put('/:id', authenticateToken, authorizeRoles('farmer', 'fpo', 'admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('farmer', 'fpo', 'admin'), deleteProduct);

export default router;