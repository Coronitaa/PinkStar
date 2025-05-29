
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoryDetails, getResources, getAvailableFilterTags, getCategoriesForGame } from '@/lib/data';
import type { Game, Category, Resource, Tag } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers } from 'lucide-react';
import { CategoryPageContent } from './CategoryPageContent';

const RESOURCES_PER_PAGE = 20;

interface CategoryPageProps {
  params: { gameSlug: string; categorySlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

type SortByType = 'relevance' | 'downloads' | 'updatedAt' | 'name';

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const game = await getGameBySlug(params.gameSlug);
  const currentCategory = await getCategoryDetails(params.gameSlug, params.categorySlug);
  const allGameCategories = await getCategoriesForGame(params.gameSlug);

  if (!game || !currentCategory) {
    notFound();
  }

  const versionFilters = typeof searchParams.versions === 'string' ? searchParams.versions.split(',') : [];
  const loaderFilters = typeof searchParams.loaders === 'string' ? searchParams.loaders.split(',') : [];
  const activeTagFilters = [...versionFilters, ...loaderFilters].filter(Boolean);
  
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const sortBy = (typeof searchParams.sort === 'string' ? searchParams.sort : 'relevance') as SortByType;

  const { resources: initialResources, total: initialTotal, hasMore: initialHasMore } = await getResources({ 
    gameSlug: params.gameSlug, 
    categorySlug: params.categorySlug, 
    tags: activeTagFilters,
    searchQuery,
    sortBy,
    page: 1,
    limit: RESOURCES_PER_PAGE,
  });

  const availableFilterTags = await getAvailableFilterTags(params.gameSlug, params.categorySlug);

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/games/${game.slug}`}>{game.name}</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{currentCategory.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="pb-4">
        <div className="flex items-center space-x-3">
            <Layers className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">{currentCategory.name}</h1>
        </div>
        {currentCategory.description && <p className="mt-2 text-lg text-muted-foreground">{currentCategory.description}</p>}
      </header>

      {allGameCategories.length > 1 && (
        <div className="mb-6 border-b">
          <Tabs defaultValue={currentCategory.slug} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-auto gap-1 bg-transparent p-0">
              {allGameCategories.map(cat => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.slug} 
                  asChild
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/50"
                >
                  <Link href={`/games/${game.slug}/${cat.slug}`}>{cat.name}</Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <CategoryPageContent
        initialResources={initialResources}
        initialHasMore={initialHasMore}
        initialTotal={initialTotal}
        gameSlug={params.gameSlug}
        categorySlug={params.categorySlug}
        availableFilterTags={availableFilterTags}
        gameName={game.name}
        categoryName={currentCategory.name}
      />
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour
