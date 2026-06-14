import Link from 'next/link';

import { Suspense } from 'react';

import type { Metadata } from 'next';

import { fetchCategories, fetchComponents } from '@/lib/api-server';

import { ProductGrid } from '@/components/catalog/ProductGrid';

import { ProductGridSkeleton } from '@/components/catalog/ProductGridSkeleton';

import { buttonVariants } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { Logo } from '@/components/layout/Logo';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  let featuredComponents: Awaited<ReturnType<typeof fetchComponents>>['data'] = [];

  let categories: Awaited<ReturnType<typeof fetchCategories>>['data'] = [];

  let totalComponents = 0;

  try {
    const [componentsRes, categoriesRes] = await Promise.all([
      fetchComponents({ limit: 8, sortBy: 'createdAt', order: 'desc' }),

      fetchCategories(),
    ]);

    featuredComponents = componentsRes.data;

    categories = categoriesRes.data ?? [];

    totalComponents = componentsRes.meta.total;
  } catch {
    featuredComponents = [];

    categories = [];
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mx-auto mb-16 max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <Logo size="lg" />
        </div>

        <p className="text-lg text-muted-foreground">
          Browse and manage PC hardware components — CPUs, GPUs, RAM, storage, motherboards, and
          power supplies.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/components" className={cn(buttonVariants({ size: 'lg' }))}>
            Browse Catalog
          </Link>

          <Link href="/builder" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Build a PC
          </Link>

          <Link
            href="/admin/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
          >
            Admin Login
          </Link>
        </div>
      </section>

      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-primary">{totalComponents}</p>

          <p className="text-sm text-muted-foreground">Components</p>
        </div>

        <div className="rounded-xl border bg-card p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-primary">{categories.length}</p>

          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold">Shop by Category</h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/components?category=${category.slug}`}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Components</h2>

          <Link href="/components" className={cn(buttonVariants({ variant: 'ghost' }))}>
            View all
          </Link>
        </div>

        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          {featuredComponents.length > 0 ? (
            <ProductGrid components={featuredComponents} />
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center">
              <p className="text-muted-foreground">No components available yet.</p>

              <Link
                href="/components"
                className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 inline-flex')}
              >
                Browse catalog
              </Link>
            </div>
          )}
        </Suspense>
      </section>
    </div>
  );
}
