'use client';

import { Button } from '@/components/ui/button';
import type { PaginationMeta } from '@/types/api';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-8">
      <Button
        variant="outline"
        disabled={meta.page <= 1}
        onClick={() => onPageChange(meta.page - 1)}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {meta.page} of {meta.totalPages}
      </span>
      <Button
        variant="outline"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPageChange(meta.page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
