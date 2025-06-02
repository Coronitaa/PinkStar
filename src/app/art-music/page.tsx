
import { getArtMusicItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const ArtMusicItemsPageContent = dynamic(
  () => import('./ArtMusicItemsPageContent').then(mod => mod.ArtMusicItemsPageContent),
  { 
    ssr: false,
    loading: () => <LoadingSpinner text="Loading art & music..." />
  }
);

export default async function ArtMusicPage() {
  const artMusicItemsWithDetails: ItemWithDetails[] = await getArtMusicItemsWithDetails();
  return (
    <ArtMusicItemsPageContent initialItems={artMusicItemsWithDetails} />
  );
}

export const revalidate = 3600;
