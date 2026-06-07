import { Router } from 'express';
import { authenticate, optionalAuthenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  componentIdParamSchema,
  componentQuerySchema,
  createComponentSchema,
  updateComponentSchema,
} from './component.validator';
import { componentController } from './component.controller';

export const componentRoutes = Router();

componentRoutes.get(
  '/',
  optionalAuthenticate,
  validate(componentQuerySchema, 'query'),
  componentController.getAll.bind(componentController),
);

componentRoutes.get(
  '/:id',
  optionalAuthenticate,
  validate(componentIdParamSchema, 'params'),
  componentController.getById.bind(componentController),
);

componentRoutes.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(createComponentSchema),
  componentController.create.bind(componentController),
);

componentRoutes.put(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(componentIdParamSchema, 'params'),
  validate(updateComponentSchema),
  componentController.update.bind(componentController),
);

componentRoutes.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'SUPERADMIN'),
  validate(componentIdParamSchema, 'params'),
  componentController.delete.bind(componentController),
);
