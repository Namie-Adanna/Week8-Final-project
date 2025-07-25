import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, DollarSign, Star, Filter, Search } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch services...'); // Debug log
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;

      console.log('API params:', params); // Debug log
      const response = await servicesAPI.getAll(params);
      console.log('Services response:', response.data); // Debug log
      setServices(response.data.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      toast.error('Failed to fetch services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await servicesAPI.getCategories();
      setCategories(response.data.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories if API fails
      setCategories(['residential', 'commercial', 'deep-cleaning', 'maintenance']);
    }
  };

  const formatCategory = (category) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Cleaning Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience top-tier residential and commercial cleaning solutions—customized to fit your schedule, space, and standards.
          </p>
        </div>

          {/* Services Grid */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service._id} className="card hover:shadow-lg transition-shadow duration-300">
                {/* Service Image */}
                <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-primary-600 text-6xl">
                    {service.category === 'residential' && '🏠'}
                    {service.category === 'commercial' && '🏢'}
                    {service.category === 'deep-cleaning' && '✨'}
                    {service.category === 'maintenance' && '🔧'}
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {formatCategory(service.category)}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.3</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(service.duration)}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Starting at ${service.price}
                    </div>
                  </div>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <div className="pt-2">
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    {isAuthenticated ? (
                      <Link
                        to={`/book/${service._id}`}
                        className="btn-primary w-full text-center"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <Link
                        to="/register"
                        className="btn-primary w-full text-center"
                      >
                        Sign Up to Book
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card bg-primary-50 border-primary-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Cleaning Solution?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find exactly what you're looking for? Contact us for a personalized 
              cleaning plan that fits your specific needs and budget.
            </p>
            <Link
              to="/contact"
              className="btn-primary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;