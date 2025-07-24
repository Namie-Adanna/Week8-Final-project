import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  Award, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Heart,
  Leaf
} from 'lucide-react';

const About = () => {
  const { isAuthenticated } = useAuth();

  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We build lasting relationships through consistent, dependable service and transparent communication.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for perfection in every detail, ensuring your space exceeds your expectations.'
    },
    {
      icon: Heart,
      title: 'Care & Respect',
      description: 'We treat your home and office with the same care and respect we would our own.'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We use eco-friendly products and practices to protect your family and the environment.'
    }
  ];

  const team = [
    {
      name: 'Naomi Birech',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2764975/pexels-photo-2764975.jpeg',
      description: 'With 5+ years in the cleaning industry, Naomi founded Naly Cleaning to provide exceptional service.'
    },
    {
      name: 'Michael Otieno',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/9775679/pexels-photo-9775679.jpeg',
      description: 'Michael ensures our operations run smoothly and our quality standards are consistently met.'
    },
    {
      name: 'Emily Anyango',
      role: 'Customer Success Lead',
      image: 'https://images.pexels.com/photos/31080755/pexels-photo-31080755.jpeg',
      description: 'Emily leads our customer success team, ensuring every client has an exceptional experience.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Cleanings Completed' },
    { number: '4.3/5', label: 'Average Rating' },
    { number: '5+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Naly Cleaning Services
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're passionate about creating clean, healthy spaces that enhance your quality of life. 
              Since 2019, we've been the trusted choice for professional cleaning services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/services" className="btn-primary text-lg px-8 py-3">
                  Book Our Services
                </Link>
              ) : (
                <Link to="/register" className="btn-primary text-lg px-8 py-3">
                  Get Started
                </Link>
              )}
              <Link to="/contact" className="btn-outline text-lg px-8 py-3">
                Contact Us
              </Link>
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

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Naly Cleaning Services was born from a simple belief: everyone deserves a clean, 
                  healthy space to live and work. Founded in 2019 by Naomi Birech, we started as 
                  a small local business with big dreams and an unwavering commitment to excellence.
                </p>
                <p>
                  What began as a one-person operation has grown into a trusted team of professional 
                  cleaners serving hundreds of satisfied customers. We've built our reputation on 
                  reliability, attention to detail, and genuine care for our clients' needs.
                </p>
                <p>
                  Today, we're proud to be the leading cleaning service in our community, but we 
                  haven't forgotten our roots. We still treat every home and office with the same 
                  personal attention and care that made us who we are.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our cleaning team at work"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the experience we deliver to our customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals behind Naly Cleaning Services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Naly Cleaning?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Licensed & Insured</h3>
                <p className="text-gray-600 text-sm">
                  Fully licensed and insured for your protection and peace of mind.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Trained Professionals</h3>
                <p className="text-gray-600 text-sm">
                  Our team is thoroughly trained and background-checked for quality service.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                <p className="text-gray-600 text-sm">
                  We work around your schedule with convenient booking options.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-yellow-100 p-2 rounded-lg flex-shrink-0">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Satisfaction Guaranteed</h3>
                <p className="text-gray-600 text-sm">
                  We're not happy until you're completely satisfied with our service.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly Products</h3>
                <p className="text-gray-600 text-sm">
                  Safe, non-toxic cleaning products that protect your family and pets.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bonded & Trusted</h3>
                <p className="text-gray-600 text-sm">
                  Bonded team members you can trust in your home or office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Naly Cleaning for their home and office needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/services" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Book Your Service
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                  Get Started Free
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

export default About;