import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { Logo } from '@/components/layout/Logo';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-8">
      <div className="mb-6 w-full max-w-md">
        <Link href="/" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-2')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Website
        </Link>
      </div>

      <div className="mb-6">
        <Logo showText />
      </div>

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
    </div>
  );
}
