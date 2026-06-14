import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const createComponentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number({ error: 'Price is required' }).positive('Price must be greater than 0'),
  stock: z.number({ error: 'Stock is required' }).int().min(0, 'Stock cannot be negative'),
  sku: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{3,20}$/, 'SKU must be 3-20 alphanumeric characters or hyphens'),
  imageUrl: z.union([z.string().url('Invalid URL'), z.literal('')]).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export type CreateComponentFormValues = z.infer<typeof createComponentSchema>;

export const updateComponentSchema = createComponentSchema.partial();

export type UpdateComponentFormValues = z.infer<typeof updateComponentSchema>;
