import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { AdminLoginPageClient } from '@/components/admin/AdminLoginPageClient';

import { Logo } from '@/components/layout/Logo';

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

      <AdminLoginPageClient />

    </div>

  );

}

