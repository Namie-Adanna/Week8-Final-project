describe('Admin Panel Flow', () => {
  beforeEach(() => {
    // Login as admin
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@demo.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Navigate to admin panel
    cy.get('[data-cy="user-menu"]').click();
    cy.contains('Admin Panel').click();
    cy.url().should('include', '/admin');
  });

  it('should display admin dashboard with statistics', () => {
    cy.contains('Dashboard').should('be.visible');
    cy.contains('Total Users').should('be.visible');
    cy.contains('Total Bookings').should('be.visible');
    cy.contains('Monthly Revenue').should('be.visible');
    cy.contains('Active Services').should('be.visible');
  });

  it('should navigate through admin sections', () => {
    const sections = ['Dashboard', 'Bookings', 'Services', 'Users'];
    
    sections.forEach(section => {
      cy.contains(section).click();
      cy.url().should('include', section.toLowerCase());
      
      // Verify section content loads
      if (section === 'Bookings') {
        cy.contains('All Bookings').should('be.visible');
      } else if (section === 'Services') {
        cy.contains('Manage Services').should('be.visible');
      } else if (section === 'Users') {
        cy.contains('User Management').should('be.visible');
      }
    });
  });

  it('should allow admin to update booking status', () => {
    // Navigate to bookings
    cy.contains('Bookings').click();
    
    // Find a pending booking and update status
    cy.get('[data-cy="booking-row"]').first().within(() => {
      cy.get('[data-cy="status-select"]').select('confirmed');
      cy.get('[data-cy="update-status-btn"]').click();
    });
    
    // Should show success message
    cy.contains('Booking updated successfully').should('be.visible');
  });

  it('should display booking details in modal', () => {
    cy.contains('Bookings').click();
    
    // Click on view details button
    cy.get('[data-cy="view-booking-btn"]').first().click();
    
    // Modal should open with booking details
    cy.get('[data-cy="booking-modal"]').should('be.visible');
    cy.contains('Booking Details').should('be.visible');
    cy.contains('Service Information').should('be.visible');
    cy.contains('Customer Information').should('be.visible');
  });

  it('should filter bookings by status', () => {
    cy.contains('Bookings').click();
    
    // Filter by pending status
    cy.get('[data-cy="status-filter"]').select('pending');
    
    // Should only show pending bookings
    cy.get('[data-cy="booking-row"]').each($row => {
      cy.wrap($row).should('contain', 'pending');
    });
  });

  it('should search bookings by customer name', () => {
    cy.contains('Bookings').click();
    
    // Search for a customer
    cy.get('[data-cy="search-input"]').type('John');
    cy.get('[data-cy="search-btn"]').click();
    
    // Results should contain the search term
    cy.get('[data-cy="booking-row"]').should('contain', 'John');
  });
});