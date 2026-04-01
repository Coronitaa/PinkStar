/**
 * Home page loading skeleton — 4 section cards in a grid.
 */
export default function HomeLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-10 sm:py-16">
      {/* Hero text */}
      <div className="text-center mb-12 sm:mb-16 space-y-4">
        <div className="skeleton-shimmer h-14 w-80 mx-auto rounded-xl" />
        <div className="skeleton-shimmer h-5 w-96 mx-auto rounded" />
        <div className="skeleton-shimmer h-5 w-72 mx-auto rounded" />
      </div>

      {/* 4 section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton-shimmer rounded-lg h-48"
          />
        ))}
      </div>
    </div>
  );
}
