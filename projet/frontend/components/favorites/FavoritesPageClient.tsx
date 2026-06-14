'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/catalog/ProductCard';
import useFavoritesStore from '@/stores/favoritesStore';
import { componentsApi } from '@/lib/api';
import type { Component } from '@/types/component';

export function FavoritesPageClient() {
  const { favorites } = useFavoritesStore();
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (favorites.size === 0) {
        setComponents([]);
        setLoading(false);
        return;
      }

      try {
        const response = await componentsApi.getAll({ limit: 100 });
        const allComponents = response.data.data ?? [];
        const favSet = favorites;
        setComponents(allComponents.filter((component) => favSet.has(component.id)));
      } catch {
        console.error('Failed to load favorites');
        setComponents([]);
      } finally {
        setLoading(false);
      }
    }

    void loadFavorites();
  }, [favorites]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (components.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-3xl font-bold">No Favorites Yet</h1>
            <p className="mt-2 text-muted-foreground">
              Start adding components to your favorites by clicking the heart icon on component
              cards.
            </p>
            <Link href="/components">
              <Button className="mt-6">Browse Components</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
            <p className="text-muted-foreground">
              {components.length} component{components.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {components.map((component) => (
              <ProductCard key={component.id} component={component} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
