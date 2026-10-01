import { Loader2 } from 'lucide-react';

/**
 * Base skeleton block with shimmer effect (shimmer is disabled when prefers-reduced-motion is active).
 * @param {{ className?: string, width?: string, height?: string }} props
 */
export function Skeleton({ className = '', width, height }) {
  return (
    <div
      role="status"
      aria-label="Loading..."
      style={{ width, height }}
      className={`animate-pulse bg-white/[0.06] rounded-xl skeleton-shimmer ${className}`}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

/**
 * Metric summary card skeleton matching Dashboard and Analytics stat cards exactly.
 */
export function StatSkeleton() {
  return (
    <div className="card h-28 flex flex-col justify-between" aria-hidden="true">
      <Skeleton className="w-24 h-3.5" />
      <div className="flex items-end justify-between">
        <Skeleton className="w-20 h-7" />
        <Skeleton className="w-12 h-5 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Recent post item skeleton row.
 */
export function PostSkeleton() {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]" aria-hidden="true">
      <div className="space-y-2 flex-1">
        <Skeleton className="w-3/5 h-4" />
        <Skeleton className="w-28 h-3" />
      </div>
      <Skeleton className="w-16 h-5 rounded-full" />
    </div>
  );
}

/**
 * Performance chart skeleton matching the weekly bar chart layout.
 */
export function ChartSkeleton() {
  return (
    <div className="card h-[310px] flex flex-col justify-between" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex h-52 items-end gap-3 pt-6">
        {[40, 70, 50, 85, 60, 95, 75].map((h, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2 h-full justify-end">
            <Skeleton className="w-full rounded-t-xl" height={`${h}%`} />
            <Skeleton className="w-4 h-3 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Library grid item skeleton.
 */
export function LibraryCardSkeleton() {
  return (
    <div className="card space-y-4" aria-hidden="true">
      <Skeleton className="w-full h-36 rounded-xl" />
      <Skeleton className="w-3/4 h-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-16 h-8 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Calendar day cell skeleton.
 */
export function CalendarCellSkeleton() {
  return (
    <div className="p-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] h-28 flex flex-col justify-between" aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton className="w-6 h-4" />
        <Skeleton className="w-8 h-4 rounded-full" />
      </div>
      <Skeleton className="w-full h-8 rounded-lg" />
    </div>
  );
}

/**
 * Accessible button loading spinner.
 */
export function ButtonSpinner({ label = 'Processing…', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="status">
      <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
      <span>{label}</span>
    </span>
  );
}

export default Skeleton;
