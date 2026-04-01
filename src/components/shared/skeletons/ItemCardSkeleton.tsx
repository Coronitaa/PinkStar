import { cn } from '@/lib/utils';

/**
 * Skeleton that mimics the exact layout of ItemCard:
 *  - 16:9 banner image
 *  - icon (48x48) + title + description lines
 *  - tag rows
 *  - footer stats
 */
export function ItemCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border/30 bg-card/80 shadow-xl flex flex-col h-full',
        className
      )}
    >
      {/* Banner 16:9 */}
      <div className="aspect-[16/9] w-full skeleton-shimmer" />

      {/* Content */}
      <div className="p-5 flex-grow space-y-4">
        {/* Icon + title + description */}
        <div className="flex items-start gap-4">
          <div className="skeleton-shimmer rounded-lg flex-shrink-0 w-12 h-12" />
          <div className="flex-grow space-y-2">
            <div className="skeleton-shimmer h-6 w-3/4 rounded" />
            <div className="skeleton-shimmer h-4 w-full rounded" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded" />
          </div>
        </div>

        {/* Tags row */}
        <div className="space-y-2">
          <div className="skeleton-shimmer h-3 w-16 rounded" />
          <div className="flex gap-1.5">
            <div className="skeleton-shimmer h-5 w-14 rounded-full" />
            <div className="skeleton-shimmer h-5 w-18 rounded-full" />
            <div className="skeleton-shimmer h-5 w-12 rounded-full" />
          </div>
        </div>

        {/* Categories row */}
        <div className="space-y-2">
          <div className="skeleton-shimmer h-3 w-20 rounded" />
          <div className="flex gap-1.5">
            <div className="skeleton-shimmer h-5 w-20 rounded-full" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-0 border-t border-border/20 flex justify-between items-center">
        <div className="skeleton-shimmer h-5 w-16 rounded" />
        <div className="skeleton-shimmer h-5 w-16 rounded" />
      </div>
    </div>
  );
}
