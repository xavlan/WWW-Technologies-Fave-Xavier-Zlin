import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { UnauthorizedError } from '../../utils/errors';
import { signToken, verifyToken as verifyJwtToken, JwtPayload } from '../../utils/jwt';
import type { SanitizedUser } from '../../types';
import type { LoginInput } from './auth.validator';

const BCRYPT_ROUNDS = 12;

function sanitizeUser(user: {
  id: string;
  email: string;
  name: string;
  role: SanitizedUser['role'];
  createdAt: Date;
}): SanitizedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  async login(input: LoginInput): Promise<{ token: string; user: SanitizedUser }> {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: sanitizeUser(user),
    };
  }

  verifyToken(token: string): JwtPayload {
    return verifyJwtToken(token);
  }

  async getMe(userId: string): Promise<SanitizedUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedError('User not found', 'UNAUTHORIZED');
    }

    return sanitizeUser(user);
  }

  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }
}

export const authService = new AuthService();
