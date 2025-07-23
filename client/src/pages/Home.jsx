import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Shield, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Users,
  Award,
  Zap
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: 'Trusted & Insured',
      description: 'All our cleaners are background-checked, trained, and fully insured for your peace of mind.'
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book appointments that fit your schedule. Same-day and recurring services available.'
    },
    {
      icon: Sparkles,
      title: 'Eco-Friendly Products',
      description: 'We use environmentally safe cleaning products that are effective and safe for your family.'
    },
    {
      icon: Star,
      title: '5-Star Service',
      description: 'Consistently rated 5 stars by our customers for quality, reliability, and professionalism.'
    }
  ];

  const services = [
    {
      name: 'Regular House Cleaning',
      description: 'Weekly, bi-weekly, or monthly cleaning to keep your home spotless.',
      price: 'Starting at $80',
      features: ['Dusting & vacuuming', 'Kitchen & bathroom cleaning', 'Floor mopping', 'Trash removal']
    },
    {
      name: 'Deep Cleaning',
      description: 'Comprehensive cleaning for move-ins, move-outs, or seasonal deep cleans.',
      price: 'Starting at $150',
      features: ['Inside appliances', 'Baseboards & windows', 'Light fixtures', 'Cabinet interiors']
    },
    {
      name: 'Office Cleaning',
      description: 'Professional commercial cleaning services for offices and businesses.',
      price: 'Starting at $120',
      features: ['Desk sanitization', 'Common area cleaning', 'Restroom maintenance', 'Flexible scheduling']
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Cleanings Completed' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '5+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Professional
                <span className="text-primary-600"> Cleaning </span>
                Services
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your space with our reliable, eco-friendly cleaning services. 
                Book online in minutes and enjoy a spotless home or office.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/services" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                ) : (
                  <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                )}
                <Link to="/services" className="btn-outline text-lg px-8 py-3 inline-flex items-center justify-center">
                  View Services
                </Link>
              </div>
            </div>
            <div className="animate-slide-up">
              <img
                src="https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional cleaning service"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Naly Cleaning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional cleaning services that exceed your expectations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-300">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From regular maintenance to deep cleaning, we have the perfect service for your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold text-primary-600 mb-4">
                    {service.price}
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-secondary-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? "/services" : "/register"}
                  className="btn-primary w-full text-center"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready for a Spotless Space?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Naly Cleaning for their home and office needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/services" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                Book Your Cleaning
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center justify-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/contact" className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                  Contact Us
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;