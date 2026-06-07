import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchCategories } from '@/lib/api-server';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import { ProductGridSkeleton } from '@/components/catalog/ProductGridSkeleton';

export const metadata: Metadata = {
  title: 'Component Catalog',
};

export default async function CatalogPage() {
  let categories: Awaited<ReturnType<typeof fetchCategories>>['data'] = [];

  try {
    const response = await fetchCategories();
    categories = response.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Component Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Browse and filter PC hardware components.
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <CatalogClient categories={categories} />
      </Suspense>
    </div>
  );
}
