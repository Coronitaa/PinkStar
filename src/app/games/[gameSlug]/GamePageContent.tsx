
'use client';

import type React from 'react';
import { useState, useEffect, useCallback, useTransition, useRef } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselItem } from '@/components/shared/Carousel';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { Loader2, Search, Layers, ChevronRight } from 'lucide-react';
import type { Game, Category, Resource } from '@/lib/types';
import { fetchBestMatchForCategoryAction } from '@/app/actions/resourceActions';

interface GamePageContentProps {
  game: Game;
  categories: Category[];
  initialCategoryResources: Record<string, Resource[]>; // slug -> resources[]
}

const DEBOUNCE_DELAY = 300; // milliseconds

export function GamePageContent({ game, categories, initialCategoryResources }: GamePageContentProps) {
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, startSearchTransition] = useTransition();
  const [categorySearchResults, setCategorySearchResults] = useState<Record<string, Resource[] | null>>({});
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce global search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(globalSearchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [globalSearchQuery]);

  // Effect to fetch search results when debounced query changes
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setCategorySearchResults({}); // Clear results if search is empty
      setIsAutoplayActive(true);
      return;
    }

    setIsAutoplayActive(false); // Stop autoplay when search is active
    startSearchTransition(async () => {
      const results: Record<string, Resource[] | null> = {};
      for (const category of categories) {
        try {
          const bestMatches = await fetchBestMatchForCategoryAction(game.slug, category.slug, debouncedSearchQuery, 3);
          results[category.slug] = bestMatches.length > 0 ? bestMatches : null; // null if no good matches
        } catch (error) {
          console.error(`Failed to fetch search results for category ${category.name}:`, error);
          results[category.slug] = null; // Treat error as no results
        }
      }
      setCategorySearchResults(results);
    });
  }, [debouncedSearchQuery, game.slug, categories]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchQuery(e.target.value);
  };
  
  const clearSearch = () => {
    setGlobalSearchQuery('');
    if(searchInputRef.current) searchInputRef.current.value = '';
  }

  const hasActiveSearch = debouncedSearchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      <div className="mb-8 p-4 border rounded-lg bg-card shadow-md">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder={`Search resources in ${game.name}...`}
            className="pl-10 w-full text-base"
            value={globalSearchQuery}
            onChange={handleSearchInputChange}
          />
          {globalSearchQuery && (
            <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={clearSearch}>
              Clear
            </Button>
          )}
        </div>
      </div>

      {isSearching && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">Searching...</p>
        </div>
      )}
      
      {!isSearching && hasActiveSearch && Object.values(categorySearchResults).every(res => res === null || res?.length === 0) && (
         <div className="text-center py-12">
            <Layers className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-xl font-semibold text-foreground">No resources found for "{debouncedSearchQuery}"</p>
            <p className="text-muted-foreground">Try a different search term.</p>
          </div>
      )}

      {!isSearching && categories.length > 0 ? (
        categories.map((category) => {
          const categoryPageLink = `/games/${game.slug}/${category.slug}`;
          const resourcesForCarousel = hasActiveSearch
            ? categorySearchResults[category.slug] // This can be null (no match) or Resource[]
            : initialCategoryResources[category.slug];

          // If searching and this category has no results (null), or if it's an empty array
          if (hasActiveSearch && (!resourcesForCarousel || resourcesForCarousel.length === 0)) {
            return (
              <section key={category.id} className="space-y-6 py-6 border-t border-border/40 first:border-t-0 opacity-60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <Link href={categoryPageLink} className="group">
                      <h2 className="text-3xl font-semibold group-hover:text-primary transition-colors flex items-center">
                        <Layers className="w-7 h-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                        {category.name}
                      </h2>
                    </Link>
                    {category.description && <p className="text-muted-foreground mt-1 max-w-2xl">{category.description}</p>}
                  </div>
                  <Button variant="outline" asChild className="mt-3 sm:mt-0">
                    <Link href={categoryPageLink}>View all in {category.name} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm mt-2 pl-10">No matching resources in this category for "{debouncedSearchQuery}".</p>
              </section>
            );
          }
          
          // If not searching and no initial resources, or if somehow resourcesForCarousel is empty array
          if (!resourcesForCarousel || resourcesForCarousel.length === 0) {
             return (
                <section key={category.id} className="space-y-6 py-6 border-t border-border/40 first:border-t-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                    <Link href={categoryPageLink} className="group">
                        <h2 className="text-3xl font-semibold group-hover:text-primary transition-colors flex items-center">
                        <Layers className="w-7 h-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                        {category.name}
                        </h2>
                    </Link>
                    {category.description && <p className="text-muted-foreground mt-1 max-w-2xl">{category.description}</p>}
                    </div>
                    <Button variant="outline" asChild className="mt-3 sm:mt-0">
                        <Link href={categoryPageLink}>View all in {category.name} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                    </Button>
                </div>
                 <p className="text-muted-foreground text-sm mt-2 pl-10">No resources available in this category yet.</p>
                </section>
            );
          }


          return (
            <section key={category.id} className="space-y-6 py-6 border-t border-border/40 first:border-t-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <Link href={categoryPageLink} className="group">
                    <h2 className="text-3xl font-semibold group-hover:text-primary transition-colors flex items-center">
                      <Layers className="w-7 h-7 mr-3 text-accent group-hover:text-primary transition-colors" />
                      {category.name}
                    </h2>
                  </Link>
                  {category.description && <p className="text-muted-foreground mt-1 max-w-2xl">{category.description}</p>}
                </div>
                 <Button variant="outline" asChild className="mt-3 sm:mt-0">
                    <Link href={categoryPageLink}>View all in {category.name} <ChevronRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>
              
              <div className="mt-4">
                 <Carousel 
                    autoplay={isAutoplayActive && resourcesForCarousel.length > 1} 
                    autoplayInterval={5000}
                    itemsToShow={3} // Adjust as needed, consider screen size hooks for true responsiveness
                    showArrows={resourcesForCarousel.length > 3} // Show arrows if more items than can be shown
                  >
                  {resourcesForCarousel.map(resource => (
                    <CarouselItem key={resource.id}>
                      <ResourceCard resource={resource} compact />
                    </CarouselItem>
                  ))}
                </Carousel>
              </div>
            </section>
          );
        })
      ) : (
         !isSearching && <section className="py-6 border-t border-border/40 first:border-t-0">
            <p className="text-muted-foreground text-center">No categories available for this game yet.</p>
        </section>
      )}
    </div>
  );
}
