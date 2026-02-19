'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ItemWithDetails } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TagBadge } from '@/components/shared/TagBadge';
import { Package, Download, Layers, Tag as TagIcon } from 'lucide-react';
import { formatNumberWithSuffix } from '@/lib/utils';
import GlareHover from '@/components/effects/GlareHover';
import { cn } from '@/lib/utils';

interface ItemCardProps {
  item: ItemWithDetails;
  basePath: string;
}

/**
 * A row that renders as many children as fit in the available width,
 * then shows a "+N more" badge for the rest.
 */
function OverflowTagRow({
  children,
  moreBadgeClassName,
  gap = 6, // 1.5 in tailwind = 0.375rem = 6px
}: {
  children: ReactNode[];
  moreBadgeClassName?: string;
  gap?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(children.length);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const containerWidth = container.offsetWidth;
    const items = Array.from(measure.children) as HTMLElement[];
    if (items.length === 0) return;

    // Approximate width of the "+N more" badge (~55px, measured generously)
    const moreBadgeWidth = 60;
    let usedWidth = 0;
    let fitCount = 0;

    for (let i = 0; i < items.length; i++) {
      const itemWidth = items[i].offsetWidth;
      const totalWithThis = usedWidth + itemWidth + (fitCount > 0 ? gap : 0);

      // If this is the last item and it fits, we don't need the "+more" badge space
      if (i === items.length - 1) {
        if (totalWithThis <= containerWidth) {
          fitCount++;
        }
        break;
      }

      // Otherwise, check if it fits while leaving room for the "+more" badge
      if (totalWithThis + gap + moreBadgeWidth <= containerWidth) {
        usedWidth = totalWithThis;
        fitCount++;
      } else {
        break;
      }
    }

    // Always show at least 1
    setVisibleCount(Math.max(1, fitCount));
  }, [children.length, gap]);

  useEffect(() => {
    recalculate();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => recalculate());
    ro.observe(container);
    return () => ro.disconnect();
  }, [recalculate]);

  const remaining = children.length - visibleCount;

  return (
    <div className="relative">
      {/* Hidden measurement row – renders all items to measure their widths */}
      <div
        ref={measureRef}
        aria-hidden
        className="flex gap-1.5 absolute top-0 left-0 invisible pointer-events-none whitespace-nowrap"
        style={{ width: 'max-content' }}
      >
        {children}
      </div>
      {/* Visible row */}
      <div ref={containerRef} className="flex flex-wrap gap-1.5">
        {children.slice(0, visibleCount)}
        {remaining > 0 && (
          <Badge variant="outline" className={moreBadgeClassName}>
            +{remaining} more
          </Badge>
        )}
      </div>
    </div>
  );
}

export function ItemCard({ item, basePath }: ItemCardProps) {
  const itemTags = item.tags || [];
  const categories = item.categories || [];
  const stats = item.stats;

  return (
    <Link href={`${basePath}/${item.slug}`} className="block group h-full">
      <GlareHover
        borderRadius="var(--radius)"
        className={cn(
          "rounded-lg h-full group/glare",
          "transition-all duration-300 ease-in-out",
          "group-hover/glare:transform group-hover/glare:-translate-y-1"
        )}
      >
        <Card className={cn(
          "flex flex-col overflow-hidden h-full bg-card/80 backdrop-blur-sm shadow-xl transition-all duration-300 ease-in-out border-border/30 rounded-lg",
          "group-hover/glare:border-primary/50 group-hover/glare:shadow-primary/40"
        )}>
          <CardHeader className="p-0">
            <div className="block relative aspect-[16/9] overflow-hidden">
              <Image
                src={item.bannerUrl}
                alt={`${item.name} banner`}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover/glare:scale-105 transition-transform duration-300 ease-in-out"
                data-ai-hint={`${item.itemType} art wallpaper`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-card/30 to-transparent group-hover/glare:from-card/50 transition-all duration-300"></div>
            </div>
          </CardHeader>
          <CardContent className="p-5 flex-grow">
            <div className="flex items-start mb-3">
              <Image
                src={item.iconUrl}
                alt={`${item.name} icon`}
                width={48}
                height={48}
                className="rounded-lg mr-4 border-2 border-primary/50 shadow-md flex-shrink-0"
                data-ai-hint={`${item.itemType} icon logo`}
              />
              <div className="flex-grow">
                <CardTitle className="text-2xl font-bold text-foreground group-hover/glare:text-primary transition-colors duration-200 line-clamp-2">
                  {item.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10">{item.description}</p>
              </div>
            </div>

            {itemTags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-primary mb-1.5 flex items-center"><TagIcon className="w-3.5 h-3.5 mr-1.5" /> {item.itemType === 'game' ? 'Game' : 'Project'} Tags</h4>
                <OverflowTagRow moreBadgeClassName="text-[10px] px-1.5 py-0.5 border-accent/50 text-accent">
                  {itemTags.map(tag => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      className="text-[10px] px-1.5 py-0.5"
                    />
                  ))}
                </OverflowTagRow>
              </div>
            )}

            {categories.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-primary mb-1.5 flex items-center"><Layers className="w-3.5 h-3.5 mr-1.5" /> Categories</h4>
                <OverflowTagRow moreBadgeClassName="text-xs border-accent/50 text-accent">
                  {categories.map(cat => (
                    <TagBadge
                      key={cat.id}
                      tag={{ name: cat.name, id: cat.id, type: 'misc' }}
                      className="text-xs bg-secondary hover:bg-secondary/80"
                    />
                  ))}
                </OverflowTagRow>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-5 pt-0 border-t border-border/20 mt-auto">
            <div className="flex justify-between items-center w-full text-base text-muted-foreground">
              <div className="flex items-center" title={`${stats.totalResources.toLocaleString()} Resources`}>
                <Package className="w-5 h-5 mr-1.5 text-accent" />
                <span>{formatNumberWithSuffix(stats.totalResources)}</span>
              </div>
              {stats.totalDownloads !== undefined && (
                <div className="flex items-center" title={`${stats.totalDownloads.toLocaleString()} Downloads`}>
                  <Download className="w-5 h-5 mr-1.5 text-accent" />
                  <span>{formatNumberWithSuffix(stats.totalDownloads)}</span>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </GlareHover>
    </Link>
  );
}
