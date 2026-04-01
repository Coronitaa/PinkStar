import { ResourceCardSkeleton } from './ResourceCardSkeleton';

/**
 * Skeleton for the Item detail page (e.g. /games/[gameSlug]).
 * Mirrors: banner, breadcrumb, icon + title + stats, category carousels.
 */
export function ItemPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="skeleton-shimmer h-4 w-10 rounded" />
        <div className="skeleton-shimmer h-4 w-3 rounded" />
        <div className="skeleton-shimmer h-4 w-16 rounded" />
        <div className="skeleton-shimmer h-4 w-3 rounded" />
        <div className="skeleton-shimmer h-4 w-24 rounded" />
      </div>

      {/* Full-width banner */}
      <section className="relative -mt-8">
        <div className="h-64 md:h-80 lg:h-96 w-screen -translate-x-1/2 left-1/2 relative skeleton-shimmer rounded-none" />

        {/* Icon + title overlay */}
        <div className="container max-w-screen-2xl relative -mt-20 px-4">
          <div className="flex flex-col md:flex-row items-end gap-4">
            {/* Icon */}
            <div className="skeleton-shimmer rounded-lg w-36 h-36 md:w-44 md:h-44 flex-shrink-0 border-4 border-background" />

            {/* Meta */}
            <div className="flex-grow space-y-3 pb-2">
              <div className="skeleton-shimmer h-10 w-72 rounded-lg" />
              <div className="skeleton-shimmer h-5 w-40 rounded" />
              <div className="skeleton-shimmer h-5 w-full max-w-lg rounded" />

              {/* Tags */}
              <div className="flex gap-2">
                <div className="skeleton-shimmer h-6 w-16 rounded-full" />
                <div className="skeleton-shimmer h-6 w-20 rounded-full" />
                <div className="skeleton-shimmer h-6 w-14 rounded-full" />
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="skeleton-shimmer h-5 w-16 rounded" />
                <div className="skeleton-shimmer h-5 w-16 rounded" />
                <div className="skeleton-shimmer h-5 w-16 rounded" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 self-end mb-2">
              <div className="skeleton-shimmer h-9 w-28 rounded-lg" />
              <div className="skeleton-shimmer h-9 w-36 rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Category carousels × 2 */}
      {[0, 1].map((i) => (
        <section key={i} className="space-y-4">
          {/* Category header */}
          <div className="skeleton-shimmer h-7 w-48 rounded-lg" />

          {/* Carousel placeholder — 5 resource cards in a row */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex-none w-56">
                <ResourceCardSkeleton />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
