import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [3, 'Service name must be at least 3 characters'],
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [30, 'Duration must be at least 30 minutes']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: {
      values: ['residential', 'commercial', 'deep-cleaning', 'maintenance'],
      message: 'Category must be one of: residential, commercial, deep-cleaning, maintenance'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Service', serviceSchema);