export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function parsePagination(
  page: number,
  limit: number,
  maxLimit = 100,
): PaginationParams {
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 && limit <= maxLimit ? limit : Math.min(limit > 0 ? limit : 12, maxLimit);

  return {
    page: safePage,
    limit: safeLimit,
  };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
  };
}

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
