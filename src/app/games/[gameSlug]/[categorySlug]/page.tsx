
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGameBySlug, getCategoryDetails, getResources, getAvailableFilterTags } from '@/lib/data';
import type { Game, Category, Resource, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourceListItem } from '@/components/resource/ResourceListItem';
import { ResourceFilterControls } from '@/components/resource/ResourceFilterControls';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, ListFilter, Layers } from 'lucide-react';
import { CategoryPageClientControls } from './CategoryPageClientControls';


interface CategoryPageProps {
  params: { gameSlug: string; categorySlug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const game = await getGameBySlug(params.gameSlug);
  const category = await getCategoryDetails(params.gameSlug, params.categorySlug);

  if (!game || !category) {
    notFound();
  }

  const versionFilters = typeof searchParams.versions === 'string' ? searchParams.versions.split(',') : [];
  const loaderFilters = typeof searchParams.loaders === 'string' ? searchParams.loaders.split(',') : [];
  const activeTagFilters = [...versionFilters, ...loaderFilters].filter(Boolean);
  
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const sortBy = (typeof searchParams.sort === 'string' ? searchParams.sort : 'relevance') as 'relevance' | 'downloads' | 'updatedAt' | 'name';

  const resources = await getResources({ 
    gameSlug: params.gameSlug, 
    categorySlug: params.categorySlug, 
    tags: activeTagFilters,
    searchQuery,
    sortBy,
  });
  const availableFilterTags = await getAvailableFilterTags(params.gameSlug, params.categorySlug);

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><Link href="/" className="hover:text-primary">Home</Link></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><Link href={`/games/${game.slug}`} className="hover:text-primary">{game.name}</Link></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{category.name}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="pb-4 border-b">
        <div className="flex items-center space-x-3">
            <Layers className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">{category.name}</h1>
        </div>
        {category.description && <p className="mt-2 text-lg text-muted-foreground">{category.description}</p>}
      </header>

      <CategoryPageClientControls
        initialSearchQuery={searchQuery}
        initialSortBy={sortBy}
      >
        {(currentSearchQuery, currentSortBy, handleSearchChange, handleSortChange) => (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) && (
              <aside className="md:col-span-3 lg:col-span-3 space-y-6">
                <ResourceFilterControls availableTags={availableFilterTags} />
              </aside>
            )}
            
            <main className={(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) ? "md:col-span-9 lg:col-span-9" : "md:col-span-12"}>
              <div className="mb-6 p-4 border rounded-lg bg-card">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={`Search in ${category.name}...`}
                      className="pl-10 w-full"
                      value={currentSearchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                  <Select value={currentSortBy} onValueChange={(value) => handleSortChange(value as typeof sortBy)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                      <SelectItem value="updatedAt">Last Updated</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {resources.length > 0 ? (
                <div className="space-y-4">
                  {resources.map(resource => (
                    <ResourceListItem key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                    <Image src="https://placehold.co/128x128/1f1f1f/4a4a4a?text=:(" alt="No results" width={128} height={128} className="mx-auto mb-4 rounded-lg" data-ai-hint="sad face emoji" />
                    <p className="text-xl font-semibold text-foreground">No resources found</p>
                    <p className="text-muted-foreground">
                        {activeTagFilters.length > 0 || searchQuery ? "Try adjusting your filters or search terms." : `No resources in ${category.name} for ${game.name} yet. Stay tuned!`}
                    </p>
                </div>
              )}
              {/* TODO: Pagination controls */}
            </main>
          </div>
        )}
      </CategoryPageClientControls>
    </div>
  );
}

export const revalidate = 3600; // Revalidate data every hour

