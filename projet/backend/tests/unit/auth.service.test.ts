/// <reference types="@types/jest" />
import { AuthService } from '../../src/modules/auth/auth.service';
import { UnauthorizedError } from '../../src/utils/errors';
import type { UserRole } from '../../src/types';

// Mock dependencies
jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock('../../src/utils/jwt', () => ({
  signToken: jest.fn(() => 'mock-jwt-token'),
  verifyToken: jest.fn(),
}));

import { prisma } from '../../src/config/database';
import bcrypt from 'bcrypt';
import { signToken, verifyToken } from '../../src/utils/jwt';

const mockPrisma = prisma as any; // eslint-disable-line @typescript-eslint/no-explicit-any
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockSignToken = signToken as jest.MockedFunction<typeof signToken>;
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return token and user on successful login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockSignToken.mockReturnValue('mock-jwt-token');

      const result = await authService.login({
        email: 'admin@test.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('admin@test.com');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@test.com' },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
    });

    it('should throw UnauthorizedError when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        authService.login({
          email: 'nonexistent@test.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError when password is incorrect', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        authService.login({
          email: 'admin@test.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        authService.login({
          email: 'admin@test.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should convert email to lowercase before lookup', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);

      await authService.login({
        email: 'ADMIN@TEST.COM',
        password: 'password123',
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'admin@test.com' },
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const mockPayload = {
        sub: 'user-123',
        email: 'admin@test.com',
        role: 'ADMIN' as UserRole,
      };

      mockVerifyToken.mockReturnValue(mockPayload);

      const result = authService.verifyToken('valid-token');

      expect(result).toEqual(mockPayload);
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error for invalid token', () => {
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken('invalid-token')).toThrow();
    });
  });

  describe('getMe', () => {
    it('should return sanitized user by ID', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        passwordHash: 'hashed-password',
        name: 'Admin User',
        role: 'ADMIN',
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authService.getMe('user-123');

      expect(result).toHaveProperty('id', 'user-123');
      expect(result).toHaveProperty('email', 'admin@test.com');
      expect(result).toHaveProperty('name', 'Admin User');
      expect(result).toHaveProperty('role', 'ADMIN');
      expect(result).not.toHaveProperty('passwordHash');
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
    });

    it('should throw UnauthorizedError when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(authService.getMe('nonexistent-id')).rejects.toThrow(
        UnauthorizedError,
      );

      await expect(authService.getMe('nonexistent-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const mockHashedPassword = 'hashed-password-123';
      mockBcrypt.hash.mockResolvedValue(mockHashedPassword as never);

      const result = await AuthService.hashPassword('plain-password');

      expect(result).toBe(mockHashedPassword);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('plain-password', 12);
    });
  });
});
