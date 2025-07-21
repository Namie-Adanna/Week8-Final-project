import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  // Build query
  const query = { userId: req.user.id };
  
  if (status) {
    query.status = status;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with population
  const bookings = await Booking.find(query)
    .populate('serviceId', 'name description price duration category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Booking.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    },
    message: 'Bookings retrieved successfully'
  });
});

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, userId, serviceId } = req.query;
  
  // Build query
  const query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (userId) {
    query.userId = userId;
  }
  
  if (serviceId) {
    query.serviceId = serviceId;
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with population
  const bookings = await Booking.find(query)
    .populate('userId', 'firstName lastName email phone')
    .populate('serviceId', 'name description price duration category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Booking.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    },
    message: 'All bookings retrieved successfully'
  });
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, appointmentDate, appointmentTime, specialInstructions, address } = req.body;

  // Verify service exists and is active
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Service not found or not available',
        code: 'SERVICE_NOT_AVAILABLE'
      }
    });
  }

  // Check for conflicting bookings (same date, time, and service)
  const existingBooking = await Booking.findOne({
    serviceId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingBooking) {
    return res.status(409).json({
      success: false,
      error: {
        message: 'This time slot is already booked',
        code: 'TIME_SLOT_UNAVAILABLE'
      }
    });
  }

  // Create booking
  const booking = await Booking.create({
    userId: req.user.id,
    serviceId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    totalPrice: service.price,
    specialInstructions,
    address
  });

  // Populate the booking with service details
  await booking.populate('serviceId', 'name description price duration category');

  res.status(201).json({
    success: true,
    data: { booking },
    message: 'Booking created successfully'
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = asyncHandler(async (req, res) => {
  const { status, cancellationReason } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      }
    });
  }

  // Check if user owns the booking or is admin
  if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Not authorized to update this booking',
        code: 'NOT_AUTHORIZED'
      }
    });
  }

  // Validate status transitions
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [], // Cannot change from completed
    cancelled: [] // Cannot change from cancelled
  };

  if (!validTransitions[booking.status].includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        message: `Cannot change status from ${booking.status} to ${status}`,
        code: 'INVALID_STATUS_TRANSITION'
      }
    });
  }

  // Update booking
  booking.status = status;
  if (status === 'cancelled' && cancellationReason) {
    booking.cancellationReason = cancellationReason;
  }

  await booking.save();
  await booking.populate('serviceId', 'name description price duration category');

  res.json({
    success: true,
    data: { booking },
    message: 'Booking updated successfully'
  });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Booking not found',
        code: 'BOOKING_NOT_FOUND'
      }
    });
  }

  // Check if user owns the booking
  if (booking.userId.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Not authorized to cancel this booking',
        code: 'NOT_AUTHORIZED'
      }
    });
  }

  // Check if booking can be cancelled
  if (booking.status === 'completed') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Cannot cancel a completed booking',
        code: 'CANNOT_CANCEL_COMPLETED'
      }
    });
  }

  if (booking.status === 'cancelled') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Booking is already cancelled',
        code: 'ALREADY_CANCELLED'
      }
    });
  }

  // Cancel booking
  booking.status = 'cancelled';
  if (cancellationReason) {
    booking.cancellationReason = cancellationReason;
  }

  await booking.save();

  res.json({
    success: true,
    data: {},
    message: 'Booking cancelled successfully'
  });
});