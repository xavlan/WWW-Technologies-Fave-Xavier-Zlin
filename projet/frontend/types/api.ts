export interface ApiErrorBody {
  message: string;
  code: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorBody;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface AdminStats {
  totalComponents: number;
  totalCategories: number;
  totalInventoryValue: string;
  lowStockCount: number;
  outOfStockCount: number;
  lowStockComponents: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: string;
  }>;
  componentsByCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
}
