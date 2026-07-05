import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
  id: string;
  type: 'vendor' | 'costume';
  name: string;
  image: string;
  price?: string;
  rating?: string;
  location?: string;
  slug: string;
};

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        if (!state.items.find(i => i.id === item.id)) {
          return { items: [...state.items, item] };
        }
        return state;
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),
      hasItem: (id) => !!get().items.find(i => i.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'persona-wishlist',
    }
  )
);
