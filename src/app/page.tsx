
import { getGamesWithDetails } from '@/lib/data';
import type { Game, Category } from '@/lib/types';
import { HomePageContent } from './HomePageContent';

export interface GameWithDetails extends Game {
  categories: Category[];
  stats: {
    totalResources: number;
    totalDownloads: number;
  };
}

export default async function HomePage() {
  // This data is fetched on the server initially
  const gamesWithDetails: GameWithDetails[] = await getGamesWithDetails();

  return (
    <HomePageContent initialGames={gamesWithDetails} />
  );
}

export const revalidate = 3600; // Revalidate data every hour
