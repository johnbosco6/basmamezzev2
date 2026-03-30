"use client"

import React, { createContext, useContext, useReducer, useEffect, useState } from "react"

export interface CartItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QTY"; id: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.id) }
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) }
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    case "CLEAR_CART":
      return { items: [] }
    case "LOAD_CART":
      return { items: action.items }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Always start with empty state — same on server and client → no hydration mismatch
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [hydrated, setHydrated] = useState(false)
  const [isCartOpen, setCartOpen] = useState(false)

  // After hydration: load persisted cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("basma-cart")
      if (saved) {
        const items: CartItem[] = JSON.parse(saved)
        if (Array.isArray(items) && items.length > 0) {
          dispatch({ type: "LOAD_CART", items })
        }
      }
    } catch { }
    setHydrated(true)
  }, [])

  // Persist to localStorage only after hydration (prevent overwriting with empty state)
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("basma-cart", JSON.stringify(state.items))
    }
  }, [state.items, hydrated])

  const addItem = (item: Omit<CartItem, "quantity">) =>
    dispatch({ type: "ADD_ITEM", item })
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", id })
  const updateQty = (id: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", id, quantity })
  const clearCart = () => dispatch({ type: "CLEAR_CART" })

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items: state.items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, isCartOpen, setCartOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

export function parsePrice(priceStr: string): number {
  const match = priceStr.match(/[\d.,]+/)
  if (!match) return 0
  return parseFloat(match[0].replace(",", "."))
}
