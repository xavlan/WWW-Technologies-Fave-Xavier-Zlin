import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ComponentImage } from '@/components/catalog/ComponentImage';
import { StockBadge } from '@/components/catalog/StockBadge';
import { cn } from '@/lib/utils';
import type { Component } from '@/types/component';
import { getStockStatus } from '@/types/component';

interface ProductCardProps {
  component: Component;
}

export function ProductCard({ component }: ProductCardProps) {
  const stockStatus = getStockStatus(component.stock);

  return (
    <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <ComponentImage
          src={component.imageUrl}
          alt={component.name}
          fill
          className="h-full w-full"
        />
      </div>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-base">{component.name}</CardTitle>
          <StockBadge status={stockStatus} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{component.brand}</Badge>
          {component.category && (
            <Badge variant="secondary">{component.category.name}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">${component.price}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/components/${component.id}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
