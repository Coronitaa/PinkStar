
import { getGamesWithDetails } from '@/lib/data';
import { GameCard } from '@/components/game/GameCard';
import type { Game, Category } from '@/lib/types'; // Ensure Category is imported if used for props

interface GameWithDetails extends Game {
  categories: Category[];
  stats: {
    totalResources: number;
    totalDownloads: number;
  };
}

export default async function HomePage() {
  const gamesWithDetails: GameWithDetails[] = await getGamesWithDetails();

  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl drop-shadow-lg">
          Welcome to <span className="animate-pulse">PinkStar</span>
        </h1>
        <p className="mt-6 text-xl leading-8 text-foreground/80 max-w-2xl mx-auto">
          Discover, download, and enhance your favorite games with our curated collection of resources.
        </p>
      </section>

      <section>
        <h2 className="text-4xl font-semibold mb-8 pb-3 border-b-2 border-primary/30 text-center">Available Games</h2>
        {gamesWithDetails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gamesWithDetails.map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                categories={game.categories} 
                stats={game.stats} 
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10 text-lg">No games available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
