import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../server.js';
import Service from '../models/Service.js';
import User from '../models/User.js';

describe('Services Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/naly-cleaning-test';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await Service.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      password: 'Password123',
      phone: '+1234567890',
      role: 'admin',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'AC',
        zipCode: '12345'
      }
    });

    // Create regular user
    const user = await User.create({
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@test.com',
      password: 'Password123',
      phone: '+1234567891',
      role: 'user',
      address: {
        street: '456 User Ave',
        city: 'User City',
        state: 'UC',
        zipCode: '54321'
      }
    });

    // Get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Password123' });
    adminToken = adminLogin.body.data.token;

    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'Password123' });
    userToken = userLogin.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/services', () => {
    beforeEach(async () => {
      await Service.create([
        {
          name: 'House Cleaning',
          description: 'Regular house cleaning service',
          price: 80,
          duration: 120,
          category: 'residential',
          isActive: true
        },
        {
          name: 'Office Cleaning',
          description: 'Professional office cleaning',
          price: 120,
          duration: 180,
          category: 'commercial',
          isActive: true
        },
        {
          name: 'Inactive Service',
          description: 'This service is inactive',
          price: 50,
          duration: 60,
          category: 'residential',
          isActive: false
        }
      ]);
    });

    it('should get all active services', async () => {
      const response = await request(app)
        .get('/api/services')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(2);
      expect(response.body.data.services.every(s => s.isActive)).toBe(true);
    });

    it('should filter services by category', async () => {
      const response = await request(app)
        .get('/api/services?category=residential')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].category).toBe('residential');
    });

    it('should search services by name', async () => {
      const response = await request(app)
        .get('/api/services?search=house')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.services).toHaveLength(1);
      expect(response.body.data.services[0].name).toContain('House');
    });
  });

  describe('POST /api/services', () => {
    const validServiceData = {
      name: 'Deep Cleaning',
      description: 'Comprehensive deep cleaning service',
      price: 150,
      duration: 240,
      category: 'deep-cleaning'
    };

    it('should create service as admin', async () => {
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validServiceData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.name).toBe(validServiceData.name);
    });

    it('should not create service as regular user', async () => {
      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validServiceData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('ADMIN_REQUIRED');
    });

    it('should not create service without authentication', async () => {
      const response = await request(app)
        .post('/api/services')
        .send(validServiceData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create service with invalid data', async () => {
      const invalidData = { ...validServiceData, price: -10 };

      const response = await request(app)
        .post('/api/services')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/services/:id', () => {
    let serviceId;

    beforeEach(async () => {
      const service = await Service.create({
        name: 'Test Service',
        description: 'Test description',
        price: 100,
        duration: 120,
        category: 'residential'
      });
      serviceId = service._id;
    });

    it('should get service by valid ID', async () => {
      const response = await request(app)
        .get(`/api/services/${serviceId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.service.name).toBe('Test Service');
    });

    it('should return 404 for non-existent service', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/services/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('SERVICE_NOT_FOUND');
    });
  });
});