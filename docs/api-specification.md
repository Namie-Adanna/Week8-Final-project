# Naly Cleaning Services - API Specification

## 🔗 Base URL
- Development: `http://localhost:5000/api`
- Production: `https://naly-cleaning-api.onrender.com/api`

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 📋 Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
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
    "details": {}
  }
}
```

## 🔑 Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zipCode": "12345"
  }
}
```

### Login User
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

### Update User Profile
- **PUT** `/auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (partial user object)

## 🧹 Services Endpoints

### Get All Services
- **GET** `/services`
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `active` (optional): Filter by active status

### Get Service by ID
- **GET** `/services/:id`

### Create Service (Admin Only)
- **POST** `/services`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
```json
{
  "name": "Deep House Cleaning",
  "description": "Comprehensive cleaning service",
  "price": 150,
  "duration": 180,
  "category": "residential"
}
```

### Update Service (Admin Only)
- **PUT** `/services/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

### Delete Service (Admin Only)
- **DELETE** `/services/:id`
- **Headers:** `Authorization: Bearer <admin_token>`

## 📅 Bookings Endpoints

### Get User Bookings
- **GET** `/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `status` (optional): Filter by booking status
  - `page` (optional): Pagination page number
  - `limit` (optional): Items per page

### Get All Bookings (Admin Only)
- **GET** `/bookings/all`
- **Headers:** `Authorization: Bearer <admin_token>`

### Create Booking
- **POST** `/bookings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "serviceId": "64a7b8c9d1e2f3g4h5i6j7k8",
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

### Update Booking Status
- **PUT** `/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "status": "confirmed"
}
```

### Cancel Booking
- **DELETE** `/bookings/:id`
- **Headers:** `Authorization: Bearer <token>`

## 👑 Admin Endpoints

### Get Dashboard Stats
- **GET** `/admin/dashboard`
- **Headers:** `Authorization: Bearer <admin_token>`

### Get All Users
- **GET** `/admin/users`
- **Headers:** `Authorization: Bearer <admin_token>`

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

## 🔄 Booking Status Values

- `pending` - Booking created, awaiting confirmation
- `confirmed` - Booking confirmed by admin
- `completed` - Service completed
- `cancelled` - Booking cancelled

## 🏷️ Service Categories

- `residential` - Home cleaning services
- `commercial` - Office/business cleaning
- `deep-cleaning` - Intensive cleaning services
- `maintenance` - Regular maintenance cleaning

## 📝 Validation Rules

### User Registration
- Email: Valid email format, unique
- Password: Minimum 6 characters
- Phone: Valid phone number format
- All address fields required

### Service Creation
- Name: Required, 3-100 characters
- Price: Required, positive number
- Duration: Required, positive integer (minutes)

### Booking Creation
- Service ID: Valid MongoDB ObjectId
- Appointment Date: Future date
- Appointment Time: Valid time format (HH:MM)
- Address: All fields required