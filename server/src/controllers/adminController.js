import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Get current date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Parallel queries for better performance
  const [
    totalUsers,
    totalServices,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    monthlyBookings,
    lastMonthBookings,
    monthlyRevenue,
    lastMonthRevenue,
    recentBookings
  ] = await Promise.all([
    User.countDocuments({ role: 'user', isActive: true }),
    Service.countDocuments({ isActive: true }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'confirmed' }),
    Booking.countDocuments({ status: 'completed' }),
    Booking.countDocuments({ status: 'cancelled' }),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ 
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
    }),
    Booking.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalPrice' } 
        }
      }
    ]),
    Booking.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalPrice' } 
        }
      }
    ]),
    Booking.find()
      .populate('userId', 'firstName lastName email')
      .populate('serviceId', 'name price')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  // Calculate growth percentages
  const bookingGrowth = lastMonthBookings > 0 
    ? ((monthlyBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(1)
    : monthlyBookings > 0 ? 100 : 0;

  const currentRevenue = monthlyRevenue[0]?.total || 0;
  const previousRevenue = lastMonthRevenue[0]?.total || 0;
  const revenueGrowth = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
    : currentRevenue > 0 ? 100 : 0;

  // Get popular services
  const popularServices = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$serviceId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { 
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    { $unwind: '$service' },
    { 
      $project: {
        name: '$service.name',
        bookings: '$count',
        price: '$service.price'
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalServices,
        totalBookings,
        monthlyRevenue: currentRevenue
      },
      bookingStats: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings
      },
      growth: {
        bookings: {
          current: monthlyBookings,
          previous: lastMonthBookings,
          percentage: parseFloat(bookingGrowth)
        },
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          percentage: parseFloat(revenueGrowth)
        }
      },
      popularServices,
      recentBookings
    },
    message: 'Dashboard statistics retrieved successfully'
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, isActive } = req.query;
  
  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) {
    query.role = role;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query
  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    },
    message: 'Users retrieved successfully'
  });
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }
    });
  }

  res.json({
    success: true,
    data: { user },
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
  });
});