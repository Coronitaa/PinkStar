import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

export function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-primary/20 transition-shadow duration-200">
      <CardHeader className="p-0">
        <Link href={`/resources/${resource.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={`${resource.name} preview`}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300"
            data-ai-hint="abstract texture"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-3 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 hover:text-primary">
          <Link href={`/resources/${resource.slug}`}>
            {resource.name}
          </Link>
        </CardTitle>
        {!compact && (
          <CardDescription className="text-xs text-muted-foreground mb-2 line-clamp-2">
             For {resource.gameName} / {resource.categoryName}
          </CardDescription>
        )}
        <p className="text-xs text-muted-foreground mb-2">By {resource.author.name}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.tags.slice(0, compact ? 2 : 3).map(tag => (
            <TagBadge key={tag.id} tag={tag} className="text-[10px] px-1.5 py-0.5" />
          ))}
        </div>
      </CardContent>
      <div className="p-3 pt-0 text-xs text-muted-foreground flex justify-between items-center">
        <span className="flex items-center">
          <Download className="w-3 h-3 mr-1" /> {resource.downloads.toLocaleString()}
        </span>
         <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline flex items-center">
            View <Eye className="w-3 h-3 ml-1" />
        </Link>
      </div>
    </Card>
  );
}
