import type { Resource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Tag, User, CalendarDays, Layers, Package, FileText, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { TagBadge } from '../shared/TagBadge';

interface ResourceInfoSidebarProps {
  resource: Resource;
}

export function ResourceInfoSidebar({ resource }: ResourceInfoSidebarProps) {
  const latestFile = resource.files.length > 0 ? resource.files[0] : null;

  return (
    <Card className="shadow-lg sticky top-20"> {/* sticky for desktop scroll */}
      <CardHeader>
        <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="mr-2 h-5 w-5" /> Download Latest ({latestFile?.size || 'N/A'})
        </Button>
        {resource.files.length > 1 && (
           <Button variant="outline" size="sm" className="w-full mt-2">
            View All Files ({resource.files.length})
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><User className="w-4 h-4 mr-2 text-accent" />Author</h4>
          <p className="text-muted-foreground">{resource.author.name}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><Layers className="w-4 h-4 mr-2 text-accent" />Version</h4>
          <p className="text-muted-foreground">{resource.version}</p>
        </div>
         <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><Package className="w-4 h-4 mr-2 text-accent" />Game</h4>
          <Link href={`/games/${resource.gameSlug}`} className="text-muted-foreground hover:text-primary transition-colors">
            {resource.gameName}
          </Link>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><FileText className="w-4 h-4 mr-2 text-accent" />Category</h4>
           <Link href={`/games/${resource.gameSlug}#${resource.categorySlug}`} className="text-muted-foreground hover:text-primary transition-colors">
             {resource.categoryName}
          </Link>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><BarChart3 className="w-4 h-4 mr-2 text-accent" />Downloads</h4>
          <p className="text-muted-foreground">{resource.downloads.toLocaleString()}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-accent" />Created</h4>
          <p className="text-muted-foreground">{format(new Date(resource.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-foreground/90 flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-accent" />Last Updated</h4>
          <p className="text-muted-foreground">{format(new Date(resource.updatedAt), 'MMM d, yyyy')}</p>
        </div>
        {resource.tags.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-foreground/90 flex items-center"><Tag className="w-4 h-4 mr-2 text-accent" />Tags</h4>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map(tag => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
