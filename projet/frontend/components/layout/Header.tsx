'use client';

import Link from 'next/link';
import { Heart, Scale } from 'lucide-react';
import { buttonVariants, Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import useFavoritesStore from '@/stores/favoritesStore';
import useCompareStore from '@/stores/compareStore';
import { Logo } from '@/components/layout/Logo';

export function Header() {
  const { favorites } = useFavoritesStore();
  const { items: compareItems } = useCompareStore();
  const favCount = favorites.size;
  const canCompare = compareItems.length === 2;
  const compareHref = canCompare
    ? `/compare?id1=${compareItems[0].id}&id2=${compareItems[1].id}`
    : '/compare';

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="md" />
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-2">
          <Link
            href="/components"
            className="px-2 py-2 text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            Catalog
          </Link>
          <Link
            href="/builder"
            className="px-2 py-2 text-muted-foreground transition-colors hover:text-foreground sm:px-3"
          >
            PC Builder
          </Link>
          <Link href="/favorites" className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative text-muted-foreground"
              aria-label={`Favorites${favCount > 0 ? `, ${favCount} items` : ''}`}
            >
              <Heart className="h-4 w-4" />
              {favCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {favCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href={compareHref} aria-label="Compare components">
            <Button
              variant="ghost"
              size="sm"
              className="relative gap-1.5 text-muted-foreground"
            >
              <Scale className="h-4 w-4" />
              {compareItems.length > 0 && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
                  {compareItems.length}/2
                </Badge>
              )}
            </Button>
          </Link>
          <Link
            href="/admin/login"
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-muted-foreground')}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
