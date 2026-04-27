"use client"

import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { getRandomProducts, type Product } from "@/lib/products"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // Calculate random products at runtime on the client
    setProducts(getRandomProducts(4, currentProductId))
  }, [currentProductId])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="text-2xl font-semibold text-foreground">You May Also Like</h2>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
