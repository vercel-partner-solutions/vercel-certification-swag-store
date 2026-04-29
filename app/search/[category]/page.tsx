import { Suspense } from "react"
import { notFound } from "next/navigation"
import { SearchContent } from "../search-content"
import { SearchLoading } from "../search-loading"
import { categories } from "@/lib/products"

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ q?: string }>
}

// Map URL slugs to category names
const categorySlugMap: Record<string, string> = {
  apparel: "Apparel",
  accessories: "Accessories",
  drinkware: "Drinkware",
  bags: "Bags",
}

export function generateStaticParams() {
  return Object.keys(categorySlugMap).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryName = categorySlugMap[category.toLowerCase()]
  
  if (!categoryName) {
    return { title: "Category Not Found" }
  }

  return {
    title: `${categoryName} | Vercel Swag Store`,
    description: `Browse our ${categoryName.toLowerCase()} collection of premium Vercel merchandise.`,
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const { q } = await searchParams
  
  const categoryName = categorySlugMap[category.toLowerCase()]
  
  if (!categoryName) {
    notFound()
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-foreground">{categoryName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Browse our {categoryName.toLowerCase()} collection
      </p>

      <Suspense fallback={<SearchLoading />}>
        <SearchContent
          initialQuery={q || ""}
          initialCategory={categoryName}
        />
      </Suspense>
    </>
  )
}
