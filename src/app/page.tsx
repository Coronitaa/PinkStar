import { getGames } from '@/lib/data';
import { GameCard } from '@/components/game/GameCard';

export default async function HomePage() {
  const games = await getGames();

  return (
    <div className="space-y-8">
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
          Welcome to PinkStar
        </h1>
        <p className="mt-4 text-lg leading-8 text-foreground/80">
          Discover, download, and enhance your favorite games.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 pb-2 border-b border-border">Available Games</h2>
        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No games available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
