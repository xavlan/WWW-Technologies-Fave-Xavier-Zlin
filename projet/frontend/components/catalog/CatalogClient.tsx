'use client';

import { useEffect, useState } from 'react';
import { PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { componentsApi } from '@/lib/api';
import { useCatalogParams } from '@/hooks/useCatalogParams';
import { SearchBar } from '@/components/catalog/SearchBar';
import { FilterBar } from '@/components/catalog/FilterBar';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ProductGridSkeleton } from '@/components/catalog/ProductGridSkeleton';
import { Pagination } from '@/components/catalog/Pagination';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/category';
import type { Component } from '@/types/component';
import type { PaginationMeta } from '@/types/api';

interface CatalogClientProps {
  categories: Category[];
}

export function CatalogClient({ categories }: CatalogClientProps) {
  const { params, updateParams, resetFilters } = useCatalogParams();
  const [components, setComponents] = useState<Component[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchComponents() {
      setIsLoading(true);

      try {
        const response = await componentsApi.getAll(params);

        if (!isMounted) return;

        setComponents(response.data.data);
        setMeta(response.data.meta);
      } catch {
        if (isMounted) {
          toast.error('Failed to load components');
          setComponents([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchComponents();

    return () => {
      isMounted = false;
    };
  }, [params]);

  return (
    <div className="space-y-6">
      <SearchBar
        key={params.search ?? 'all'}
        value={params.search ?? ''}
        onChange={(search) => updateParams({ search: search || undefined })}
      />

      <FilterBar
        categories={categories}
        params={params}
        onUpdate={updateParams}
        onReset={resetFilters}
      />

      {isLoading ? (
        <ProductGridSkeleton />
      ) : components.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <PackageOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No components found</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you are looking for.
          </p>
          <Button className="mt-6" variant="outline" onClick={resetFilters}>
            Reset filters
          </Button>
        </div>
      ) : (
        <>
          <ProductGrid components={components} />
          <Pagination meta={meta} onPageChange={(page) => updateParams({ page }, false)} />
        </>
      )}
    </div>
  );
}
