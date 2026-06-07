import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistStore {
  items: any[]
  toggleItem: (product: any) => void
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
    }),
    { name: "laddoo-laado-wishlist" }
  )
)