import { ItemCardSkeleton } from './ItemCardSkeleton';

/**
 * Skeleton for the Items listing page (Games / Web / Apps / Art-Music).
 * Mirrors: title, description, search bar, sort dropdown, grid of ItemCards.
 */
export function ItemsPageSkeleton() {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="text-center py-10 space-y-4">
        <div className="skeleton-shimmer h-14 w-72 mx-auto rounded-lg" />
        <div className="skeleton-shimmer h-5 w-96 mx-auto rounded" />
        <div className="skeleton-shimmer h-5 w-64 mx-auto rounded" />
      </section>

      {/* Search + sort bar */}
      <div className="mb-12 p-4 border rounded-lg bg-card shadow-md backdrop-blur-sm bg-background/80 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="skeleton-shimmer h-10 flex-grow w-full rounded-lg" />
          <div className="skeleton-shimmer h-10 w-48 rounded-lg" />
        </div>
      </div>

      {/* Section header */}
      <section>
        <div className="skeleton-shimmer h-9 w-56 mx-auto mb-8 rounded-lg" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
