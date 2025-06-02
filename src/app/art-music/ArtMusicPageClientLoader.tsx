
'use client';

import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { ItemWithDetails } from '@/lib/types';

const ArtMusicItemsPageContent = dynamic(
  () => import('./ArtMusicItemsPageContent').then(mod => mod.ArtMusicItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading art & music..." />
  }
);

interface ArtMusicPageClientLoaderProps {
  initialItems: ItemWithDetails[];
}

export function ArtMusicPageClientLoader({ initialItems }: ArtMusicPageClientLoaderProps) {
  return <ArtMusicItemsPageContent initialItems={initialItems} />;
}
