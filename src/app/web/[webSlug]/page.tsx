
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getWebItemBySlug, getCategoriesForItemGeneric, getHighlightedResources, getItemStatsGeneric, formatNumberWithSuffix } from '@/lib/data';
import type { WebItem, Category, Resource } from '@/lib/types';
import { TagBadge } from '@/components/shared/TagBadge';
import { Card, CardContent } from '@/components/ui/card';
import { WebItemPageContent } from './WebItemPageContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Layers, Download, Heart, Package, Code } from 'lucide-react';

interface WebItemPageProps {
  params: { webSlug: string };
}

const CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE = 5;
const FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL = CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE + 5;

export default async function WebItemPage({ params }: WebItemPageProps) {
  const webItem = await getWebItemBySlug(params.webSlug);
  if (!webItem) {
    notFound();
  }

  const categories = await getCategoriesForItemGeneric(params.webSlug, 'web');
  const stats = await getItemStatsGeneric(params.webSlug, 'web');

  const initialCategoryResources: Record<string, Resource[]> = {};
  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category && typeof category.slug === 'string') {
        try {
          initialCategoryResources[category.slug] = await getHighlightedResources(params.webSlug, 'web', category.slug, FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL);
        } catch (error) {
          console.error(`Error fetching highlighted resources for category ${category.slug} in web item ${params.webSlug}:`, error);
          initialCategoryResources[category.slug] = [];
        }
      } else {
        console.warn('Skipping invalid category object for web item:', category);
      }
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/web">Web Projects</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{webItem.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative -mx-4 -mt-4">
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={webItem.bannerUrl}
            alt={`${webItem.name} banner`}
            fill
            style={{objectFit:"cover"}}
            priority // Added for LCP optimization
            data-ai-hint="web project screenshot modern"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <div className="container max-w-screen-2xl relative -mt-16 md:-mt-20 px-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Image
              src={webItem.iconUrl}
              alt={`${webItem.name} icon`}
              width={128}
              height={128}
              className="rounded-lg border-4 border-background shadow-xl"
              priority // Added for LCP optimization
              data-ai-hint="website logo abstract"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">{webItem.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{webItem.description}</p>
              {webItem.tags && webItem.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {webItem.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)}
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

      {webItem.longDescription && (
        <section className="pt-4">
            <Card>
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-line">{webItem.longDescription}</p>
                </CardContent>
            </Card>
        </section>
      )}

      <WebItemPageContent
        item={webItem}
        categories={categories}
        initialCategoryResources={initialCategoryResources}
      />
    </div>
  );
}

export const revalidate = 3600;
