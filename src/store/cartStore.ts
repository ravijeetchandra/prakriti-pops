'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  product_id: string
  name_en: string
  name_hi: string
  slug: string
  price: number
  qty: number
  image: string
  original_price?: number
  campaign_id?: string | null
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (product_id: string) => void
  updateQty: (product_id: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product_id === item.product_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product_id === item.product_id ? { ...i, qty: i.qty + qty } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, qty }] }
        }),
      removeItem: (product_id) =>
        set((state) => ({
          items: state.items.filter((i) => i.product_id !== product_id),
        })),
      updateQty: (product_id, qty) =>
        set((state) => ({
          items: qty <= 0
            ? state.items.filter((i) => i.product_id !== product_id)
            : state.items.map((i) =>
                i.product_id === product_id ? { ...i, qty } : i
              ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.qty, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
    }),
    { name: 'pp-cart' }
  )
)
