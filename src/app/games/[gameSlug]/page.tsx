
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoriesForItemGeneric, getHighlightedResources, getItemStatsGeneric, formatNumberWithSuffix } from '@/lib/data';
import type { Category, Game, Resource } from '@/lib/types';
import { TagBadge } from '@/components/shared/TagBadge';
import { Card, CardContent } from '@/components/ui/card';
import { GamePageContent } from './GamePageContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Layers, Download, Heart, Package } from 'lucide-react';

interface GamePageProps {
  params: { gameSlug: string };
}

const CAROUSEL_ITEMS_TO_SHOW_ON_GAME_PAGE = 5;
const FETCH_ITEMS_FOR_GAME_PAGE_CAROUSEL = CAROUSEL_ITEMS_TO_SHOW_ON_GAME_PAGE + 5;

export default async function GamePage({ params }: GamePageProps) {
  const game = await getGameBySlug(params.gameSlug);
  if (!game) {
    notFound();
  }

  const categories = await getCategoriesForItemGeneric(params.gameSlug, 'game');
  const stats = await getItemStatsGeneric(params.gameSlug, 'game');

  const initialCategoryResources: Record<string, Resource[]> = {};
  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category && typeof category.slug === 'string') {
        try {
          initialCategoryResources[category.slug] = await getHighlightedResources(params.gameSlug, 'game', category.slug, FETCH_ITEMS_FOR_GAME_PAGE_CAROUSEL);
        } catch (error) {
          console.error(`Error fetching highlighted resources for category ${category.slug} in game ${params.gameSlug}:`, error);
          initialCategoryResources[category.slug] = []; 
        }
      } else {
        console.warn('Skipping invalid category object:', category);
      }
    }
  }


  return (
    <div className="space-y-8"> 
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/games">Games</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{game.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative -mx-4 -mt-4"> 
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
              <div className="mt-3 flex items-center space-x-4 sm:space-x-6 text-sm text-muted-foreground">
                <span className="flex items-center" title={`${stats.totalResources.toLocaleString()} resources`}>
                  <Package className="w-4 h-4 mr-1.5 text-accent" />
                  {formatNumberWithSuffix(stats.totalResources)}
                </span>
                {stats.totalDownloads !== undefined && (
                  <span className="flex items-center" title={`${stats.totalDownloads.toLocaleString()} downloads`}>
                    <Download className="w-4 h-4 mr-1.5 text-accent" />
                    {formatNumberWithSuffix(stats.totalDownloads)}
                  </span>
                )}
                <span className="flex items-center" title={`${stats.totalFollowers.toLocaleString()} followers/likes`}>
                  <Heart className="w-4 h-4 mr-1.5 text-accent" />
                  {formatNumberWithSuffix(stats.totalFollowers)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {game.longDescription && (
        <section className="pt-4"> 
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
