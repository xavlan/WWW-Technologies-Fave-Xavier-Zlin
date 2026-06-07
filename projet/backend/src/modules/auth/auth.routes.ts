import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { loginRateLimiter } from '../../middleware/loginRateLimiter.middleware';
import { loginSchema } from './auth.validator';
import { authController } from './auth.controller';

export const authRoutes = Router();

authRoutes.post(
  '/login',
  loginRateLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
);

authRoutes.post('/logout', authController.logout.bind(authController));

authRoutes.get('/me', authenticate, authController.me.bind(authController));
