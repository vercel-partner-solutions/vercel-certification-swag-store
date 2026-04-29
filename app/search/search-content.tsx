"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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

// Map category names to URL slugs
const categoryToSlug: Record<string, string> = {
  All: "",
  Apparel: "apparel",
  Accessories: "accessories",
  Drinkware: "drinkware",
  Bags: "bags",
}

export function SearchContent({ initialQuery, initialCategory }: SearchContentProps) {
  const router = useRouter()

  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce search query - only trigger when more than 3 characters
  useEffect(() => {
    if (query.length > 3 || query.length === 0) {
      const timer = setTimeout(() => {
        setDebouncedQuery(query)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [query])

  // Update URL when debounced query changes (only for query param, not category)
  useEffect(() => {
    const slug = categoryToSlug[initialCategory]
    const basePath = slug ? `/search/${slug}` : "/search"
    
    if (debouncedQuery) {
      router.replace(`${basePath}?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false })
    } else {
      router.replace(basePath, { scroll: false })
    }
  }, [debouncedQuery, initialCategory, router])

  // Get filtered products (limit to 5 when searching)
  const allResults = searchProducts(debouncedQuery, initialCategory)
  const products = debouncedQuery ? allResults.slice(0, 5) : allResults

  const handleClearSearch = useCallback(() => {
    setQuery("")
    setDebouncedQuery("")
  }, [])

  // Get the URL for a category
  const getCategoryUrl = (cat: string) => {
    const slug = categoryToSlug[cat]
    const queryParam = debouncedQuery ? `?q=${encodeURIComponent(debouncedQuery)}` : ""
    return slug ? `/search/${slug}${queryParam}` : `/search${queryParam}`
  }

  return (
    <div className="mt-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Form */}
        <Form action={categoryToSlug[initialCategory] ? `/search/${categoryToSlug[initialCategory]}` : "/search"} className="relative w-full sm:max-w-sm">
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
        </Form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={initialCategory === cat ? "default" : "outline"}
              size="sm"
              asChild
              className="text-xs"
            >
              <Link href={getCategoryUrl(cat)}>{cat}</Link>
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
