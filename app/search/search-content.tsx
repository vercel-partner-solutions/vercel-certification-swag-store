"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product-grid"
import { categories, searchProducts } from "@/lib/products"
import { SearchEmpty } from "./search-empty"

interface SearchContentProps {
  initialQuery: string
  initialCategory: string
}

export function SearchContent({ initialQuery, initialCategory }: SearchContentProps) {
  const router = useRouter()

  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  // Get filtered products (limit to 5 when searching)
  const allResults = searchProducts(query, category)
  const products = query ? allResults.slice(0, 5) : allResults

  // Update URL when search parameters change
  const updateURL = useCallback((newQuery: string, newCategory: string) => {
    const params = new URLSearchParams()

    if (newQuery) {
      params.set("q", newQuery)
    }

    if (newCategory && newCategory !== "All") {
      params.set("category", newCategory)
    }

    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search"
    router.replace(newUrl, { scroll: false })
  }, [router])

  const handleSearch = (value: string) => {
    setQuery(value)
    updateURL(value, category)
  }

  const handleClearSearch = () => {
    setQuery("")
    updateURL("", category)
  }

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    updateURL(query, newCategory)
  }

  return (
    <div className="mt-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className="text-xs"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          {products.length === 0
            ? "No results found"
            : `Showing ${products.length} of ${allResults.length} result${allResults.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {/* Content */}
      <div className="mt-8">
        {products.length === 0 ? (
          <SearchEmpty query={query} onClear={handleClearSearch} />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
