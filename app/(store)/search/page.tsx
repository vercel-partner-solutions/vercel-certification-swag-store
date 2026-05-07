import type { Metadata } from "next"
import { ProductGrid } from "@/components/product-grid"
import { getCategories, getProducts } from "@/lib/api"
import { SearchEmpty } from "./search-empty"
import { SearchForm } from "./search-form"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the full Vercel Swag Store catalog by name, category, or tag.",
  openGraph: {
    title: "Search | Vercel Swag Store",
    description:
      "Search the full Vercel Swag Store catalog by name, category, or tag.",
  },
}

const SEARCH_RESULT_LIMIT = 5
const DEFAULT_LIMIT = 12

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", category = "" } = await searchParams
  const limit = q.length > 0 ? SEARCH_RESULT_LIMIT : DEFAULT_LIMIT
  const isSearching = q.length > 0 || category.length > 0

  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({
      search: q || undefined,
      category: category || undefined,
      limit,
    }).catch(() => []),
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground">Search</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse our collection of premium Vercel merchandise
      </p>

      <div className="mt-8">
        <SearchForm
          initialQuery={q}
          initialCategory={category}
          categories={categories}
        />

        {products.length === 0 ? (
          <div className="mt-8">
            <SearchEmpty query={q} />
          </div>
        ) : (
          <>
            {isSearching && (
              <p className="mt-4 text-sm text-muted-foreground">
                Showing {products.length} result
                {products.length === 1 ? "" : "s"}
                {q ? ` for "${q}"` : ""}
                {category ? ` in ${category}` : ""}
              </p>
            )}
            <div className="mt-8">
              <ProductGrid products={products} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
