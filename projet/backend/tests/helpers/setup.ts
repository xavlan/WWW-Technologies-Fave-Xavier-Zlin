/// <reference types="@types/jest" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-min-32-chars';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {});
