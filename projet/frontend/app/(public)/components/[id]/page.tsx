import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchComponentById } from '@/lib/api-server';
import { ComponentImage } from '@/components/catalog/ComponentImage';
import { StockBadge } from '@/components/catalog/StockBadge';
import { SpecsTable } from '@/components/catalog/SpecsTable';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getStockStatus } from '@/types/component';
import { ComponentDetailClient } from '@/components/catalog/ComponentDetailClient';

interface ComponentDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ComponentDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetchComponentById(id);
    const component = response.data;

    if (!component) {
      return { title: 'Component Not Found' };
    }

    return {
      title: component.name,
      description: component.description,
    };
  } catch {
    return { title: 'Component Not Found' };
  }
}

export default async function ComponentDetailPage({ params }: ComponentDetailPageProps) {
  const { id } = await params;

  let component: Awaited<ReturnType<typeof fetchComponentById>>['data'];

  try {
    const response = await fetchComponentById(id);
    component = response.data;
  } catch {
    notFound();
  }

  if (!component) {
    notFound();
  }

  const stockStatus = getStockStatus(component.stock);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground" data-testid="breadcrumb">
        <Link href="/" className="hover:text-foreground" data-testid="breadcrumb-home">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/components" className="hover:text-foreground">
          Components
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{component.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div
          className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
          data-testid="component-image"
        >
          <ComponentImage
            src={component.imageUrl}
            alt={component.name}
            fill
            priority
            className="h-full w-full"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="outline" data-testid="component-brand">
                {component.brand}
              </Badge>
              {component.category && (
                <Badge variant="secondary" data-testid="component-category">
                  {component.category.name}
                </Badge>
              )}
              <StockBadge status={stockStatus} data-testid="component-stock" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="component-name">
              {component.name}
            </h1>
            <p className="mt-2 text-muted-foreground" data-testid="component-model">
              {component.model}
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-primary" data-testid="component-price">
              ${component.price}
            </p>
            <p className="mt-1 text-sm text-muted-foreground" data-testid="component-sku">
              SKU: {component.sku}
            </p>
            <p className="text-sm text-muted-foreground">
              {component.stock > 0
                ? `${component.stock} unit(s) available`
                : 'Currently unavailable'}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p
              className="leading-relaxed text-muted-foreground"
              data-testid="component-description"
            >
              {component.description}
            </p>
          </div>

          <ComponentDetailClient
            componentId={component.id}
            componentName={component.name}
            categorySlug={component.category?.slug}
          />

          <Link
            href="/components"
            className={cn(buttonVariants({ variant: 'outline' }))}
            data-testid="back-to-catalog-link"
          >
            Back to catalog
          </Link>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold">Technical Specifications</h2>
        <SpecsTable specifications={component.specifications} />
      </section>
    </div>
  );
}
