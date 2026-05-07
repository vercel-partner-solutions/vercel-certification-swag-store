import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ApiRequestError, getProductById, getProducts } from "@/lib/api"
import { formatPrice } from "@/lib/format"
import { ProductPurchase } from "./product-purchase"
import { RelatedProducts } from "./related-products"

interface ProductPageProps {
  params: Promise<{ param: string }>
}

export async function generateStaticParams() {
  try {
    const products = await getProducts({ limit: 100 })
    return products.map((p) => ({ param: p.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { param } = await params
  try {
    const product = await getProductById(param)
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        type: "website",
        title: product.name,
        description: product.description,
        images: product.images.map((url) => ({ url })),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: product.images,
      },
    }
  } catch {
    return { title: "Product Not Found" }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { param } = await params

  let product
  try {
    product = await getProductById(param)
  } catch (err) {
    if (err instanceof ApiRequestError && err.status === 404) notFound()
    throw err
  }

  const image = product.images[0]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/search"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
          {image && (
            <Image
              src={image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm capitalize text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <ProductPurchase product={product} />
        </div>
      </div>

      <RelatedProducts product={product} />
    </div>
  )
}
