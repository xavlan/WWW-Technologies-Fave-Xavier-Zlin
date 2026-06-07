import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { ConflictError, NotFoundError } from '../../utils/errors';
import type { CreateCategoryInput, UpdateCategoryInput } from './category.validator';

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            components: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            components: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async create(data: CreateCategoryInput) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
      },
      include: {
        _count: {
          select: {
            components: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateCategoryInput) {
    try {
      return await prisma.category.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.slug !== undefined && { slug: data.slug }),
          ...(data.description !== undefined && { description: data.description }),
        },
        include: {
          _count: {
            select: {
              components: {
                where: { isActive: true },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Category not found');
      }
      throw error;
    }
  }

  async delete(id: string) {
    const activeComponentCount = await prisma.component.count({
      where: {
        categoryId: id,
        isActive: true,
      },
    });

    if (activeComponentCount > 0) {
      throw new ConflictError(
        'Cannot delete category with active components',
        'CATEGORY_HAS_COMPONENTS',
      );
    }

    try {
      await prisma.category.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError('Category not found');
      }
      throw error;
    }
  }
}

export const categoryRepository = new CategoryRepository();
