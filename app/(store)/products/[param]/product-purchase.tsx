"use client"

import { useEffect, useState } from "react"
import { Check, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { getProductStockAction } from "@/lib/cart-actions"
import type { Product, StockInfo } from "@/lib/types"

interface ProductPurchaseProps {
  product: Product
}

const STOCK_REFRESH_MS = 30_000

export function ProductPurchase({ product }: ProductPurchaseProps) {
  const { addToCart, openCart } = useCart()
  const [stock, setStock] = useState<StockInfo | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    let cancelled = false
    const tick = async () => {
      try {
        const next = await getProductStockAction(product.id)
        if (!cancelled) setStock(next)
      } catch {
        // Keep last known stock; failure is rare and the user can retry.
      }
    }
    tick()
    const id = setInterval(tick, STOCK_REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [product.id])

  // Clamp the selected quantity if reported stock drops below it.
  useEffect(() => {
    if (stock && stock.stock > 0 && quantity > stock.stock) {
      setQuantity(stock.stock)
    }
  }, [stock, quantity])

  const isLoadingStock = stock === null
  const isOutOfStock = !isLoadingStock && !stock.inStock
  const isLowStock = !isLoadingStock && stock.lowStock && stock.stock > 0
  const maxQty = stock ? Math.max(1, stock.stock) : 1

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  const handleIncrement = () => {
    if (quantity < maxQty) setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    if (isOutOfStock || isLoadingStock) return
    addToCart(product, quantity)
    setIsAdded(true)
    openCart()
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 2000)
  }

  return (
    <>
      <div className="mt-4">
        {isLoadingStock ? (
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            Checking availability…
          </span>
        ) : isOutOfStock ? (
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-muted-foreground">
            Out of stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
            Only {stock.stock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-foreground">
            In stock
          </span>
        )}
      </div>

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
            disabled={quantity >= maxQty || isOutOfStock}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        size="lg"
        onClick={handleAddToCart}
        disabled={isOutOfStock || isLoadingStock}
        className="mt-8 w-full sm:w-auto"
      >
        {isAdded ? (
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
    </>
  )
}
