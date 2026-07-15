import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  category: string
  quantity: number
  stock?: number
}

interface CartStore {
  items: CartItem[]

  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, size: string) => void
  increaseQuantity: (id: string, size: string) => void
  decreaseQuantity: (id: string, size: string) => void
  clearCart: () => void
  setItems: (items: CartItem[]) => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => {
        set({ items })
      },

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (cartItem) =>
              cartItem.id === item.id &&
              cartItem.size === item.size
          )

          if (existingItem) {
            if (
              typeof item.stock === "number" &&
              existingItem.quantity >= item.stock
            ) {
              return state
            }

            return {
              items: state.items.map((cartItem) =>
                cartItem.id === item.id &&
                cartItem.size === item.size
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + 1,
                    }
                  : cartItem
              ),
            }
          }

          if (
            typeof item.stock === "number" &&
            item.stock <= 0
          ) {
            return state
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
              },
            ],
          }
        }),

      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.size === size
              )
          ),
        })),

      increaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.id !== id ||
              item.size !== size
            ) {
              return item
            }

            if (
              typeof item.stock === "number" &&
              item.quantity >= item.stock
            ) {
              return item
            }

            return {
              ...item,
              quantity: item.quantity + 1,
            }
          }),
        })),

      decreaseQuantity: (id, size) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id &&
              item.size === size
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => {
        set({ items: [] })
      },
    }),
    {
      name: "laddu-laado-cart",
    }
  )
)