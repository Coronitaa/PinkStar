import { ResourceCardSkeleton } from './ResourceCardSkeleton';

/**
 * Skeleton for the Category page (e.g. /games/[gameSlug]/[categorySlug]).
 * Mirrors: breadcrumb, header, category tabs, sidebar filters + resource grid.
 */
export function CategoryPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="skeleton-shimmer h-4 w-10 rounded" />
        <div className="skeleton-shimmer h-4 w-3 rounded" />
        <div className="skeleton-shimmer h-4 w-16 rounded" />
        <div className="skeleton-shimmer h-4 w-3 rounded" />
        <div className="skeleton-shimmer h-4 w-24 rounded" />
        <div className="skeleton-shimmer h-4 w-3 rounded" />
        <div className="skeleton-shimmer h-4 w-20 rounded" />
      </div>

      {/* Page header */}
      <header className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton-shimmer w-8 h-8 rounded" />
            <div className="skeleton-shimmer h-9 w-48 rounded-lg" />
          </div>
          <div className="skeleton-shimmer h-9 w-32 rounded-lg" />
        </div>
        <div className="skeleton-shimmer h-5 w-80 mt-3 rounded" />
      </header>

      {/* Category tabs */}
      <div className="border-b pb-2 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-shimmer h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Main content: sidebar + grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar filters */}
        <aside className="md:col-span-3 space-y-4">
          <div className="skeleton-shimmer h-6 w-24 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton-shimmer h-4 w-28 rounded" />
              <div className="skeleton-shimmer h-8 w-full rounded-lg" />
            </div>
          ))}
        </aside>

        {/* Resource grid */}
        <main className="md:col-span-9 space-y-6">
          {/* Search + sort */}
          <div className="p-4 border rounded-lg bg-card shadow flex flex-col sm:flex-row gap-4">
            <div className="skeleton-shimmer h-10 flex-grow rounded-lg" />
            <div className="skeleton-shimmer h-10 w-40 rounded-lg" />
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
