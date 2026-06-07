'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { componentsApi, categoriesApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockBadge } from '@/components/catalog/StockBadge';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { Pagination } from '@/components/catalog/Pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Component } from '@/types/component';
import type { Category } from '@/types/category';
import type { PaginationMeta } from '@/types/api';
import { getStockStatus } from '@/types/component';

export function InventoryPageClient() {
  const router = useRouter();
  const [components, setComponents] = useState<Component[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Component | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);

      try {
        const [componentsRes, categoriesRes] = await Promise.all([
          componentsApi.getAll({
            search: debouncedSearch || undefined,
            category: categoryFilter === 'all' ? undefined : categoryFilter,
            page,
            limit: 10,
            sortBy: 'name',
            order: 'asc',
          }),
          categoriesApi.getAll(),
        ]);

        if (!isMounted) return;

        setComponents(componentsRes.data.data);
        setMeta(componentsRes.data.meta);
        setCategories(categoriesRes.data.data ?? []);
      } catch {
        if (isMounted) {
          toast.error('Failed to load inventory');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, debouncedSearch, page, refreshToken]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      await componentsApi.delete(deleteTarget.id);
      toast.success('Component deleted');
      setDeleteTarget(null);
      setRefreshToken((token) => token + 1);
    } catch {
      toast.error('Failed to delete component');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage PC component inventory.</p>
        </div>
        <Link href="/admin/inventory/new" className={cn(buttonVariants())}>
          Add New Component
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search inventory..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value ?? 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="sm:w-48">
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

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components.map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>{component.brand}</TableCell>
                  <TableCell>{component.category?.name ?? '—'}</TableCell>
                  <TableCell>{component.sku}</TableCell>
                  <TableCell>${component.price}</TableCell>
                  <TableCell>{component.stock}</TableCell>
                  <TableCell>
                    <StockBadge status={getStockStatus(component.stock)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/inventory/${component.id}/edit`)}
                        aria-label={`Edit ${component.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(component)}
                        aria-label={`Delete ${component.name}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination meta={meta} onPageChange={setPage} />

      <DeleteConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete component"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will soft-delete the component from the public catalog.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
