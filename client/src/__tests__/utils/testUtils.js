import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock API responses
export const mockApiResponse = (data, success = true) => ({
  data: {
    success,
    data,
    message: success ? 'Success' : 'Error'
  }
});

// Mock user data
export const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  role: 'user',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345'
  }
};

export const mockAdmin = {
  ...mockUser,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  role: 'admin'
};

// Mock service data
export const mockService = {
  _id: '1',
  name: 'House Cleaning',
  description: 'Regular house cleaning service',
  price: 80,
  duration: 120,
  category: 'residential',
  isActive: true,
  features: ['Dusting', 'Vacuuming', 'Mopping']
};

// Mock booking data
export const mockBooking = {
  _id: '1',
  userId: mockUser.id,
  serviceId: mockService,
  appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  appointmentTime: '10:00',
  status: 'pending',
  totalPrice: 80,
  address: {
    street: '123 Service St',
    city: 'Service City',
    state: 'SC',
    zipCode: '67890'
  },
  createdAt: new Date()
};

// Re-export everything from testing-library
export * from '@testing-library/react';