import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoryDetails, getResources, getAvailableFilterTags, getCategoriesForGame } from '@/lib/data';
import type { Game, Category, Resource, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, PlusCircle, ArrowLeft } from 'lucide-react';
import { CategoryPageContent } from './CategoryPageContent';
import { cn } from '@/lib/utils';

const RESOURCES_PER_PAGE = 20;
const MAX_VISIBLE_CATEGORY_TABS = 5;

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
  const genreFilters = typeof searchParams.genres === 'string' ? searchParams.genres.split(',') : [];
  const miscFilters = typeof searchParams.misc === 'string' ? searchParams.misc.split(',') : [];
  const channelFilters = typeof searchParams.channels === 'string' ? searchParams.channels.split(',') : [];

  const activeTagFilters = [...versionFilters, ...loaderFilters, ...genreFilters, ...miscFilters, ...channelFilters].filter(Boolean);

  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const sortBy = (typeof searchParams.sort === 'string' ? searchParams.sort : (searchQuery ? 'relevance' : 'downloads')) as SortByType;

  const { resources: initialResources, total: initialTotal, hasMore: initialHasMore } = await getResources({
    gameSlug: params.gameSlug,
    categorySlug: params.categorySlug,
    tags: activeTagFilters.length > 0 ? activeTagFilters : undefined,
    searchQuery,
    sortBy,
    page: 1,
    limit: RESOURCES_PER_PAGE,
  });

  const availableFilterTags = await getAvailableFilterTags(params.gameSlug, params.categorySlug);

  const visibleCategories = allGameCategories.length > MAX_VISIBLE_CATEGORY_TABS
    ? allGameCategories.slice(0, MAX_VISIBLE_CATEGORY_TABS)
    : allGameCategories;
  const showMoreCategoriesButton = allGameCategories.length > MAX_VISIBLE_CATEGORY_TABS;


  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/games">Games</BreadcrumbLink></BreadcrumbItem>
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
        <div className="mb-6 border-b pb-2">
          <div className="flex justify-between items-center">
            <Tabs defaultValue={currentCategory.slug} className="overflow-x-auto whitespace-nowrap scrollbar-hide">
              <TabsList className="inline-flex justify-start gap-1 bg-transparent p-0 w-max">
                {visibleCategories.map(cat => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.slug}
                    asChild
                    className={cn(
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted/50 px-3 py-1.5 h-auto text-sm",
                      cat.slug === currentCategory.slug && "bg-primary text-primary-foreground shadow-md"
                    )}
                  >
                    <Link href={`/games/${game.slug}/${cat.slug}`}>{cat.name}</Link>
                  </TabsTrigger>
                ))}
                {showMoreCategoriesButton && (
                  <Button variant="ghost" size="sm" asChild className="ml-2 text-sm h-auto py-1.5 px-2.5 hover:bg-muted/50">
                     <Link href={`/games/${game.slug}`} title={`View all categories for ${game.name}`}>
                        <PlusCircle className="w-4 h-4 mr-1.5" /> More
                    </Link>
                  </Button>
                )}
              </TabsList>
            </Tabs>
            <Button variant="outline" className="ml-4 shrink-0">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Resource
            </Button>
          </div>
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

export const revalidate = 3600;
