
import Link from 'next/link';
import Image from 'next/image';
import type { GenericListItem, Category, ItemStats, ItemWithDetails } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TagBadge } from '@/components/shared/TagBadge';
import { Package, Download, Layers, Tag as TagIcon, Eye, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: ItemWithDetails; // Using ItemWithDetails which includes categories and stats
  basePath: string; // e.g., "/games", "/web", "/apps", "/art-music"
}

const MAX_CATEGORIES_DISPLAY = 2;
const MAX_TAGS_DISPLAY = 2;

export function ItemCard({ item, basePath }: ItemCardProps) {
  const itemTags = item.tags || [];
  const categories = item.categories || [];
  const stats = item.stats;

  const handleProjectLinkClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation(); // Prevent card navigation
    if (item.projectUrl) {
      window.open(item.projectUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleProjectLinkKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      if (item.projectUrl) {
        window.open(item.projectUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <Link href={`${basePath}/${item.slug}`} className="block group h-full">
      <Card className="flex flex-col overflow-hidden h-full bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-primary/40 transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50 transform hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="block relative aspect-[16/9] overflow-hidden">
            <Image
              src={item.bannerUrl}
              alt={`${item.name} banner`}
              fill
              style={{objectFit:"cover"}}
              className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint={`${item.itemType} art wallpaper`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover:from-card/50 transition-all duration-300"></div>
          </div>
        </CardHeader>
        <CardContent className="p-5 flex-grow">
          <div className="flex items-start mb-3">
            <Image 
              src={item.iconUrl} 
              alt={`${item.name} icon`} 
              width={48} 
              height={48} 
              className="rounded-lg mr-4 border-2 border-primary/50 shadow-md flex-shrink-0"
              data-ai-hint={`${item.itemType} icon logo`}
            />
            <div className="flex-grow">
                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {item.name}
                </CardTitle>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{item.description}</p>
          
          {itemTags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-primary mb-1.5 flex items-center"><TagIcon className="w-3.5 h-3.5 mr-1.5" /> {item.itemType === 'game' ? 'Game' : 'Project'} Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {itemTags.slice(0, MAX_TAGS_DISPLAY).map(tag => (
                  <TagBadge 
                    key={tag.id} 
                    tag={tag} 
                    className="text-[10px] px-1.5 py-0.5"
                  />
                ))}
                {itemTags.length > MAX_TAGS_DISPLAY && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/50 text-accent">
                    +{itemTags.length - MAX_TAGS_DISPLAY} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {categories.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-primary mb-1.5 flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5" /> Categories</h4>
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, MAX_CATEGORIES_DISPLAY).map(cat => (
                  <TagBadge 
                    key={cat.id} 
                    tag={{ name: cat.name, id: cat.id, type: 'misc' }} 
                    className="text-xs bg-secondary hover:bg-secondary/80"
                  />
                ))}
                {categories.length > MAX_CATEGORIES_DISPLAY && (
                  <Badge variant="outline" className="text-xs border-accent/50 text-accent">
                    +{categories.length - MAX_CATEGORIES_DISPLAY} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-5 pt-0 border-t border-border/20 mt-auto">
          <div className="flex justify-between items-center w-full text-sm text-muted-foreground">
            <div className="flex items-center" title="Total Resources">
              <Package className="w-4 h-4 mr-1.5 text-accent" />
              <span>{stats.totalResources.toLocaleString()} Resources</span>
            </div>
            {stats.totalDownloads !== undefined && (
                 <div className="flex items-center" title="Total Downloads">
                    <Download className="w-4 h-4 mr-1.5 text-accent" />
                    <span>{stats.totalDownloads.toLocaleString()} Dls</span>
                 </div>
            )}
            {stats.totalViews !== undefined && (
                 <div className="flex items-center" title="Total Views">
                    <Eye className="w-4 h-4 mr-1.5 text-accent" />
                    <span>{stats.totalViews.toLocaleString()} Views</span>
                 </div>
            )}
            {item.itemType !== 'game' && item.projectUrl && (
                 <span 
                    onClick={handleProjectLinkClick}
                    onKeyDown={handleProjectLinkKeyDown}
                    role="link"
                    tabIndex={0}
                    className="flex items-center hover:text-primary cursor-pointer" title="Visit Project">
                    <ExternalLink className="w-4 h-4 mr-1.5 text-accent" />
                    <span>Visit</span>
                </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
