
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { Resource, Tag, Category as CategoryType, PaginatedResourcesResponse, GetResourcesParams } from '@/lib/types';
import { ResourceListItem } from '@/components/resource/ResourceListItem';
import { ResourceFilterControls } from '@/components/resource/ResourceFilterControls';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ListFilter, Info, Upload } from 'lucide-react';
import { fetchPaginatedResourcesAction } from '@/app/actions/resourceActions';

const RESOURCES_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 500;

type SortByType = 'relevance' | 'downloads' | 'updatedAt' | 'name';

interface CategoryPageContentProps {
  initialResources: Resource[];
  initialHasMore: boolean;
  initialTotal: number;
  gameSlug: string;
  categorySlug: string;
  availableFilterTags: { versions: Tag[]; loaders: Tag[]; genres: Tag[]; misc: Tag[]; channels: Tag[] };
  gameName: string;
  categoryName: string;
}

export function CategoryPageContent({
  initialResources,
  initialHasMore,
  initialTotal,
  gameSlug,
  categorySlug,
  availableFilterTags,
  gameName,
  categoryName,
}: CategoryPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavPending, startNavTransition] = useTransition();
  const [isDataLoading, startDataTransition] = useTransition();

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalResources, setTotalResources] = useState(initialTotal);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [searchQueryInput, setSearchQueryInput] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortByType>(() => {
    const qFromUrl = searchParams.get('q') || '';
    const sortParam = searchParams.get('sort') as SortByType;
    return sortParam || (qFromUrl ? 'relevance' : 'downloads');
  });
  
  const activeTagFiltersRef = useRef<string[]>([]);

  // Sync controlled inputs with URL on initial load or direct URL change
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    setSearchQueryInput(qFromUrl); 

    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
    } else {
      setSortBy(qFromUrl ? 'relevance' : 'downloads');
    }

    const versionFilters = searchParams.get('versions')?.split(',').filter(Boolean) || [];
    const loaderFilters = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
    const genreFilters = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    const miscFilters = searchParams.get('misc')?.split(',').filter(Boolean) || [];
    const channelFilters = searchParams.get('channels')?.split(',').filter(Boolean) || [];
    activeTagFiltersRef.current = [...versionFilters, ...loaderFilters, ...genreFilters, ...miscFilters, ...channelFilters];

  }, [searchParams]);


  const fetchAndSetResources = useCallback(async (page: number, options?: { isNewSearchOrFilter?: boolean }) => {
    startDataTransition(async () => {
      const currentQ = searchParams.get('q') || '';
      const currentSort = (searchParams.get('sort') as SortByType) || (currentQ ? 'relevance' : 'downloads');
      
      const versionFilters = searchParams.get('versions')?.split(',').filter(Boolean) || [];
      const loaderFilters = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
      const genreFilters = searchParams.get('genres')?.split(',').filter(Boolean) || [];
      const miscFilters = searchParams.get('misc')?.split(',').filter(Boolean) || [];
      const channelFilters = searchParams.get('channels')?.split(',').filter(Boolean) || [];
      const currentTags = [...versionFilters, ...loaderFilters, ...genreFilters, ...miscFilters, ...channelFilters];

      const params: GetResourcesParams = {
        gameSlug,
        categorySlug,
        page,
        limit: RESOURCES_PER_PAGE,
        searchQuery: currentQ || undefined, 
        sortBy: currentSort,
        tags: currentTags.length > 0 ? currentTags : undefined,
      };
      
      try {
        const data = await fetchPaginatedResourcesAction(params);
        if (page === 1 || options?.isNewSearchOrFilter) {
          setResources(data.resources);
          setCurrentPage(1); 
        } else {
          setResources((prev) => [...prev, ...data.resources]);
          setCurrentPage(page);
        }
        setHasMore(data.hasMore);
        setTotalResources(data.total);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    });
  }, [gameSlug, categorySlug, searchParams, startDataTransition]);


   useEffect(() => {
    fetchAndSetResources(1, { isNewSearchOrFilter: true });
  }, [searchParams, fetchAndSetResources]);


  const loadMoreResources = useCallback(() => {
    if (isDataLoading || !hasMore || isNavPending) return;
    fetchAndSetResources(currentPage + 1);
  }, [isDataLoading, hasMore, currentPage, fetchAndSetResources, isNavPending]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isDataLoading && !isNavPending) {
        loadMoreResources();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, isDataLoading, isNavPending, loadMoreResources]);
  
  const updateUrlParams = useCallback((newParams: Record<string, string | undefined | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value.length > 0) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    startNavTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQueryInput !== (searchParams.get('q') || '')) {
         updateUrlParams({ q: searchQueryInput });
      }
    }, SEARCH_DEBOUNCE_MS); 
    return () => clearTimeout(handler);
  }, [searchQueryInput, searchParams, updateUrlParams]);


  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQueryInput(e.target.value);
  };

  const handleSortChange = (value: SortByType) => {
    updateUrlParams({ sort: value });
  };

  const handleFilterChange = useCallback((tags: { versions?: string; loaders?: string; genres?: string; misc?: string, channels?:string }) => {
    updateUrlParams({ 
      versions: tags.versions, 
      loaders: tags.loaders,
      genres: tags.genres,
      misc: tags.misc,
      channels: tags.channels
    });
  }, [updateUrlParams]);
  
  const isLoadingFirstPage = isDataLoading && currentPage === 1;
  const isLoadingMore = isDataLoading && currentPage > 1;
  const totalPages = Math.ceil(totalResources / RESOURCES_PER_PAGE) || 1;

  const hasActiveFiltersOrSearch = activeTagFiltersRef.current.length > 0 || (searchParams.get('q') || '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0 || availableFilterTags.genres.length > 0 || availableFilterTags.misc.length > 0 || availableFilterTags.channels.length > 0) && (
        <aside className="md:col-span-3 lg:col-span-3 space-y-6">
          <ResourceFilterControls 
            availableTags={availableFilterTags} 
            onFilterChangeCallback={handleFilterChange}
          />
        </aside>
      )}

      <main className={(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0 || availableFilterTags.genres.length > 0 || availableFilterTags.misc.length > 0 || availableFilterTags.channels.length > 0) ? "md:col-span-9 lg:col-span-9" : "md:col-span-12"}>
        <div className="mb-6 p-4 border rounded-lg bg-card shadow">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto"> 
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search in ${categoryName}...`}
                className="pl-10 w-full sm:min-w-[250px] md:min-w-[300px]"
                value={searchQueryInput}
                onChange={handleSearchInputChange}
              />
            </div>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-auto min-w-[160px]"> 
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
        
        {(isNavPending || isLoadingFirstPage) && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!(isNavPending || isLoadingFirstPage) && resources.length > 0 && (
          <div className="space-y-4">
            {resources.map(resource => (
              <ResourceListItem key={resource.id} resource={resource} />
            ))}
          </div>
        )}
        
        {!(isNavPending || isLoadingFirstPage) && resources.length === 0 && (
          <div className="text-center py-12">
            <Image src="https://placehold.co/128x128/1f1f1f/E64A8B?text=:(" alt="No results" width={128} height={128} className="mx-auto mb-4 rounded-lg opacity-70" data-ai-hint="sad face emoji"/>
            <p className="text-xl font-semibold text-foreground">No resources found</p>
            <p className="text-muted-foreground">
              {hasActiveFiltersOrSearch ? "Try adjusting your filters or search terms." : `No resources in ${categoryName} for ${gameName} yet.`}
            </p>
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div ref={loadMoreRef} className="h-10" /> 

        {!(isDataLoading || isNavPending) && resources.length > 0 && (
          <div className="py-6 text-center text-muted-foreground">
            {hasMore ? (
              <p>Loading more...</p>
            ) : (
              <p>You've reached the end of the list.</p>
            )}
            <p className="text-sm mt-1">Page {currentPage} of {totalPages} ({totalResources} resources total)</p>
          </div>
        )}
      </main>
    </div>
  );
}

    