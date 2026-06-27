import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  category: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, size: string) => void
  increaseQuantity: (id: string, size: string) => void
  decreaseQuantity: (id: string, size: string) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void // 👈 Naya method
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => set({ items }), // DB se data load karne ke liye

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.id === item.id && i.size === item.size
          )
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.size === size)),
        })),

      increaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decreaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id && i.size === size ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "laddu-laado-cart" }
  )
)