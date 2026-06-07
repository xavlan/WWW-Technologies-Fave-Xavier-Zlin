import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import type { UserRole } from '../types';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);

  if (typeof decoded === 'string' || !decoded.sub || !decoded.email || !decoded.role) {
    throw new Error('Invalid token payload');
  }

  return {
    sub: decoded.sub,
    email: decoded.email as string,
    role: decoded.role as UserRole,
  };
}
