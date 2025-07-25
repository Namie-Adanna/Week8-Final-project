describe('User Registration and Booking Flow', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('/');
  });

  it('should complete full user journey from registration to booking', () => {
    // Step 1: Navigate to registration
    cy.get('[data-cy="get-started-btn"]').first().click();
    cy.url().should('include', '/register');

    // Step 2: Fill out registration form
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="email"]').type(`test${Date.now()}@example.com`);
    cy.get('input[name="password"]').type('Password123');
    cy.get('input[name="phone"]').type('+1234567890');
    cy.get('input[name="address.street"]').type('123 Main St');
    cy.get('input[name="address.city"]').type('Anytown');
    cy.get('input[name="address.state"]').type('CA');
    cy.get('input[name="address.zipCode"]').type('12345');

    // Step 3: Submit registration
    cy.get('button[type="submit"]').click();

    // Step 4: Should redirect to dashboard after successful registration
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back, John!').should('be.visible');

    // Step 5: Navigate to services
    cy.get('[data-cy="browse-services-btn"]').click();
    cy.url().should('include', '/services');

    // Step 6: Select a service to book
    cy.contains('Book Now').first().click();
    cy.url().should('include', '/book/');

    // Step 7: Fill out booking form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    cy.get('input[name="appointmentDate"]').type(tomorrowString);
    cy.get('select[name="appointmentTime"]').select('10:00');
    cy.get('input[name="address.street"]').clear().type('456 Service St');
    cy.get('input[name="address.city"]').clear().type('Service City');
    cy.get('input[name="address.state"]').clear().type('SC');
    cy.get('input[name="address.zipCode"]').clear().type('67890');
    cy.get('textarea[name="specialInstructions"]').type('Please focus on the kitchen area');

    // Step 8: Submit booking
    cy.get('button[type="submit"]').click();

    // Step 9: Should redirect to bookings page
    cy.url().should('include', '/bookings');
    cy.contains('My Bookings').should('be.visible');
    cy.contains('pending').should('be.visible');
  });

  it('should handle login flow', () => {
    // Navigate to login
    cy.contains('Login').click();
    cy.url().should('include', '/login');

    // Try demo credentials
    cy.get('input[name="email"]').type('user@demo.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });

  it('should navigate through all main pages', () => {
    const pages = [
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'About', url: '/about' },
      { name: 'Contact', url: '/contact' }
    ];

    pages.forEach(page => {
      cy.contains(page.name).click();
      cy.url().should('include', page.url);
      
      // Check that page content loads
      if (page.name === 'Home') {
        cy.contains('Welcome to Naly professional cleaning services').should('be.visible');
      } else if (page.name === 'Services') {
        cy.contains('Our Cleaning Services').should('be.visible');
      } else if (page.name === 'About') {
        cy.contains('About Naly Cleaning Services').should('be.visible');
      } else if (page.name === 'Contact') {
        cy.contains('Get in Touch').should('be.visible');
      }
    });
  });

  it('should be responsive on mobile devices', () => {
    // Test mobile viewport
    cy.viewport('iphone-x');
    
    // Check mobile menu
    cy.get('[data-cy="mobile-menu-button"]').should('be.visible');
    cy.get('[data-cy="mobile-menu-button"]').click();
    
    // Mobile navigation should be visible
    cy.get('[data-cy="mobile-nav"]').should('be.visible');
    cy.contains('Home').should('be.visible');
    cy.contains('Services').should('be.visible');
  });

  it('should handle form validation errors', () => {
    // Go to registration
    cy.contains('Get Started').first().click();
    
    // Try to submit empty form
    cy.get('button[type="submit"]').click();
    
    // Should show validation errors
    cy.contains('First name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
    
    // Fill invalid email
    cy.get('input[name="email"]').type('invalid-email');
    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email').should('be.visible');
  });
});