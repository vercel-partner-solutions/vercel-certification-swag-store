import { Skeleton } from "@/components/ui/skeleton"

export function SearchLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-border">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
