import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  categoryIdParamSchema,
  createCategorySchema,
  updateCategorySchema,
} from './category.validator';
import { categoryController } from './category.controller';

export const categoryRoutes = Router();

categoryRoutes.get('/', categoryController.getAll.bind(categoryController));

categoryRoutes.get(
  '/:id',
  validate(categoryIdParamSchema, 'params'),
  categoryController.getById.bind(categoryController),
);

categoryRoutes.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(createCategorySchema),
  categoryController.create.bind(categoryController),
);

categoryRoutes.put(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(categoryIdParamSchema, 'params'),
  validate(updateCategorySchema),
  categoryController.update.bind(categoryController),
);

categoryRoutes.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(categoryIdParamSchema, 'params'),
  categoryController.delete.bind(categoryController),
);
