/// <reference types="@types/jest" />
import { ComponentService } from '../../src/modules/components/component.service';
import { ConflictError } from '../../src/utils/errors';

// Mock dependencies
jest.mock('../../src/modules/components/component.repository');
jest.mock('../../src/utils/pagination');
jest.mock('../../src/utils/serialize');
jest.mock('../../src/config/database', () => ({
  prisma: {
    category: {
      findUnique: jest.fn().mockResolvedValue({ id: 'cat-1' }),
    },
  },
}));

import { componentRepository } from '../../src/modules/components/component.repository';
import { buildPaginationMeta, parsePagination } from '../../src/utils/pagination';
import { serializeComponent, serializeComponents } from '../../src/utils/serialize';

const mockRepository = componentRepository as any; // eslint-disable-line @typescript-eslint/no-explicit-any
const mockBuildPaginationMeta = buildPaginationMeta as jest.MockedFunction<typeof buildPaginationMeta>;
const mockParsePagination = parsePagination as jest.MockedFunction<typeof parsePagination>;
const mockSerializeComponent = serializeComponent as jest.MockedFunction<typeof serializeComponent>;
const mockSerializeComponents = serializeComponents as jest.MockedFunction<typeof serializeComponents>

describe('ComponentService', () => {
  let componentService: ComponentService;

  beforeEach(() => {
    componentService = new ComponentService();
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return paginated components with default pagination', async () => {
      const mockItems = [
        { id: '1', name: 'Component 1' },
        { id: '2', name: 'Component 2' },
      ];
      const mockTotal = 20;

      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: mockItems, total: mockTotal });
      mockSerializeComponents.mockReturnValue(mockItems as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 20, totalPages: 2 });

      const result = await componentService.getAll({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      });

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(mockParsePagination).toHaveBeenCalledWith(1, 12);
      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ includeInactive: false }),
        { page: 1, limit: 12 },
        expect.any(Object),
      );
    });

    it('should apply search filter', async () => {
      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: [], total: 0 });
      mockSerializeComponents.mockReturnValue([]);
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 0 });

      await componentService.getAll({
        search: 'GPU',
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'GPU' }),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should apply category filter', async () => {
      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: [], total: 0 });
      mockSerializeComponents.mockReturnValue([]);
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 0 });

      await componentService.getAll({
        category: 'cpu',
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'cpu' }),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should apply price range filter', async () => {
      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: [], total: 0 });
      mockSerializeComponents.mockReturnValue([]);
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 0 });

      await componentService.getAll({
        minPrice: 100,
        maxPrice: 500,
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ minPrice: 100, maxPrice: 500 }),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should apply inStock filter', async () => {
      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: [], total: 0 });
      mockSerializeComponents.mockReturnValue([]);
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 0 });

      await componentService.getAll({
        inStock: true,
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
      });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ inStock: true }),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should include inactive components for admin', async () => {
      mockParsePagination.mockReturnValue({ page: 1, limit: 12 });
      mockRepository.findAll.mockResolvedValue({ items: [], total: 0 });
      mockSerializeComponents.mockReturnValue([]);
      mockBuildPaginationMeta.mockReturnValue({ page: 1, limit: 12, total: 0, totalPages: 0 });

      await componentService.getAll(
        {
          page: 1,
          limit: 12,
          sortBy: 'createdAt',
          order: 'desc',
        },
        { isAdmin: true },
      );

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ includeInactive: true }),
        expect.any(Object),
        expect.any(Object),
      );
    });
  });

  describe('getById', () => {
    it('should return component by ID', async () => {
      const mockComponent = { id: '1', name: 'Component 1' };
      mockRepository.findById.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await componentService.getById('1');

      expect(result).toEqual(mockComponent);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should call findByIdAdmin for admin requests', async () => {
      const mockComponent = { id: '1', name: 'Component 1' };
      mockRepository.findByIdAdmin.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await componentService.getById('1', { isAdmin: true });

      expect(mockRepository.findByIdAdmin).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create component with valid data', async () => {
      const mockData = {
        name: 'New Component',
        brand: 'Brand',
        model: 'Model',
        description: 'Description',
        price: 100,
        stock: 10,
        sku: 'SKU-123',
        categoryId: 'cat-1',
        imageUrl: null,
        specifications: {},
      };
      const mockComponent = { id: '1', ...mockData };

      mockRepository.checkSkuExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await componentService.create(mockData);

      expect(result).toEqual(mockComponent);
      expect(mockRepository.checkSkuExists).toHaveBeenCalledWith('SKU-123');
      expect(mockRepository.create).toHaveBeenCalledWith(mockData);
    });

    it('should throw ConflictError if SKU already exists', async () => {
      const mockData = {
        name: 'New Component',
        brand: 'Brand',
        model: 'Model',
        description: 'Description',
        price: 100,
        stock: 10,
        sku: 'EXISTING-SKU',
        categoryId: 'cat-1',
        imageUrl: null,
        specifications: {},
      };

      mockRepository.checkSkuExists.mockResolvedValue(true);

      await expect(componentService.create(mockData)).rejects.toThrow(ConflictError);
      await expect(componentService.create(mockData)).rejects.toThrow('SKU already exists');
    });
  });

  describe('update', () => {
    it('should update component with valid data', async () => {
      const mockUpdateData = { price: 150 };
      const mockComponent = { id: '1', name: 'Component', price: 150 };

      mockRepository.checkSkuExists.mockResolvedValue(false);
      mockRepository.update.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const result = await componentService.update('1', mockUpdateData);

      expect(result).toEqual(mockComponent);
      expect(mockRepository.update).toHaveBeenCalledWith('1', mockUpdateData);
    });

    it('should check SKU uniqueness when SKU is being updated', async () => {
      const mockUpdateData = { sku: 'NEW-SKU' };
      const mockComponent = { id: '1', name: 'Component', sku: 'NEW-SKU' };

      mockRepository.checkSkuExists.mockResolvedValue(false);
      mockRepository.update.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await componentService.update('1', mockUpdateData);

      expect(mockRepository.checkSkuExists).toHaveBeenCalledWith('NEW-SKU', '1');
    });

    it('should not check SKU when SKU is not being updated', async () => {
      const mockUpdateData = { price: 150 };
      const mockComponent = { id: '1', name: 'Component', price: 150 };

      mockRepository.update.mockResolvedValue(mockComponent);
      mockSerializeComponent.mockReturnValue(mockComponent as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      await componentService.update('1', mockUpdateData);

      expect(mockRepository.checkSkuExists).not.toHaveBeenCalled();
    });

    it('should throw ConflictError if SKU conflicts with another component', async () => {
      const mockUpdateData = { sku: 'EXISTING-SKU' };

      mockRepository.checkSkuExists.mockResolvedValue(true);

      await expect(componentService.update('1', mockUpdateData)).rejects.toThrow(ConflictError);
      await expect(componentService.update('1', mockUpdateData)).rejects.toThrow('SKU already exists');
    });
  });

  describe('delete', () => {
    it('should soft delete component', async () => {
      const mockComponent = { id: '1', name: 'Component', isActive: false };

      mockRepository.delete.mockResolvedValue(mockComponent);

      const result = await componentService.delete('1');

      expect(result).toEqual({ message: 'Component deleted successfully' });
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
