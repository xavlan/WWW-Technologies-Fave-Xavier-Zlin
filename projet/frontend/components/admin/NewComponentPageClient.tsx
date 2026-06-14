'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InventoryForm } from '@/components/admin/InventoryForm';
import { componentsApi } from '@/lib/api';
import type { CreateComponentFormValues } from '@/lib/validators';
import type { Category } from '@/types/category';

interface NewComponentPageClientProps {
  categories: Category[];
}

export function NewComponentPageClient({ categories }: NewComponentPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateComponentFormValues) => {
    setIsSubmitting(true);

    try {
      await componentsApi.create({
        name: data.name,
        brand: data.brand,
        model: data.model,
        description: data.description,
        price: data.price,
        stock: data.stock,
        sku: data.sku.toUpperCase(),
        categoryId: data.categoryId,
        imageUrl: data.imageUrl?.trim() ? data.imageUrl.trim() : undefined,
        specifications: data.specifications ?? {},
      });
      toast.success('Component created successfully');
      router.push('/admin/inventory');
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { error?: { message?: string; code?: string; details?: unknown } } };
      };
      const message = err.response?.data?.error?.message || 'Failed to create component';
      const code = err.response?.data?.error?.code;

      if (code === 'SKU_CONFLICT') {
        toast.error('SKU already exists. Please use a unique SKU.');
      } else if (code === 'VALIDATION_ERROR') {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Component</h1>
        <p className="text-muted-foreground">Add a new item to the inventory.</p>
      </div>
      <InventoryForm
        categories={categories}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        cancelHref="/admin/inventory"
      />
    </div>
  );
}
