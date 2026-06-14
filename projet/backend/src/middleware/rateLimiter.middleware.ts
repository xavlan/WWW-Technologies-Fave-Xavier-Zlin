import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

const isDevelopment = env.NODE_ENV === 'development';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: isDevelopment ? 10_000 : env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDevelopment,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
});
