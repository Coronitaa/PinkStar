import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, ArrowRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

interface ResourceListItemProps {
  resource: Resource;
}

export function ResourceListItem({ resource }: ResourceListItemProps) {
  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-colors duration-200">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
        <Link href={`/resources/${resource.slug}`} className="block shrink-0">
          <Image
            src={resource.imageUrl}
            alt={`${resource.name} thumbnail`}
            width={128}
            height={72}
            className="rounded-md object-cover aspect-video group-hover:opacity-90 transition-opacity"
            data-ai-hint="abstract art"
          />
        </Link>
        <div className="flex-grow">
          <CardTitle className="text-lg mb-1 hover:text-primary">
            <Link href={`/resources/${resource.slug}`}>{resource.name}</Link>
          </CardTitle>
          <p className="text-xs text-muted-foreground mb-1">By {resource.author.name} for {resource.gameName}</p>
          <p className="text-sm text-foreground/80 mb-2 line-clamp-2">{resource.description}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {resource.tags.map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
          </div>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
            <span className="flex items-center"><Download className="w-3 h-3 mr-1" /> {resource.downloads.toLocaleString()} Downloads</span>
            <span className="flex items-center"><CalendarDays className="w-3 h-3 mr-1" />Updated: {format(new Date(resource.updatedAt), 'MMM d, yyyy')}</span>
            <span>Version: {resource.version}</span>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="mt-2 sm:mt-0 sm:ml-auto self-start sm:self-center group/button">
          <Link href={`/resources/${resource.slug}`}>
            Details <ArrowRight className="ml-1 h-4 w-4 group-hover/button:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
