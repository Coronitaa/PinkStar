

"use client";

import React, { useState, useMemo } from 'react';
import type { ChangelogEntry, ResourceFile, Tag, Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { Download, Filter, GitMerge, CalendarDays, Tag as TagIcon, Info } from 'lucide-react'; // Added Info icon
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TagBadge } from '@/components/shared/TagBadge';
import { cn } from '@/lib/utils';

const CLEAR_FILTER_VALUE = "_ANY_";

interface ResourceChangelogTabContentProps {
  changelogEntries: ChangelogEntry[];
  allResourceFiles: ResourceFile[];
  resourceAuthor: Author;
}

// Helper to render markdown-like text (simple version)
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
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

const getChannelSpecificClasses = (channel?: Tag) => {
    if (!channel) return { circle: 'bg-muted', border: 'border-border/30', text: 'text-muted-foreground' };
    switch (channel.name.toLowerCase()) {
      case 'release':
        return { circle: 'bg-green-500', border: 'border-green-500', text: 'text-green-700 dark:text-green-400' };
      case 'beta':
        return { circle: 'bg-sky-500', border: 'border-sky-500', text: 'text-sky-700 dark:text-sky-400' };
      case 'alpha':
        return { circle: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-700 dark:text-orange-400' };
      default:
        return { circle: 'bg-muted', border: 'border-border/50', text: 'text-muted-foreground' };
    }
};


export function ResourceChangelogTabContent({ changelogEntries, allResourceFiles, resourceAuthor }: ResourceChangelogTabContentProps) {
  const [selectedGameVersionId, setSelectedGameVersionId] = useState<string | undefined>(undefined);
  const [selectedChannelId, setSelectedChannelId] = useState<string | undefined>(undefined);
  
  const sortedChangelogEntries = useMemo(() => {
    return [...changelogEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [changelogEntries]);

  const availableGameVersions = useMemo(() => {
    const versionsMap = new Map<string, Tag>();
    sortedChangelogEntries.forEach(entry => {
      if (entry.gameVersionTag && !versionsMap.has(entry.gameVersionTag.id)) {
        versionsMap.set(entry.gameVersionTag.id, entry.gameVersionTag);
      }
    });
    return Array.from(versionsMap.values()).sort((a, b) => b.name.localeCompare(a.name)); // Newer first
  }, [sortedChangelogEntries]);

  const availableChannels = useMemo(() => {
    const channelsMap = new Map<string, Tag>();
    sortedChangelogEntries.forEach(entry => {
      if (entry.channelTag && !channelsMap.has(entry.channelTag.id)) {
        channelsMap.set(entry.channelTag.id, entry.channelTag);
      }
    });
     return Array.from(channelsMap.values()).sort((a,b) => {
        const order = ['Release', 'Beta', 'Alpha'];
        return order.indexOf(a.name) - order.indexOf(b.name);
    });
  }, [sortedChangelogEntries]);

  const filteredChangelogEntries = useMemo(() => {
    return sortedChangelogEntries.filter(entry => {
      const gameVersionMatch = !selectedGameVersionId || (entry.gameVersionTag && entry.gameVersionTag.id === selectedGameVersionId);
      const channelMatch = !selectedChannelId || (entry.channelTag && entry.channelTag.id === selectedChannelId);
      return gameVersionMatch && channelMatch;
    });
  }, [sortedChangelogEntries, selectedGameVersionId, selectedChannelId]);

  const hasActiveFilters = selectedGameVersionId || selectedChannelId;

  return (
    <div className="space-y-6">
      {(availableGameVersions.length > 0 || availableChannels.length > 0) && (
        <div className="p-4 border rounded-md bg-card-foreground/5 shadow-sm space-y-3 sm:flex sm:flex-row sm:items-center sm:gap-4 sm:flex-wrap">
          <div className="flex items-center text-sm font-medium text-muted-foreground shrink-0">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            Filter changelog by:
          </div>
          {availableGameVersions.length > 0 && (
            <div className="flex-none">
              <Select
                value={selectedGameVersionId}
                onValueChange={(value) => setSelectedGameVersionId(value === CLEAR_FILTER_VALUE ? undefined : value)}
              >
                <SelectTrigger className="w-auto h-9 text-xs rounded-md min-w-[150px]">
                  <SelectValue placeholder="All Game Versions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Game Versions</SelectItem>
                  {availableGameVersions.map(tag => (
                    <SelectItem key={tag.id} value={tag.id} className="text-xs">{tag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {availableChannels.length > 0 && (
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
                  {availableChannels.map(tag => (
                    <SelectItem key={tag.id} value={tag.id} className="text-xs">{tag.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedGameVersionId(undefined); setSelectedChannelId(undefined); }}
              className="text-xs h-9 text-muted-foreground hover:text-primary"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {filteredChangelogEntries.length > 0 ? (
        <div className="space-y-0"> {/* Reduced space for denser timeline */}
          {filteredChangelogEntries.map((entry, index) => {
            const relatedFile = entry.relatedFileId ? allResourceFiles.find(f => f.id === entry.relatedFileId) : null;
            const channelClasses = getChannelSpecificClasses(entry.channelTag);
            return (
              <div key={entry.id} id={`changelog-entry-${entry.id}`} className="relative flex group">
                {/* Timeline vertical line and dot */}
                <div className={cn("absolute left-[11px] top-0 w-0.5 h-full", channelClasses.border, index === 0 && "top-5", index === filteredChangelogEntries.length - 1 && "h-5")}></div>
                 <div className={cn("absolute left-0 top-5 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-background flex items-center justify-center", channelClasses.circle)}>
                  <GitMerge className="w-3 h-3 text-white" />
                </div>
                
                <div className={cn("ml-10 mb-6 p-4 rounded-md shadow-sm bg-card-foreground/5 border-l-4", channelClasses.border, 'w-full')}>
                    <div className="mb-3">
                    <h4 className="font-semibold text-lg text-foreground">{entry.versionName}</h4>
                    <div className="text-xs text-muted-foreground flex items-center space-x-3 flex-wrap">
                        <span>by {resourceAuthor.name}</span>
                        <span className="flex items-center"><CalendarDays className="w-3 h-3 mr-1"/>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                        {entry.channelTag && <Badge variant={entry.channelTag.name.toLowerCase() === 'release' ? 'default' : entry.channelTag.name.toLowerCase() === 'beta' ? 'secondary' : 'destructive'} className={cn("capitalize text-xs px-1.5 py-0 h-5", entry.channelTag.color, entry.channelTag.textColor)}>{entry.channelTag.name}</Badge>}
                    </div>
                    </div>

                    {entry.gameVersionTag && (
                        <div className="mb-1">
                            <TagBadge tag={entry.gameVersionTag} className="text-xs"/>
                        </div>
                    )}
                    {entry.loaderTags && entry.loaderTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {entry.loaderTags.map(lt => <TagBadge key={lt.id} tag={lt} className="text-xs" />)}
                        </div>
                    )}

                    <SimpleMarkdown text={entry.notes} />

                    {relatedFile && (
                    <div className="mt-3">
                        <Button variant="outline" size="sm" asChild className="button-outline-glow">
                        <Link href={relatedFile.url} download>
                            <Download className="w-4 h-4 mr-2" /> Download File ({relatedFile.size})
                        </Link>
                        </Button>
                    </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground p-4 text-center">
          {changelogEntries.length > 0 ? "No changelog entries match the selected filters." : "No changelog entries available for this resource."}
        </p>
      )}
    </div>
  );
}
