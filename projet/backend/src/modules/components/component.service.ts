import { prisma } from '../../config/database';
import { ConflictError, ValidationError } from '../../utils/errors';
import { buildPaginationMeta, parsePagination } from '../../utils/pagination';
import { serializeComponent, serializeComponents } from '../../utils/serialize';
import { componentRepository } from './component.repository';
import type {
  ComponentQueryInput,
  CreateComponentInput,
  UpdateComponentInput,
} from './component.validator';

export class ComponentService {
  constructor(private readonly repository = componentRepository) {}

  async getAll(query: ComponentQueryInput) {
    const { page, limit } = parsePagination(query.page, query.limit);

    const { items, total } = await this.repository.findAll(
      {
        search: query.search,
        category: query.category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        inStock: query.inStock,
        includeInactive: false,
      },
      { page, limit },
      { sortBy: query.sortBy, order: query.order },
    );

    return {
      data: serializeComponents(items),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async getById(id: string, options: { isAdmin?: boolean } = {}) {
    const component = options.isAdmin
      ? await this.repository.findByIdAdmin(id)
      : await this.repository.findById(id);

    return serializeComponent(component);
  }

  async create(data: CreateComponentInput) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new ValidationError('Invalid category selected', {
        field: 'categoryId',
        message: 'Category does not exist',
      });
    }

    const skuExists = await this.repository.checkSkuExists(data.sku);

    if (skuExists) {
      throw new ConflictError('SKU already exists', 'SKU_CONFLICT');
    }

    const component = await this.repository.create(data);
    return serializeComponent(component);
  }

  async update(id: string, data: UpdateComponentInput) {
    if (data.sku) {
      const skuExists = await this.repository.checkSkuExists(data.sku, id);

      if (skuExists) {
        throw new ConflictError('SKU already exists', 'SKU_CONFLICT');
      }
    }

    const component = await this.repository.update(id, data);
    return serializeComponent(component);
  }

  async delete(id: string) {
    await this.repository.delete(id);
    return { message: 'Component deleted successfully' };
  }
}

export const componentService = new ComponentService();
