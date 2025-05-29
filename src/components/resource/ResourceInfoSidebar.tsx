
import type { Resource, Tag } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, Tag as TagIcon, User, CalendarDays, Layers, Package, FileText, BarChart3, MessageSquare, 
  ExternalLink, AlertTriangle, ShieldQuestion, Heart, Star, Users, GitBranch
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { TagBadge } from '../shared/TagBadge';
import { Separator } from '@/components/ui/separator';
import { formatTimeAgo } from '@/lib/data'; // Import the client-safe formatter
import { cn } from '@/lib/utils';

interface ResourceInfoSidebarProps {
  resource: Resource;
}

const SidebarCard: React.FC<React.PropsWithChildren<{ title?: string; icon?: React.ElementType; className?: string }>> = ({ title, icon: Icon, children, className }) => (
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

const InfoItem: React.FC<{ label: string; value: React.ReactNode; icon?: React.ElementType, className?: string }> = ({ label, value, icon: Icon, className }) => (
  <div className={cn("flex justify-between items-center py-1.5", className)}>
    <span className="text-muted-foreground flex items-center">
      {Icon && <Icon className="w-3.5 h-3.5 mr-2 text-accent" />}
      {label}
    </span>
    <span className="text-foreground font-medium text-right">{value}</span>
  </div>
);

const RatingDisplay: React.FC<{ rating?: number }> = ({ rating }) => {
  if (typeof rating !== 'number') return <span className="text-muted-foreground">N/A</span>;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
      {halfStar && <Star key="half" className="w-4 h-4 text-amber-400 fill-amber-200" />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-4 h-4 text-amber-400/50" />)}
      <span className="ml-1.5 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
    </div>
  );
};


export function ResourceInfoSidebar({ resource }: ResourceInfoSidebarProps) {
  const latestFile = resource.files.length > 0 ? resource.files[0] : null;
  const [updatedAtFormatted, setUpdatedAtFormatted] = React.useState<string>(formatTimeAgo(resource.updatedAt));

  React.useEffect(() => {
    // Ensure formatTimeAgo is called on client after hydration
    setUpdatedAtFormatted(formatTimeAgo(resource.updatedAt));
  }, [resource.updatedAt]);

  const tagGroups = resource.tags.reduce((acc, tag) => {
    const type = tag.type.charAt(0).toUpperCase() + tag.type.slice(1); // Capitalize type
    if (!acc[type]) acc[type] = [];
    acc[type].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  return (
    <div className="space-y-5 sticky top-20">
      <SidebarCard className="border-primary/50 shadow-primary/20">
        <div className="space-y-2">
          <Button size="lg" className="w-full button-primary-glow text-base py-3 h-auto">
            <Download className="mr-2 h-5 w-5" /> Download Latest {latestFile ? `(${latestFile.size})` : ''}
          </Button>
          {resource.files.length > 0 && ( // Show only if there are files
            <Button variant="outline" size="sm" className="w-full button-outline-glow" asChild>
              <Link href={`#files-tab`} scroll={false}> {/* Updated this link */}
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
            {/* Add link to author profile if available later */}
            <p className="text-xs text-muted-foreground">Creator of this resource</p>
          </div>
        </div>
      </SidebarCard>
      
      <SidebarCard title="Details" icon={ListChecks}>
        <InfoItem label="Version" value={resource.version} icon={GitBranch} />
        <InfoItem label="Game" value={<Link href={`/games/${resource.gameSlug}`} className="hover:text-primary transition-colors">{resource.gameName}</Link>} icon={Package} />
        <InfoItem label="Category" value={<Link href={`/games/${resource.gameSlug}/${resource.categorySlug}`} className="hover:text-primary transition-colors">{resource.categoryName}</Link>} icon={Layers} />
        <InfoItem label="Downloads" value={resource.downloads.toLocaleString()} icon={BarChart3} />
        <InfoItem label="Rating" value={<RatingDisplay rating={resource.rating} />} icon={Star} />
        <InfoItem label="Followers" value={(resource.followers || 0).toLocaleString()} icon={Heart} />
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
                    {tagsInGroup.map(tag => <TagBadge key={tag.id} tag={tag} />)}
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
