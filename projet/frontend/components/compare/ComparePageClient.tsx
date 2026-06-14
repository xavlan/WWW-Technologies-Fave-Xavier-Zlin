'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ComponentImage } from '@/components/catalog/ComponentImage';
import { componentsApi } from '@/lib/api';
import type { Component } from '@/types/component';
import { ComparisonTable } from './ComparisonTable';

function CompareEmptyState({ error }: { error: string }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Compare Components</h1>
        <p className="mt-3 text-destructive">{error}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Add up to 2 components of the same category from the catalog, then use the compare bar at
          the bottom of the screen.
        </p>
        <Link href="/components">
          <Button className="mt-6">Browse Components</Button>
        </Link>
      </div>
    </div>
  );
}

export function ComparePageClient() {
  const searchParams = useSearchParams();
  const [component1, setComponent1] = useState<Component | null>(null);
  const [component2, setComponent2] = useState<Component | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id1 = searchParams.get('id1');
  const id2 = searchParams.get('id2');

  useEffect(() => {
    async function loadComponents() {
      try {
        setLoading(true);
        setError(null);

        if (!id1 || !id2) {
          setError('Please select two components to compare');
          return;
        }

        if (id1 === id2) {
          setError('Please select two different components');
          return;
        }

        const [res1, res2] = await Promise.all([
          componentsApi.getById(id1),
          componentsApi.getById(id2),
        ]);

        const c1 = res1.data?.data;
        const c2 = res2.data?.data;

        if (!c1 || !c2) {
          setError('One or both components not found');
          return;
        }

        if (c1.category?.slug !== c2.category?.slug) {
          setError('Components must be from the same category to compare');
          return;
        }

        setComponent1(c1);
        setComponent2(c2);
      } catch {
        setError('Failed to load components for comparison');
      } finally {
        setLoading(false);
      }
    }

    void loadComponents();
  }, [id1, id2]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <CompareEmptyState error={error} />;
  }

  if (!component1 || !component2) {
    return (
      <CompareEmptyState error="No components found for this comparison." />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="text-center sm:text-left">
          <Link href="/components">
            <Button variant="outline" size="sm">
              ← Back to Catalog
            </Button>
          </Link>
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Compare Components</h1>
          <p className="text-muted-foreground">
            {component1.category?.name} — side-by-side comparison
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[component1, component2].map((component) => (
            <div key={component.id} className="overflow-hidden rounded-xl border bg-card">
              <div className="relative aspect-video bg-muted">
                <ComponentImage
                  src={component.imageUrl}
                  alt={component.name}
                  fill
                  className="h-full w-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{component.name}</h3>
                <p className="text-sm text-muted-foreground">{component.brand}</p>
                <p className="mt-2 text-xl font-bold text-primary">
                  ${Number(component.price).toFixed(2)}
                </p>
                <Link href={`/components/${component.id}`}>
                  <Button className="mt-3 w-full" size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <ComparisonTable component1={component1} component2={component2} />
      </div>
    </div>
  );
}
