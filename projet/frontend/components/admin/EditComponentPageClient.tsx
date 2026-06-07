'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { InventoryForm } from '@/components/admin/InventoryForm';
import { componentsApi } from '@/lib/api';
import type { CreateComponentFormValues } from '@/lib/validators';
import type { Category } from '@/types/category';
import type { Component } from '@/types/component';

interface EditComponentPageClientProps {
  categories: Category[];
  component: Component;
}

export function EditComponentPageClient({
  categories,
  component,
}: EditComponentPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateComponentFormValues) => {
    setIsSubmitting(true);

    try {
      await componentsApi.update(component.id, {
        ...data,
        imageUrl: data.imageUrl || undefined,
      });
      toast.success('Component updated successfully');
      router.push('/admin/inventory');
    } catch {
      toast.error('Failed to update component');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Component</h1>
        <p className="text-muted-foreground">Update details for {component.name}.</p>
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
