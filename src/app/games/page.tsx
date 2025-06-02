
import { getGamesWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types';
import { GamesPageClientLoader } from './GamesPageClientLoader';

export default async function GamesPage() {
  const gamesWithDetails: ItemWithDetails[] = await getGamesWithDetails();
  return (
    <GamesPageClientLoader initialItems={gamesWithDetails} />
  );
}

export const revalidate = 3600;
