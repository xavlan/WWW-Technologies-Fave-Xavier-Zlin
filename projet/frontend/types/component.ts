import type { Category } from './category';

export interface Component {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string | null;
  specifications: Record<string, string | number | boolean>;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ComponentQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateComponentDto {
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl?: string;
  specifications: Record<string, string | number | boolean>;
  categoryId: string;
}

export type UpdateComponentDto = Partial<CreateComponentDto>;

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'out_of_stock';
  if (stock <= 5) return 'low_stock';
  return 'in_stock';
}
