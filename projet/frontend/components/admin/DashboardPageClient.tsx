'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-react';
import { adminApi } from '@/lib/api';
import { StatsCard } from '@/components/admin/StatsCard';
import { StockBadge } from '@/components/catalog/StockBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AdminStats } from '@/types/api';
import { getStockStatus } from '@/types/component';

export function DashboardPageClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await adminApi.getStats();
        setStats(response.data.data ?? null);
      } catch {
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-muted-foreground">Could not load dashboard stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Overview of your inventory performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Components"
          value={stats.totalComponents}
          icon={Package}
          testId="total-components-stat"
        />
        <StatsCard
          title="Total Value"
          value={`$${stats.totalInventoryValue}`}
          icon={DollarSign}
          testId="total-value-stat"
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          variant="warning"
          testId="low-stock-stat"
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStockCount}
          icon={XCircle}
          variant="danger"
          testId="out-of-stock-stat"
        />
      </div>

      <section className="space-y-4" data-testid="recent-activity">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
          <Link
            href="/admin/inventory/new"
            className={cn(buttonVariants({ size: 'sm' }))}
            data-testid="quick-add-component"
          >
            Add component
          </Link>
        </div>

        {stats.lowStockComponents.length === 0 ? (
          <p className="text-sm text-muted-foreground">All items are well stocked.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border" data-testid="low-stock-alert-list">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">SKU</th>
                  <th className="px-4 py-3 text-left font-medium">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockComponents.map((component) => (
                  <tr key={component.id} className="border-t" data-testid="low-stock-item">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inventory/${component.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {component.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{component.sku}</td>
                    <td className="px-4 py-3">{component.stock}</td>
                    <td className="px-4 py-3">${component.price}</td>
                    <td className="px-4 py-3">
                      <StockBadge status={getStockStatus(component.stock)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
