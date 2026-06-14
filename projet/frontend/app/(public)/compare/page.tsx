import { Metadata } from 'next';
import { ComparePageClient } from '@/components/compare/ComparePageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Compare Components',
  description: 'Compare two components side-by-side',
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ComparePageClient />
    </div>
  );
}
