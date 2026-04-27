"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import {
  getCart,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  getCartWithProducts,
  getCartTotal,
  clearCart as clearCartUtil,
  type CartItem,
  type CartItemWithProduct,
} from "@/lib/cart"

interface CartContextType {
  cart: CartItem[]
  cartWithProducts: CartItemWithProduct[]
  cartTotal: number
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addToCart: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from cookie on mount
  useEffect(() => {
    setCart(getCart())
  }, [])

  const refreshCart = useCallback(() => {
    setCart(getCart())
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const addToCart = useCallback((productId: string, quantity: number) => {
    addToCartUtil(productId, quantity)
    refreshCart()
  }, [refreshCart])

  const removeFromCart = useCallback((productId: string) => {
    removeFromCartUtil(productId)
    refreshCart()
  }, [refreshCart])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    updateCartItemQuantityUtil(productId, quantity)
    refreshCart()
  }, [refreshCart])

  const clearCart = useCallback(() => {
    clearCartUtil()
    refreshCart()
  }, [refreshCart])

  const cartWithProducts = getCartWithProducts()
  const cartTotal = getCartTotal()
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartWithProducts,
        cartTotal,
        itemCount,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
