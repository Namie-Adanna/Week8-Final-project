import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Home from '../../pages/Home';

const mockAuthContext = {
  user: null,
  isAuthenticated: false
};

jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockAuthContext
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  it('renders hero section with main heading', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText(/Welcome to Naly professional cleaning services/i)).toBeInTheDocument();
  });

  it('renders features section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Why Choose Naly Cleaning?')).toBeInTheDocument();
    expect(screen.getByText('Trusted & Insured')).toBeInTheDocument();
    expect(screen.getByText('Flexible Scheduling')).toBeInTheDocument();
    expect(screen.getByText('Eco-Friendly Products')).toBeInTheDocument();
    expect(screen.getByText('5-Star Service')).toBeInTheDocument();
  });

  it('renders services section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText('Regular House Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Deep Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Office Cleaning')).toBeInTheDocument();
  });

  it('renders stats section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('Happy Customers')).toBeInTheDocument();
    expect(screen.getByText('50,000+')).toBeInTheDocument();
    expect(screen.getByText('Cleanings Completed')).toBeInTheDocument();
  });

  it('shows "Get Started" button when not authenticated', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getAllByText('Get Started')).toHaveLength(2); // Hero and CTA sections
  });

  it('shows "Book Now" button when authenticated', () => {
    mockAuthContext.isAuthenticated = true;
    
    renderWithProviders(<Home />);
    
    expect(screen.getAllByText('Book Now')).toHaveLength(4); // Hero, services, and CTA sections
  });

  it('renders CTA section', () => {
    renderWithProviders(<Home />);
    
    expect(screen.getByText('Ready for a Spotless Space?')).toBeInTheDocument();
  });
});