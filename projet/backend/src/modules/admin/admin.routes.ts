import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { adminController } from './admin.controller';

export const adminRoutes = Router();

adminRoutes.get(
  '/stats',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  adminController.getStats.bind(adminController),
);
