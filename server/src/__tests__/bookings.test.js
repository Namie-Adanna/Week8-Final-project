import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

describe('Bookings Endpoints', () => {
  let userToken;
  let adminToken;
  let userId;
  let serviceId;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/naly-cleaning-test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await Booking.deleteMany({});
    await Service.deleteMany({});
    await User.deleteMany({});

    // Create test user
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123',
      phone: '+1234567890',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TC',
        zipCode: '12345'
      }
    });
    userId = user._id;

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'Password123',
      phone: '+1234567891',
      role: 'admin',
      address: {
        street: '456 Admin St',
        city: 'Admin City',
        state: 'AC',
        zipCode: '54321'
      }
    });

    // Create test service
    const service = await Service.create({
      name: 'Test Cleaning',
      description: 'Test cleaning service',
      price: 100,
      duration: 120,
      category: 'residential'
    });
    serviceId = service._id;

    // Get tokens
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Password123' });
    userToken = userLogin.body.data.token;

    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123' });
    adminToken = adminLogin.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/bookings', () => {
    const validBookingData = {
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      appointmentTime: '10:00',
      address: {
        street: '789 Service St',
        city: 'Service City',
        state: 'SC',
        zipCode: '67890'
      },
      specialInstructions: 'Please focus on kitchen'
    };

    it('should create booking with valid data', async () => {
      const bookingData = {
        ...validBookingData,
        serviceId: serviceId.toString()
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.serviceId._id).toBe(serviceId.toString());
      expect(response.body.data.booking.status).toBe('pending');
    });

    it('should not create booking without authentication', async () => {
      const bookingData = {
        ...validBookingData,
        serviceId: serviceId.toString()
      };

      const response = await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create booking with past date', async () => {
      const bookingData = {
        ...validBookingData,
        serviceId: serviceId.toString(),
        appointmentDate: '2020-01-01'
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not create booking with non-existent service', async () => {
      const fakeServiceId = new mongoose.Types.ObjectId();
      const bookingData = {
        ...validBookingData,
        serviceId: fakeServiceId.toString()
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send(bookingData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('SERVICE_NOT_AVAILABLE');
    });
  });

  describe('GET /api/bookings', () => {
    beforeEach(async () => {
      await Booking.create([
        {
          userId,
          serviceId,
          appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          appointmentTime: '10:00',
          totalPrice: 100,
          status: 'pending',
          address: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TC',
            zipCode: '12345'
          }
        },
        {
          userId,
          serviceId,
          appointmentDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
          appointmentTime: '14:00',
          totalPrice: 100,
          status: 'confirmed',
          address: {
            street: '456 Test Ave',
            city: 'Test City',
            state: 'TC',
            zipCode: '12345'
          }
        }
      ]);
    });

    it('should get user bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(2);
    });

    it('should filter bookings by status', async () => {
      const response = await request(app)
        .get('/api/bookings?status=pending')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookings).toHaveLength(1);
      expect(response.body.data.bookings[0].status).toBe('pending');
    });

    it('should not get bookings without authentication', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/bookings/:id', () => {
    let bookingId;

    beforeEach(async () => {
      const booking = await Booking.create({
        userId,
        serviceId,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        appointmentTime: '10:00',
        totalPrice: 100,
        status: 'pending',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TC',
          zipCode: '12345'
        }
      });
      bookingId = booking._id;
    });

    it('should update booking status as owner', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'cancelled' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('cancelled');
    });

    it('should update booking status as admin', async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.status).toBe('confirmed');
    });

    it('should not update booking with invalid status transition', async () => {
      // First set to completed
      await Booking.findByIdAndUpdate(bookingId, { status: 'completed' });

      const response = await request(app)
        .put(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'pending' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('INVALID_STATUS_TRANSITION');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    let bookingId;

    beforeEach(async () => {
      const booking = await Booking.create({
        userId,
        serviceId,
        appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        appointmentTime: '10:00',
        totalPrice: 100,
        status: 'pending',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TC',
          zipCode: '12345'
        }
      });
      bookingId = booking._id;
    });

    it('should cancel booking as owner', async () => {
      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ cancellationReason: 'Change of plans' })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify booking is cancelled
      const booking = await Booking.findById(bookingId);
      expect(booking.status).toBe('cancelled');
    });

    it('should not cancel completed booking', async () => {
      await Booking.findByIdAndUpdate(bookingId, { status: 'completed' });

      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('CANNOT_CANCEL_COMPLETED');
    });
  });
});