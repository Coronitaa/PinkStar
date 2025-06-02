
"use client";

import type { Tag, ItemType, TagType } from '@/lib/types';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AvailableTags {
  versions: Tag[];
  loaders: Tag[];
  genres: Tag[]; // Game genres
  misc: Tag[];
  channels: Tag[];
  // Web specific
  frameworks: Tag[];
  languages: Tag[];
  tooling: Tag[];
  // App specific
  platforms: Tag[]; // Re-using 'platform' type for app platforms if defined in commonTags
  appCategories: Tag[]; // App specific genres/categories
  // Art & Music specific
  artStyles: Tag[];
  musicGenres: Tag[];
}

type FilterableTagType = keyof AvailableTags;

interface ResourceFilterControlsProps {
  availableTags: Partial<AvailableTags>; // Use Partial as not all item types will have all tags
  itemType: ItemType;
  onFilterChangeCallback: (newFilters: Record<FilterableTagType, string | undefined>) => void;
}

const tagTypeToLabelMapping: Record<FilterableTagType, string> = {
  versions: "Version",
  loaders: "Loader",
  genres: "Genre",
  misc: "Type", // For game 'misc' tags
  channels: "Channel",
  frameworks: "Framework",
  languages: "Language",
  tooling: "Tooling",
  platforms: "Platform",
  appCategories: "App Category",
  artStyles: "Art Style",
  musicGenres: "Music Genre",
};


export function ResourceFilterControls({ availableTags, itemType, onFilterChangeCallback }: ResourceFilterControlsProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedFilters, setSelectedFilters] = useState<Record<FilterableTagType, string[]>>(() => {
    const initialFilters: Record<FilterableTagType, string[]> = {} as any;
    for (const key in tagTypeToLabelMapping) {
      initialFilters[key as FilterableTagType] = [];
    }
    return initialFilters;
  });

  useEffect(() => {
    const newSelectedFilters: Record<FilterableTagType, string[]> = {} as any;
    let hasInitialParams = false;
    for (const key in tagTypeToLabelMapping) {
      const filterKey = key as FilterableTagType;
      const params = searchParams.get(filterKey)?.split(',').filter(Boolean) || [];
      newSelectedFilters[filterKey] = params;
      if (params.length > 0) hasInitialParams = true;
    }
    setSelectedFilters(newSelectedFilters);
  }, [searchParams]);

  const updateFiltersInUrl = useCallback((updatedSelectedFilters: Record<FilterableTagType, string[]>) => {
    startTransition(() => {
      const paramsToUpdate: Record<FilterableTagType, string | undefined> = {} as any;
      for (const key in updatedSelectedFilters) {
        const filterKey = key as FilterableTagType;
        const ids = updatedSelectedFilters[filterKey];
        paramsToUpdate[filterKey] = ids.length > 0 ? ids.join(',') : undefined;
      }
      onFilterChangeCallback(paramsToUpdate);
    });
  }, [onFilterChangeCallback]);
  
  const handleClearFilters = () => {
    const clearedFilters: Record<FilterableTagType, string[]> = {} as any;
    for (const key in tagTypeToLabelMapping) {
      clearedFilters[key as FilterableTagType] = [];
    }
    setSelectedFilters(clearedFilters);
    updateFiltersInUrl(clearedFilters);
  };

  const toggleTagSelection = (tagId: string, type: FilterableTagType) => {
    const newSelectedFilters = { ...selectedFilters };
    const currentSelection = newSelectedFilters[type] || [];
    
    newSelectedFilters[type] = currentSelection.includes(tagId)
      ? currentSelection.filter(id => id !== tagId)
      : [...currentSelection, tagId];
    
    setSelectedFilters(newSelectedFilters);
    updateFiltersInUrl(newSelectedFilters);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(arr => arr.length > 0);

  const relevantTagTypesForItem: FilterableTagType[] = (() => {
    switch (itemType) {
      case 'game':
        return ['versions', 'loaders', 'genres', 'misc', 'channels'];
      case 'web':
        return ['frameworks', 'languages', 'tooling', 'misc', 'channels']; // misc could be 'template type' etc.
      case 'app':
        return ['platforms', 'appCategories', 'languages', 'tooling', 'channels']; // platforms from commonTags (iOS, Android), appCategories for 'Productivity' etc.
      case 'art-music':
        return ['artStyles', 'musicGenres', 'tooling', 'misc', 'channels']; // tooling for 'Photoshop', misc for 'Brush pack' etc.
      default:
        return [];
    }
  })();

  const renderTagGroup = (type: FilterableTagType, tags: Tag[] | undefined) => {
    if (!tags || tags.length === 0) return null;
    
    const title = tagTypeToLabelMapping[type] || type.charAt(0).toUpperCase() + type.slice(1);
    const currentSelectedTags = selectedFilters[type] || [];

    return (
      <div key={type}>
        <h4 className="font-semibold mb-2 text-foreground/90 text-sm">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const isSelected = currentSelectedTags.includes(tag.id);
            return (
              <Button
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTagSelection(tag.id, type)}
                disabled={isPending}
                className={cn(
                  "text-xs px-2.5 py-1 h-auto rounded-full transition-all duration-150 ease-in-out",
                  isSelected && "bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
                  !isSelected && "border-border/50 hover:bg-accent/20 hover:border-accent text-muted-foreground hover:text-accent-foreground"
                )}
              >
                {isSelected && <Check className="w-3 h-3 mr-1" />}
                {tag.name}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const activeFilterGroups = relevantTagTypesForItem.filter(type => availableTags[type] && (availableTags[type] as Tag[]).length > 0);

  return (
    <Card className="shadow-md sticky top-24 bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
        <CardTitle className="text-lg flex items-center"><ListFilter className="w-5 h-5 mr-2 text-primary" /> Filters</CardTitle>
        {hasActiveFilters && (
             <Button onClick={handleClearFilters} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary" disabled={isPending}>
                <X className="w-3.5 h-3.5 mr-1" /> Clear All
            </Button>
          )}
      </CardHeader>
      <CardContent className="space-y-5 pt-2 pb-4">
        {activeFilterGroups.length > 0 ? (
            activeFilterGroups.map(type => renderTagGroup(type, availableTags[type]))
        ) : (
            <p className="text-xs text-muted-foreground">No filters available for this category.</p>
        )}
      </CardContent>
    </Card>
  );
}

    