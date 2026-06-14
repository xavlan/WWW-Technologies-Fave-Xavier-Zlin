'use client';



import { useState } from 'react';

import Image from 'next/image';

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

  const placeholderUrl = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(alt.slice(0, 20))}`;

  const imageSrc = !src || hasError ? placeholderUrl : src;



  return (

    <Image

      src={imageSrc}

      alt={alt}

      className={cn('object-cover', className)}

      fill={fill}

      width={fill ? undefined : width ?? 400}

      height={fill ? undefined : height ?? 300}

      priority={priority}

      onError={() => setHasError(true)}

      unoptimized

    />

  );

}

