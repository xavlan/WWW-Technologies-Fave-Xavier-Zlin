import { z } from 'zod';

const specificationsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
);

export const createComponentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  brand: z.string().trim().min(1, 'Brand is required'),
  model: z.string().trim().min(1, 'Model is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  sku: z
    .string()
    .trim()
    .transform((value) => value.toUpperCase())
    .pipe(
      z
        .string()
        .regex(
          /^[A-Z0-9-]{3,20}$/,
          'SKU must be 3-20 uppercase alphanumeric characters or hyphens',
        ),
    ),
  imageUrl: z
    .union([z.string().url('Invalid image URL'), z.literal('')])
    .optional()
    .nullable()
    .transform((value) => (value ? value : null)),
  specifications: specificationsSchema,
  categoryId: z.string().min(1, 'Category is required'),
});

export const updateComponentSchema = createComponentSchema.partial();

export const componentQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStock: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
});

export const componentIdParamSchema = z.object({
  id: z.string().min(1, 'Component ID is required'),
});

export type CreateComponentInput = z.infer<typeof createComponentSchema>;
export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;
export type ComponentQueryInput = z.infer<typeof componentQuerySchema>;
