import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoriesForGame, getHighlightedResources, getResources, getAvailableFilterTags } from '@/lib/data';
import type { Category, Resource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { ResourceListItem } from '@/components/resource/ResourceListItem';
import { ResourceFilterControls } from '@/components/resource/ResourceFilterControls';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { TagBadge } from '@/components/shared/TagBadge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight } from 'lucide-react';

interface GamePageProps {
  params: { gameSlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const game = await getGameBySlug(params.gameSlug);
  if (!game) {
    notFound();
  }

  const categories = await getCategoriesForGame(params.gameSlug);

  // Handle filtering from searchParams
  const versionFilters = typeof searchParams.versions === 'string' ? searchParams.versions.split(',') : [];
  const loaderFilters = typeof searchParams.loaders === 'string' ? searchParams.loaders.split(',') : [];
  const activeTagFilters = [...versionFilters, ...loaderFilters].filter(Boolean);


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


      {categories.map(async (category) => {
        const highlightedResources = await getHighlightedResources(params.gameSlug, category.slug, 5);
        const allCategoryResources = await getResources({ gameSlug: params.gameSlug, categorySlug: category.slug, tags: activeTagFilters });
        const availableFilterTags = await getAvailableFilterTags(params.gameSlug, category.slug);
        
        const categoryPageLink = `/games/${params.gameSlug}/${category.slug}`;

        return (
          <section key={category.id} className="space-y-6 py-6 border-t border-border/40 first:border-t-0">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-semibold">{category.name}</h2>
                {/* <Button variant="link" asChild>
                    <Link href={categoryPageLink}>View all <ChevronRight className="w-4 h-4 ml-1" /></Link>
                </Button> */}
            </div>
            {category.description && <p className="text-muted-foreground">{category.description}</p>}

            {highlightedResources.length > 0 && (
              <div>
                <h3 className="text-xl font-medium mb-3 text-accent">Highlights</h3>
                <Carousel>
                  {highlightedResources.map(resource => (
                    <CarouselItem key={resource.id}>
                      <ResourceCard resource={resource} compact />
                    </CarouselItem>
                  ))}
                </Carousel>
              </div>
            )}
            
            <Separator className="my-8" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) && (
                <div className="md:col-span-3 lg:col-span-3">
                   <ResourceFilterControls availableTags={availableFilterTags} />
                </div>
              )}
              
              <div className={(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) ? "md:col-span-9 lg:col-span-9" : "md:col-span-12"}>
                {allCategoryResources.length > 0 ? (
                  <div className="space-y-4">
                    {allCategoryResources.map(resource => (
                      <ResourceListItem key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {activeTagFilters.length > 0 ? "No resources match the current filters." : "No resources in this category yet. Stay tuned!"}
                  </p>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
