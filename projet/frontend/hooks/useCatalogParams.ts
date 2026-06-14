'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ComponentQueryParams } from '@/types/component';

export function useCatalogParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo<ComponentQueryParams>(() => {
    const inStockParam = searchParams.get('inStock');

    return {
      search: searchParams.get('search') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      inStock: inStockParam === null ? undefined : inStockParam === 'true',
      sortBy: (searchParams.get('sortBy') as ComponentQueryParams['sortBy']) ?? 'createdAt',
      order: (searchParams.get('order') as ComponentQueryParams['order']) ?? 'desc',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 12,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Partial<ComponentQueryParams>, resetPage = true) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });

      if (resetPage && !('page' in updates)) {
        next.set('page', '1');
      }

      router.push(`${pathname}?${next.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  return { params, updateParams, resetFilters };
}
