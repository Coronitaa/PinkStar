
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAppItemBySlug, getCategoriesForItemGeneric, getHighlightedResources, getItemStatsGeneric, formatNumberWithSuffix } from '@/lib/data';
import type { AppItem, Category, Resource } from '@/lib/types';
import { TagBadge } from '@/components/shared/TagBadge';
import { Card, CardContent } from '@/components/ui/card';
import { AppItemPageContent } from './AppItemPageContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Layers, Download, Heart, Package, TabletSmartphone } from 'lucide-react';

interface AppItemPageProps {
  params: { appSlug: string };
}

const CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE = 5;
const FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL = CAROUSEL_ITEMS_TO_SHOW_ON_ITEM_PAGE + 5;

export default async function AppItemPage({ params }: AppItemPageProps) {
  const appItem = await getAppItemBySlug(params.appSlug);
  if (!appItem) {
    notFound();
  }

  const categories = await getCategoriesForItemGeneric(params.appSlug, 'app');
  const stats = await getItemStatsGeneric(params.appSlug, 'app');

  const initialCategoryResources: Record<string, Resource[]> = {};
  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category && typeof category.slug === 'string') {
        try {
          initialCategoryResources[category.slug] = await getHighlightedResources(params.appSlug, 'app', category.slug, FETCH_ITEMS_FOR_ITEM_PAGE_CAROUSEL);
        } catch (error) {
          console.error(`Error fetching highlighted resources for category ${category.slug} in app item ${params.appSlug}:`, error);
          initialCategoryResources[category.slug] = [];
        }
      } else {
        console.warn('Skipping invalid category object for app item:', category);
      }
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/apps">Apps</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{appItem.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="relative -mx-4 -mt-4">
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={appItem.bannerUrl}
            alt={`${appItem.name} banner`}
            fill
            style={{objectFit:"cover"}}
            priority // Added for LCP optimization
            data-ai-hint="app interface screenshot modern"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <div className="container max-w-screen-2xl relative -mt-16 md:-mt-20 px-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <Image
              src={appItem.iconUrl}
              alt={`${appItem.name} icon`}
              width={128}
              height={128}
              className="rounded-lg border-4 border-background shadow-xl"
              priority // Added for LCP optimization
              data-ai-hint="app icon design"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground drop-shadow-md">{appItem.name}</h1>
              <p className="text-lg text-muted-foreground mt-1">{appItem.description}</p>
              {appItem.tags && appItem.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {appItem.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)}
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

      {appItem.longDescription && (
        <section className="pt-4">
            <Card>
                <CardContent className="p-6">
                    <p className="text-foreground/90 whitespace-pre-line">{appItem.longDescription}</p>
                </CardContent>
            </Card>
        </section>
      )}

      <AppItemPageContent
        item={appItem}
        categories={categories}
        initialCategoryResources={initialCategoryResources}
      />
    </div>
  );
}

export const revalidate = 3600;
