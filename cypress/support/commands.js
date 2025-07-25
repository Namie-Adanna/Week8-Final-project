// Custom commands for Cypress

// Login command
Cypress.Commands.add('login', (email = 'user@demo.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Login as admin command
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@demo.com', 'password123');
});

// Create booking command
Cypress.Commands.add('createBooking', (serviceId = null) => {
  cy.visit('/services');
  
  if (serviceId) {
    cy.visit(`/book/${serviceId}`);
  } else {
    cy.contains('Book Now').first().click();
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  cy.get('input[name="appointmentDate"]').type(tomorrowString);
  cy.get('select[name="appointmentTime"]').select('10:00');
  cy.get('input[name="address.street"]').clear().type('123 Test St');
  cy.get('input[name="address.city"]').clear().type('Test City');
  cy.get('input[name="address.state"]').clear().type('TC');
  cy.get('input[name="address.zipCode"]').clear().type('12345');
  
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/bookings');
});

// Wait for API response
Cypress.Commands.add('waitForApi', (alias) => {
  cy.wait(alias).then((interception) => {
    expect(interception.response.statusCode).to.be.oneOf([200, 201]);
  });
});

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Custom assertion for toast messages
Cypress.Commands.add('shouldShowToast', (message) => {
  cy.get('[data-cy="toast"]').should('contain', message);
});

// Fill address form
Cypress.Commands.add('fillAddress', (address = {}) => {
  const defaultAddress = {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    ...address
  };
  
  cy.get('input[name="address.street"]').clear().type(defaultAddress.street);
  cy.get('input[name="address.city"]').clear().type(defaultAddress.city);
  cy.get('input[name="address.state"]').clear().type(defaultAddress.state);
  cy.get('input[name="address.zipCode"]').clear().type(defaultAddress.zipCode);
});

// Intercept API calls
Cypress.Commands.add('interceptApi', () => {
  cy.intercept('POST', '/api/auth/login').as('login');
  cy.intercept('POST', '/api/auth/register').as('register');
  cy.intercept('GET', '/api/services').as('getServices');
  cy.intercept('POST', '/api/bookings').as('createBooking');
  cy.intercept('GET', '/api/bookings').as('getBookings');
  cy.intercept('PUT', '/api/bookings/*').as('updateBooking');
});