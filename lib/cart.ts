import { getProductById, type Product } from "./products"

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartItemWithProduct extends CartItem {
  product: Product
}

const CART_COOKIE_NAME = "vercel-swag-cart"

export function getCart(): CartItem[] {
  if (typeof document === "undefined") return []
  
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CART_COOKIE_NAME}=`))
    ?.split("=")[1]

  if (!cookieValue) return []

  try {
    return JSON.parse(decodeURIComponent(cookieValue))
  } catch {
    return []
  }
}

export function setCart(cart: CartItem[]): void {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // Cookie expires in 7 days

  document.cookie = `${CART_COOKIE_NAME}=${encodeURIComponent(
    JSON.stringify(cart)
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
}

export function addToCart(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const existingItem = cart.find((item) => item.productId === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({ productId, quantity })
  }

  setCart(cart)
  return cart
}

export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart().filter((item) => item.productId !== productId)
  setCart(cart)
  return cart
}

export function updateCartItemQuantity(productId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const item = cart.find((item) => item.productId === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    setCart(cart)
  }

  return cart
}

export function getCartItemCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0)
}

export function getCartWithProducts(): CartItemWithProduct[] {
  const cart = getCart()
  const cartWithProducts: CartItemWithProduct[] = []

  for (const item of cart) {
    const product = getProductById(item.productId)
    if (product) {
      cartWithProducts.push({ ...item, product })
    }
  }

  return cartWithProducts
}

export function getCartTotal(): number {
  return getCartWithProducts().reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
}

export function clearCart(): void {
  setCart([])
}
