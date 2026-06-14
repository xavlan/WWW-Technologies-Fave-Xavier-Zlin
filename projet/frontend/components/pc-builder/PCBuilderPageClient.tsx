'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ComponentImage } from '@/components/catalog/ComponentImage';
import { componentsApi, categoriesApi } from '@/lib/api';
import type { Component } from '@/types/component';
import type { Category } from '@/types/category';

const BUILDER_CATEGORY_SLUGS = ['cpu', 'gpu', 'ram', 'storage'];

interface BuilderSelection {
  [category: string]: Component | null;
}

function getPowerConsumption(component: Component | null): number | null {
  if (!component) return null;

  const specs = component.specifications;
  const powerKeys = ['TDP', 'tdp', 'Power', 'power', 'Wattage', 'wattage', 'Power Consumption'];

  for (const key of powerKeys) {
    const value = specs[key];
    if (typeof value === 'number' && value > 0) return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value.replace(/[^\d]/g, ''), 10);
      if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  return null;
}

function formatBuildSummary(categories: Category[], selection: BuilderSelection, total: number): string {
  const lines = categories.map((category) => {
    const selected = selection[category.slug];
    return `${category.name}: ${selected?.name ?? 'Not selected'} — $${selected ? Number(selected.price).toFixed(2) : '0.00'}`;
  });

  return ['My PC Build', ...lines, `Total: $${total.toFixed(2)}`].join('\n');
}

export function PCBuilderPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryComponents, setCategoryComponents] = useState<Record<string, Component[]>>({});
  const [selection, setSelection] = useState<BuilderSelection>({});
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsResponse, componentsResponse] = await Promise.all([
          categoriesApi.getAll(),
          componentsApi.getAll({ limit: 100 }),
        ]);

        const cats = (catsResponse.data.data || []).filter((cat) =>
          BUILDER_CATEGORY_SLUGS.includes(cat.slug),
        );
        setCategories(cats);

        const allComponents = componentsResponse.data.data ?? [];
        const components: Record<string, Component[]> = {};
        cats.forEach((cat) => {
          components[cat.slug] = allComponents.filter(
            (component) => component.category?.slug === cat.slug,
          );
        });

        setCategoryComponents(components);

        const initial: BuilderSelection = {};
        cats.forEach((cat) => {
          const comps = components[cat.slug] ?? [];
          initial[cat.slug] = comps.length > 0 ? comps[0] : null;
        });
        setSelection(initial);
      } catch {
        toast.error('Failed to load PC Builder data');
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Loading PC Builder...</p>
        </div>
      </div>
    );
  }

  const calculateTotal = (): number =>
    Object.values(selection).reduce(
      (total, component) => total + (component ? Number(component.price) : 0),
      0,
    );

  const calculatePower = (): number | null => {
    const values = Object.values(selection)
      .map(getPowerConsumption)
      .filter((value): value is number => value !== null);

    return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null;
  };

  const selectedCount = Object.values(selection).filter((c) => c !== null).length;
  const isComplete = selectedCount === categories.length && categories.length > 0;
  const total = calculateTotal();
  const estimatedPower = calculatePower();
  const buildSummary = formatBuildSummary(categories, selection, total);

  const handleBuildComplete = () => {
    if (!isComplete) return;
    setShowSummary(true);
    toast.success('Your PC build is ready!');
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildSummary);
      toast.success('Build summary copied to clipboard');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight">PC Builder</h1>
            <p className="text-lg text-muted-foreground">
              Select a CPU, GPU, RAM, and storage to configure your build
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {categories.map((category) => {
                const components = categoryComponents[category.slug] || [];
                const selected = selection[category.slug];

                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/30">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                      {components.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No components available in this category
                        </p>
                      ) : (
                        <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                          {components.map((component) => {
                            const isSelected = selected?.id === component.id;

                            return (
                              <button
                                key={component.id}
                                type="button"
                                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                    : 'border-border hover:bg-muted/50'
                                }`}
                                onClick={() =>
                                  setSelection({ ...selection, [category.slug]: component })
                                }
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                                  <ComponentImage
                                    src={component.imageUrl}
                                    alt={component.name}
                                    fill
                                    className="h-full w-full"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium">{component.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {component.brand} {component.model}
                                  </p>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="font-semibold">
                                    ${Number(component.price).toFixed(2)}
                                  </p>
                                  <p
                                    className={`text-xs ${
                                      component.stock > 0 ? 'text-green-600' : 'text-destructive'
                                    }`}
                                  >
                                    {component.stock > 0
                                      ? `${component.stock} in stock`
                                      : 'Out of stock'}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              <Card className="sticky top-20 shadow-md">
                <CardHeader>
                  <CardTitle>Build Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const selected = selection[category.slug];
                      return (
                        <div
                          key={category.id}
                          className="flex items-start justify-between gap-2 text-sm"
                        >
                          <div className="min-w-0">
                            <p className="font-medium">{category.name}</p>
                            {selected ? (
                              <p className="truncate text-xs text-muted-foreground">
                                {selected.name}
                              </p>
                            ) : (
                              <p className="text-xs text-destructive">Not selected</p>
                            )}
                          </div>
                          {selected && (
                            <p className="shrink-0 font-semibold">
                              ${Number(selected.price).toFixed(2)}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                    {estimatedPower !== null && (
                      <p className="text-sm text-muted-foreground">
                        Estimated power: ~{estimatedPower}W
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2">
                    <Badge variant="outline" className="w-full justify-center py-1">
                      {selectedCount} / {categories.length} components selected
                    </Badge>

                    <Button className="w-full" disabled={!isComplete} onClick={handleBuildComplete}>
                      {isComplete
                        ? 'Build Complete'
                        : `Select ${categories.length - selectedCount} more`}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const cleared: BuilderSelection = {};
                        categories.forEach((cat) => {
                          cleared[cat.slug] = null;
                        });
                        setSelection(cleared);
                      }}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Build Complete
            </DialogTitle>
            <DialogDescription>
              Your configuration is ready. Total: ${total.toFixed(2)}
              {estimatedPower !== null ? ` · ~${estimatedPower}W estimated` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
            {categories.map((category) => {
              const selected = selection[category.slug];
              if (!selected) return null;

              return (
                <div key={category.id} className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                    <ComponentImage
                      src={selected.imageUrl}
                      alt={selected.name}
                      fill
                      className="h-full w-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{selected.name}</p>
                  </div>
                  <p className="shrink-0 font-semibold">${Number(selected.price).toFixed(2)}</p>
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => void handleCopySummary()} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy summary
            </Button>
            <Link href="/components">
              <Button>Browse catalog</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
