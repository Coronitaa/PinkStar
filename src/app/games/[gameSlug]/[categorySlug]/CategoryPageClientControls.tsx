
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
    setSortBy((searchParams.get('sort') as typeof sortBy) || 'relevance');
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateQueryParams(query, sortBy);
  };

  const handleSortChange = (sort: 'relevance' | 'downloads' | 'updatedAt' | 'name') => {
    setSortBy(sort);
    updateQueryParams(searchQuery, sort);
  };
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== (searchParams.get('q') || '')) {
         updateQueryParams(searchQuery, sortBy);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery, sortBy, searchParams, pathname, router]);


  return (
    <>
      {children(searchQuery, sortBy, setSearchQuery, handleSortChange)}
    </>
  );
}
