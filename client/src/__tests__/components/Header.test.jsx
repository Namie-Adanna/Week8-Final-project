import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import Header from '../../components/common/Header';

// Mock the useAuth hook
const mockLogout = jest.fn();
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  logout: mockLogout
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

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation links', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Naly Cleaning')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('shows login and register buttons when not authenticated', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('shows user menu when authenticated', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { firstName: 'John', role: 'user' };
    
    renderWithProviders(<Header />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('opens mobile menu when hamburger is clicked', () => {
    renderWithProviders(<Header />);
    
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Mobile menu should be visible
    expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop and mobile
  });

  it('shows admin panel link for admin users', () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { firstName: 'Admin', role: 'admin' };
    
    renderWithProviders(<Header />);
    
    const userButton = screen.getByText('Admin');
    fireEvent.click(userButton);
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('calls logout when logout button is clicked', async () => {
    mockAuthContext.isAuthenticated = true;
    mockAuthContext.user = { firstName: 'John', role: 'user' };
    
    renderWithProviders(<Header />);
    
    const userButton = screen.getByText('John');
    fireEvent.click(userButton);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});