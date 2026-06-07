'use client';

import { Suspense } from 'react';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminLoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
