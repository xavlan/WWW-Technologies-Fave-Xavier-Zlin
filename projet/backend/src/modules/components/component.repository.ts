import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { NotFoundError } from '../../utils/errors';
import { getSkip } from '../../utils/pagination';
import type { CreateComponentInput, UpdateComponentInput } from './component.validator';

export interface ComponentFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  includeInactive?: boolean;
}

export interface ComponentSort {
  sortBy: 'price' | 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ComponentPagination {
  page: number;
  limit: number;
}

const categoryInclude = {
  category: true,
} as const;

function buildWhereClause(filters: ComponentFilters): Prisma.ComponentWhereInput {
  const where: Prisma.ComponentWhereInput = {};

  if (!filters.includeInactive) {
    where.isActive = filters.isActive ?? true;
  } else if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { brand: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.category) {
    where.category = {
      OR: [{ id: filters.category }, { slug: filters.category }],
    };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  if (filters.inStock === true) {
    where.stock = { gt: 0 };
  }

  return where;
}

export class ComponentRepository {
  async findAll(
    filters: ComponentFilters,
    pagination: ComponentPagination,
    sort: ComponentSort,
  ) {
    const where = buildWhereClause(filters);
    const skip = getSkip(pagination.page, pagination.limit);
    const orderBy = { [sort.sortBy]: sort.order } as Prisma.ComponentOrderByWithRelationInput;

    const [items, total] = await Promise.all([
      prisma.component.findMany({
        where,
        include: categoryInclude,
        orderBy,
        skip,
        take: pagination.limit,
      }),
      prisma.component.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string, options: { includeInactive?: boolean } = {}) {
    const component = await prisma.component.findFirst({
      where: {
        id,
        ...(options.includeInactive ? {} : { isActive: true }),
      },
      include: categoryInclude,
    });

    if (!component) {
      throw new NotFoundError('Component not found');
    }

    return component;
  }

  async findByIdAdmin(id: string) {
    const component = await prisma.component.findUnique({
      where: { id },
      include: categoryInclude,
    });

    if (!component) {
      throw new NotFoundError('Component not found');
    }

    return component;
  }

  async create(data: CreateComponentInput) {
    return prisma.component.create({
      data: {
        name: data.name,
        brand: data.brand,
        model: data.model,
        description: data.description,
        price: data.price,
        stock: data.stock,
        sku: data.sku,
        imageUrl: data.imageUrl ?? null,
        specifications: data.specifications,
        categoryId: data.categoryId,
      },
      include: categoryInclude,
    });
  }

  async update(id: string, data: UpdateComponentInput) {
    try {
      return await prisma.component.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.brand !== undefined && { brand: data.brand }),
          ...(data.model !== undefined && { model: data.model }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.sku !== undefined && { sku: data.sku }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.specifications !== undefined && { specifications: data.specifications }),
          ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        },
        include: categoryInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Component not found');
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.component.update({
        where: { id },
        data: { isActive: false },
        include: categoryInclude,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Component not found');
      }
      throw error;
    }
  }

  async checkSkuExists(sku: string, excludeId?: string): Promise<boolean> {
    const existing = await prisma.component.findFirst({
      where: {
        sku,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    return existing !== null;
  }
}

export const componentRepository = new ComponentRepository();
