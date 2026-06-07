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
        ...data,
        imageUrl: data.imageUrl || undefined,
      });
      toast.success('Component created successfully');
      router.push('/admin/inventory');
    } catch {
      toast.error('Failed to create component');
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
