import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchEmptyProps {
  query: string
  onClear: () => void
}

export function SearchEmpty({ query, onClear }: SearchEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">No products found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {query
          ? `We couldn't find any products matching "${query}"`
          : "No products match the selected filters"}
      </p>
      <Button variant="outline" onClick={onClear} className="mt-4">
        Clear filters
      </Button>
    </div>
  )
}
