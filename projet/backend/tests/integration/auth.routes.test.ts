/// <reference types="@types/jest" />
import request from 'supertest';
import { createApp } from '../../src/app';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UnauthorizedError } from '../../src/utils/errors';
import { getAdminAuthHeader } from '../helpers/auth';
import type { UserRole } from '../../src/types';

// Mock the database and services
jest.mock('../../src/config/database');
jest.mock('../../src/modules/auth/auth.service');

const mockAuthService = AuthService as jest.MockedClass<typeof AuthService>;

describe('Auth Routes Integration Tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: any;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 200 and token with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN' as UserRole,
        createdAt: new Date(),
      };

      mockAuthService.prototype.login.mockResolvedValue({
        token: 'mock-jwt-token',
        user: mockUser,
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBe('mock-jwt-token');
      expect(response.body.data.user).toMatchObject({
        id: 'user-123',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN',
      });
    });

    it('should return 401 with wrong password', async () => {
      mockAuthService.prototype.login.mockRejectedValue(
        new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS'),
      );

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      });
    });

    it('should return 401 with non-existent user', async () => {
      mockAuthService.prototype.login.mockRejectedValue(
        new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS'),
      );

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 with missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return 400 with missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@test.com',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 200 with success message', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          message: 'Logged out successfully',
        },
      });
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 200 with user data when authenticated', async () => {
      const mockUser = {
        id: 'test-admin-id',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN' as UserRole,
        createdAt: new Date(),
      };

      mockAuthService.prototype.getMe.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set(getAdminAuthHeader())
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        id: 'test-admin-id',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN',
      });
    });

    it('should return 401 when no token provided', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'UNAUTHORIZED');
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 when token is expired', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer expired-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
