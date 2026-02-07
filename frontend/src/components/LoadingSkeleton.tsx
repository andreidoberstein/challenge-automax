import { Skeleton } from '@/components/ui/skeleton';

export function LoadingSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
        <div className="bg-muted/50 p-4">
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 grid grid-cols-5 gap-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-8 w-24 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg border p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
