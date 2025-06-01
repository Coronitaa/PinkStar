
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import type { Resource, Tag, Category as CategoryType, PaginatedResourcesResponse, GetResourcesParams, ItemType } from '@/lib/types';
import { ResourceListItem } from '@/components/resource/ResourceListItem';
import { ResourceFilterControls, type AvailableTags } from '@/components/resource/ResourceFilterControls';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Info } from 'lucide-react';
import { fetchPaginatedResourcesAction } from '@/app/actions/resourceActions';

const RESOURCES_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 500;

type SortByType = 'relevance' | 'downloads' | 'updatedAt' | 'name';
type FilterableTagType = keyof AvailableTags;

interface CategoryPageContentProps {
  initialResources: Resource[];
  initialHasMore: boolean;
  initialTotal: number;
  itemSlug: string;
  itemType: ItemType;
  categorySlug: string;
  availableFilterTags: Partial<AvailableTags>;
  itemName: string;
  categoryName: string;
}

export function CategoryPageContent({
  initialResources,
  initialHasMore,
  initialTotal,
  itemSlug,
  itemType,
  categorySlug,
  availableFilterTags,
  itemName,
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
  
  const getDefaultSortBy = useCallback(() => {
    const qFromUrl = searchParams.get('q') || '';
    if (qFromUrl) return 'relevance';
    return itemType === 'game' ? 'downloads' : 'updatedAt';
  }, [itemType, searchParams]);

  const [sortBy, setSortBy] = useState<SortByType>(() => {
    const sortParam = searchParams.get('sort') as SortByType;
    return sortParam || getDefaultSortBy();
  });
  
  const activeTagFiltersRef = useRef<string[]>([]);

  const getAllActiveTagIdsFromParams = useCallback((params: URLSearchParams): string[] => {
    const allIds: string[] = [];
    const tagKeys: FilterableTagType[] = ['versions', 'loaders', 'genres', 'misc', 'channels', 'frameworks', 'languages', 'tooling', 'platforms', 'appCategories', 'artStyles', 'musicGenres'];
    tagKeys.forEach(key => {
      const ids = params.get(key)?.split(',').filter(Boolean) || [];
      allIds.push(...ids);
    });
    return allIds;
  }, []);


  useEffect(() => {
    const qFromUrl = searchParams.get('q') || '';
    setSearchQueryInput(qFromUrl); 

    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
    } else {
      setSortBy(getDefaultSortBy());
    }
    activeTagFiltersRef.current = getAllActiveTagIdsFromParams(searchParams);
  }, [searchParams, getDefaultSortBy, getAllActiveTagIdsFromParams]);


  const fetchAndSetResources = useCallback(async (page: number, options?: { isNewSearchOrFilter?: boolean }) => {
    startDataTransition(async () => {
      const currentQ = searchParams.get('q') || '';
      const currentSort = (searchParams.get('sort') as SortByType) || getDefaultSortBy();
      const currentTags = getAllActiveTagIdsFromParams(searchParams);

      const params: GetResourcesParams = {
        parentItemSlug: itemSlug,
        parentItemType: itemType,
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
  }, [itemSlug, itemType, categorySlug, searchParams, startDataTransition, getDefaultSortBy, getAllActiveTagIdsFromParams]);


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
    // If relevance sort is selected but query is empty, switch to default sort
    if (current.get('sort') === 'relevance' && !current.get('q')) {
        const defaultSort = itemType === 'game' ? 'downloads' : 'updatedAt';
        current.set('sort', defaultSort);
    }
    // If query is added and sort is not relevance, switch to relevance
    if (current.get('q') && current.get('sort') !== 'relevance') {
        current.set('sort', 'relevance');
    }


    startNavTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router, itemType]);

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

  const handleFilterChange = useCallback((newFilters: Record<FilterableTagType, string | undefined>) => {
    updateUrlParams(newFilters);
  }, [updateUrlParams]);
  
  const isLoadingFirstPage = isDataLoading && currentPage === 1;
  const isLoadingMore = isDataLoading && currentPage > 1;
  const totalPages = Math.ceil(totalResources / RESOURCES_PER_PAGE) || 1;

  const hasAnyAvailableFilters = Object.values(availableFilterTags).some(tagsArray => tagsArray && tagsArray.length > 0);
  const hasActiveSearchOrFilters = activeTagFiltersRef.current.length > 0 || (searchParams.get('q') || '');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {hasAnyAvailableFilters && (
        <aside className="md:col-span-3 lg:col-span-3 space-y-6">
          <ResourceFilterControls 
            availableTags={availableFilterTags} 
            itemType={itemType}
            onFilterChangeCallback={handleFilterChange}
          />
        </aside>
      )}

      <main className={hasAnyAvailableFilters ? "md:col-span-9 lg:col-span-9" : "md:col-span-12"}>
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
                {itemType === 'game' && <SelectItem value="downloads">Downloads</SelectItem>}
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
              {hasActiveSearchOrFilters ? "Try adjusting your filters or search terms." : `No resources in ${categoryName} for ${itemName} yet.`}
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

    