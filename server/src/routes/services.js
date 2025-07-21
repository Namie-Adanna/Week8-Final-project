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

// Public routes
router.get('/', validatePagination, getServices);
router.get('/categories', getServiceCategories);
router.get('/:id', validateObjectId, getService);

// Protected admin routes
router.post('/', protect, adminOnly, validateService, createService);
router.put('/:id', protect, adminOnly, validateObjectId, validateService, updateService);
router.delete('/:id', protect, adminOnly, validateObjectId, deleteService);

export default router;