'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComponentImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ComponentImage({
  src,
  alt,
  className,
  fill = false,
  width,
  height,
  priority = false,
}: ComponentImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className,
        )}
      >
        <Cpu className="h-10 w-10 opacity-50" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={cn('object-cover', className)}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      onError={() => setHasError(true)}
      unoptimized
    />
  );
}
