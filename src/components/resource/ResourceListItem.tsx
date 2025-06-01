
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, ArrowRight, CalendarDays, User, ShieldCheck } from 'lucide-react'; // Removed Badge import, not used directly
import { format } from 'date-fns';
import { formatTimeAgo } from '@/lib/data';

interface ResourceListItemProps {
  resource: Resource;
}

export function ResourceListItem({ resource }: ResourceListItemProps) {
  const [updatedTimeAgo, setUpdatedTimeAgo] = useState('');

  useEffect(() => {
    setUpdatedTimeAgo(formatTimeAgo(resource.updatedAt));
  }, [resource.updatedAt]);

  return (
    <Card className="overflow-hidden group bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50 transform hover:-translate-y-px">
      <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-5">
        <Link href={`/resources/${resource.slug}`} className="block shrink-0 rounded-md overflow-hidden shadow-md">
          <Image
            src={resource.imageUrl}
            alt={`${resource.name} thumbnail`}
            width={128}
            height={72}
            className="object-cover aspect-video group-hover:scale-105 transition-transform duration-300 ease-in-out"
            data-ai-hint="abstract game asset"
          />
        </Link>
        <div className="flex-grow">
          <CardTitle className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
            <Link href={`/resources/${resource.slug}`}>{resource.name}</Link>
          </CardTitle>
          <div className="text-xs text-muted-foreground mb-2 flex flex-wrap gap-x-3">
            <span className="flex items-center"><User className="w-3 h-3 mr-1 text-accent" />By {resource.author.name}</span>
            <span className="flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-accent" />For {resource.parentItemName}</span>
          </div>
          <p className="text-sm text-foreground/80 mb-3 line-clamp-2 h-10">{resource.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {resource.tags.slice(0, 5).map(tag => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {resource.tags.length > 5 && (
               <span className="text-xs px-2 py-0.5 rounded-full border border-accent/50 text-accent bg-accent/10">+{resource.tags.length - 5} more</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
            <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
                <Download className="w-3.5 h-3.5 mr-1 text-accent" /> {resource.downloads.toLocaleString()}
            </span>
            <span 
              className="flex items-center" 
              title={`Last updated: ${format(new Date(resource.updatedAt), 'PPP p')}`}
            >
                <CalendarDays className="w-3.5 h-3.5 mr-1 text-accent" /> {updatedTimeAgo || new Date(resource.updatedAt).toLocaleDateString()}
            </span>
            <span className="font-medium">v{resource.version}</span>
          </div>
        </div>
        <Button asChild variant="outline" size="default" className="mt-3 sm:mt-0 sm:ml-auto self-start sm:self-center group/button button-outline-glow shrink-0">
          <Link href={`/resources/${resource.slug}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-0.5 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
