
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import type { ItemWithDetails, GenericListItem } from '@/lib/types';
import { ItemCard } from '@/components/game/GameCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ListFilter, Music } from 'lucide-react';
import { calculateGenericItemSearchScore } from '@/lib/data';

type SortOption = 'popularity' | 'name_asc' | 'name_desc' | 'created_desc' | 'created_asc' | 'updated_desc' | 'default';

export function ArtMusicItemsPageContent({ initialItems }: { initialItems: ItemWithDetails[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const filteredAndSortedItems = useMemo(() => {
    let itemsToProcess = [...initialItems] as (GenericListItem & { searchScore?: number; stats: ItemWithDetails['stats'] })[];

    if (debouncedSearchQuery.trim()) {
      itemsToProcess = itemsToProcess
        .map(item => ({
          ...item,
          searchScore: calculateGenericItemSearchScore(item, debouncedSearchQuery),
        }))
        .filter(item => item.searchScore && item.searchScore > 0)
        .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
    }

    if (!debouncedSearchQuery.trim() || sortBy !== 'default') {
        switch (sortBy) {
        case 'popularity':
             itemsToProcess.sort((a, b) => (b.stats.totalViews ?? b.stats.totalFollowers ?? 0) - (a.stats.totalViews ?? a.stats.totalFollowers ?? 0));
            break;
        case 'name_asc':
            itemsToProcess.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            itemsToProcess.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'created_desc':
            itemsToProcess.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
            break;
        case 'created_asc':
            itemsToProcess.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
            break;
        case 'updated_desc':
            itemsToProcess.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
            break;
        case 'default':
            if (!debouncedSearchQuery.trim()) {
                 itemsToProcess.sort((a, b) => (b.stats.totalViews ?? b.stats.totalFollowers ?? 0) - (a.stats.totalViews ?? a.stats.totalFollowers ?? 0));
            }
            break;
        }
    }
    
    return itemsToProcess;
  }, [initialItems, debouncedSearchQuery, sortBy]);

  return (
    <div className="space-y-12">
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl drop-shadow-lg">
         Art &amp; Music Showcase on <span className="animate-pulse">PinkStar</span>
        </h1>
        <p className="mt-6 text-xl leading-8 text-foreground/80 max-w-2xl mx-auto">
          Immerse yourself in stunning visuals and captivating sounds.
        </p>
      </section>

      <div className="mb-12 p-4 border rounded-lg bg-card shadow-md backdrop-blur-sm bg-background/80 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search art & music..."
              className="pl-10 w-full text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-full sm:w-auto min-w-[200px]">
              <ListFilter className="w-4 h-4 mr-2 opacity-70" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Relevance / Default</SelectItem>
              <SelectItem value="popularity">Popularity (Views/Followers)</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="created_desc">Latest Added</SelectItem>
              <SelectItem value="created_asc">Oldest Added</SelectItem>
              <SelectItem value="updated_desc">Recently Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section>
        <h2 className="text-4xl font-semibold mb-8 pb-3 border-b-2 border-primary/30 text-center flex items-center justify-center">
            <Music className="w-9 h-9 mr-3 text-primary" /> Available Art &amp; Music
        </h2>
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedItems.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item}
                categories={item.categories} 
                stats={item.stats} 
                basePath="/art-music"
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-10 text-lg">
            {debouncedSearchQuery.trim() ? `No art or music found for "${debouncedSearchQuery}".` : "No art or music available at the moment. Check back soon!"}
          </p>
        )}
      </section>
    </div>
  );
}
