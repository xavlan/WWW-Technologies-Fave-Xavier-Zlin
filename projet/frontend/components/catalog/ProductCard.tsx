'use client';

import Link from 'next/link';
import { Heart, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants, Button } from '@/components/ui/button';
import { ComponentImage } from '@/components/catalog/ComponentImage';
import { StockBadge } from '@/components/catalog/StockBadge';
import { cn } from '@/lib/utils';
import type { Component } from '@/types/component';
import { getStockStatus } from '@/types/component';
import useFavoritesStore from '@/stores/favoritesStore';
import useCompareStore from '@/stores/compareStore';

interface ProductCardProps {
  component: Component;
}

export function ProductCard({ component }: ProductCardProps) {
  const stockStatus = getStockStatus(component.stock);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { addItem, hasItem, removeItem } = useCompareStore();
  const favorite = isFavorite(component.id);
  const inCompare = hasItem(component.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(component.id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(component.id);
      toast.success('Added to favorites');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCompare) {
      removeItem(component.id);
      toast.info('Removed from comparison');
      return;
    }

    if (!component.category) {
      toast.error('Category missing for this component');
      return;
    }

    const result = addItem({
      id: component.id,
      name: component.name,
      categorySlug: component.category.slug,
      categoryName: component.category.name,
    });

    if (result.success) {
      toast.success('Added to comparison');
    } else {
      toast.error(result.message ?? 'Could not add to comparison');
    }
  };

  return (
    <Card
      className="group h-full overflow-hidden border-border/60 transition-all hover:border-primary/30 hover:shadow-lg"
      data-testid="product-card"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <ComponentImage
          src={component.imageUrl}
          alt={component.name}
          fill
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={handleCompare}
            aria-label={inCompare ? 'Remove from comparison' : 'Add to comparison'}
          >
            <Scale
              className={cn(
                'h-4 w-4 transition-colors',
                inCompare ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={handleFavorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                favorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground',
              )}
            />
          </Button>
        </div>
      </div>

      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className="line-clamp-2 text-base leading-snug"
            data-testid="product-name"
          >
            {component.name}
          </CardTitle>
          <StockBadge status={stockStatus} data-testid="stock-badge" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs" data-testid="product-brand">
            {component.brand}
          </Badge>
          {component.category && (
            <Badge variant="secondary" className="text-xs">
              {component.category.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-2xl font-bold text-primary" data-testid="product-price">
          ${Number(component.price).toFixed(2)}
        </p>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Link
          href={`/components/${component.id}`}
          className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
          data-testid="view-details-link"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
