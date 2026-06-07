'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SpecsKeyValueBuilderProps {
  value: Record<string, string | number | boolean>;
  onChange: (value: Record<string, string | number | boolean>) => void;
  errors?: string;
}

export function SpecsKeyValueBuilder({ value, onChange, errors }: SpecsKeyValueBuilderProps) {
  const entries = Object.entries(value);

  const updateEntry = (index: number, key: 'key' | 'val', newValue: string) => {
    const nextEntries = [...entries];
    const [currentKey, currentVal] = nextEntries[index] ?? ['', ''];

    if (key === 'key') {
      nextEntries[index] = [newValue, currentVal];
    } else {
      nextEntries[index] = [currentKey, newValue];
    }

    onChange(Object.fromEntries(nextEntries.filter(([k]) => k.trim() !== '')));
  };

  const addRow = () => {
    onChange({ ...value, '': '' });
  };

  const removeRow = (index: number) => {
    const nextEntries = entries.filter((_, i) => i !== index);
    onChange(Object.fromEntries(nextEntries));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Specifications</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Add spec
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No specifications added yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, val], index) => (
            <div key={`${key}-${index}`} className="flex gap-2">
              <Input
                placeholder="Key (e.g. cores)"
                value={key}
                onChange={(event) => updateEntry(index, 'key', event.target.value)}
              />
              <Input
                placeholder="Value (e.g. 16)"
                value={String(val)}
                onChange={(event) => updateEntry(index, 'val', event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                aria-label="Remove specification"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {errors && <p className="text-sm text-destructive">{errors}</p>}
    </div>
  );
}
