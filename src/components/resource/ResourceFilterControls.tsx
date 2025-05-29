"use client";

import type { Tag } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
}

export function ResourceFilterControls({ availableTags }: ResourceFilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);

  useEffect(() => {
    const versionParams = searchParams.get('versions')?.split(',') || [];
    const loaderParams = searchParams.get('loaders')?.split(',') || [];
    setSelectedVersions(versionParams.filter(v => v));
    setSelectedLoaders(loaderParams.filter(l => l));
  }, [searchParams]);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedVersions.length > 0) {
      params.set('versions', selectedVersions.join(','));
    } else {
      params.delete('versions');
    }
    if (selectedLoaders.length > 0) {
      params.set('loaders', selectedLoaders.join(','));
    } else {
      params.delete('loaders');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const handleResetFilters = () => {
    setSelectedVersions([]);
    setSelectedLoaders([]);
    router.push(pathname, { scroll: false });
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

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex items-center"><Filter className="w-5 h-5 mr-2 text-primary" /> Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {availableTags.versions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground/90">Version</h4>
            <div className="space-y-2">
              {availableTags.versions.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`version-${tag.id}`}
                    checked={selectedVersions.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id, 'version')}
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
            <div className="space-y-2">
              {availableTags.loaders.map(tag => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`loader-${tag.id}`}
                    checked={selectedLoaders.includes(tag.id)}
                    onCheckedChange={() => toggleTagSelection(tag.id, 'loader')}
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
          <Button onClick={handleFilterChange} className="w-full sm:w-auto">Apply Filters</Button>
          {hasActiveFilters && (
             <Button onClick={handleResetFilters} variant="outline" className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" /> Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
