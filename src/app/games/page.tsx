import { getGamesWithDetails } from '@/lib/data';
import type { Game, Category } from '@/lib/types';
import { GamesPageContent } from './GamesPageContent';

export interface GameWithDetails extends Game {
  categories: Category[];
  stats: {
    totalResources: number;
    totalDownloads: number;
    totalFollowers: number;
  };
}

// Renamed from HomePage to GamesPage
export default async function GamesPage() {
  const gamesWithDetails: GameWithDetails[] = await getGamesWithDetails();
  return (
    <GamesPageContent initialGames={gamesWithDetails} />
  );
}

export const revalidate = 3600;
