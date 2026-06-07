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
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
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
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
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
              <Badge variant="outline">{component.brand}</Badge>
              {component.category && (
                <Badge variant="secondary">{component.category.name}</Badge>
              )}
              <StockBadge status={stockStatus} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
            <p className="mt-2 text-muted-foreground">{component.model}</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-primary">${component.price}</p>
            <p className="mt-1 text-sm text-muted-foreground">SKU: {component.sku}</p>
            <p className="text-sm text-muted-foreground">
              {component.stock > 0
                ? `${component.stock} unit(s) available`
                : 'Currently unavailable'}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <p className="leading-relaxed text-muted-foreground">{component.description}</p>
          </div>

          <Link href="/components" className={cn(buttonVariants({ variant: 'outline' }))}>
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
