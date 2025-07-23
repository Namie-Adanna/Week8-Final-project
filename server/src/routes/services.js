import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceCategories
} from '../controllers/serviceController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateService, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Add logging middleware for debugging
router.use((req, res, next) => {
  console.log(`Services route: ${req.method} ${req.path}`);
  next();
});

// Public routes
router.get('/categories', getServiceCategories);
router.get('/', getServices);
router.get('/:id', getService);

// Protected admin routes
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

export default router;