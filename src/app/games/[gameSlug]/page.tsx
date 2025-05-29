import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoriesForGame, getHighlightedResources } from '@/lib/data';
import type { Category, Resource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { TagBadge } from '@/components/shared/TagBadge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Layers } from 'lucide-react';

interface GamePageProps {
  params: { gameSlug: string };
}

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.gameSlug);
  if (!game) {
    notFound();
  }

  const categories = await getCategoriesForGame(params.gameSlug);

  return (
    <div className="space-y-12">
      <section className="relative -mx-4 -mt-8"> {/* Stretch banner */}
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={game.bannerUrl}
            alt={`${game.name} banner`}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="game wallpaper"
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
              data-ai-hint="game logo"
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

      {categories.length > 0 ? (
        categories.map(async (category) => {
          const highlightedResources = await getHighlightedResources(params.gameSlug, category.slug, 5);
          const categoryPageLink = `/games/${params.gameSlug}/${category.slug}`;

          return (
            <section key={category.id} className="space-y-6 py-6 border-t border-border/40 first:border-t-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <Link href={categoryPageLink} className="group">
                    <h2 className="text-3xl font-semibold group-hover:text-primary transition-colors flex items-center">
                      <Layers className="w-7 h-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                      {category.name}
                    </h2>
                  </Link>
                  {category.description && <p className="text-muted-foreground mt-1 max-w-2xl">{category.description}</p>}
                </div>
                <Button variant="outline" asChild className="mt-3 sm:mt-0">
                    <Link href={categoryPageLink}>View all in {category.name} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
              

              {highlightedResources.length > 0 ? (
                <div className="mt-4">
                  <Carousel>
                    {highlightedResources.map(resource => (
                      <CarouselItem key={resource.id}>
                        <ResourceCard resource={resource} compact />
                      </CarouselItem>
                    ))}
                  </Carousel>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">No highlighted resources in this category yet.</p>
              )}
            </section>
          );
        })
      ) : (
        <section className="py-6 border-t border-border/40 first:border-t-0">
            <p className="text-muted-foreground text-center">No categories available for this game yet.</p>
        </section>
      )}
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
