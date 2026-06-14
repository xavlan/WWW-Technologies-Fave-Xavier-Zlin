'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InventoryForm } from '@/components/admin/InventoryForm';
import { componentsApi } from '@/lib/api';
import type { CreateComponentFormValues } from '@/lib/validators';
import type { Category } from '@/types/category';
import type { Component } from '@/types/component';

interface ComponentFormPageClientProps {
  categories: Category[];
  component?: Component;
}

function getApiError(error: unknown): { message: string; code?: string } {
  const err = error as { response?: { data?: { error?: { message?: string; code?: string } } } };
  return {
    message: err.response?.data?.error?.message ?? 'Something went wrong',
    code: err.response?.data?.error?.code,
  };
}

export function ComponentFormPageClient({ categories, component }: ComponentFormPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(component);

  const handleSubmit = async (data: CreateComponentFormValues) => {
    setIsSubmitting(true);

    const payload = {
      name: data.name,
      brand: data.brand,
      model: data.model,
      description: data.description,
      price: data.price,
      stock: data.stock,
      sku: data.sku.toUpperCase(),
      categoryId: data.categoryId,
      imageUrl: data.imageUrl?.trim() || undefined,
      specifications: data.specifications ?? {},
    };

    try {
      if (isEdit && component) {
        await componentsApi.update(component.id, payload);
        toast.success('Component updated');
      } else {
        await componentsApi.create(payload);
        toast.success('Component created');
      }
      router.push('/admin/inventory');
    } catch (error: unknown) {
      const { message, code } = getApiError(error);
      if (code === 'SKU_CONFLICT') {
        toast.error('This SKU is already used');
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
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? 'Edit Component' : 'New Component'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? `Update ${component!.name}` : 'Add a new item to the inventory.'}
        </p>
      </div>
      <InventoryForm
        categories={categories}
        initialData={component}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        cancelHref="/admin/inventory"
      />
    </div>
  );
}
