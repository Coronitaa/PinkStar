
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoriesForGame, getHighlightedResources } from '@/lib/data';
import type { Category, Game, Resource } from '@/lib/types';
import { TagBadge } from '@/components/shared/TagBadge';
import { Card, CardContent } from '@/components/ui/card';
import { GamePageContent } from './GamePageContent'; 

interface GamePageProps {
  params: { gameSlug: string };
}

const CAROUSEL_ITEMS_TO_SHOW_ON_GAME_PAGE = 5; // Same as in GamePageContent
const FETCH_ITEMS_FOR_GAME_PAGE_CAROUSEL = CAROUSEL_ITEMS_TO_SHOW_ON_GAME_PAGE + 5;

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.gameSlug);
  if (!game) {
    notFound();
  }

  const categories = await getCategoriesForGame(params.gameSlug);

  const initialCategoryResources: Record<string, Resource[]> = {};
  for (const category of categories) {
    initialCategoryResources[category.slug] = await getHighlightedResources(params.gameSlug, category.slug, FETCH_ITEMS_FOR_GAME_PAGE_CAROUSEL); 
  }

  return (
    <div className="space-y-12">
      <section className="relative -mx-4 -mt-8">
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={game.bannerUrl}
            alt={`${game.name} banner`}
            fill 
            style={{objectFit:"cover"}} 
            priority
            data-ai-hint="game wallpaper splash"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <div className="container max-w-screen-2xl relative -mt-16 md:-mt-20 px-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Image
              src={game.iconUrl}
              alt={`${game.name} icon`}
              width={128}
              height={128}
              className="rounded-lg border-4 border-background shadow-xl"
              data-ai-hint="game icon avatar"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">{game.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{game.description}</p>
              {game.tags && game.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {game.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {game.longDescription && (
        <section>
            <Card>
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-line">{game.longDescription}</p>
                </CardContent>
            </Card>
        </section>
      )}
      
      <GamePageContent 
        game={game} 
        categories={categories} 
        initialCategoryResources={initialCategoryResources} 
      />

    </div>
  );
}

export const revalidate = 3600;
