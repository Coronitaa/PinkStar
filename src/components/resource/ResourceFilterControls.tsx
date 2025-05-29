
"use client";

import type { Tag } from '@/lib/types';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceFilterControlsProps {
  availableTags: {
    versions: Tag[];
    loaders: Tag[];
  };
  onFilterChangeCallback: (tags: { versions?: string; loaders?: string; }) => void;
}

export function ResourceFilterControls({ availableTags, onFilterChangeCallback }: ResourceFilterControlsProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);

  useEffect(() => {
    const versionParams = searchParams.get('versions')?.split(',').filter(Boolean) || [];
    const loaderParams = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
    setSelectedVersions(versionParams);
    setSelectedLoaders(loaderParams);
  }, [searchParams]);

  const updateFilters = useCallback((newVersions: string[], newLoaders: string[]) => {
    startTransition(() => {
      const paramsToUpdate: { versions?: string; loaders?: string; } = {};
      if (newVersions.length > 0) {
        paramsToUpdate.versions = newVersions.join(',');
      } else {
        paramsToUpdate.versions = undefined; 
      }
      if (newLoaders.length > 0) {
        paramsToUpdate.loaders = newLoaders.join(',');
      } else {
        paramsToUpdate.loaders = undefined; 
      }
      onFilterChangeCallback(paramsToUpdate);
    });
  }, [onFilterChangeCallback]);
  
  const handleClearFilters = () => {
    setSelectedVersions([]);
    setSelectedLoaders([]);
    updateFilters([], []);
  };

  const toggleTagSelection = (tagId: string, type: 'version' | 'loader') => {
    let currentVersions = [...selectedVersions];
    let currentLoaders = [...selectedLoaders];

    if (type === 'version') {
      currentVersions = selectedVersions.includes(tagId) 
        ? selectedVersions.filter(id => id !== tagId) 
        : [...selectedVersions, tagId];
      setSelectedVersions(currentVersions);
    } else {
      currentLoaders = selectedLoaders.includes(tagId)
        ? selectedLoaders.filter(id => id !== tagId)
        : [...selectedLoaders, tagId];
      setSelectedLoaders(currentLoaders);
    }
    updateFilters(currentVersions, currentLoaders);
  };

  const hasActiveFilters = selectedVersions.length > 0 || selectedLoaders.length > 0;

  const renderTagGroup = (title: string, tags: Tag[], selectedTags: string[], type: 'version' | 'loader') => {
    if (tags.length === 0) return null;
    return (
      <div>
        <h4 className="font-semibold mb-2 text-foreground/90 text-sm">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <Button
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTagSelection(tag.id, type)}
                disabled={isPending}
                className={cn(
                  "text-xs px-2.5 py-1 h-auto rounded-full transition-all duration-200 ease-in-out",
                  isSelected && "shadow-md",
                  !isSelected && "border-border/50 hover:bg-accent/50 hover:border-accent"
                )}
              >
                {isSelected && <Check className="w-3 h-3 mr-1.5" />}
                {tag.name}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };


  return (
    <Card className="shadow-md sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center"><Filter className="w-4 h-4 mr-2 text-primary" /> Filters</CardTitle>
        {hasActiveFilters && (
             <Button onClick={handleClearFilters} variant="ghost" size="sm" className="text-xs" disabled={isPending}>
                <X className="w-3 h-3 mr-1" /> Clear Filters
            </Button>
          )}
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        {renderTagGroup('Version', availableTags.versions, selectedVersions, 'version')}
        {renderTagGroup('Loader', availableTags.loaders, selectedLoaders, 'loader')}
        
        {availableTags.versions.length === 0 && availableTags.loaders.length === 0 && (
          <p className="text-xs text-muted-foreground">No filters available for this category.</p>
        )}
      </CardContent>
    </Card>
  );
}
