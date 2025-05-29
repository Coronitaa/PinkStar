
"use client";

import type React from 'react';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type SortByType = 'relevance' | 'downloads' | 'updatedAt' | 'name';

interface CategoryPageClientControlsProps {
  initialSearchQuery?: string;
  initialSortBy?: SortByType;
  renderControls: (
    currentSearchQuery: string,
    currentSortBy: SortByType,
    handleSearchChange: (query: string) => void,
    handleSortChange: (sort: SortByType) => void
  ) => React.ReactNode;
}

export function CategoryPageClientControls({ 
  initialSearchQuery = '', 
  initialSortBy = 'relevance',
  renderControls // Changed from 'children'
}: CategoryPageClientControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [_isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<SortByType>(initialSortBy);

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    const sortParam = searchParams.get('sort');
    if (sortParam && ['relevance', 'downloads', 'updatedAt', 'name'].includes(sortParam)) {
      setSortBy(sortParam as SortByType);
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

  const handleSortChange = (sortValue: SortByType) => {
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

  // Call the renamed render prop
  const content = renderControls(searchQuery, sortBy, searchSetterAdapter, handleSortChange);

  return (
    <>
      {content}
    </>
  );
}
