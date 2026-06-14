import { Metadata } from 'next';
import { PCBuilderPageClient } from '@/components/pc-builder/PCBuilderPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'PC Builder',
  description: 'Build your custom PC with our component selector',
};

export default function PCBuilderPage() {
  return <PCBuilderPageClient />;
}
