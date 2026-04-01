import { cn } from '@/lib/utils';

/**
 * Skeleton for a compact ResourceCard.
 */
export function ResourceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border/30 bg-card/80 shadow flex flex-col',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="aspect-[16/9] w-full skeleton-shimmer" />

      {/* Body */}
      <div className="p-3 space-y-2 flex-grow">
        <div className="skeleton-shimmer h-4 w-4/5 rounded" />
        <div className="skeleton-shimmer h-3 w-full rounded" />
        <div className="skeleton-shimmer h-3 w-3/4 rounded" />
      </div>

      {/* Footer */}
      <div className="p-3 pt-0 border-t border-border/20 flex justify-between">
        <div className="skeleton-shimmer h-4 w-12 rounded" />
        <div className="skeleton-shimmer h-4 w-12 rounded" />
      </div>
    </div>
  );
}
