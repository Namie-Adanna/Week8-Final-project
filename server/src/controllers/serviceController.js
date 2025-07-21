import Service from '../models/Service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = asyncHandler(async (req, res) => {
  const { category, active, page = 1, limit = 10, search } = req.query;
  
  // Build query
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (active !== undefined) {
    query.isActive = active === 'true';
  } else {
    // By default, only show active services for public access
    query.isActive = true;
  }
  
  if (search) {
    query.$text = { $search: search };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  // Execute query with pagination
  const services = await Service.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await Service.countDocuments(query);
  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    },
    message: 'Services retrieved successfully'
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Service not found',
        code: 'SERVICE_NOT_FOUND'
      }
    });
  }

  res.json({
    success: true,
    data: { service },
    message: 'Service retrieved successfully'
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: { service },
    message: 'Service created successfully'
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!service) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Service not found',
        code: 'SERVICE_NOT_FOUND'
      }
    });
  }

  res.json({
    success: true,
    data: { service },
    message: 'Service updated successfully'
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      error: {
        message: 'Service not found',
        code: 'SERVICE_NOT_FOUND'
      }
    });
  }

  // Soft delete - just mark as inactive
  service.isActive = false;
  await service.save();

  res.json({
    success: true,
    data: {},
    message: 'Service deleted successfully'
  });
});

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
export const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await Service.distinct('category', { isActive: true });

  res.json({
    success: true,
    data: { categories },
    message: 'Service categories retrieved successfully'
  });
});