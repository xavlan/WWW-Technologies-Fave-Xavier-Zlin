import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { componentRoutes } from '../modules/components/component.routes';
import { categoryRoutes } from '../modules/categories/category.routes';
import { adminRoutes } from '../modules/admin/admin.routes';

export const apiRouter = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'TechInventory API v1',
      version: '1.0.0',
    },
  });
});

apiRouter.use('/auth', authRoutes);
apiRouter.use('/components', componentRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/admin', adminRoutes);
