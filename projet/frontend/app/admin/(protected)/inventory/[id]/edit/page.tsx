import { notFound } from 'next/navigation';
import { fetchCategories, fetchComponentById } from '@/lib/api-server';
import { ComponentFormPageClient } from '@/components/admin/ComponentFormPageClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';

interface EditComponentPageProps {
  params: Promise<{ id: string }>;
}

async function EditComponentContent({ id }: { id: string }) {
  let component: Awaited<ReturnType<typeof fetchComponentById>>['data'];
  let categories: Awaited<ReturnType<typeof fetchCategories>>['data'] = [];

  try {
    const [componentRes, categoriesRes] = await Promise.all([
      fetchComponentById(id),
      fetchCategories(),
    ]);

    component = componentRes.data;
    categories = categoriesRes.data ?? [];
  } catch {
    notFound();
  }

  if (!component) {
    notFound();
  }

  return <ComponentFormPageClient categories={categories} component={component} />;
}

export default async function EditComponentPage({ params }: EditComponentPageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <EditComponentContent id={id} />
    </Suspense>
  );
}
