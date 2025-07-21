import express from 'express';
import { getDashboardStats, getAllUsers, updateUserStatus } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', validatePagination, getAllUsers);
router.put('/users/:id/status', validateObjectId, updateUserStatus);

export default router;