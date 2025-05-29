
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
  const [isNavPending, startNavTransition] = useTransition(); // For URL updates
  const [isDataLoading, startDataTransition] = useTransition(); // For data fetching operations


  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalResources, setTotalResources] = useState(initialTotal);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [searchQueryInput, setSearchQueryInput] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortByType>((searchParams.get('sort') as SortByType) || 'relevance');
  
  const activeTagFiltersRef = useRef<string[]>([]); // Ref to hold current tag filters derived from URL

  // Sync controlled inputs with URL on initial load or direct URL change
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setSearchQueryInput(q);

    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
    } else {
      setSortBy(params?.searchQuery ? 'relevance' : 'downloads'); // Default to relevance if searching
    }

    const versionFilters = searchParams.get('versions')?.split(',').filter(Boolean) || [];
    const loaderFilters = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
    activeTagFiltersRef.current = [...versionFilters, ...loaderFilters];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const fetchAndSetResources = useCallback(async (page: number, queryOverride?: string) => {
    startDataTransition(async () => {
      const currentQ = queryOverride !== undefined ? queryOverride : searchParams.get('q') || '';
      const currentSort = (searchParams.get('sort') as SortByType) || (currentQ ? 'relevance' : 'downloads');
      const currentVersions = searchParams.get('versions')?.split(',').filter(Boolean) || [];
      const currentLoaders = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
      const currentTags = [...currentVersions, ...currentLoaders];

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
        if (page === 1) {
          setResources(data.resources);
        } else {
          setResources((prev) => [...prev, ...data.resources]);
        }
        setHasMore(data.hasMore);
        setTotalResources(data.total);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug, categorySlug, searchParams]); // searchParams covers q, sort, tags from URL


  // Effect to fetch page 1 when URL parameters (filters, sort, query) change
  useEffect(() => {
    // This effect should only run when searchParams changes, NOT on initial mount if props are sufficient.
    // The initial props (initialResources, etc.) are from the server render with current searchParams.
    // We only need to re-fetch page 1 if the searchParams *actually change* after the initial load.
    
    // A way to check if it's not the initial server-rendered state causing this:
    // Compare current resources with initialResources. If they are different, it means client-side changes happened.
    // Or, more simply, only trigger if not the first page.
    // For the first page, the server already fetched the data.
     if (initialResources !== resources || currentPage !==1 || initialHasMore !== hasMore || initialTotal !== totalResources) {
        // This condition implies that the state has diverged from initial props,
        // or we are already past page 1. This means a client-side change (filter, sort, search) has occurred.
        fetchAndSetResources(1);
     }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, fetchAndSetResources]);
   // Removed initialResources, initialHasMore, initialTotal from deps to avoid re-fetch on initial load
   // fetchAndSetResources is memoized and depends on searchParams, so this should be safe.


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
      if (value !== undefined && value !== null && value !== (key === 'sort' ? (searchParams.get('q') ? 'relevance' : 'downloads') : '') && value.length > 0) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
     // Reset page to 1 whenever filters/search/sort change
    current.set('page', '1');

    startNavTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  // Debounce search query input before updating URL
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
    // setSortBy(value); // State will be updated by useEffect watching searchParams
    updateUrlParams({ sort: value });
  };
  
  const isLoadingFirstPage = isDataLoading && currentPage === 1;
  const isLoadingMore = isDataLoading && currentPage > 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) && (
        <aside className="md:col-span-3 lg:col-span-3 space-y-6 md:sticky md:top-24 h-max">
          <ResourceFilterControls 
            availableTags={availableFilterTags} 
            onFilterChangeCallback={(tags) => updateUrlParams(tags)} // Pass callback to update URL
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
                placeholder={`Search in ${categoryName}...`}
                className="pl-10 w-full"
                value={searchQueryInput}
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
