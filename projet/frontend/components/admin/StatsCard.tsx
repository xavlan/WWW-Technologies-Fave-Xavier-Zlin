import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'text-primary',
  warning: 'text-amber-600',
  danger: 'text-red-600',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  variant = 'default',
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn('h-5 w-5', variantStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className={cn('text-3xl font-bold', variantStyles[variant])}>{value}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
