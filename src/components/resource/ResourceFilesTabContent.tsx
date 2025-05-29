
"use client";

import React, { useState, useMemo } from 'react';
import type { ResourceFile, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagBadge } from '@/components/shared/TagBadge';
import Link from 'next/link';
import { Download, Filter } from 'lucide-react';

interface ResourceFilesTabContentProps {
  files: ResourceFile[];
}

const CLEAR_FILTER_VALUE = "_ANY_"; // Sentinel value for "All" or "Any" option

export function ResourceFilesTabContent({ files }: ResourceFilesTabContentProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(undefined);
  const [selectedLoaderId, setSelectedLoaderId] = useState<string | undefined>(undefined);

  const allAvailableVersions = useMemo(() => {
    const versionsMap = new Map<string, Tag>();
    files.forEach(file => {
      file.supportedVersions.forEach(version => {
        if (!versionsMap.has(version.id)) {
          versionsMap.set(version.id, version);
        }
      });
    });
    return Array.from(versionsMap.values()).sort((a,b) => b.name.localeCompare(a.name)); // Sort newer first potentially
  }, [files]);

  const allAvailableLoaders = useMemo(() => {
    const loadersMap = new Map<string, Tag>();
    files.forEach(file => {
      file.supportedLoaders.forEach(loader => {
        if (!loadersMap.has(loader.id)) {
          loadersMap.set(loader.id, loader);
        }
      });
    });
    return Array.from(loadersMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const versionMatch = !selectedVersionId || file.supportedVersions.some(v => v.id === selectedVersionId);
      const loaderMatch = !selectedLoaderId || file.supportedLoaders.some(l => l.id === selectedLoaderId);
      return versionMatch && loaderMatch;
    });
  }, [files, selectedVersionId, selectedLoaderId]);

  return (
    <div className="space-y-6">
      {(allAvailableVersions.length > 0 || allAvailableLoaders.length > 0) && (
        <div className="p-4 border rounded-md bg-card-foreground/5 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center text-sm font-medium text-muted-foreground shrink-0">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            Filter files by:
          </div>
          {allAvailableVersions.length > 0 && (
            <div className="flex-1 min-w-[150px]">
              <Select 
                value={selectedVersionId} 
                onValueChange={(value) => {
                  setSelectedVersionId(value === CLEAR_FILTER_VALUE ? undefined : value);
                }}
              >
                <SelectTrigger className="w-full h-9 text-xs rounded-md">
                  <SelectValue placeholder="All Versions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Versions</SelectItem>
                  {allAvailableVersions.map(vTag => (
                    <SelectItem key={vTag.id} value={vTag.id} className="text-xs">{vTag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {allAvailableLoaders.length > 0 && (
             <div className="flex-1 min-w-[150px]">
              <Select 
                value={selectedLoaderId} 
                onValueChange={(value) => {
                  setSelectedLoaderId(value === CLEAR_FILTER_VALUE ? undefined : value);
                }}
              >
                <SelectTrigger className="w-full h-9 text-xs rounded-md">
                  <SelectValue placeholder="All Loaders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Loaders</SelectItem>
                  {allAvailableLoaders.map(lTag => (
                    <SelectItem key={lTag.id} value={lTag.id} className="text-xs">{lTag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
           {(selectedVersionId || selectedLoaderId) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSelectedVersionId(undefined); setSelectedLoaderId(undefined);}}
              className="text-xs h-9 text-muted-foreground hover:text-primary"
            >
              Clear Filters
            </Button>
           )}
        </div>
      )}

      {filteredFiles.length > 0 ? (
        <ul className="space-y-4">
          {filteredFiles.map(file => (
            <li key={file.id} className="p-4 border rounded-md bg-card-foreground/10 hover:bg-card-foreground/15 transition-colors shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-grow">
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">Size: {file.size}</p>
                  
                  {(file.supportedVersions.length > 0 || file.supportedLoaders.length > 0) && (
                    <div className="mt-2 space-y-2">
                      {file.supportedVersions.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Compatible Versions:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {file.supportedVersions.map(vTag => <TagBadge key={vTag.id} tag={vTag} className="text-[10px] px-1.5 py-0.5" />)}
                          </div>
                        </div>
                      )}
                      {file.supportedLoaders.length > 0 && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">Compatible Loaders:</span>
                           <div className="flex flex-wrap gap-1.5">
                            {file.supportedLoaders.map(lTag => <TagBadge key={lTag.id} tag={lTag} className="text-[10px] px-1.5 py-0.5" />)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Link href={file.url} download className="shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" className="button-outline-glow w-full sm:w-auto">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground p-4 text-center">
          {files.length > 0 ? "No files match the selected filters." : "No files available for this resource."}
        </p>
      )}
    </div>
  );
}
    
