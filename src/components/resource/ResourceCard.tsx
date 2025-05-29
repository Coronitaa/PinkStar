
import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye, User } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

export function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col group bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50 transform hover:-translate-y-px">
      <CardHeader className="p-0">
        <Link href={`/resources/${resource.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={`${resource.name} preview`}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
            data-ai-hint="abstract texture pattern"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover:from-card/50 transition-all duration-300"></div>
        </Link>
      </CardHeader>
      <CardContent className={`p-4 flex-grow ${compact ? 'pb-2' : ''}`}>
        <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
          <Link href={`/resources/${resource.slug}`}>
            {resource.name}
          </Link>
        </CardTitle>
        {!compact && (
          <CardDescription className="text-xs text-muted-foreground mb-2 line-clamp-1">
             For {resource.gameName} / {resource.categoryName}
          </CardDescription>
        )}
        <p className="text-xs text-muted-foreground mb-2 flex items-center">
          <User className="w-3 h-3 mr-1 text-accent" /> By {resource.author.name}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {resource.tags.slice(0, compact ? 2 : 3).map(tag => (
            <TagBadge key={tag.id} tag={tag} className="text-[10px] px-1.5 py-0.5" />
          ))}
          {resource.tags.length > (compact ? 2 : 3) && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/50 text-accent">
              +{resource.tags.length - (compact ? 2 : 3)}
            </Badge>
          )}
        </div>
      </CardContent>
      <div className={`p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center ${compact ? 'pb-3' : ''}`}>
        <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
          <Download className="w-3.5 h-3.5 mr-1 text-accent" /> {resource.downloads.toLocaleString()}
        </span>
         <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline flex items-center font-medium group-hover:text-accent transition-colors">
            View <Eye className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>
    </Card>
  );
}
