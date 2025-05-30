
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye, User, Tags, Info, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel, CarouselItem as NestedCarouselItem } from '@/components/shared/Carousel'; // Renamed to avoid conflict

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
  onHoverChange?: (hovering: boolean) => void;
}

const MAX_TAGS_COMPACT = 2;
const MAX_TAGS_OVERLAY = 5; // Reduced for better fit in overlay

export function ResourceCard({ resource, compact = false, onHoverChange }: ResourceCardProps) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onHoverChange?.(false);
  };
  
  const latestFile = resource.files && resource.files.length > 0 
    ? resource.files.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0] 
    : null;

  return (
    <div 
      className={cn(
        "relative h-full", // Wrapper for positioning overlay correctly
        compact ? "w-full" : "" // Ensure compact cards take full width in carousel cell
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card 
        className={cn(
          "overflow-hidden h-full flex flex-col group bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out border-border/30 hover:border-primary/50",
          compact ? "transform hover:-translate-y-px hover:shadow-primary/40" : "transform hover:-translate-y-1",
          compact ? "text-xs" : "" // Smaller text for compact cards
        )}
      >
        {/* Base Card Content */}
        <CardHeader className="p-0">
          <Link href={`/resources/${resource.slug}`} className="block relative aspect-video overflow-hidden group/image">
            <Image
              src={resource.imageUrl}
              alt={`${resource.name} preview`}
              fill
              style={{objectFit:"cover"}}
              className="group-hover/image:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint={compact ? "gameplay thumbnail abstract" : "gameplay screenshot pattern"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover/image:from-card/50 transition-all duration-300"></div>
          </Link>
        </CardHeader>
        <CardContent className={cn("p-3 flex-grow", compact ? 'pb-2' : 'p-4')}>
          <CardTitle className={cn("font-semibold mb-1 group-hover:text-primary transition-colors", compact ? "text-sm leading-tight" : "text-lg")}>
            <Link href={`/resources/${resource.slug}`}>
              {resource.name}
            </Link>
          </CardTitle>
          {!compact && (
            <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
              For {resource.gameName} / {resource.categoryName}
            </p>
          )}
          <p className="text-xs text-muted-foreground mb-1.5 flex items-center">
            <User className="w-3 h-3 mr-1 text-accent" /> By {resource.author.name}
          </p>
          <div className="flex flex-wrap gap-1 mb-1.5">
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
        <div className={cn("p-3 pt-0 text-xs text-muted-foreground flex justify-between items-center mt-auto", compact ? 'pb-2' : 'p-4')}>
          <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
            <Download className="w-3.5 h-3.5 mr-1 text-accent" /> {resource.downloads.toLocaleString()}
          </span>
          {!compact && (
            <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline flex items-center font-medium group-hover:text-accent transition-colors">
                View <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>

      {/* Hover Detail Overlay - only for compact cards in carousels */}
      {compact && (
        <Link href={`/resources/${resource.slug}`} className="block absolute inset-0 z-10" aria-label={`View details for ${resource.name}`}>
            <div 
            className={cn(
                "detail-overlay absolute inset-0 bg-card/95 backdrop-blur-md p-3 rounded-lg shadow-2xl border border-primary/50",
                "flex flex-col transition-all duration-300 ease-in-out",
                "opacity-0 scale-95 pointer-events-none",
                isHovering && "opacity-100 scale-100 pointer-events-auto"
            )}
            onClick={(e) => e.stopPropagation()} // Prevent link trigger if clicking on carousel controls
            >
            {resource.imageGallery && resource.imageGallery.length > 0 ? (
                <div className="aspect-video overflow-hidden rounded-md mb-2 shadow-inner">
                <Carousel 
                    itemsToShow={1} 
                    showArrows={resource.imageGallery.length > 1} 
                    autoplay={isHovering} // Autoplay only when overlay is active
                    autoplayInterval={2500}
                    className="h-full" // Ensure carousel fills its container
                >
                    {resource.imageGallery.map((imgUrl, idx) => (
                    <NestedCarouselItem key={idx}>
                        <Image 
                            src={imgUrl} 
                            alt={`${resource.name} gallery image ${idx + 1}`} 
                            fill 
                            style={{objectFit:"cover"}}
                            className="rounded-md"
                            data-ai-hint="game art concept"
                        />
                    </NestedCarouselItem>
                    ))}
                </Carousel>
                </div>
            ) : (
                <div className="aspect-video overflow-hidden rounded-md mb-2 relative bg-muted/30">
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
            
            <h3 className="text-sm font-semibold text-primary mb-0.5 line-clamp-1">{resource.name}</h3>
            <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2 h-8">{resource.description}</p>
            
            {resource.tags.length > 0 && (
                <div className="mb-1.5">
                <h4 className="text-[10px] font-semibold text-accent mb-0.5 flex items-center"><Tags className="w-3 h-3 mr-1" /> Tags</h4>
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
            <div className="mt-auto pt-1.5 border-t border-border/20 flex items-center gap-2">
                {latestFile && (
                  <a 
                    href={latestFile.url} 
                    download 
                    onClick={(e) => e.stopPropagation()} // Prevent link navigation
                    className="flex-1"
                  >
                    <Button variant="default" size="sm" className="w-full button-primary-glow text-xs py-1 h-auto">
                        <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </Button>
                  </a>
                )}
                <Link 
                    href={`/resources/${resource.slug}`} 
                    onClick={(e) => e.stopPropagation()} // Prevent double navigation if already a link
                    className={!latestFile ? "flex-1" : ""}
                >
                    <Button variant="outline" size={latestFile ? "icon" : "sm"} className={cn("button-outline-glow text-xs h-auto", latestFile ? "p-1.5" : "w-full py-1")}>
                        <Info className="w-3.5 h-3.5" />
                        {!latestFile && <span className="ml-1.5">Details</span>}
                    </Button>
                </Link>
            </div>
            </div>
        </Link>
      )}
      </Card>
    </div>
  );
}
