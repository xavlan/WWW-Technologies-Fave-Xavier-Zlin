'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SpecsKeyValueBuilder } from '@/components/admin/SpecsKeyValueBuilder';
import { cn } from '@/lib/utils';
import { createComponentSchema, type CreateComponentFormValues } from '@/lib/validators';
import type { Category } from '@/types/category';
import type { Component } from '@/types/component';

interface InventoryFormProps {
  categories: Category[];
  initialData?: Component;
  isSubmitting?: boolean;
  onSubmit: (data: CreateComponentFormValues) => Promise<void>;
  cancelHref: string;
}

export function InventoryForm({
  categories,
  initialData,
  isSubmitting = false,
  onSubmit,
  cancelHref,
}: InventoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateComponentFormValues>({
    resolver: zodResolver(createComponentSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      brand: initialData?.brand ?? '',
      model: initialData?.model ?? '',
      description: initialData?.description ?? '',
      price: initialData ? Number(initialData.price) : 0,
      stock: initialData?.stock ?? 0,
      sku: initialData?.sku ?? '',
      imageUrl: initialData?.imageUrl ?? '',
      categoryId: initialData?.categoryId ?? '',
      specifications: initialData?.specifications ?? {},
    },
  });

  const specifications = watch('specifications');
  const categoryId = watch('categoryId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register('brand')} />
          {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" {...register('model')} />
          {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} className="uppercase" />
          {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" min="0" {...register('stock', { valueAsNumber: true })} />
          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              if (value) {
                setValue('categoryId', value, { shouldValidate: true });
              }
            }}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" placeholder="https://..." {...register('imageUrl')} />
          {errors.imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={4}
            className="flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <SpecsKeyValueBuilder
            value={specifications}
            onChange={(next) => setValue('specifications', next, { shouldValidate: true })}
            errors={
              typeof errors.specifications?.message === 'string'
                ? errors.specifications.message
                : undefined
            }
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Component' : 'Create Component'}
        </Button>
        <Link href={cancelHref} className={cn(buttonVariants({ variant: 'outline' }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
