import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  showText?: boolean;
  className?: string;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

const wordmarkHeights = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-11',
};

const wordmarkWidths = {
  sm: 'w-[72px]',
  md: 'w-[96px]',
  lg: 'w-[132px]',
};

export function Logo({ showText = false, className, href = '/', size = 'md' }: LogoProps) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'TechInventory';

  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-2 text-primary', className)}
      aria-label={`${appName} home`}
    >
      <Image
        src="/logo-tech.svg"
        alt="TECH"
        width={200}
        height={52}
        className={cn('shrink-0 object-contain', wordmarkHeights[size], wordmarkWidths[size])}
        priority
      />
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-muted-foreground">
          Inventory
        </span>
      )}
    </Link>
  );
}
