
"use client";

import React, { useState, useMemo } from 'react';
import type { ResourceFile, Tag, ChangelogEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Filter, Info } from 'lucide-react';
import { cn } from '@/lib/utils'; 
import { format } from 'date-fns';

interface ResourceFilesTabContentProps {
  files: ResourceFile[];
  allChangelogEntries?: ChangelogEntry[];
  resourceSlug: string; // Add resourceSlug here
}

const CLEAR_FILTER_VALUE = "_ANY_"; 

// Helper to render markdown-like text (simple version for modal)
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line text-popover-foreground">
      {text.split('\n').map((line, index) => {
        // Basic list item handling
        if (line.match(/^(\s*-\s+)/)) {
          return <li key={index} className="ml-4 list-disc">{line.replace(/^(\s*-\s+)/, '')}</li>;
        }
        // Basic bold handling (**text**)
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Basic italic handling (*text* or _text_)
        line = line.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
        
        return <p key={index} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: line }} />;
      })}
    </div>
  );
};

export function ResourceFilesTabContent({ files, allChangelogEntries = [] }: ResourceFilesTabContentProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string | undefined>(undefined);
  const [selectedLoaderId, setSelectedLoaderId] = useState<string | undefined>(undefined);
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(undefined);

  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const [selectedEntryForModal, setSelectedEntryForModal] = useState<ChangelogEntry | null>(null);

  const allAvailableVersions = useMemo(() => {
    const versionsMap = new Map<string, Tag>();
    files.forEach(file => {
      file.supportedVersions.forEach(version => {
        if (!versionsMap.has(version.id)) {
          versionsMap.set(version.id, version);
        }
      });
    });
    return Array.from(versionsMap.values()).sort((a,b) => b.name.localeCompare(a.name)); 
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

  const allAvailableChannels = useMemo(() => {
    const channelsMap = new Map<string, Tag>();
    files.forEach(file => {
      if (file.channel && !channelsMap.has(file.channel.id)) {
        channelsMap.set(file.channel.id, file.channel);
      }
    });
    return Array.from(channelsMap.values()).sort((a,b) => {
        const order = ['Release', 'Beta', 'Alpha'];
        return order.indexOf(a.name) - order.indexOf(b.name);
    });
  }, [files]);

  const filteredFiles = useMemo(() => {
    return files.filter(file => {
      const versionMatch = !selectedVersionId || file.supportedVersions.some(v => v.id === selectedVersionId);
      const loaderMatch = !selectedLoaderId || file.supportedLoaders.some(l => l.id === selectedLoaderId);
      const channelMatch = !selectedChannelId || (file.channel && file.channel.id === selectedChannelId);
      return versionMatch && loaderMatch && channelMatch;
    }).sort((a, b) => {
      const order = ['Release', 'Beta', 'Alpha'];
      const aChannelIndex = a.channel ? order.indexOf(a.channel.name) : order.length;
      const bChannelIndex = b.channel ? order.indexOf(b.channel.name) : order.length;
      if (aChannelIndex !== bChannelIndex) return aChannelIndex - bChannelIndex;
      return a.name.localeCompare(b.name);
    });
  }, [files, selectedVersionId, selectedLoaderId, selectedChannelId]);
  
  const hasActiveFilters = selectedVersionId || selectedLoaderId || selectedChannelId;

  const getChannelSpecificClasses = (channel?: Tag) => {
    if (!channel) return { bubble: '', border: 'border-border/30', text: 'text-muted-foreground' };
    switch (channel.name.toLowerCase()) {
      case 'release':
        return { bubble: 'bg-green-500 text-green-50', border: 'border-green-500/70', text: 'text-green-700 dark:text-green-400' };
      case 'beta':
        return { bubble: 'bg-sky-500 text-sky-50', border: 'border-sky-500/70', text: 'text-sky-700 dark:text-sky-400' };
      case 'alpha':
        return { bubble: 'bg-orange-500 text-orange-50', border: 'border-orange-500/70', text: 'text-orange-700 dark:text-orange-400' };
      default:
        return { bubble: 'bg-muted text-muted-foreground', border: 'border-border/50', text: 'text-muted-foreground' };
    }
  };

  const handleOpenChangelogModal = (entry: ChangelogEntry) => {
    setSelectedEntryForModal(entry);
    setIsChangelogModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {(allAvailableVersions.length > 0 || allAvailableLoaders.length > 0 || allAvailableChannels.length > 0) && (
        <div className="p-4 border rounded-md bg-card-foreground/5 shadow-sm space-y-3 sm:flex sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap">
          <div className="flex items-center text-sm font-medium text-muted-foreground shrink-0">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            Filter files by:
          </div>
          {allAvailableVersions.length > 0 && (
            <div className="flex-none"> 
              <Select 
                value={selectedVersionId} 
                onValueChange={(value) => setSelectedVersionId(value === CLEAR_FILTER_VALUE ? undefined : value)}
              >
                <SelectTrigger className="w-auto h-9 text-xs rounded-md min-w-[130px]"> 
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
             <div className="flex-none"> 
              <Select 
                value={selectedLoaderId} 
                onValueChange={(value) => setSelectedLoaderId(value === CLEAR_FILTER_VALUE ? undefined : value)}
              >
                <SelectTrigger className="w-auto h-9 text-xs rounded-md min-w-[130px]"> 
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
          {allAvailableChannels.length > 0 && (
             <div className="flex-none">
              <Select 
                value={selectedChannelId} 
                onValueChange={(value) => setSelectedChannelId(value === CLEAR_FILTER_VALUE ? undefined : value)}
              >
                <SelectTrigger className="w-auto h-9 text-xs rounded-md min-w-[130px]"> 
                  <SelectValue placeholder="All Channels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Channels</SelectItem>
                  {allAvailableChannels.map(cTag => (
                    <SelectItem key={cTag.id} value={cTag.id} className="text-xs">{cTag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
           {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setSelectedVersionId(undefined); setSelectedLoaderId(undefined); setSelectedChannelId(undefined);}}
              className="text-xs h-9 text-muted-foreground hover:text-primary"
            >
              Clear Filters
            </Button>
           )}
        </div>
      )}

      {filteredFiles.length > 0 ? (
        <ul className="space-y-4">
          {filteredFiles.map(file => {
            const channelClasses = getChannelSpecificClasses(file.channel);
            const relatedChangelogEntry = allChangelogEntries.find(entry => entry.relatedFileId === file.id);

            return (
            <li 
                key={file.id} 
                className={cn(
                    "p-4 border rounded-md bg-card-foreground/10 hover:bg-card-foreground/15 transition-colors shadow-sm",
                    "border-l-4", 
                    channelClasses.border
                )}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    {file.channel && (
                      <span className={cn("mr-2 px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap", channelClasses.bubble)}>
                        {file.channel.name}
                      </span>
                    )}
                    <p className="font-medium text-foreground">{file.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 ml-1">Size: {file.size}</p>
                  
                  {(file.supportedVersions.length > 0 || file.supportedLoaders.length > 0) && (
                    <div className="mt-2 space-y-2 ml-1">
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
                <div className="shrink-0 self-start sm:self-center mt-2 sm:mt-0 flex items-center gap-2">
                  {relatedChangelogEntry && (
                     <Dialog open={isChangelogModalOpen && selectedEntryForModal?.id === relatedChangelogEntry.id} onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setSelectedEntryForModal(null);
                        }
                        setIsChangelogModalOpen(isOpen);
                     }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" className="h-9 w-9 border-accent/50 hover:bg-accent/10" onClick={() => handleOpenChangelogModal(relatedChangelogEntry)} title="View Changelog Entry">
                          <Info className="w-4 h-4 text-accent" />
                        </Button>
                      </DialogTrigger>
                       {selectedEntryForModal?.id === relatedChangelogEntry.id && (
                        <DialogContent className="sm:max-w-lg bg-popover text-popover-foreground">
                            <DialogHeader>
                            <DialogTitle className="text-primary">Changelog: {selectedEntryForModal.versionName}</DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground">
                                Released on {format(new Date(selectedEntryForModal.date), 'MMM d, yyyy')}
                            </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                                <SimpleMarkdown text={selectedEntryForModal.notes} />
                            </div>
                        </DialogContent>
                        )}
                    </Dialog>
                  )}
                  <a href={file.url} download>
                    <Button variant="outline" size="sm" className="button-outline-glow h-9">
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </a>
                </div>
              </div>
            </li>
          )})}
        </ul>
      ) : (
        <p className="text-muted-foreground p-4 text-center">
          {files.length > 0 ? "No files match the selected filters." : "No files available for this resource."}
        </p>
      )}
    </div>
  );
}
