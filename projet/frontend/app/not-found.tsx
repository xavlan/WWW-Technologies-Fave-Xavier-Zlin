import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground" data-testid="not-found-message">
        The page you are looking for does not exist.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={cn(buttonVariants())}>
          Go home
        </Link>
        <Link href="/components" className={cn(buttonVariants({ variant: 'outline' }))}>
          Browse catalog
        </Link>
      </div>
    </div>
  );
}
