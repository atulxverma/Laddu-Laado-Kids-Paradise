import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  items: any[]
  toggleItem: (product: any) => void
  clearWishlist: () => void // 👈 Required for cleaning
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (product) => set((state) => {
        const exists = state.items.find(i => i.id === product.id)
        if (exists) {
          return { items: state.items.filter(i => i.id !== product.id) }
        }
        return { items: [...state.items, product] }
      }),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "laddu-laado-wishlist" }
  )
)