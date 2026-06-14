import { fetchCategories } from '@/lib/api-server';
import { ComponentFormPageClient } from '@/components/admin/ComponentFormPageClient';

export default async function NewComponentPage() {
  let categories: Awaited<ReturnType<typeof fetchCategories>>['data'] = [];

  try {
    const response = await fetchCategories();
    categories = response.data ?? [];
  } catch {
    categories = [];
  }

  return <ComponentFormPageClient categories={categories} />;
}
