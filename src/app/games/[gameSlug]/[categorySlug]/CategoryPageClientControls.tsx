
"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface CategoryPageClientControlsProps {
  initialSearchQuery?: string;
  initialSortBy?: 'relevance' | 'downloads' | 'updatedAt' | 'name';
  children: (
    currentSearchQuery: string,
    currentSortBy: 'relevance' | 'downloads' | 'updatedAt' | 'name',
    handleSearchChange: (query: string) => void,
    handleSortChange: (sort: 'relevance' | 'downloads' | 'updatedAt' | 'name') => void
  ) => React.ReactNode;
}

export function CategoryPageClientControls({ 
  initialSearchQuery = '', 
  initialSortBy = 'relevance',
  children 
}: CategoryPageClientControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'relevance' | 'downloads' | 'updatedAt' | 'name'>(initialSortBy);

  // Sync state with URL search params on initial load or when URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as typeof sortBy);
    } else {
      setSortBy('relevance');
    }
  }, [searchParams]);

  const updateQueryParams = (newSearchQuery: string, newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSearchQuery) {
      params.set('q', newSearchQuery);
    } else {
      params.delete('q');
    }
    if (newSortBy && newSortBy !== 'relevance') {
      params.set('sort', newSortBy);
    } else {
      params.delete('sort');
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // This adapter ensures the function passed to children strictly matches (query: string) => void
  const searchSetterAdapter = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sort: 'relevance' | 'downloads' | 'updatedAt' | 'name') => {
    setSortBy(sort);
    updateQueryParams(searchQuery, sort); // Update immediately for sort
  };
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only update if the debounced searchQuery is different from the current URL param
      if (searchQuery !== (searchParams.get('q') || '')) {
         updateQueryParams(searchQuery, sortBy);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery, sortBy, searchParams, pathname, router]); // Added router, pathname, searchParams to deps


  return (
    <>
      {children(searchQuery, sortBy, searchSetterAdapter, handleSortChange)}
    </>
  );
}

