import { prisma } from '../../config/database';

export class AdminService {
  async getStats() {
    const activeWhere = { isActive: true };

    const [
      totalComponents,
      totalCategories,
      lowStockCount,
      outOfStockCount,
      lowStockComponents,
      categories,
    ] = await Promise.all([
      prisma.component.count({ where: activeWhere }),
      prisma.category.count(),
      prisma.component.count({
        where: {
          ...activeWhere,
          stock: { lte: 5 },
        },
      }),
      prisma.component.count({
        where: {
          ...activeWhere,
          stock: 0,
        },
      }),
      prisma.component.findMany({
        where: {
          ...activeWhere,
          stock: { lte: 5 },
        },
        orderBy: { stock: 'asc' },
        take: 10,
        select: {
          id: true,
          name: true,
          sku: true,
          stock: true,
          price: true,
        },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              components: {
                where: activeWhere,
              },
            },
          },
        },
      }),
    ]);

    const componentsForValue = await prisma.component.findMany({
      where: activeWhere,
      select: {
        price: true,
        stock: true,
      },
    });

    const totalInventoryValue = componentsForValue.reduce((sum, component) => {
      return sum + Number(component.price) * component.stock;
    }, 0);

    return {
      totalComponents,
      totalCategories,
      totalInventoryValue: totalInventoryValue.toFixed(2),
      lowStockCount,
      outOfStockCount,
      lowStockComponents: lowStockComponents.map((component) => ({
        id: component.id,
        name: component.name,
        sku: component.sku,
        stock: component.stock,
        price: component.price.toString(),
      })),
      componentsByCategory: categories.map((category) => ({
        categoryId: category.id,
        categoryName: category.name,
        count: category._count.components,
      })),
    };
  }
}

export const adminService = new AdminService();
