
"use client"; 

import * as React from 'react';
import type { Resource, Tag, ItemType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Download, Tag as TagIcon, User, CalendarDays, Layers, Package, FileText, BarChart3, MessageSquare,
  ExternalLink, AlertTriangle, ShieldQuestion, Star, Users, GitBranch, ListChecks, Binary, Palette, MusicIcon, Laptop, Heart, StarHalf
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link'; 
import { TagBadge } from '../shared/TagBadge';
import { Separator } from '@/components/ui/separator';
import { formatTimeAgo, formatNumberWithSuffix } from '@/lib/data'; 
import { cn } from '@/lib/utils';

interface SidebarCardProps extends React.PropsWithChildren<{ title?: string; icon?: React.ElementType; className?: string }> {}

const SidebarCard: React.FC<SidebarCardProps> = ({ title, icon: Icon, children, className }) => (
  <Card className={cn("shadow-lg bg-card/80 backdrop-blur-sm border-border/40", className)}>
    {title && (
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className="text-base font-semibold text-primary flex items-center">
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {title}
        </CardTitle>
      </CardHeader>
    )}
    <CardContent className={cn("text-sm", title ? "px-4 pb-4 pt-0" : "p-4")}>
      {children}
    </CardContent>
  </Card>
);

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
  suppressHydrationWarning?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon: Icon, className, suppressHydrationWarning }) => (
  <div className={cn("flex justify-between items-center py-1.5", className)}>
    <span className="text-muted-foreground flex items-center">
      {Icon && <Icon className="w-3.5 h-3.5 mr-2 text-accent" />}
      {label}
    </span>
    <span className="text-foreground font-medium text-right" suppressHydrationWarning={suppressHydrationWarning}>
      {value}
    </span>
  </div>
);

const RatingDisplaySidebar: React.FC<{ rating?: number; reviewCount?: number }> = ({ rating, reviewCount }) => {
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return <span className="text-muted-foreground">N/A</span>;

  const stars = [];
  const starSize = "w-4 h-4"; 
  for (let i = 0; i < 5; i++) {
    if (rating >= i + 0.75) {
      stars.push(<Star key={`star-full-${i}`} className={cn(starSize, "text-amber-400 fill-amber-400")} />);
    } else if (rating >= i + 0.25) {
      stars.push(<StarHalf key={`star-half-${i}`} className={cn(starSize, "text-amber-400 fill-amber-400")} />);
    } else {
      stars.push(<Star key={`star-empty-${i}`} className={cn(starSize, "text-amber-400/40")} />); 
    }
  }
  return (
    <div className="flex items-center">
      {stars}
      <span className="ml-1.5 text-xs text-muted-foreground">
        ({rating.toFixed(1)})
        {reviewCount !== undefined && <span className="ml-1">({formatNumberWithSuffix(reviewCount)} reviews)</span>}
      </span>
    </div>
  );
};

interface ResourceInfoSidebarProps { 
  resource: Resource;
}

const getItemTypeIcon = (itemType: ItemType) => {
  switch (itemType) {
    case 'game': return Package;
    case 'web': return Binary;
    case 'app': return Laptop;
    case 'art-music': return Palette; 
    default: return Package;
  }
};

export function ResourceInfoSidebar({ resource }: ResourceInfoSidebarProps) {
  const latestFile = resource.files.length > 0 ? resource.files[0] : null;
  const [updatedAtFormatted, setUpdatedAtFormatted] = React.useState<string>(() => {
    if (typeof window === 'undefined') {
      return new Date(resource.updatedAt).toLocaleDateString(); 
    }
    return new Date(resource.updatedAt).toLocaleDateString(); 
  });

  React.useEffect(() => {
    setUpdatedAtFormatted(formatTimeAgo(resource.updatedAt));
  }, [resource.updatedAt]);

  const tagGroups = resource.tags.reduce((acc, tag) => {
    const type = tag.type.charAt(0).toUpperCase() + tag.type.slice(1);
    if (!acc[type]) acc[type] = [];
    acc[type].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const getFilterQueryParamForTagType = (tagType: Tag['type']): string | null => {
    switch (tagType) {
      case 'version': return 'versions';
      case 'loader': return 'loaders';
      case 'genre': return 'genres';
      case 'misc': return 'misc';
      case 'channel': return 'channels';
      case 'framework': return 'frameworks';
      case 'language': return 'languages';
      case 'tooling': return 'tooling';
      case 'platform': return 'platforms';
      case 'app-category': return 'appCategories';
      case 'art-style': return 'artStyles';
      case 'music-genre': return 'musicGenres';
      default: return null;
    }
  };

  const parentItemPath = `/${resource.parentItemType === 'art-music' ? 'art-music' : resource.parentItemType + 's'}/${resource.parentItemSlug}`;


  return (
    <div className="space-y-5 sticky top-20">
      <SidebarCard className="border-primary/50 shadow-primary/20">
        <div className="space-y-2">
          <Button size="lg" className="w-full button-primary-glow text-base py-3 h-auto">
            <Download className="mr-2 h-5 w-5" /> Download Latest {latestFile ? `(${latestFile.size})` : ''}
          </Button>
          {resource.files.length > 0 && ( 
            <Button variant="outline" size="sm" className="w-full button-outline-glow" asChild>
              <Link href={`?tab=files`} scroll={false}> 
                <FileText className="mr-2 h-4 w-4" /> View All Files ({resource.files.length})
              </Link>
            </Button>
          )}
        </div>
      </SidebarCard>

      <SidebarCard title="Author" icon={User}>
        <div className="flex items-center space-x-3">
          {resource.author.avatarUrl && (
            <img src={resource.author.avatarUrl} alt={resource.author.name} className="w-10 h-10 rounded-full border-2 border-accent" />
          )}
          <div>
            <p className="font-semibold text-foreground">{resource.author.name}</p>
            <p className="text-xs text-muted-foreground">Creator of this resource</p>
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Details" icon={ListChecks}>
        <InfoItem label="Version" value={resource.version} icon={GitBranch} />
        <InfoItem label="Project" value={<Link href={parentItemPath} className="hover:text-primary transition-colors">{resource.parentItemName}</Link>} icon={getItemTypeIcon(resource.parentItemType)} />
        <InfoItem label="Category" value={<Link href={`${parentItemPath}/${resource.categorySlug}`} className="hover:text-primary transition-colors">{resource.categoryName}</Link>} icon={Layers} />
        <InfoItem label="Downloads" value={formatNumberWithSuffix(resource.downloads)} icon={BarChart3} />
        <InfoItem label="Rating" value={<RatingDisplaySidebar rating={resource.rating} reviewCount={resource.reviewCount} />} icon={Star} />
        <InfoItem label="Followers" value={formatNumberWithSuffix(resource.followers)} icon={Heart} />
        <InfoItem label="Created" value={format(new Date(resource.createdAt), 'MMM d, yyyy')} icon={CalendarDays} />
        <InfoItem label="Updated" value={updatedAtFormatted} icon={CalendarDays} suppressHydrationWarning={true} />
      </SidebarCard>

      {Object.entries(tagGroups).length > 0 && (
        <SidebarCard title="Tags" icon={TagIcon}>
          <div className="space-y-3">
            {Object.entries(tagGroups).map(([type, tagsInGroup]) => (
              tagsInGroup.length > 0 && (
                <div key={type}>
                  <h5 className="text-xs font-semibold text-muted-foreground mb-1.5">{type}</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {tagsInGroup.map(tag => {
                      const queryParam = getFilterQueryParamForTagType(tag.type);
                      const categoryPath = `${parentItemPath}/${resource.categorySlug}`;
                      if (queryParam) {
                        return (
                          <Link 
                            key={tag.id} 
                            href={`${categoryPath}?${queryParam}=${tag.id}`}
                            className="hover:opacity-80 transition-opacity"
                          >
                            <TagBadge tag={tag} />
                          </Link>
                        );
                      }
                      return <TagBadge key={tag.id} tag={tag} />;
                    })}
                  </div>
                </div>
              )
            ))}
          </div>
        </SidebarCard>
      )}

      {resource.links && Object.values(resource.links).some(link => !!link) && (
        <SidebarCard title="Project Links" icon={ExternalLink}>
            <div className="space-y-2">
                {resource.links.discord && <Button variant="outline" size="sm" asChild className="w-full justify-start"><Link href={resource.links.discord} target="_blank"><MessageSquare className="mr-2 h-4 w-4 text-indigo-400"/>Discord Server</Link></Button>}
                {resource.links.wiki && <Button variant="outline" size="sm" asChild className="w-full justify-start"><Link href={resource.links.wiki} target="_blank"><ShieldQuestion className="mr-2 h-4 w-4 text-green-400"/>Wiki / Guide</Link></Button>}
                {resource.links.issues && <Button variant="outline" size="sm" asChild className="w-full justify-start"><Link href={resource.links.issues} target="_blank"><AlertTriangle className="mr-2 h-4 w-4 text-yellow-400"/>Issue Tracker</Link></Button>}
                {resource.links.source && <Button variant="outline" size="sm" asChild className="w-full justify-start"><Link href={resource.links.source} target="_blank"><GitBranch className="mr-2 h-4 w-4 text-gray-400"/>Source Code</Link></Button>}
                {resource.links.projectUrl && <Button variant="outline" size="sm" asChild className="w-full justify-start"><Link href={resource.links.projectUrl} target="_blank"><ExternalLink className="mr-2 h-4 w-4 text-blue-400"/>Visit Resource Site</Link></Button>}
            </div>
        </SidebarCard>
      )}

      <SidebarCard>
         <Button variant="destructive" size="sm" className="w-full bg-destructive/80 hover:bg-destructive text-destructive-foreground">
            <AlertTriangle className="mr-2 h-4 w-4" /> Report Resource
        </Button>
      </SidebarCard>

    </div>
  );
}

