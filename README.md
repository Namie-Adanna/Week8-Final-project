# Naly Cleaning Services - MERN Stack Application

A comprehensive platform for booking professional cleaning services with user authentication, service management, and booking system.

## 🚀 Features

### User Features
- Browse available cleaning services
- Book appointments with preferred dates/times
- View booking history and status
- User authentication and profile management

### Admin Features
- Manage cleaning services (CRUD operations)
- View and manage all bookings
- User management
- Dashboard with analytics

## 🛠️ Tech Stack

**Frontend:**
- React 18 with functional components
- React Router for navigation
- Tailwind CSS for styling
- React Hook Form for form handling
- Axios for API calls
- React Query (optional) for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Express middleware for validation and error handling

**Testing:**
- Jest for unit testing
- Supertest for API testing
- React Testing Library for component testing
- Cypress for E2E testing

**Deployment:**
- Backend: Render/Railway
- Frontend: Netlify/Vercel
- Database: MongoDB Atlas
- CI/CD: GitHub Actions

## 📁 Project Structure

```
naly-cleaning-services/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API service functions
│   │   ├── utils/         # Utility functions
│   │   ├── context/       # React context providers
│   │   └── __tests__/     # Frontend tests
│   ├── package.json
│   └── tailwind.config.js
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── utils/         # Utility functions
│   │   ├── config/        # Configuration files
│   │   └── __tests__/     # Backend tests
│   ├── package.json
│   └── server.js
├── docs/                  # Documentation
├── .github/workflows/     # CI/CD workflows
└── README.md
```

## 🗄️ Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  role: String (enum: ['user', 'admin']),
  createdAt: Date,
  updatedAt: Date
}
```

### Services Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  duration: Number, // in minutes
  category: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  serviceId: ObjectId (ref: 'Service'),
  appointmentDate: Date,
  appointmentTime: String,
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled']),
  totalPrice: Number,
  specialInstructions: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 API Endpoints Planning

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Services Routes
- `GET /api/services` - Get all active services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Bookings Routes
- `GET /api/bookings` - Get user's bookings (protected)
- `GET /api/bookings/all` - Get all bookings (admin only)
- `POST /api/bookings` - Create new booking (protected)
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking

### Admin Routes
- `GET /api/admin/dashboard` - Get dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- pnpm package manager

### Installation
1. Clone the repository
2. Install dependencies for both client and server
3. Set up environment variables
4. Run the development servers

## 📝 Development Roadmap

- [x] Project planning and architecture
- [ ] Backend setup and database models
- [ ] Authentication system
- [ ] API endpoints development
- [ ] Frontend setup and routing
- [ ] UI components development
- [ ] Frontend-backend integration
- [ ] Testing implementation
- [ ] Deployment setup
- [ ] CI/CD pipeline

## 🔗 Live Demo
- **Frontend:** [Coming Soon]
- **Backend API:** [Coming Soon]

## 📹 Video Demonstration
[Coming Soon]

---

Built with ❤️ using the MERN stack