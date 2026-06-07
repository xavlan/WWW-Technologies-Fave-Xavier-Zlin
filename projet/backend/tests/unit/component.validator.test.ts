/// <reference types="@types/jest" />
import {
  createComponentSchema,
  updateComponentSchema,
  componentQuerySchema,
} from '../../src/modules/components/component.validator';

describe('Component Validators', () => {
  describe('createComponentSchema', () => {
    it('should validate valid component data', () => {
      const validData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        imageUrl: 'https://example.com/image.jpg',
        specifications: {
          cores: 24,
          threads: 32,
          baseClock: '3.0 GHz',
          boostClock: '5.8 GHz',
        },
        categoryId: 'category-123',
      };

      const result = createComponentSchema.parse(validData);

      expect(result).toEqual(validData);
    });

    it('should accept data without imageUrl', () => {
      const validData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: { cores: 24 },
        categoryId: 'category-123',
      };

      const result = createComponentSchema.parse(validData);

      expect(result.imageUrl).toBeUndefined();
    });

    it('should reject name shorter than 2 characters', () => {
      const invalidData = {
        name: 'A',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty brand', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: '',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty model', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: '',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject zero or negative price', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 0,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject negative stock', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: -5,
        sku: 'CPU-INTEL-13900K',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid SKU format', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'invalid-sku!',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject SKU with lowercase letters', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'cpu-intel-13900k',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should reject invalid image URL', () => {
      const invalidData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        imageUrl: 'not-a-url',
        specifications: {},
        categoryId: 'category-123',
      };

      expect(() => createComponentSchema.parse(invalidData)).toThrow();
    });

    it('should accept valid specifications with various types', () => {
      const validData = {
        name: 'Intel Core i9-13900K',
        brand: 'Intel',
        model: 'i9-13900K',
        description: 'High-performance desktop processor',
        price: 599.99,
        stock: 50,
        sku: 'CPU-INTEL-13900K',
        specifications: {
          cores: 24,
          threads: 32,
          hasIntegratedGraphics: true,
          socket: 'LGA 1700',
        },
        categoryId: 'category-123',
      };

      const result = createComponentSchema.parse(validData);

      expect(result.specifications).toEqual(validData.specifications);
    });
  });

  describe('updateComponentSchema', () => {
    it('should accept partial updates with single field', () => {
      const partialData = {
        price: 549.99,
      };

      const result = updateComponentSchema.parse(partialData);

      expect(result).toEqual(partialData);
    });

    it('should accept partial updates with multiple fields', () => {
      const partialData = {
        price: 549.99,
        stock: 45,
      };

      const result = updateComponentSchema.parse(partialData);

      expect(result).toEqual(partialData);
    });

    it('should accept empty object', () => {
      const result = updateComponentSchema.parse({});

      expect(result).toEqual({});
    });

    it('should still validate field types when provided', () => {
      const invalidData = {
        price: -10,
      };

      expect(() => updateComponentSchema.parse(invalidData)).toThrow();
    });
  });

  describe('componentQuerySchema', () => {
    it('should accept empty query with defaults', () => {
      const result = componentQuerySchema.parse({});

      expect(result).toEqual({
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
        limit: 12,
      });
    });

    it('should accept search parameter', () => {
      const result = componentQuerySchema.parse({ search: 'GPU' });

      expect(result.search).toBe('GPU');
    });

    it('should accept category parameter', () => {
      const result = componentQuerySchema.parse({ category: 'gpu' });

      expect(result.category).toBe('gpu');
    });

    it('should accept price range parameters', () => {
      const result = componentQuerySchema.parse({ minPrice: 100, maxPrice: 1000 });

      expect(result.minPrice).toBe(100);
      expect(result.maxPrice).toBe(1000);
    });

    it('should transform inStock string to boolean', () => {
      const result = componentQuerySchema.parse({ inStock: 'true' });

      expect(result.inStock).toBe(true);
    });

    it('should transform inStock false string to boolean', () => {
      const result = componentQuerySchema.parse({ inStock: 'false' });

      expect(result.inStock).toBe(false);
    });

    it('should accept valid sortBy values', () => {
      const result1 = componentQuerySchema.parse({ sortBy: 'price' });
      const result2 = componentQuerySchema.parse({ sortBy: 'name' });
      const result3 = componentQuerySchema.parse({ sortBy: 'createdAt' });

      expect(result1.sortBy).toBe('price');
      expect(result2.sortBy).toBe('name');
      expect(result3.sortBy).toBe('createdAt');
    });

    it('should accept valid order values', () => {
      const result1 = componentQuerySchema.parse({ order: 'asc' });
      const result2 = componentQuerySchema.parse({ order: 'desc' });

      expect(result1.order).toBe('asc');
      expect(result2.order).toBe('desc');
    });

    it('should accept pagination parameters', () => {
      const result = componentQuerySchema.parse({ page: 2, limit: 24 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(24);
    });

    it('should enforce maximum limit of 100', () => {
      const result = componentQuerySchema.parse({ limit: 200 });

      expect(result.limit).toBe(100);
    });

    it('should coerce string numbers to integers', () => {
      const result = componentQuerySchema.parse({ page: '2', limit: '24' });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(24);
    });

    it('should accept all parameters together', () => {
      const result = componentQuerySchema.parse({
        search: 'GPU',
        category: 'gpu',
        minPrice: 100,
        maxPrice: 1000,
        inStock: 'true',
        sortBy: 'price',
        order: 'asc',
        page: 2,
        limit: 24,
      });

      expect(result).toEqual({
        search: 'GPU',
        category: 'gpu',
        minPrice: 100,
        maxPrice: 1000,
        inStock: true,
        sortBy: 'price',
        order: 'asc',
        page: 2,
        limit: 24,
      });
    });
  });
});
