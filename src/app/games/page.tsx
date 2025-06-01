
import { getGamesWithDetails } from '@/lib/data';
import type { ItemWithDetails } from '@/lib/types'; // Use generalized type
import { GamesPageContent } from './GamesPageContent';

export default async function GamesPage() {
  const gamesWithDetails: ItemWithDetails[] = await getGamesWithDetails();
  return (
    <GamesPageContent initialItems={gamesWithDetails} />
  );
}

export const revalidate = 3600;
