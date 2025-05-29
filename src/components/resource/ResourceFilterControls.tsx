
"use client";

import type { Tag } from '@/lib/types';
import { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';

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
    const versionParams = searchParams.get('versions')?.split(',') || [];
    const loaderParams = searchParams.get('loaders')?.split(',') || [];
    setSelectedVersions(versionParams.filter(v => v));
    setSelectedLoaders(loaderParams.filter(l => l));
  }, [searchParams]);

  const handleApplyFilters = () => {
    startTransition(() => {
      const paramsToUpdate: { versions?: string; loaders?: string; } = {};
      if (selectedVersions.length > 0) {
        paramsToUpdate.versions = selectedVersions.join(',');
      } else {
        paramsToUpdate.versions = undefined; // explicitly remove if empty
      }
      if (selectedLoaders.length > 0) {
        paramsToUpdate.loaders = selectedLoaders.join(',');
      } else {
        paramsToUpdate.loaders = undefined; // explicitly remove if empty
      }
      onFilterChangeCallback(paramsToUpdate);
    });
  };
  
  const handleResetFilters = () => {
    startTransition(() => {
      setSelectedVersions([]);
      setSelectedLoaders([]);
      onFilterChangeCallback({ versions: undefined, loaders: undefined });
    });
  };

  const toggleTagSelection = (tagId: string, type: 'version' | 'loader') => {
    if (type === 'version') {
      setSelectedVersions(prev => 
        prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
      );
    } else {
      setSelectedLoaders(prev =>
        prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
      );
    }
  };

  const hasActiveFilters = selectedVersions.length > 0 || selectedLoaders.length > 0;
  const hasPendingChanges = (
    JSON.stringify(selectedVersions.sort()) !== JSON.stringify((searchParams.get('versions')?.split(',') || []).filter(Boolean).sort()) ||
    JSON.stringify(selectedLoaders.sort()) !== JSON.stringify((searchParams.get('loaders')?.split(',') || []).filter(Boolean).sort())
  );


  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Filter className="w-5 h-5 mr-2 text-primary" /> Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableTags.versions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Version</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {availableTags.versions.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`version-${tag.id}`}
                    checked={selectedVersions.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id, 'version')}
                    disabled={isPending}
                  />
                  <Label htmlFor={`version-${tag.id}`} className="text-sm font-normal cursor-pointer">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {availableTags.loaders.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Loader</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {availableTags.loaders.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`loader-${tag.id}`}
                    checked={selectedLoaders.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id, 'loader')}
                    disabled={isPending}
                  />
                  <Label htmlFor={`loader-${tag.id}`} className="text-sm font-normal cursor-pointer">
                    {tag.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button onClick={handleApplyFilters} className="w-full sm:w-auto" disabled={isPending || !hasPendingChanges}>
            {isPending ? 'Applying...' : 'Apply Filters'}
          </Button>
          {hasActiveFilters && (
             <Button onClick={handleResetFilters} variant="outline" className="w-full sm:w-auto" disabled={isPending}>
                <X className="w-4 h-4 mr-2" /> Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
