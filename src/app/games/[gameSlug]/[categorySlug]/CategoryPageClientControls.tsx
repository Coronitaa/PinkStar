
"use client";

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type React from 'react';

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
  const [_isPending, startTransition] = useTransition(); // Renamed to avoid conflict if isPending is passed by children

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

  const searchSetterAdapter = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (sortValue: 'relevance' | 'downloads' | 'updatedAt' | 'name') => {
    setSortBy(sortValue);
    updateQueryParams(searchQuery, sortValue); 
  };
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== (searchParams.get('q') || '')) {
         updateQueryParams(searchQuery, sortBy);
      }
    }, 500); 
    return () => clearTimeout(handler);
  }, [searchQuery, sortBy, searchParams, pathname, router]);


  const content = children(searchQuery, sortBy, searchSetterAdapter, handleSortChange);

  return (
    <>
      {content}
    </>
  );
}
