
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Resource, ResourceFile, Tag } from '@/lib/types'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagBadge } from '@/components/shared/TagBadge';
import { Download, Eye, User, Tags, Info, ArrowRight, Star, StarHalf, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Carousel as NestedCarousel, CarouselItem as NestedCarouselItem } from '@/components/shared/Carousel';
import { formatNumberWithSuffix } from '@/lib/data';

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
  onHoverChange?: (hovering: boolean) => void;
}

const MAX_TAGS_COMPACT = 1;
const MAX_TAGS_OVERLAY = 9; 

const RatingDisplay: React.FC<{ rating?: number; compact?: boolean; fiveStarMode?: boolean }> = ({ rating, compact = false, fiveStarMode = false }) => {
  if (typeof rating !== 'number' || rating < 0 || rating > 5) return null;

  if (fiveStarMode) {
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
        <span className="ml-1.5 text-xs text-muted-foreground">({rating.toFixed(1)})</span>
      </div>
    );
  } else { 
    const starIconSize = compact ? "w-3 h-3" : "w-4 h-4";
    return (
      <div className={cn("flex items-center gap-0.5", compact ? "text-xs" : "text-sm")}>
        <Star className={cn(starIconSize, "text-amber-400 fill-amber-400 mr-0.5")} />
        <span className="text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  }
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
        "relative h-full group/card", 
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/resources/${resource.slug}`} className="block h-full" aria-label={`View details for ${resource.name}`}>
        <Card
          className={cn(
            "overflow-hidden h-full flex flex-col bg-card/80 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out border-border/30 group-hover/card:border-primary/50",
            compact ? "p-2 pb-1.5" : "p-4", 
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
          <CardContent className={cn("flex-grow", compact ? 'p-2 pt-1.5 pb-1' : 'p-4 pt-3')}>
            <CardTitle className={cn("font-semibold group-hover/card:text-primary transition-colors line-clamp-1", compact ? "text-base mb-1" : "text-lg mb-1")}>
              {resource.name}
            </CardTitle>
            {!compact && (
              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">
                For {resource.parentItemName} / {resource.categoryName}
              </p>
            )}
            <p className={cn("text-muted-foreground flex items-center line-clamp-1", compact ? "text-[10px] mb-1" : "text-xs mb-1.5")}>
              <User className={cn("mr-1 text-accent shrink-0", compact ? "w-2.5 h-2.5" : "w-3 h-3")} />
              By {resource.author.name}
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
          <div className={cn("text-muted-foreground flex justify-between items-center mt-auto", compact ? 'p-2 pt-0 pb-1.5 text-[10px]' : 'p-4 pt-0 text-xs border-t border-border/20')}>
            <span className="flex items-center" title={`${resource.downloads.toLocaleString()} downloads`}>
              <Download className={cn("mr-1 text-accent", compact ? "w-3 h-3" : "w-3.5 h-3.5")} /> {formatNumberWithSuffix(resource.downloads)}
            </span>
            {resource.rating !== undefined && (
              <RatingDisplay rating={resource.rating} compact={compact} />
            )}
          </div>
        </Card>
      </Link>

      {compact && ( 
        <div
          className={cn(
            "detail-overlay absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", 
            "w-80 h-auto", 
            "bg-card/95 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-primary/50",
            "flex flex-col transition-all duration-300 ease-in-out transform-gpu", 
            isHovering ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
            "z-30" 
          )}
          style={{transformOrigin: 'center center'}} 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              window.location.href = `/resources/${resource.slug}`; 
            }
          }}
        >
          <div className="aspect-video overflow-hidden rounded-md mb-3 shadow-inner" onClick={(e) => e.stopPropagation()}>
            {resource.imageGallery && resource.imageGallery.length > 0 ? (
              <NestedCarousel
                itemsToShow={1}
                showArrows={resource.imageGallery.length > 1}
                autoplay={isHovering} 
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
              </NestedCarousel>
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
              <RatingDisplay rating={resource.rating} fiveStarMode={true} />
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

          <div className="mt-2 pt-2 border-t border-border/10 flex justify-around text-xs">
            <div className="flex items-center text-muted-foreground" title={`${resource.downloads.toLocaleString()} downloads`}>
              <Download className="w-3.5 h-3.5 mr-1 text-accent" />
              {formatNumberWithSuffix(resource.downloads)}
            </div>
            {resource.followers !== undefined && (
              <div className="flex items-center text-muted-foreground" title={`${resource.followers.toLocaleString()} followers`}>
                <Heart className="w-3.5 h-3.5 mr-1 text-accent" />
                {formatNumberWithSuffix(resource.followers)}
              </div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-border/20 flex items-center gap-2">
            {latestFile ? (
              <a
                href={latestFile.url}
                download
                onClick={(e) => e.stopPropagation()} 
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
            <Button asChild variant="outline" size="icon" className={cn("button-outline-glow text-xs h-auto p-2")}>
              <Link
                href={`/resources/${resource.slug}`}
                onClick={(e) => e.stopPropagation()} 
                aria-label={`More information about ${resource.name}`}
              >
                <Info className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
