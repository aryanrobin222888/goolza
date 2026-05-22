export default function LeagueSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      {/* Header skeleton */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 mb-6 p-7 flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-7 bg-slate-800 rounded w-48" />
          <div className="h-4 bg-slate-800 rounded w-32" />
          <div className="h-3 bg-slate-800 rounded w-24" />
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 bg-slate-800 rounded-full w-32" />
        <div className="h-10 bg-slate-800 rounded-full w-32" />
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Standings table skeleton */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          {/* Header row */}
          <div className="flex gap-3 px-4 py-3 border-b border-slate-800">
            <div className="w-8 h-4 bg-slate-800 rounded" />
            <div className="flex-1 h-4 bg-slate-800 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-4 bg-slate-800 rounded" />
            ))}
          </div>
          {/* Table rows */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/50"
            >
              <div className="w-6 h-4 bg-slate-800 rounded" />
              <div className="w-6 h-6 bg-slate-800 rounded-full" />
              <div className="flex-1 h-4 bg-slate-800 rounded max-w-[120px]" />
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-8 h-4 bg-slate-800 rounded" />
              ))}
              <div className="w-12 h-4 bg-slate-800 rounded hidden md:block" />
              <div className="w-8 h-5 bg-slate-800 rounded" />
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-5">
          {/* Top scorers */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
              <div className="w-4 h-4 bg-slate-800 rounded" />
              <div className="w-24 h-4 bg-slate-800 rounded" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/50">
                <div className="w-5 h-4 bg-slate-800 rounded" />
                <div className="w-10 h-10 bg-slate-800 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-800 rounded w-24" />
                  <div className="h-3 bg-slate-800 rounded w-16" />
                </div>
                <div className="w-8 h-6 bg-slate-800 rounded" />
              </div>
            ))}
          </div>

          {/* Match center */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <div className="flex border-b border-slate-800">
              <div className="flex-1 h-12 bg-slate-800/50" />
              <div className="flex-1 h-12 bg-slate-800/50" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/50">
                <div className="w-14 h-8 bg-slate-800 rounded" />
                <div className="flex-1 flex items-center justify-between gap-2">
                  <div className="w-16 h-8 bg-slate-800 rounded" />
                  <div className="w-10 h-6 bg-slate-800 rounded" />
                  <div className="w-16 h-8 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
