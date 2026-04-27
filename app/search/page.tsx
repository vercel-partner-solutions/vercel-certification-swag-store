import { Suspense } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchContent } from "./search-content"
import { SearchLoading } from "./search-loading"

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-2xl font-semibold text-foreground">Search</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our collection of premium Vercel merchandise
          </p>

          <Suspense fallback={<SearchLoading />}>
            <SearchContent
              initialQuery={params.q || ""}
              initialCategory={params.category || "All"}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
