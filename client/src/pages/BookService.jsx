import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { servicesAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, DollarSign, MapPin, FileText } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const schema = yup.object({
  appointmentDate: yup.date()
    .required('Appointment date is required')
    .min(new Date(), 'Appointment date must be in the future'),
  appointmentTime: yup.string()
    .required('Appointment time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'),
  address: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required').length(2, 'State must be 2 characters'),
    zipCode: yup.string().required('ZIP code is required').matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  }),
  specialInstructions: yup.string().max(500, 'Special instructions cannot exceed 500 characters'),
});

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: user?.address || {},
    },
  });

  useEffect(() => {
    fetchService();
    // Pre-fill address from user profile
    if (user?.address) {
      setValue('address', user.address);
    }
  }, [serviceId, user, setValue]);

  const fetchService = async () => {
    try {
      const response = await servicesAPI.getById(serviceId);
      setService(response.data.data.service);
    } catch (error) {
      toast.error('Failed to fetch service details');
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const bookingData = {
        serviceId,
        ...data,
      };

      await bookingsAPI.create(bookingData);
      toast.success('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="btn-primary"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/services')}
              className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
            >
              ← Back to Services
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Book {service.name}
            </h1>
            <p className="text-gray-600">
              Fill out the form below to schedule your cleaning service
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service Details */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Service Details
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{formatCategory(service.category)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(service.duration)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium text-primary-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${service.price}
                    </span>
                  </div>

                  {service.features && service.features.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Appointment Details */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Appointment Details
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">
                        Preferred Date
                      </label>
                      <input
                        {...register('appointmentDate')}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className={`mt-1 input-field ${errors.appointmentDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {errors.appointmentDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                        Preferred Time
                      </label>
                      <select
                        {...register('appointmentTime')}
                        className={`mt-1 input-field ${errors.appointmentTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      >
                        <option value="">Select time</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                      {errors.appointmentTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.appointmentTime.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Address */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Service Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </label>
                      <input
                        {...register('address.street')}
                        type="text"
                        className={`mt-1 input-field ${errors.address?.street ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="123 Main Street"
                      />
                      {errors.address?.street && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          {...register('address.city')}
                          type="text"
                          className={`mt-1 input-field ${errors.address?.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Anytown"
                        />
                        {errors.address?.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          {...register('address.state')}
                          type="text"
                          maxLength="2"
                          className={`mt-1 input-field ${errors.address?.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="CA"
                        />
                        {errors.address?.state && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.state.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          {...register('address.zipCode')}
                          type="text"
                          className={`mt-1 input-field ${errors.address?.zipCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="12345"
                        />
                        {errors.address?.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.zipCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Special Instructions (Optional)
                  </h2>
                  
                  <div>
                    <textarea
                      {...register('specialInstructions')}
                      rows={4}
                      className={`input-field ${errors.specialInstructions ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Any specific instructions or areas you'd like us to focus on..."
                    />
                    {errors.specialInstructions && (
                      <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/services')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Booking...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Service (${service.price})
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;