
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye, User, Tags, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Carousel, CarouselItem } from '@/components/shared/Carousel'; // For nested carousel

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

const MAX_TAGS_COMPACT = 2;
const MAX_TAGS_OVERLAY = 9;

export function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden h-full flex flex-col group relative bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50 transform hover:-translate-y-px",
        compact && "hover:shadow-primary/40" 
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Base Card Content (Always Visible or Base for Overlay) */}
      <CardHeader className="p-0">
        <Link href={`/resources/${resource.slug}`} className="block relative aspect-video overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={`${resource.name} preview`}
            fill // Changed from layout="fill"
            style={{objectFit:"cover"}} // Changed from objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
            data-ai-hint={compact ? "gameplay thumbnail abstract" : "gameplay screenshot pattern"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover:from-card/50 transition-all duration-300"></div>
        </Link>
      </CardHeader>
      <CardContent className={cn("p-4 flex-grow", compact ? 'pb-2' : '')}>
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
          {resource.tags.slice(0, compact ? MAX_TAGS_COMPACT : 3).map(tag => (
            <TagBadge key={tag.id} tag={tag} className="text-[10px] px-1.5 py-0.5" />
          ))}
          {resource.tags.length > (compact ? MAX_TAGS_COMPACT : 3) && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/50 text-accent">
              +{resource.tags.length - (compact ? MAX_TAGS_COMPACT : 3)}
            </Badge>
          )}
        </div>
      </CardContent>
      <div className={cn("p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center mt-auto", compact ? 'pb-3' : '')}>
        <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
          <Download className="w-3.5 h-3.5 mr-1 text-accent" /> {resource.downloads.toLocaleString()}
        </span>
         <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline flex items-center font-medium group-hover:text-accent transition-colors">
            View <Eye className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Hover Detail Overlay - only for compact cards in carousels */}
      {compact && (
        <div 
          className={cn(
            "detail-overlay absolute inset-0 z-10 bg-card/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-primary/50",
            "flex flex-col transition-all duration-300 ease-in-out",
            "opacity-0 scale-95 pointer-events-none",
            isHovering && "opacity-100 scale-100 pointer-events-auto"
          )}
        >
          {resource.imageGallery && resource.imageGallery.length > 0 ? (
            <div className="aspect-video overflow-hidden rounded-md mb-3 shadow-inner">
              <Carousel 
                itemsToShow={1} 
                showArrows={resource.imageGallery.length > 1} 
                autoplay={true} 
                autoplayInterval={3000}
              >
                {resource.imageGallery.map((imgUrl, idx) => (
                  <CarouselItem key={idx}>
                    <Image 
                        src={imgUrl} 
                        alt={`${resource.name} gallery image ${idx + 1}`} 
                        fill 
                        style={{objectFit:"cover"}}
                        className="rounded-md"
                        data-ai-hint="game art concept"
                    />
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          ) : (
             <div className="aspect-video overflow-hidden rounded-md mb-3 relative bg-muted/30">
                <Image
                    src={resource.imageUrl} // Fallback to main image if no gallery
                    alt={`${resource.name} preview`}
                    fill
                    style={{objectFit:"cover"}}
                    className="rounded-md"
                    data-ai-hint="abstract pattern"
                />
             </div>
          )}
          
          <h3 className="text-base font-semibold text-primary mb-1 line-clamp-1">{resource.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 h-8">{resource.description}</p>
          
          {resource.tags.length > 0 && (
            <div className="mb-2">
              <h4 className="text-[10px] font-semibold text-accent mb-1 flex items-center"><Tags className="w-3 h-3 mr-1" /> Tags</h4>
              <div className="flex flex-wrap gap-1">
                {resource.tags.slice(0, MAX_TAGS_OVERLAY).map(tag => (
                  <TagBadge key={tag.id} tag={tag} className="text-[9px] px-1 py-0.5" />
                ))}
                {resource.tags.length > MAX_TAGS_OVERLAY && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0.5 border-accent/50 text-accent">
                    +{resource.tags.length - MAX_TAGS_OVERLAY}
                  </Badge>
                )}
              </div>
            </div>
          )}
          <div className="mt-auto pt-2 border-t border-border/20">
            <Link href={`/resources/${resource.slug}`} className="w-full">
                <button className="w-full button-outline-glow text-xs py-1.5 px-2 rounded-md flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 mr-1.5" /> View Full Details
                </button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
