"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return

    setIsAdding(true)

    // Simulate adding to cart
    setTimeout(() => {
      setIsAdding(false)
      setIsAdded(true)

      // Reset after showing success
      setTimeout(() => {
        setIsAdded(false)
      }, 2000)
    }, 500)
  }

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg border border-border bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">{product.name}</h1>
            </div>
          </div>

          <p className="mt-4 text-2xl font-semibold text-foreground">${product.price}</p>

          {/* Stock Indicator */}
          <div className="mt-4">
            {isOutOfStock ? (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
                Out of stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
                In stock
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mt-8">
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <div className="mt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center text-lg font-medium tabular-nums">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={quantity >= product.stock || isOutOfStock}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className="mt-8 w-full sm:w-auto"
          >
            {isAdding ? (
              "Adding..."
            ) : isAdded ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart
              </>
            ) : isOutOfStock ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
