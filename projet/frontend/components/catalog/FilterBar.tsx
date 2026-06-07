'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/category';
import type { ComponentQueryParams } from '@/types/component';

interface FilterBarProps {
  categories: Category[];
  params: ComponentQueryParams;
  onUpdate: (updates: Partial<ComponentQueryParams>) => void;
  onReset: () => void;
}

export function FilterBar({ categories, params, onUpdate, onReset }: FilterBarProps) {
  return (
    <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="category-filter">Category</Label>
        <Select
          value={params.category ?? 'all'}
          onValueChange={(value) =>
            onUpdate({ category: !value || value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="min-price">Min Price</Label>
        <Input
          id="min-price"
          type="number"
          min={0}
          placeholder="0"
          value={params.minPrice ?? ''}
          onChange={(event) =>
            onUpdate({
              minPrice: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-price">Max Price</Label>
        <Input
          id="max-price"
          type="number"
          min={0}
          placeholder="Any"
          value={params.maxPrice ?? ''}
          onChange={(event) =>
            onUpdate({
              maxPrice: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-by">Sort By</Label>
        <Select
          value={`${params.sortBy}-${params.order}`}
          onValueChange={(value) => {
            if (!value) return;
            const [sortBy, order] = value.split('-') as [
              ComponentQueryParams['sortBy'],
              ComponentQueryParams['order'],
            ];
            onUpdate({ sortBy, order });
          }}
        >
          <SelectTrigger id="sort-by" className="w-full">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest first</SelectItem>
            <SelectItem value="createdAt-asc">Oldest first</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end gap-2 lg:col-span-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.inStock === true}
            onChange={(event) =>
              onUpdate({ inStock: event.target.checked ? true : undefined })
            }
            className="h-4 w-4 rounded border-input"
          />
          In stock only
        </label>
        <Button type="button" variant="outline" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
