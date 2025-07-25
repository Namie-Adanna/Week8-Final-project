# API Documentation - Naly Cleaning Services

## 📋 Overview

The Naly Cleaning Services API is a RESTful API built with Node.js and Express.js. It provides endpoints for user authentication, service management, booking operations, and administrative functions.

**Base URL**: `https://your-api-domain.com/api`

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Tokens expire after 7 days by default
- Refresh tokens are not implemented (users must re-login)

## 📊 Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {} // Optional additional details
  }
}
```

## 🔑 Authentication Endpoints

### Register User
Creates a new user account.

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

**Validation Rules**:
- `firstName`: Required, 2-50 characters
- `lastName`: Required, 2-50 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters, must contain uppercase, lowercase, and number
- `phone`: Required, valid phone number format
- `address`: All fields required, zipCode must match format `12345` or `12345-6789`

### Login User
Authenticates a user and returns a JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Get User Profile
Retrieves the authenticated user's profile.

**Endpoint**: `GET /auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Profile retrieved successfully"
}
```

### Update User Profile
Updates the authenticated user's profile information.

**Endpoint**: `PUT /auth/profile`

**Headers**: `Authorization: Bearer <token>`

**Request Body** (partial update allowed):
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Newtown",
    "state": "NY",
    "zipCode": "54321"
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "+1987654321",
      "address": {
        "street": "456 Oak Ave",
        "city": "Newtown",
        "state": "NY",
        "zipCode": "54321"
      },
      "role": "user"
    }
  },
  "message": "Profile updated successfully"
}
```

## 🧹 Services Endpoints

### Get All Services
Retrieves all active services with optional filtering.

**Endpoint**: `GET /services`

**Query Parameters**:
- `category` (optional): Filter by category (`residential`, `commercial`, `deep-cleaning`, `maintenance`)
- `search` (optional): Search in name and description
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Example**: `GET /services?category=residential&page=1&limit=10`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "name": "Regular House Cleaning",
        "description": "Weekly, bi-weekly, or monthly cleaning to keep your home spotless.",
        "price": 80,
        "duration": 120,
        "category": "residential",
        "isActive": true,
        "features": [
          "Dusting all surfaces",
          "Vacuuming carpets and rugs",
          "Mopping hard floors",
          "Kitchen cleaning",
          "Bathroom sanitization",
          "Trash removal"
        ],
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Services retrieved successfully"
}
```

### Get Service by ID
Retrieves a specific service by its ID.

**Endpoint**: `GET /services/:id`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "name": "Regular House Cleaning",
      "description": "Weekly, bi-weekly, or monthly cleaning to keep your home spotless.",
      "price": 80,
      "duration": 120,
      "category": "residential",
      "isActive": true,
      "features": [
        "Dusting all surfaces",
        "Vacuuming carpets and rugs",
        "Mopping hard floors"
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Service retrieved successfully"
}
```

### Get Service Categories
Retrieves all available service categories.

**Endpoint**: `GET /services/categories`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": [
      "residential",
      "commercial",
      "deep-cleaning",
      "maintenance"
    ]
  },
  "message": "Service categories retrieved successfully"
}
```

### Create Service (Admin Only)
Creates a new service.

**Endpoint**: `POST /services`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "name": "Deep House Cleaning",
  "description": "Comprehensive cleaning service for move-ins, move-outs, or seasonal deep cleans.",
  "price": 150,
  "duration": 240,
  "category": "deep-cleaning",
  "features": [
    "Inside appliance cleaning",
    "Baseboards and window sills",
    "Light fixture cleaning"
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "service": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
      "name": "Deep House Cleaning",
      "description": "Comprehensive cleaning service for move-ins, move-outs, or seasonal deep cleans.",
      "price": 150,
      "duration": 240,
      "category": "deep-cleaning",
      "isActive": true,
      "features": [
        "Inside appliance cleaning",
        "Baseboards and window sills",
        "Light fixture cleaning"
      ],
      "createdAt": "2024-01-15T11:30:00.000Z",
      "updatedAt": "2024-01-15T11:30:00.000Z"
    }
  },
  "message": "Service created successfully"
}
```

### Update Service (Admin Only)
Updates an existing service.

**Endpoint**: `PUT /services/:id`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body** (partial update allowed):
```json
{
  "price": 160,
  "description": "Updated description"
}
```

### Delete Service (Admin Only)
Soft deletes a service (marks as inactive).

**Endpoint**: `DELETE /services/:id`

**Headers**: `Authorization: Bearer <admin_token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {},
  "message": "Service deleted successfully"
}
```

## 📅 Bookings Endpoints

### Get User Bookings
Retrieves bookings for the authenticated user.

**Endpoint**: `GET /bookings`

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `status` (optional): Filter by status (`pending`, `confirmed`, `completed`, `cancelled`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "userId": "64a7b8c9d1e2f3g4h5i6j7k7",
        "serviceId": {
          "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
          "name": "Regular House Cleaning",
          "description": "Weekly cleaning service",
          "price": 80,
          "duration": 120,
          "category": "residential"
        },
        "appointmentDate": "2024-02-15T00:00:00.000Z",
        "appointmentTime": "10:00",
        "status": "pending",
        "totalPrice": 80,
        "specialInstructions": "Please focus on kitchen",
        "address": {
          "street": "456 Oak Ave",
          "city": "Anytown",
          "state": "CA",
          "zipCode": "12345"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 15,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Bookings retrieved successfully"
}
```

### Create Booking
Creates a new booking for the authenticated user.

**Endpoint**: `POST /bookings`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "serviceId": "64a7b8c9d1e2f3g4h5i6j7k9",
  "appointmentDate": "2024-02-15",
  "appointmentTime": "10:00",
  "specialInstructions": "Please focus on kitchen",
  "address": {
    "street": "456 Oak Ave",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  }
}
```

**Validation Rules**:
- `serviceId`: Required, valid MongoDB ObjectId
- `appointmentDate`: Required, must be today or future date
- `appointmentTime`: Required, format HH:MM (24-hour)
- `address`: All fields required
- `specialInstructions`: Optional, max 500 characters

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "userId": "64a7b8c9d1e2f3g4h5i6j7k7",
      "serviceId": {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k9",
        "name": "Regular House Cleaning",
        "description": "Weekly cleaning service",
        "price": 80,
        "duration": 120,
        "category": "residential"
      },
      "appointmentDate": "2024-02-15T00:00:00.000Z",
      "appointmentTime": "10:00",
      "status": "pending",
      "totalPrice": 80,
      "specialInstructions": "Please focus on kitchen",
      "address": {
        "street": "456 Oak Ave",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Booking created successfully"
}
```

### Update Booking Status
Updates the status of a booking.

**Endpoint**: `PUT /bookings/:id`

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "confirmed",
  "cancellationReason": "Optional reason if cancelling"
}
```

**Valid Status Transitions**:
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `completed`, `cancelled`
- `completed` → (no changes allowed)
- `cancelled` → (no changes allowed)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "booking": {
      "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "status": "confirmed",
      // ... other booking fields
    }
  },
  "message": "Booking updated successfully"
}
```

### Cancel Booking
Cancels a booking (sets status to cancelled).

**Endpoint**: `DELETE /bookings/:id`

**Headers**: `Authorization: Bearer <token>`

**Request Body** (optional):
```json
{
  "cancellationReason": "Change of plans"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {},
  "message": "Booking cancelled successfully"
}
```

### Get All Bookings (Admin Only)
Retrieves all bookings with filtering options.

**Endpoint**: `GET /bookings/all`

**Headers**: `Authorization: Bearer <admin_token>`

**Query Parameters**:
- `status` (optional): Filter by status
- `userId` (optional): Filter by user ID
- `serviceId` (optional): Filter by service ID
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response**: Same format as user bookings but includes all users' bookings.

## 👑 Admin Endpoints

### Get Dashboard Statistics
Retrieves comprehensive dashboard statistics for admin users.

**Endpoint**: `GET /admin/dashboard`

**Headers**: `Authorization: Bearer <admin_token>`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 150,
      "totalServices": 6,
      "totalBookings": 89,
      "monthlyRevenue": 4500
    },
    "bookingStats": {
      "pending": 12,
      "confirmed": 8,
      "completed": 65,
      "cancelled": 4
    },
    "growth": {
      "bookings": {
        "current": 25,
        "previous": 20,
        "percentage": 25.0
      },
      "revenue": {
        "current": 4500,
        "previous": 3800,
        "percentage": 18.4
      }
    },
    "popularServices": [
      {
        "name": "Regular House Cleaning",
        "bookings": 45,
        "price": 80
      },
      {
        "name": "Deep Cleaning",
        "bookings": 23,
        "price": 150
      }
    ],
    "recentBookings": [
      {
        "_id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "userId": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "serviceId": {
          "name": "Regular House Cleaning",
          "price": 80
        },
        "appointmentDate": "2024-02-15T00:00:00.000Z",
        "status": "pending",
        "totalPrice": 80,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "message": "Dashboard statistics retrieved successfully"
}
```

### Get All Users (Admin Only)
Retrieves all users with filtering and pagination.

**Endpoint**: `GET /admin/users`

**Headers**: `Authorization: Bearer <admin_token>`

**Query Parameters**:
- `search` (optional): Search in name and email
- `role` (optional): Filter by role (`user`, `admin`)
- `isActive` (optional): Filter by active status (`true`, `false`)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "64a7b8c9d1e2f3g4h5i6j7k8",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "role": "user",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 150,
      "itemsPerPage": 30,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Users retrieved successfully"
}
```

### Update User Status (Admin Only)
Activates or deactivates a user account.

**Endpoint**: `PUT /admin/users/:id/status`

**Headers**: `Authorization: Bearer <admin_token>`

**Request Body**:
```json
{
  "isActive": false
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isActive": false
    }
  },
  "message": "User deactivated successfully"
}
```

## ❌ Error Codes

### Authentication Errors
- `NO_TOKEN`: No authorization token provided
- `INVALID_TOKEN`: Token is invalid or malformed
- `TOKEN_EXPIRED`: Token has expired
- `USER_EXISTS`: Email already registered
- `INVALID_CREDENTIALS`: Wrong email or password
- `ACCOUNT_DEACTIVATED`: User account is deactivated
- `ADMIN_REQUIRED`: Admin privileges required

### Validation Errors
- `VALIDATION_ERROR`: Request data validation failed
- `INVALID_DATE`: Invalid date format or past date
- `INVALID_STATUS_TRANSITION`: Cannot change from current status to requested status

### Resource Errors
- `USER_NOT_FOUND`: User does not exist
- `SERVICE_NOT_FOUND`: Service does not exist
- `SERVICE_NOT_AVAILABLE`: Service is inactive or unavailable
- `BOOKING_NOT_FOUND`: Booking does not exist
- `RESOURCE_NOT_FOUND`: Generic resource not found

### Authorization Errors
- `NOT_AUTHORIZED`: User not authorized for this action
- `CANNOT_CANCEL_COMPLETED`: Cannot cancel completed booking
- `ALREADY_CANCELLED`: Booking is already cancelled

### Server Errors
- `SERVER_ERROR`: Generic server error
- `AUTH_SERVER_ERROR`: Authentication server error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## 📊 HTTP Status Codes

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid request data)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Insufficient permissions)
- `404` - Not Found (Resource not found)
- `409` - Conflict (Resource already exists)
- `422` - Unprocessable Entity (Validation error)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Internal Server Error (Server error)

## 🔄 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Window**: 15 minutes
- **Max Requests**: 100 per IP address
- **Headers**: Rate limit info included in response headers
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining in current window
  - `X-RateLimit-Reset`: Time when rate limit resets

## 📝 Request/Response Examples

### Example: Complete Booking Flow

1. **Login**:
```bash
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"password123"}'
```

2. **Get Services**:
```bash
curl -X GET https://api.example.com/api/services \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Create Booking**:
```bash
curl -X POST https://api.example.com/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "serviceId": "64a7b8c9d1e2f3g4h5i6j7k9",
    "appointmentDate": "2024-02-15",
    "appointmentTime": "10:00",
    "address": {
      "street": "456 Oak Ave",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    }
  }'
```

4. **Get User Bookings**:
```bash
curl -X GET https://api.example.com/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🛠️ SDK and Tools

### Postman Collection
A Postman collection is available with all endpoints pre-configured. Import the collection and set up environment variables for easy testing.

### OpenAPI Specification
The API follows OpenAPI 3.0 specification. The complete spec file is available for generating client SDKs in various programming languages.

## 📞 Support

For API support and questions:
- **Email**: api-support@nalycleaning.com
- **Documentation**: Check this guide first
- **Issues**: Report bugs via GitHub issues
- **Updates**: API changes will be announced via email

---

This documentation is updated regularly. Last updated: January 2024