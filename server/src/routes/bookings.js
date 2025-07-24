import express from 'express';
import {
  getUserBookings,
  getAllBookings,
  createBooking,
  updateBooking,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Add logging middleware
router.use((req, res, next) => {
  console.log(`Bookings route: ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Protected routes
router.get('/', protect, validatePagination, getUserBookings);
router.post('/', protect, createBooking);
router.put('/:id', protect, validateObjectId, updateBooking);
router.delete('/:id', protect, validateObjectId, cancelBooking);

// Admin routes
router.get('/all', protect, adminOnly, validatePagination, getAllBookings);

export default router;