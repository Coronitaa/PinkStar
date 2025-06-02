
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArtMusicItemBySlug, getCategoriesForItemGeneric, getHighlightedResources, getItemStatsGeneric, formatNumberWithSuffix } from '@/lib/data';
import type { ArtMusicItem, Category, Resource } from '@/lib/types';
import { TagBadge } from '@/components/shared/TagBadge';
import { Card, CardContent } from '@/components/ui/card';
import { ArtMusicItemPageContent } from './ArtMusicItemPageContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Layers, Download, Heart, Package, Music } from 'lucide-react';

interface ArtMusicItemPageProps {
  params: { artMusicSlug: string };
}

const CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE = 5;
const FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL = CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE + 5;

export default async function ArtMusicItemPage({ params }: ArtMusicItemPageProps) {
  const artMusicItem = await getArtMusicItemBySlug(params.artMusicSlug);
  if (!artMusicItem) {
    notFound();
  }

  const categories = await getCategoriesForItemGeneric(params.artMusicSlug, 'art-music');
  const stats = await getItemStatsGeneric(params.artMusicSlug, 'art-music');

  const initialCategoryResources: Record<string, Resource[]> = {};
  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category && typeof category.slug === 'string') {
        try {
          initialCategoryResources[category.slug] = await getHighlightedResources(params.artMusicSlug, 'art-music', category.slug, FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL);
        } catch (error) {
          console.error(`Error fetching highlighted resources for category ${category.slug} in art/music item ${params.artMusicSlug}:`, error);
          initialCategoryResources[category.slug] = [];
        }
      } else {
        console.warn('Skipping invalid category object for art/music item:', category);
      }
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/art-music">Art &amp; Music</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{artMusicItem.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative -mx-4 -mt-4">
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={artMusicItem.bannerUrl}
            alt={`${artMusicItem.name} banner`}
            fill
            style={{objectFit:"cover"}}
            priority // Added for LCP optimization
            data-ai-hint="abstract art music visual"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <div className="container max-w-screen-2xl relative -mt-16 md:-mt-20 px-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Image
              src={artMusicItem.iconUrl}
              alt={`${artMusicItem.name} icon`}
              width={128}
              height={128}
              className="rounded-lg border-4 border-background shadow-xl"
              priority // Added for LCP optimization
              data-ai-hint="album art illustration"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">{artMusicItem.name}</h1>
              {artMusicItem.artistName && <p className="text-xl text-primary/90 mt-1">By {artMusicItem.artistName}</p>}
              <p className="text-lg text-muted-foreground mt-1">{artMusicItem.description}</p>
              {artMusicItem.tags && artMusicItem.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {artMusicItem.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)}
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
                <span className="flex items-center" title={`${stats.totalFollowers.toLocaleString()} followers`}>
                  <Heart className="w-4 h-4 mr-1.5 text-accent fill-accent" />
                  {formatNumberWithSuffix(stats.totalFollowers)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {artMusicItem.longDescription && (
        <section className="pt-4">
            <Card>
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-line">{artMusicItem.longDescription}</p>
                </CardContent>
            </Card>
        </section>
      )}

      <ArtMusicItemPageContent
        item={artMusicItem}
        categories={categories}
        initialCategoryResources={initialCategoryResources}
      />
    </div>
  );
}

export const revalidate = 3600;
