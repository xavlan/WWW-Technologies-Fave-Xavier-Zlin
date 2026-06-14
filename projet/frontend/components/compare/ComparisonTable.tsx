import type { Component } from '@/types/component';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComparisonTableProps {
  component1: Component;
  component2: Component;
}

export function ComparisonTable({ component1, component2 }: ComparisonTableProps) {
  const allSpecs = new Set<string>();
  Object.keys(component1.specifications).forEach((key) => allSpecs.add(key));
  Object.keys(component2.specifications).forEach((key) => allSpecs.add(key));

  const specs = Array.from(allSpecs).sort();

  const getValue = (value: unknown) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value ?? '-');
  };

  const isDifferent = (spec: string): boolean => {
    const val1 = getValue(component1.specifications[spec]);
    const val2 = getValue(component2.specifications[spec]);
    return val1 !== val2;
  };

  const highlightClass = (spec: string) =>
    isDifferent(spec) ? 'bg-yellow-50 dark:bg-yellow-950/30 font-semibold' : '';

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Specification</TableHead>
            <TableHead className="min-w-48">{component1.name}</TableHead>
            <TableHead className="min-w-48">{component2.name}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Brand</TableCell>
            <TableCell
              className={
                component1.brand !== component2.brand ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
              }
            >
              {component1.brand}
            </TableCell>
            <TableCell
              className={
                component1.brand !== component2.brand ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
              }
            >
              {component2.brand}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Model</TableCell>
            <TableCell
              className={
                component1.model !== component2.model ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
              }
            >
              {component1.model}
            </TableCell>
            <TableCell
              className={
                component1.model !== component2.model ? 'bg-yellow-50 dark:bg-yellow-950/30' : ''
              }
            >
              {component2.model}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Price</TableCell>
            <TableCell
              className={
                Number(component1.price) !== Number(component2.price)
                  ? 'bg-yellow-50 font-semibold dark:bg-yellow-950/30'
                  : 'font-semibold'
              }
            >
              ${Number(component1.price).toFixed(2)}
            </TableCell>
            <TableCell
              className={
                Number(component1.price) !== Number(component2.price)
                  ? 'bg-yellow-50 font-semibold dark:bg-yellow-950/30'
                  : 'font-semibold'
              }
            >
              ${Number(component2.price).toFixed(2)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="font-medium">Stock</TableCell>
            <TableCell>
              <span
                className={
                  component1.stock === 0
                    ? 'text-destructive'
                    : component1.stock <= 5
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }
              >
                {component1.stock} units
              </span>
            </TableCell>
            <TableCell>
              <span
                className={
                  component2.stock === 0
                    ? 'text-destructive'
                    : component2.stock <= 5
                      ? 'text-yellow-600'
                      : 'text-green-600'
                }
              >
                {component2.stock} units
              </span>
            </TableCell>
          </TableRow>

          {specs.map((spec) => (
            <TableRow key={spec}>
              <TableCell className={`font-medium capitalize ${highlightClass(spec)}`}>
                {spec}
              </TableCell>
              <TableCell className={highlightClass(spec)}>
                {getValue(component1.specifications[spec])}
              </TableCell>
              <TableCell className={highlightClass(spec)}>
                {getValue(component2.specifications[spec])}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="border-t bg-muted/30 px-6 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="inline-block h-3 w-3 rounded bg-yellow-200 align-middle"></span>
          <span className="ml-2">Highlighted rows show differences</span>
        </p>
      </div>
    </div>
  );
}
