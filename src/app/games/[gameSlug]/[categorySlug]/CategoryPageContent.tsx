
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
  const [isPending, startTransition] = useTransition();

  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalResources, setTotalResources] = useState(initialTotal);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // States for controlled inputs reflecting URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState<SortByType>((searchParams.get('sort') as SortByType) || 'relevance');
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);

  // Effect to synchronize controlled inputs with URL search params
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    const sortParam = searchParams.get('sort');
     if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
    } else {
      setSortBy('relevance');
    }
    const versionFilters = searchParams.get('versions')?.split(',') || [];
    const loaderFilters = searchParams.get('loaders')?.split(',') || [];
    setActiveTagFilters([...versionFilters, ...loaderFilters].filter(Boolean));
  }, [searchParams]);


  // Effect to reset resources and pagination when filters/sort/query change
  useEffect(() => {
    // This effect runs when searchParams change, indicating filters, sort, or query might have changed.
    // We need to fetch page 1 with the new params.
    const fetchInitialFilteredData = async () => {
      setIsLoadingMore(true); // Use isLoadingMore to show loading state for the whole list
      const params: GetResourcesParams = {
        gameSlug,
        categorySlug,
        page: 1,
        limit: RESOURCES_PER_PAGE,
        searchQuery: searchParams.get('q') || undefined,
        sortBy: (searchParams.get('sort') as SortByType) || 'relevance',
        tags: [
          ...(searchParams.get('versions')?.split(',') || []),
          ...(searchParams.get('loaders')?.split(',') || []),
        ].filter(Boolean),
      };
      
      try {
        const data = await fetchPaginatedResourcesAction(params);
        setResources(data.resources);
        setHasMore(data.hasMore);
        setTotalResources(data.total);
        setCurrentPage(1); // Reset to page 1
      } catch (error) {
        console.error("Failed to fetch initial filtered resources:", error);
        // Handle error appropriately, e.g., show a toast
      }
      setIsLoadingMore(false);
    };

    // Only run if it's not the initial load managed by server props
    // Check if current resources match initial to avoid double fetch on load.
    // A more robust check might involve comparing searchParams to their initial state.
    // For now, if current search/sort/filters differ from initial state, or if not first render:
    if (currentPage > 1 || searchQuery !== (searchParams.get('q') || '') || sortBy !== ((searchParams.get('sort') as SortByType) || 'relevance') || JSON.stringify(activeTagFilters) !== JSON.stringify([...(searchParams.get('versions')?.split(',') || []),...(searchParams.get('loaders')?.split(',') || [])].filter(Boolean)) ) {
       // If it's not the very first render (where initialResources are set), then fetch.
       // The very first render populates `resources` from `initialResources`.
       // Subsequent changes to `searchParams` should trigger this.
       // A simple way to distinguish: if `resources` isn't `initialResources` by reference.
       // However, initialResources could be empty.
       // Let's rely on the fact that this effect runs after initial mount.
       // If initialResources prop changes, it's a new page load from server, which is fine.
       // We want this to run if searchParams *change after* initial load.
        if (resources !== initialResources || currentPage !== 1 || hasMore !== initialHasMore) {
             fetchInitialFilteredData();
        }
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searchParams, gameSlug, categorySlug, initialResources, initialHasMore]); // Add initialResources dependencies to re-trigger if server props change


  const loadMoreResources = useCallback(async () => {
    if (isLoadingMore || !hasMore || isPending) return;
    setIsLoadingMore(true);

    const nextPage = currentPage + 1;
    const params: GetResourcesParams = {
      gameSlug,
      categorySlug,
      page: nextPage,
      limit: RESOURCES_PER_PAGE,
      searchQuery: searchParams.get('q') || undefined,
      sortBy: (searchParams.get('sort') as SortByType) || 'relevance',
      tags: [
        ...(searchParams.get('versions')?.split(',') || []),
        ...(searchParams.get('loaders')?.split(',') || []),
      ].filter(Boolean),
    };

    try {
      const data = await fetchPaginatedResourcesAction(params);
      setResources((prev) => [...prev, ...data.resources]);
      setHasMore(data.hasMore);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Failed to load more resources:", error);
      // Potentially show an error message to the user
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMore, currentPage, gameSlug, categorySlug, searchParams, isPending]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        loadMoreResources();
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, isLoadingMore, loadMoreResources]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = () => {
    updateUrlParams({ q: searchQuery });
  };

  const handleSortChange = (value: SortByType) => {
    setSortBy(value);
    updateUrlParams({ sort: value });
  };

  const updateUrlParams = (newParams: Record<string, string | undefined>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== (key === 'sort' ? 'relevance' : '')) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
    });
    startTransition(() => {
      router.push(`${pathname}?${current.toString()}`, { scroll: false });
    });
  };
  
  // Debounce search query update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== (searchParams.get('q') || '')) {
         updateUrlParams({ q: searchQuery });
      }
    }, 500); 
    return () => clearTimeout(handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, router, pathname, searchParams]); //Removed updateUrlParams from dep array to avoid issues


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {(availableFilterTags.versions.length > 0 || availableFilterTags.loaders.length > 0) && (
        <aside className="md:col-span-3 lg:col-span-3 space-y-6 md:sticky md:top-24 h-max">
          <ResourceFilterControls availableTags={availableFilterTags} />
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
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
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

        {isPending && resources.length === 0 && ( // Show main loading only if no resources and pending
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        {!isPending && resources.length > 0 && (
          <div className="space-y-4">
            {resources.map(resource => (
              <ResourceListItem key={resource.id} resource={resource} />
            ))}
          </div>
        )}
        
        {!isPending && resources.length === 0 && (
          <div className="text-center py-12">
            <Image src="https://placehold.co/128x128/1f1f1f/4a4a4a?text=:(" alt="No results" width={128} height={128} className="mx-auto mb-4 rounded-lg" data-ai-hint="sad face emoji"/>
            <p className="text-xl font-semibold text-foreground">No resources found</p>
            <p className="text-muted-foreground">
              {activeTagFilters.length > 0 || searchQuery ? "Try adjusting your filters or search terms." : `No resources in ${categoryName} for ${gameName} yet.`}
            </p>
          </div>
        )}

        {isLoadingMore && resources.length > 0 && ( // Show loading spinner only when loading more
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        <div ref={loadMoreRef} className="h-10" /> {/* Invisible element to trigger loading more */}

        {!isLoadingMore && !hasMore && resources.length > 0 && (
          <p className="text-center text-muted-foreground py-6">You've reached the end of the list.</p>
        )}
      </main>
    </div>
  );
}
