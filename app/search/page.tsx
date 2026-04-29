import { Suspense } from "react"
import { SearchContent } from "./search-content"
import { SearchLoading } from "./search-loading"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">Search</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse our collection of premium Vercel merchandise
      </p>

      <Suspense fallback={<SearchLoading />}>
        <SearchContent
          initialQuery={q || ""}
          initialCategory="All"
        />
      </Suspense>
    </>
  )
}
