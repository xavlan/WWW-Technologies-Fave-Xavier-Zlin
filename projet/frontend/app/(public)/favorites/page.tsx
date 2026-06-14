import { Metadata } from 'next';
import { FavoritesPageClient } from '@/components/favorites/FavoritesPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View your favorite components',
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
