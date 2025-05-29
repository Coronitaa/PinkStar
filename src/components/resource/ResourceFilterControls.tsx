
"use client";

import type { Tag } from '@/lib/types';
import { useState, useEffect, useTransition, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListFilter, X, Check } from 'lucide-react'; // Changed icon
import { cn } from '@/lib/utils';

interface ResourceFilterControlsProps {
  availableTags: {
    versions: Tag[];
    loaders: Tag[];
    genres: Tag[];
    misc: Tag[];
  };
  onFilterChangeCallback: (tags: { versions?: string; loaders?: string; genres?: string; misc?: string }) => void;
}

export function ResourceFilterControls({ availableTags, onFilterChangeCallback }: ResourceFilterControlsProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMisc, setSelectedMisc] = useState<string[]>([]);


  useEffect(() => {
    const versionParams = searchParams.get('versions')?.split(',').filter(Boolean) || [];
    const loaderParams = searchParams.get('loaders')?.split(',').filter(Boolean) || [];
    const genreParams = searchParams.get('genres')?.split(',').filter(Boolean) || [];
    const miscParams = searchParams.get('misc')?.split(',').filter(Boolean) || [];
    setSelectedVersions(versionParams);
    setSelectedLoaders(loaderParams);
    setSelectedGenres(genreParams);
    setSelectedMisc(miscParams);
  }, [searchParams]);

  const updateFilters = useCallback((
    newVersions: string[], 
    newLoaders: string[],
    newGenres: string[],
    newMisc: string[]
    ) => {
    startTransition(() => {
      const paramsToUpdate: { versions?: string; loaders?: string; genres?: string; misc?: string } = {};
      
      paramsToUpdate.versions = newVersions.length > 0 ? newVersions.join(',') : undefined;
      paramsToUpdate.loaders = newLoaders.length > 0 ? newLoaders.join(',') : undefined;
      paramsToUpdate.genres = newGenres.length > 0 ? newGenres.join(',') : undefined;
      paramsToUpdate.misc = newMisc.length > 0 ? newMisc.join(',') : undefined;
      
      onFilterChangeCallback(paramsToUpdate);
    });
  }, [onFilterChangeCallback]);
  
  const handleClearFilters = () => {
    setSelectedVersions([]);
    setSelectedLoaders([]);
    setSelectedGenres([]);
    setSelectedMisc([]);
    updateFilters([], [], [], []);
  };

  const toggleTagSelection = (tagId: string, type: 'version' | 'loader' | 'genre' | 'misc') => {
    let currentVersions = [...selectedVersions];
    let currentLoaders = [...selectedLoaders];
    let currentGenres = [...selectedGenres];
    let currentMisc = [...selectedMisc];


    switch(type) {
      case 'version':
        currentVersions = selectedVersions.includes(tagId) 
          ? selectedVersions.filter(id => id !== tagId) 
          : [...selectedVersions, tagId];
        setSelectedVersions(currentVersions);
        break;
      case 'loader':
        currentLoaders = selectedLoaders.includes(tagId)
          ? selectedLoaders.filter(id => id !== tagId)
          : [...selectedLoaders, tagId];
        setSelectedLoaders(currentLoaders);
        break;
      case 'genre':
        currentGenres = selectedGenres.includes(tagId)
          ? selectedGenres.filter(id => id !== tagId)
          : [...selectedGenres, tagId];
        setSelectedGenres(currentGenres);
        break;
      case 'misc':
        currentMisc = selectedMisc.includes(tagId)
          ? selectedMisc.filter(id => id !== tagId)
          : [...selectedMisc, tagId];
        setSelectedMisc(currentMisc);
        break;
    }
    updateFilters(currentVersions, currentLoaders, currentGenres, currentMisc);
  };

  const hasActiveFilters = selectedVersions.length > 0 || selectedLoaders.length > 0 || selectedGenres.length > 0 || selectedMisc.length > 0;

  const renderTagGroup = (title: string, tags: Tag[], selectedTags: string[], type: 'version' | 'loader' | 'genre' | 'misc') => {
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


  return (
    <Card className="shadow-md sticky top-24 bg-card/80 backdrop-blur-sm border-border/40">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4">
        <CardTitle className="text-lg flex items-center"><ListFilter className="w-5 h-5 mr-2 text-primary" /> Filters</CardTitle>
        {hasActiveFilters && (
             <Button onClick={handleClearFilters} variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary" disabled={isPending}>
                <X className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
      </CardHeader>
      <CardContent className="space-y-5 pt-2 pb-4">
        {renderTagGroup('Version', availableTags.versions, selectedVersions, 'version')}
        {renderTagGroup('Loader', availableTags.loaders, selectedLoaders, 'loader')}
        {renderTagGroup('Genre', availableTags.genres, selectedGenres, 'genre')}
        {renderTagGroup('Type', availableTags.misc, selectedMisc, 'misc')}
        
        {availableTags.versions.length === 0 && availableTags.loaders.length === 0 && availableTags.genres.length === 0 && availableTags.misc.length === 0 && (
          <p className="text-xs text-muted-foreground">No filters available for this category.</p>
        )}
      </CardContent>
    </Card>
  );
}
