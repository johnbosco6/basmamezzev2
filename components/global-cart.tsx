"use client"

import { useCart } from "@/context/cart-context"
import { CartDrawer } from "./cart-drawer"

export function GlobalCart() {
  const { isCartOpen, setCartOpen } = useCart()

  return (
    <CartDrawer 
      isOpen={isCartOpen} 
      onClose={() => setCartOpen(false)} 
    />
  )
}
