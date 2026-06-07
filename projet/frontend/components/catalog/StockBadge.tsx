import type { StockStatus } from '@/types/component';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const stockConfig: Record<
  StockStatus,
  { label: string; className: string }
> = {
  in_stock: {
    label: 'In Stock',
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  low_stock: {
    label: 'Low Stock',
    className: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
};

interface StockBadgeProps {
  status: StockStatus;
  className?: string;
}

export function StockBadge({ status, className }: StockBadgeProps) {
  const config = stockConfig[status];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
