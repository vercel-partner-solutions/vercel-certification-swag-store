"use client"

import Link from "next/link"
import { Search, ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export function Header() {
  const { itemCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="h-5 w-5"
            viewBox="0 0 76 65"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="font-semibold">Vercel Store</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={openCart}
            className="relative text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Sales Banner */}
      <div className="bg-foreground px-4 py-2 text-center text-sm text-background">
        <p>
          <span className="font-semibold">Free shipping</span> on all orders over $100.{" "}
          <Link href="/products" className="underline underline-offset-2 hover:opacity-80">
            Shop now
          </Link>
        </p>
      </div>
    </header>
  )
}
