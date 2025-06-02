
import { getArtMusicItemsWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { ArtMusicPageClientLoader } from './ArtMusicPageClientLoader';

export default async function ArtMusicPage() {
  const artMusicItemsWithDetails: ItemWithDetails[] = await getArtMusicItemsWithDetails();
  return (
    <ArtMusicPageClientLoader initialItems={artMusicItemsWithDetails} />
  );
}

export const revalidate = 3600;
