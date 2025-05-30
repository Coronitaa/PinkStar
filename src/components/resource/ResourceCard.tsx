
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Resource, ResourceFile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye, User, Tags, Info, ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel, CarouselItem as NestedCarouselItem } from '@/components/shared/Carousel';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
  onHoverChange?: (hovering: boolean) => void;
}

const MAX_TAGS_COMPACT = 1;
const MAX_TAGS_OVERLAY = 5; // Max tags for the hover overlay

const RatingDisplay: React.FC<{ rating?: number, compact?: boolean }> = ({ rating, compact = false }) => {
  if (typeof rating !== 'number') return null;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; // Simple half star logic
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const starSize = compact ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div className={cn("flex items-center", compact ? "gap-0.5" : "gap-0.5")}>
      {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className={cn(starSize, "text-amber-400 fill-amber-400")} />)}
      {halfStar && <Star key="half" className={cn(starSize, "text-amber-400 fill-amber-200")} />}
      {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className={cn(starSize, "text-amber-400/50")} />)}
      {!compact && <span className="ml-1 text-[10px] text-muted-foreground">({rating.toFixed(1)})</span>}
      {compact && <span className="ml-0.5 text-[9px] text-muted-foreground">({rating.toFixed(1)})</span>}
    </div>
  );
};


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
        "relative h-full group/card", // group/card for overlay hover state
        compact ? "w-full" : ""
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/resources/${resource.slug}`} className="block h-full" aria-label={`View details for ${resource.name}`}>
        <Card
          className={cn(
            "overflow-hidden h-full flex flex-col bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out border-border/30 group-hover/card:border-primary/50",
            compact ? "transform hover:-translate-y-px group-hover/card:shadow-primary/30" : "transform hover:-translate-y-1",
            compact ? "" : "" // Global text size for compact card already handled by specific elements
          )}
        >
          <CardHeader className="p-0">
            <div className="block relative aspect-video overflow-hidden">
              <Image
                src={resource.imageUrl}
                alt={`${resource.name} preview`}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover/card:scale-105 transition-transform duration-300 ease-in-out"
                data-ai-hint={compact ? "gameplay thumbnail abstract" : "gameplay screenshot pattern"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover/card:from-card/50 transition-all duration-300"></div>
            </div>
          </CardHeader>
          <CardContent className={cn("flex-grow", compact ? 'p-2 pb-1.5' : 'p-4')}>
            <CardTitle className={cn("font-semibold group-hover/card:text-primary transition-colors line-clamp-1", compact ? "text-xs leading-tight mb-0.5" : "text-lg mb-1")}>
              {resource.name}
            </CardTitle>
            {!compact && (
              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                For {resource.gameName} / {resource.categoryName}
              </p>
            )}
            <p className={cn("text-muted-foreground flex items-center line-clamp-1", compact ? "text-[10px] mb-1" : "text-xs mb-1.5")}>
              <User className="w-3 h-3 mr-1 text-accent shrink-0" /> By {resource.author.name}
            </p>
            {compact && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {resource.tags.slice(0, MAX_TAGS_COMPACT).map(tag => (
                  <TagBadge key={tag.id} tag={tag} className="text-[9px] px-1 py-0" />
                ))}
                {resource.tags.length > MAX_TAGS_COMPACT && (
                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-accent/50 text-accent">
                    +{resource.tags.length - MAX_TAGS_COMPACT}
                  </Badge>
                )}
              </div>
            )}
            {!compact && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1.5">
                {resource.tags.slice(0, 3).map(tag => (
                  <TagBadge key={tag.id} tag={tag} className="text-[10px] px-1.5 py-0.5" />
                ))}
                {resource.tags.length > 3 && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 border-accent/50 text-accent">
                    +{resource.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
          <div className={cn("text-muted-foreground flex justify-between items-center mt-auto", compact ? 'p-2 pt-0 pb-1.5 text-[10px]' : 'p-4 pt-0 text-xs')}>
            <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
              <Download className={cn("mr-1 text-accent", compact ? "w-3 h-3" : "w-3.5 h-3.5")} /> {resource.downloads.toLocaleString()}
            </span>
            {compact && resource.rating !== undefined && (
              <RatingDisplay rating={resource.rating} compact />
            )}
            {!compact && resource.rating !== undefined && (
              <RatingDisplay rating={resource.rating} />
            )}
            {!compact && ( // "View Details" link for non-compact, now removed as overlay handles details
                 <Link href={`/resources/${resource.slug}`} className="text-primary hover:underline flex items-center font-medium group-hover/card:text-accent transition-colors">
                    View <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
            )}
          </div>
        </Card>
      </Link>

      {/* Hover Detail Overlay */}
      <div // Changed from Link/a to div for better click control logic
        className={cn(
          "detail-overlay absolute inset-0 bg-card/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-primary/50",
          "flex flex-col transition-all duration-300 ease-in-out z-20", // Increased z-index
          isHovering ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-90 pointer-events-none" // Scale from 90 for more "sobrepasar"
        )}
        onClick={(e) => {
          // Navigate if the click is on the overlay background itself
          // And not on an interactive element within the overlay
          if (e.target === e.currentTarget) {
            // Simulate link click for Next.js router if needed, or let a parent Link handle it if wrapped
             window.location.href = `/resources/${resource.slug}`; // Simple navigation for now
          }
        }}
      >
        <div className="aspect-video overflow-hidden rounded-md mb-3 shadow-inner" onClick={(e) => e.stopPropagation()}>
          {resource.imageGallery && resource.imageGallery.length > 0 ? (
            <Carousel
              itemsToShow={1}
              showArrows={resource.imageGallery.length > 1}
              autoplay={isHovering} // Autoplay only when overlay is active
              autoplayInterval={2500}
              className="h-full"
            >
              {resource.imageGallery.map((imgUrl, idx) => (
                <NestedCarouselItem key={idx}>
                  <Image
                    src={imgUrl}
                    alt={`${resource.name} gallery image ${idx + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-md"
                    data-ai-hint="game art concept"
                  />
                </NestedCarouselItem>
              ))}
            </Carousel>
          ) : (
            <div className="aspect-video overflow-hidden rounded-md relative bg-muted/30">
              <Image
                src={resource.imageUrl}
                alt={`${resource.name} preview`}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-md"
                data-ai-hint="abstract pattern"
              />
            </div>
          )}
        </div>

        <h3 className="text-base font-semibold text-primary mb-1 line-clamp-1">{resource.name}</h3>
        {resource.rating !== undefined && (
          <div className="mb-1.5">
            <RatingDisplay rating={resource.rating} />
          </div>
        )}
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 h-8">{resource.description}</p>

        {resource.tags.length > 0 && (
          <div className="mb-2">
            <h4 className="text-[11px] font-semibold text-accent mb-1 flex items-center"><Tags className="w-3.5 h-3.5 mr-1" /> Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.slice(0, MAX_TAGS_OVERLAY).map(tag => (
                <TagBadge key={tag.id} tag={tag} className="text-xs px-1.5 py-0.5" />
              ))}
              {resource.tags.length > MAX_TAGS_OVERLAY && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-accent/50 text-accent">
                  +{resource.tags.length - MAX_TAGS_OVERLAY}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-border/20 flex items-center gap-2">
          {latestFile ? (
            <a
              href={latestFile.url}
              download
              onClick={(e) => e.stopPropagation()} // Prevent overlay link navigation
              className="flex-1"
              aria-label={`Download ${resource.name} - ${latestFile.name}`}
            >
              <Button variant="default" size="sm" className="w-full button-primary-glow text-xs py-1.5 h-auto">
                <Download className="w-4 h-4 mr-1.5" /> Download
              </Button>
            </a>
          ) : (
            <Button variant="default" size="sm" className="w-full button-primary-glow text-xs py-1.5 h-auto" disabled>
              <Download className="w-4 h-4 mr-1.5" /> Download
            </Button>
          )}
          <Link
            href={`/resources/${resource.slug}`}
            onClick={(e) => e.stopPropagation()} // Prevent outer div click navigation
            passHref
            aria-label={`More information about ${resource.name}`}
          >
            <Button asChild variant="outline" size="icon" className={cn("button-outline-glow text-xs h-auto p-2")}>
              <a>
                <Info className="w-4 h-4" />
              </a>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
