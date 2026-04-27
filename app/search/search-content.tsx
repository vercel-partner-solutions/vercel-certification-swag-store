"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Form from "next/form"
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
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)

  // Debounce search query - only trigger when more than 3 characters
  useEffect(() => {
    if (query.length > 3 || query.length === 0) {
      const timer = setTimeout(() => {
        setDebouncedQuery(query)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [query])

  // Update URL when debounced query or category changes
  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedQuery) {
      params.set("q", debouncedQuery)
    }

    if (category && category !== "All") {
      params.set("category", category)
    }

    const newUrl = params.toString() ? `/search?${params.toString()}` : "/search"
    router.replace(newUrl, { scroll: false })
  }, [debouncedQuery, category, router])

  // Get filtered products (limit to 5 when searching)
  const allResults = searchProducts(debouncedQuery, category)
  const products = debouncedQuery ? allResults.slice(0, 5) : allResults

  const handleClearSearch = useCallback(() => {
    setQuery("")
    setDebouncedQuery("")
  }, [])

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory)
  }, [])

  return (
    <div className="mt-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Form */}
        <Form action="/search" className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="q"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {category !== "All" && (
            <input type="hidden" name="category" value={category} />
          )}
        </Form>

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
      {debouncedQuery && (
        <p className="mt-4 text-sm text-muted-foreground">
          {products.length === 0
            ? "No results found"
            : `Showing ${products.length} of ${allResults.length} result${allResults.length !== 1 ? "s" : ""} for "${debouncedQuery}"`}
        </p>
      )}

      {/* Content */}
      <div className="mt-8">
        {products.length === 0 ? (
          <SearchEmpty query={debouncedQuery} onClear={handleClearSearch} />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}
