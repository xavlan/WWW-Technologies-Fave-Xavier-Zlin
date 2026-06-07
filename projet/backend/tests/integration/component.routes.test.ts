/// <reference types="@types/jest" />
import request from 'supertest';
import { createApp } from '../../src/app';
import { ComponentService } from '../../src/modules/components/component.service';
import { NotFoundError, ConflictError } from '../../src/utils/errors';

// Mock the service
jest.mock('../../src/modules/components/component.service');

const mockComponentService = ComponentService as jest.MockedClass<typeof ComponentService>;

describe('Component Routes Integration Tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: any;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/components', () => {
    it('should return 200 with paginated components', async () => {
      const mockComponents = [
        { id: '1', name: 'Component 1' },
        { id: '2', name: 'Component 2' },
      ] as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      mockComponentService.prototype.getAll.mockResolvedValue({
        data: mockComponents,
        meta: { page: 1, limit: 12, total: 20, totalPages: 2 },
      });

      const response = await request(app)
        .get('/api/v1/components')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockComponents,
        meta: { page: 1, limit: 12, total: 20, totalPages: 2 },
      });
    });

    it('should apply search filter from query params', async () => {
      mockComponentService.prototype.getAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
      });

      await request(app)
        .get('/api/v1/components?search=GPU')
        .expect(200);

      expect(mockComponentService.prototype.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'GPU' }),
        expect.any(Object),
      );
    });

    it('should apply category filter from query params', async () => {
      mockComponentService.prototype.getAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
      });

      await request(app)
        .get('/api/v1/components?category=cpu')
        .expect(200);

      expect(mockComponentService.prototype.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'cpu' }),
        expect.any(Object),
      );
    });

    it('should apply pagination from query params', async () => {
      mockComponentService.prototype.getAll.mockResolvedValue({
        data: [],
        meta: { page: 2, limit: 24, total: 0, totalPages: 0 },
      });

      await request(app)
        .get('/api/v1/components?page=2&limit=24')
        .expect(200);

      expect(mockComponentService.prototype.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 24 }),
        expect.any(Object),
      );
    });

    it('should apply sort from query params', async () => {
      mockComponentService.prototype.getAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 12, total: 0, totalPages: 0 },
      });

      await request(app)
        .get('/api/v1/components?sortBy=price&order=asc')
        .expect(200);

      expect(mockComponentService.prototype.getAll).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy: 'price', order: 'asc' }),
        expect.any(Object),
      );
    });
  });

  describe('GET /api/v1/components/:id', () => {
    it('should return 200 with component details', async () => {
      const mockComponent = {
        id: '1',
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        price: 599.99,
      } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      mockComponentService.prototype.getById.mockResolvedValue(mockComponent);

      const response = await request(app)
        .get('/api/v1/components/1')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockComponent,
      });
    });

    it('should return 404 when component not found', async () => {
      mockComponentService.prototype.getById.mockRejectedValue(
        new NotFoundError('Component not found'),
      );

      const response = await request(app)
        .get('/api/v1/components/nonexistent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('POST /api/v1/components', () => {
    it('should return 201 when authenticated admin creates component', async () => {
      const newComponent = {
        id: '1',
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
      } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      mockComponentService.prototype.create.mockResolvedValue(newComponent);

      const response = await request(app)
        .post('/api/v1/components')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({
          name: 'Intel Core i9-13900K',
          brand: 'Intel',
          model: 'i9-13900K',
          description: 'High-performance processor',
          price: 599.99,
          stock: 50,
          sku: 'CPU-INTEL-13900K',
          categoryId: 'cat-1',
          specifications: {},
        })
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: newComponent,
      });
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .post('/api/v1/components')
        .send({
          name: 'Intel Core i9-13900K',
          brand: 'Intel',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 with invalid body', async () => {
      const response = await request(app)
        .post('/api/v1/components')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({
          name: 'A',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('should return 409 with duplicate SKU', async () => {
      mockComponentService.prototype.create.mockRejectedValue(
        new ConflictError('SKU already exists', 'SKU_CONFLICT'),
      );

      const response = await request(app)
        .post('/api/v1/components')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({
          name: 'Intel Core i9-13900K',
          brand: 'Intel',
          model: 'i9-13900K',
          description: 'High-performance processor',
          price: 599.99,
          stock: 50,
          sku: 'EXISTING-SKU',
          categoryId: 'cat-1',
          specifications: {},
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'SKU_CONFLICT');
    });
  });

  describe('PUT /api/v1/components/:id', () => {
    it('should return 200 when authenticated admin updates component', async () => {
      const updatedComponent = {
        id: '1',
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        price: 549.99,
      } as any; // eslint-disable-line @typescript-eslint/no-explicit-any

      mockComponentService.prototype.update.mockResolvedValue(updatedComponent);

      const response = await request(app)
        .put('/api/v1/components/1')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({
          price: 549.99,
        })
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: updatedComponent,
      });
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .put('/api/v1/components/1')
        .send({ price: 549.99 })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 when component not found', async () => {
      mockComponentService.prototype.update.mockRejectedValue(
        new NotFoundError('Component not found'),
      );

      const response = await request(app)
        .put('/api/v1/components/nonexistent')
        .set('Authorization', 'Bearer valid-admin-token')
        .send({ price: 549.99 })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/components/:id', () => {
    it('should return 200 when authenticated admin deletes component', async () => {
      mockComponentService.prototype.delete.mockResolvedValue({
        message: 'Component deleted successfully',
      });

      const response = await request(app)
        .delete('/api/v1/components/1')
        .set('Authorization', 'Bearer valid-admin-token')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: { message: 'Component deleted successfully' },
      });
    });

    it('should return 401 when unauthenticated', async () => {
      const response = await request(app)
        .delete('/api/v1/components/1')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 when component not found', async () => {
      mockComponentService.prototype.delete.mockRejectedValue(
        new NotFoundError('Component not found'),
      );

      const response = await request(app)
        .delete('/api/v1/components/nonexistent')
        .set('Authorization', 'Bearer valid-admin-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});
