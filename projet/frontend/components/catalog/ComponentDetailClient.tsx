'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { componentsApi } from '@/lib/api';
import useFavoritesStore from '@/stores/favoritesStore';
import type { Component } from '@/types/component';

interface ComponentDetailClientProps {
  componentId: string;
  componentName: string;
  categorySlug?: string;
}

export function ComponentDetailClient({
  componentId,
  componentName,
  categorySlug,
}: ComponentDetailClientProps) {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [favorite, setFavorite] = useState(false);
  const [componentsInCategory, setComponentsInCategory] = useState<Component[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(componentId));
  }, [componentId, isFavorite]);

  useEffect(() => {
    if (!categorySlug) return;

    async function loadComponents() {
      try {
        const response = await componentsApi.getAll({
          category: categorySlug,
          limit: 100,
        });
        setComponentsInCategory(response.data.data.filter((c) => c.id !== componentId));
      } catch {
        console.error('Failed to load components');
      }
    }

    loadComponents();
  }, [categorySlug, componentId]);

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(componentId);
    } else {
      addFavorite(componentId);
    }
    setFavorite(!favorite);
  };

  const handleCompare = (otherId: string) => {
    router.push(`/compare?id1=${componentId}&id2=${otherId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={favorite ? 'default' : 'outline'}
          onClick={handleFavorite}
          className="gap-2"
        >
          <Heart className={`h-4 w-4 ${favorite ? 'fill-current' : ''}`} />
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </Button>

        {componentsInCategory.length > 0 && (
          <Button
            variant={showComparison ? 'default' : 'outline'}
            onClick={() => setShowComparison(!showComparison)}
            className="gap-2"
          >
            <Scale className="h-4 w-4" />
            Compare
          </Button>
        )}
      </div>

      {showComparison && componentsInCategory.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
          <p className="text-sm font-medium">Select a component to compare with {componentName}:</p>
          <div className="grid gap-2">
            {componentsInCategory.slice(0, 5).map((comp) => (
              <Button
                key={comp.id}
                variant="outline"
                onClick={() => handleCompare(comp.id)}
                className="justify-start text-left h-auto py-2"
              >
                <div>
                  <p className="font-medium">{comp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {comp.brand} - ${comp.price}
                  </p>
                </div>
              </Button>
            ))}
          </div>
          {componentsInCategory.length > 5 && (
            <p className="text-xs text-muted-foreground text-center">
              Showing 5 of {componentsInCategory.length} components
            </p>
          )}
        </div>
      )}
    </div>
  );
}
