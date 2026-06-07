import { Prisma } from '@prisma/client';

type ComponentWithCategory = Prisma.ComponentGetPayload<{
  include: { category: true };
}>;

export interface SerializedComponent {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: string;
  stock: number;
  sku: string;
  imageUrl: string | null;
  specifications: Prisma.JsonValue;
  isActive: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function serializeComponent(component: ComponentWithCategory): SerializedComponent {
  return {
    id: component.id,
    name: component.name,
    brand: component.brand,
    model: component.model,
    description: component.description,
    price: component.price.toString(),
    stock: component.stock,
    sku: component.sku,
    imageUrl: component.imageUrl,
    specifications: component.specifications,
    isActive: component.isActive,
    categoryId: component.categoryId,
    category: component.category,
    createdAt: component.createdAt,
    updatedAt: component.updatedAt,
  };
}

export function serializeComponents(components: ComponentWithCategory[]): SerializedComponent[] {
  return components.map(serializeComponent);
}
