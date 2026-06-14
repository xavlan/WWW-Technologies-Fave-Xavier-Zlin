import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});
