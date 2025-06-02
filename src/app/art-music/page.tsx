
import { getArtMusicItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { ArtMusicItemsPageContent } from './ArtMusicItemsPageContent';

export default async function ArtMusicPage() {
  const artMusicItemsWithDetails: ItemWithDetails[] = await getArtMusicItemsWithDetails();
  return (
    <ArtMusicItemsPageContent initialItems={artMusicItemsWithDetails} />
  );
}

export const revalidate = 3600;
