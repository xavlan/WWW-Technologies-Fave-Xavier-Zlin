'use client';

import Link from 'next/link';
import { Scale, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useCompareStore from '@/stores/compareStore';

export function CompareBar() {
  const { items, removeItem, clear } = useCompareStore();

  if (items.length === 0) return null;

  const canCompare = items.length === 2;
  const compareHref = canCompare ? `/compare?id1=${items[0].id}&id2=${items[1].id}` : undefined;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl border bg-background p-4 shadow-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Scale className="h-4 w-4 text-primary" />
          <span>{items.length}/2 selected for comparison</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {items.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full p-0.5 hover:bg-background"
                aria-label={`Remove ${item.name} from comparison`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>

          {canCompare && compareHref ? (
            <Link href={compareHref}>
              <Button size="sm">Compare Now</Button>
            </Link>
          ) : (
            <Button size="sm" disabled>
              Select one more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
