import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { CategoryShowcase } from "@/components/category-showcase"
import { getFeaturedProducts, getProductById } from "@/lib/products"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts().slice(0, 4)
  const heroProduct = getProductById("vercel-hoodie")

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section>
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-20">
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Vercel Swag Store
              </h1>
              <p className="mt-4 max-w-xl text-balance text-lg text-muted-foreground">
                Premium merchandise for developers who ship fast. High-quality apparel and accessories featuring the Vercel brand.
              </p>
              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Shop All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {heroProduct && (
              <Link
                href={`/products/${heroProduct.id}`}
                className="group relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted lg:mx-0"
              >
                <Image
                  src={heroProduct.image}
                  alt={heroProduct.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-sm font-medium text-white/80">Featured</p>
                  <p className="mt-1 text-lg font-semibold text-white">{heroProduct.name}</p>
                  <p className="mt-1 text-white/90">${heroProduct.price}</p>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Category Showcase */}
        <CategoryShowcase />

        {/* Featured Products Section */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Featured Products</h2>
            <Link
              href="/products"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8">
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
