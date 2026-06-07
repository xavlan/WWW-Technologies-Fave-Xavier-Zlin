import { ProductCard } from '@/components/catalog/ProductCard';
import type { Component } from '@/types/component';

interface ProductGridProps {
  components: Component[];
}

export function ProductGrid({ components }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {components.map((component) => (
        <ProductCard key={component.id} component={component} />
      ))}
    </div>
  );
}
