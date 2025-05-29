
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
import { Loader2, Search } from 'lucide-react';
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
  availableFilterTags: { versions: Tag[]; loaders: Tag[] };
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
    const q = searchParams.get('q') || '';
    const sortParam = searchParams.get('sort') as SortByType;
    return sortParam || (q ? 'relevance' : 'downloads');
  });
  
  const activeTagFiltersRef = useRef<string[]>([]);

  // Sync controlled inputs with URL on initial load or direct URL change
  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    // Do not trim qFromUrl here, respect spaces
    setSearchQueryInput(qFromUrl);

    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
    } else {
      // Default to relevance if searching (even with spaces), otherwise downloads
      setSortBy(qFromUrl ? 'relevance' : 'downloads');
    }

    const versionFilters = searchParams.get('versions')?.split(',').filter(Boolean) || [];
    const loaderFilters = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
    activeTagFiltersRef.current = [...versionFilters, ...loaderFilters];
  }, [searchParams]);


  const fetchAndSetResources = useCallback(async (page: number, queryOverride?: string, sortOverride?: SortByType, tagsOverride?: { versions?: string; loaders?: string }) => {
    startDataTransition(async () => {
      const currentQ = queryOverride !== undefined ? queryOverride : (searchParams.get('q') || '');
      const currentSort = sortOverride || (searchParams.get('sort') as SortByType) || (currentQ ? 'relevance' : 'downloads');
      const currentVersions = (tagsOverride?.versions || searchParams.get('versions'))?.split(',').filter(Boolean) || [];
      const currentLoaders = (tagsOverride?.loaders || searchParams.get('loaders'))?.split(',').filter(Boolean) || [];
      const currentTags = [...currentVersions, ...currentLoaders];

      const params: GetResourcesParams = {
        gameSlug,
        categorySlug,
        page,
        limit: RESOURCES_PER_PAGE,
        searchQuery: currentQ || undefined, // Send raw query
        sortBy: currentSort,
        tags: currentTags.length > 0 ? currentTags : undefined,
      };
      
      try {
        const data = await fetchPaginatedResourcesAction(params);
        if (page === 1) {
          setResources(data.resources);
        } else {
          // Append for infinite scroll
          setResources((prev) => [...prev, ...data.resources]);
        }
        setHasMore(data.hasMore);
        setTotalResources(data.total);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
        // Potentially set an error state here
      }
    });
  }, [gameSlug, categorySlug, searchParams, startDataTransition]); // Removed fetchAndSetResources from its own deps


  // Effect to fetch page 1 when URL parameters (filters, sort, query) change
   useEffect(() => {
    // This effect fetches page 1 if any relevant searchParam changes.
    // The initial load is handled by props from the server.
    // This ensures that client-side navigations or direct URL changes trigger a refresh.
    fetchAndSetResources(1);
  }, [searchParams, fetchAndSetResources]); // Only depends on searchParams and the memoized fetcher


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
        current.delete(key); // Remove param if value is empty, null, or undefined
      }
    });
    current.set('page', '1'); // Reset page to 1 whenever filters/search/sort change

    startNavTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  // Debounce search query input before updating URL
  useEffect(() => {
    const handler = setTimeout(() => {
      // Pass searchQueryInput as is, without trimming
      if (searchQueryInput !== (searchParams.get('q') || '')) {
         updateUrlParams({ q: searchQueryInput });
      }
    }, SEARCH_DEBOUNCE_MS); 
    return () => clearTimeout(handler);
  }, [searchQueryInput, searchParams, updateUrlParams]);


  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Do not trim here, allow user to type spaces if they intend to search with them
    setSearchQueryInput(e.target.value);
  };

  const handleSortChange = (value: SortByType) => {
    updateUrlParams({ sort: value });
  };

  const handleFilterChange = useCallback((tags: { versions?: string; loaders?: string; }) => {
    updateUrlParams({ versions: tags.versions, loaders: tags.loaders });
  }, [updateUrlParams]);
  
  const isLoadingFirstPage = isDataLoading && currentPage === 1;
  const isLoadingMore = isDataLoading && currentPage > 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) && (
        <aside className="md:col-span-3 lg:col-span-3 space-y-6">
          <ResourceFilterControls 
            availableTags={availableFilterTags} 
            onFilterChangeCallback={handleFilterChange}
          />
        </aside>
      )}

      <main className={(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) ? "md:col-span-9 lg:col-span-9" : "md:col-span-12"}>
        <div className="mb-6 p-4 border rounded-lg bg-card shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search in ${categoryName}... (try "mod  " with spaces)`}
                className="pl-10 w-full"
                value={searchQueryInput} // Controlled component, respects spaces
                onChange={handleSearchInputChange}
              />
            </div>
            <Select value={sortBy} onValueChange={handleSortChange}>
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
            <Image src="https://placehold.co/128x128/1f1f1f/4a4a4a?text=:(" alt="No results" width={128} height={128} className="mx-auto mb-4 rounded-lg" data-ai-hint="sad face emoji"/>
            <p className="text-xl font-semibold text-foreground">No resources found</p>
            <p className="text-muted-foreground">
              {activeTagFiltersRef.current.length > 0 || (searchParams.get('q') || '') ? "Try adjusting your filters or search terms." : `No resources in ${categoryName} for ${gameName} yet.`}
            </p>
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div ref={loadMoreRef} className="h-10" /> 

        {!(isDataLoading || isNavPending) && !hasMore && resources.length > 0 && (
          <p className="text-center text-muted-foreground py-6">You've reached the end of the list.</p>
        )}
      </main>
    </div>
  );
}
