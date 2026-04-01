/**
 * Skeleton for the Resource detail page.
 * Mirrors: title, gallery, description, download section, related resources.
 */
export default function ResourcePageLoading() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`skeleton-shimmer h-4 rounded ${i % 2 === 1 ? 'w-3' : 'w-16'}`}
          />
        ))}
      </div>

      {/* Title + meta */}
      <div className="space-y-3">
        <div className="skeleton-shimmer h-10 w-3/4 rounded-lg" />
        <div className="flex gap-3">
          <div className="skeleton-shimmer h-5 w-24 rounded-full" />
          <div className="skeleton-shimmer h-5 w-20 rounded-full" />
          <div className="skeleton-shimmer h-5 w-16 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery / image */}
          <div className="skeleton-shimmer aspect-[16/9] w-full rounded-xl" />

          {/* Description */}
          <div className="space-y-3">
            <div className="skeleton-shimmer h-4 w-full rounded" />
            <div className="skeleton-shimmer h-4 w-5/6 rounded" />
            <div className="skeleton-shimmer h-4 w-4/5 rounded" />
            <div className="skeleton-shimmer h-4 w-full rounded" />
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
          </div>
        </div>

        {/* Sidebar: download + stats */}
        <aside className="space-y-4">
          {/* Download card */}
          <div className="skeleton-shimmer h-48 rounded-xl" />

          {/* Stats */}
          <div className="skeleton-shimmer h-32 rounded-xl" />
        </aside>
      </div>

      {/* Related resources */}
      <section className="space-y-4">
        <div className="skeleton-shimmer h-6 w-40 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton-shimmer aspect-[16/9] rounded-lg" />
              <div className="skeleton-shimmer h-4 w-full rounded" />
              <div className="skeleton-shimmer h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
