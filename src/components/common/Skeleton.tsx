interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse-soft bg-ink-850 rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="panel p-5">
      <Skeleton className="h-3 w-20 mb-3" />
      <Skeleton className="h-8 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="panel p-5">
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
