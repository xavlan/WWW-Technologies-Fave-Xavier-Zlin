import { fetchCategories } from '@/lib/api-server';
import { NewComponentPageClient } from '@/components/admin/NewComponentPageClient';

export default async function NewComponentPage() {
  let categories: Awaited<ReturnType<typeof fetchCategories>>['data'] = [];

  try {
    const response = await fetchCategories();
    categories = response.data ?? [];
  } catch {
    categories = [];
  }

  return <NewComponentPageClient categories={categories} />;
}
