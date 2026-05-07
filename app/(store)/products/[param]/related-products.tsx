import { ProductGrid } from "@/components/product-grid"
import { getProducts } from "@/lib/api"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  product: Product
}

const TARGET_COUNT = 4

export async function RelatedProducts({ product }: RelatedProductsProps) {
  // Try same category first; fall back to other featured/popular products if
  // the category doesn't have enough siblings (most categories have ≤3 items).
  const [byCategory, fallback] = await Promise.all([
    getProducts({ category: product.category, limit: 8 }).catch(() => []),
    getProducts({ limit: 12 }).catch(() => []),
  ])

  const seen = new Set<string>([product.id])
  const related: Product[] = []
  for (const list of [byCategory, fallback]) {
    for (const p of list) {
      if (related.length >= TARGET_COUNT) break
      if (!seen.has(p.id)) {
        related.push(p)
        seen.add(p.id)
      }
    }
    if (related.length >= TARGET_COUNT) break
  }

  if (related.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="text-2xl font-semibold text-foreground">
        You May Also Like
      </h2>
      <div className="mt-8">
        <ProductGrid products={related} />
      </div>
    </section>
  )
}
