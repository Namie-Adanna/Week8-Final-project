# Testing Strategy - Naly Cleaning Services

## 🎯 Testing Overview

Our comprehensive testing strategy ensures the reliability, security, and performance of the Naly Cleaning Services platform across all layers of the application.

## 🏗️ Testing Pyramid

```
    /\
   /  \     E2E Tests (10%)
  /____\    - Critical user flows
 /      \   - Cross-browser testing
/________\  Integration Tests (20%)
           - API endpoints
           - Database operations
___________
           Unit Tests (70%)
           - Components
           - Functions
           - Business logic
```

## 🧪 Unit Testing

### Backend Unit Tests

**Framework**: Jest + Supertest
**Coverage Target**: 85%+

**Test Categories**:
1. **Model Tests**: Database schema validation
2. **Controller Tests**: Business logic and error handling
3. **Middleware Tests**: Authentication, validation, error handling
4. **Utility Tests**: Helper functions and utilities

**Example Test Structure**:
```javascript
describe('Auth Controller', () => {
  describe('register', () => {
    it('should register user with valid data', async () => {
      // Test implementation
    });
    
    it('should reject duplicate email', async () => {
      // Test implementation
    });
  });
});
```

**Running Backend Tests**:
```bash
cd server
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Frontend Unit Tests

**Framework**: Vitest + React Testing Library
**Coverage Target**: 80%+

**Test Categories**:
1. **Component Tests**: UI components and interactions
2. **Hook Tests**: Custom React hooks
3. **Utility Tests**: Helper functions
4. **Context Tests**: React context providers

**Example Component Test**:
```javascript
describe('Header Component', () => {
  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });
});
```

**Running Frontend Tests**:
```bash
cd client
npm test                 # Run all tests
npm run test:ui         # With UI
npm run test:coverage   # With coverage
```

## 🔗 Integration Testing

### API Integration Tests

**Purpose**: Test complete API workflows and database interactions

**Test Scenarios**:
1. **Authentication Flow**: Registration → Login → Protected routes
2. **Booking Flow**: Service selection → Booking creation → Status updates
3. **Admin Operations**: User management → Service management → Analytics

**Database Setup**:
- Separate test database
- Clean state before each test
- Seed data for consistent testing

**Example Integration Test**:
```javascript
describe('Booking Integration', () => {
  it('should complete full booking flow', async () => {
    // 1. Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    // 2. Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(credentials);
    
    // 3. Create booking
    const bookingResponse = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(bookingData);
    
    expect(bookingResponse.status).toBe(201);
  });
});
```

## 🌐 End-to-End Testing

### E2E Testing with Cypress

**Purpose**: Test complete user journeys across the entire application

**Test Scenarios**:

1. **User Registration & Login**:
   - New user registration
   - Login with valid/invalid credentials
   - Password reset flow

2. **Service Booking Flow**:
   - Browse services
   - Select and book service
   - View booking confirmation
   - Manage bookings

3. **Admin Panel**:
   - Admin login
   - Dashboard navigation
   - Booking management
   - User management

4. **Responsive Design**:
   - Mobile navigation
   - Form interactions on mobile
   - Cross-browser compatibility

**Example E2E Test**:
```javascript
describe('User Booking Flow', () => {
  it('should complete booking from registration to confirmation', () => {
    cy.visit('/');
    cy.get('[data-cy="get-started"]').click();
    
    // Fill registration form
    cy.fillRegistrationForm(userData);
    cy.get('[data-cy="submit"]').click();
    
    // Navigate to services
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="browse-services"]').click();
    
    // Book service
    cy.get('[data-cy="book-now"]').first().click();
    cy.fillBookingForm(bookingData);
    cy.get('[data-cy="confirm-booking"]').click();
    
    // Verify booking created
    cy.url().should('include', '/bookings');
    cy.contains('Booking created successfully');
  });
});
```

**Running E2E Tests**:
```bash
npx cypress open        # Interactive mode
npx cypress run         # Headless mode
npx cypress run --browser chrome  # Specific browser
```

## 🔍 Testing Best Practices

### General Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the user experiences
   - Avoid testing internal implementation details
   - Test the public API/interface

2. **Arrange, Act, Assert (AAA) Pattern**
   ```javascript
   it('should update user profile', async () => {
     // Arrange
     const user = await createTestUser();
     const updateData = { firstName: 'Updated' };
     
     // Act
     const response = await updateProfile(user.id, updateData);
     
     // Assert
     expect(response.data.firstName).toBe('Updated');
   });
   ```

3. **Test Edge Cases**
   - Invalid inputs
   - Boundary conditions
   - Error scenarios
   - Network failures

4. **Isolation and Independence**
   - Each test should be independent
   - Clean up after tests
   - Use fresh data for each test

### Backend Testing Best Practices

1. **Database Testing**:
   ```javascript
   beforeEach(async () => {
     await User.deleteMany({});
     await Service.deleteMany({});
     await Booking.deleteMany({});
   });
   ```

2. **Mock External Dependencies**:
   ```javascript
   jest.mock('../services/emailService', () => ({
     sendEmail: jest.fn().mockResolvedValue(true)
   }));
   ```

3. **Test Error Handling**:
   ```javascript
   it('should handle database connection error', async () => {
     jest.spyOn(mongoose, 'connect').mockRejectedValue(new Error('Connection failed'));
     
     const response = await request(app).get('/api/services');
     expect(response.status).toBe(500);
   });
   ```

### Frontend Testing Best Practices

1. **User-Centric Testing**:
   ```javascript
   // Good: Test user interactions
   fireEvent.click(screen.getByRole('button', { name: /submit/i }));
   
   // Avoid: Testing implementation details
   expect(component.state.isSubmitting).toBe(true);
   ```

2. **Async Testing**:
   ```javascript
   it('should display loading state', async () => {
     render(<BookingForm />);
     fireEvent.click(screen.getByText('Submit'));
     
     expect(screen.getByText('Loading...')).toBeInTheDocument();
     
     await waitFor(() => {
       expect(screen.getByText('Success')).toBeInTheDocument();
     });
   });
   ```

3. **Custom Render Utilities**:
   ```javascript
   const renderWithProviders = (ui, options = {}) => {
     return render(
       <BrowserRouter>
         <AuthProvider>
           {ui}
         </AuthProvider>
       </BrowserRouter>,
       options
     );
   };
   ```

## 📊 Test Coverage Goals

### Coverage Targets

| Layer | Target | Critical Paths |
|-------|--------|----------------|
| Backend Controllers | 90%+ | 95%+ |
| Backend Models | 85%+ | 90%+ |
| Backend Middleware | 90%+ | 95%+ |
| Frontend Components | 80%+ | 90%+ |
| Frontend Hooks | 85%+ | 90%+ |
| Frontend Utils | 90%+ | 95%+ |

### Coverage Reports

**Backend Coverage**:
```bash
cd server
npm run test:coverage
open coverage/lcov-report/index.html
```

**Frontend Coverage**:
```bash
cd client
npm test -- --coverage
open coverage/lcov-report/index.html
```

## 🚀 Continuous Integration

### GitHub Actions Workflow

The CI pipeline runs:

1. **Parallel Testing**:
   - Backend tests with MongoDB
   - Frontend tests with jsdom
   - Lint and code quality checks

2. **E2E Testing**:
   - Start backend server
   - Build and serve frontend
   - Run Cypress tests

3. **Coverage Reporting**:
   - Upload to Codecov
   - Generate coverage badges
   - Fail on coverage drops

### Test Environment Setup

**Backend Test Environment**:
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**'
  ]
};
```

**Frontend Test Environment**:
```javascript
// vite.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  }
});
```

## 🔧 Testing Tools and Utilities

### Custom Test Utilities

1. **Test Data Factories**:
   ```javascript
   export const createTestUser = (overrides = {}) => ({
     firstName: 'Test',
     lastName: 'User',
     email: `test${Date.now()}@example.com`,
     password: 'Password123',
     ...overrides
   });
   ```

2. **API Test Helpers**:
   ```javascript
   export const authenticatedRequest = async (app, method, url, data, userType = 'user') => {
     const token = await getAuthToken(userType);
     return request(app)[method](url)
       .set('Authorization', `Bearer ${token}`)
       .send(data);
   };
   ```

3. **Cypress Commands**:
   ```javascript
   Cypress.Commands.add('login', (email, password) => {
     cy.visit('/login');
     cy.get('[data-cy="email"]').type(email);
     cy.get('[data-cy="password"]').type(password);
     cy.get('[data-cy="submit"]').click();
   });
   ```

## 📈 Performance Testing

### Load Testing

**Tools**: Artillery, k6, or Apache Bench

**Test Scenarios**:
1. **API Endpoints**: Test response times under load
2. **Database Operations**: Test query performance
3. **Authentication**: Test login/registration under load

**Example Load Test**:
```yaml
# artillery.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/services"
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
```

### Frontend Performance

**Tools**: Lighthouse, WebPageTest

**Metrics**:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

## 🔐 Security Testing

### Automated Security Testing

1. **Dependency Scanning**: Snyk, npm audit
2. **SAST**: ESLint security rules
3. **API Security**: OWASP ZAP

### Manual Security Testing

1. **Authentication**: Test JWT handling, session management
2. **Authorization**: Test role-based access control
3. **Input Validation**: Test SQL injection, XSS prevention
4. **Rate Limiting**: Test API rate limits

## 📱 Accessibility Testing

### Automated A11y Testing

**Tools**: cypress-axe, jest-axe

```javascript
// Cypress accessibility test
it('should be accessible', () => {
  cy.visit('/');
  cy.injectAxe();
  cy.checkA11y();
});
```

### Manual A11y Testing

1. **Keyboard Navigation**: Tab through all interactive elements
2. **Screen Reader**: Test with NVDA/JAWS
3. **Color Contrast**: Verify WCAG compliance
4. **Focus Management**: Test focus indicators

## 📋 Test Maintenance

### Regular Maintenance Tasks

1. **Update Dependencies**: Keep testing frameworks updated
2. **Review Test Coverage**: Identify gaps and add tests
3. **Refactor Tests**: Keep tests maintainable and readable
4. **Performance Monitoring**: Track test execution times

### Test Documentation

1. **Test Plan**: Document testing strategy and scope
2. **Test Cases**: Maintain test case documentation
3. **Bug Reports**: Link tests to bug reports
4. **Coverage Reports**: Regular coverage analysis

## 🎯 Quality Gates

### Definition of Done

A feature is considered complete when:

- [ ] Unit tests written and passing (85%+ coverage)
- [ ] Integration tests cover main workflows
- [ ] E2E tests cover critical user paths
- [ ] All tests pass in CI/CD pipeline
- [ ] Code review completed
- [ ] Security scan passes
- [ ] Performance benchmarks met
- [ ] Accessibility requirements met

### Release Criteria

Before releasing to production:

- [ ] All tests passing
- [ ] Coverage thresholds met
- [ ] Security vulnerabilities addressed
- [ ] Performance regression tests pass
- [ ] E2E tests pass on staging environment
- [ ] Manual testing completed
- [ ] Documentation updated

This comprehensive testing strategy ensures that the Naly Cleaning Services platform maintains high quality, reliability, and user satisfaction across all features and updates.