import type { Component } from '@/types/component';

interface SpecsTableProps {
  specifications: Component['specifications'];
}

export function SpecsTable({ specifications }: SpecsTableProps) {
  const entries = Object.entries(specifications);

  if (entries.length === 0) {
    return <p className="text-muted-foreground">No specifications available.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b last:border-b-0">
              <th className="w-1/3 bg-muted/50 px-4 py-3 text-left font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </th>
              <td className="px-4 py-3">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
