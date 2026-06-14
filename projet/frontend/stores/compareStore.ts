import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareItem {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  clear: () => void;
  hasItem: (id: string) => boolean;
}

const MAX_COMPARE = 2;

const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const current = get().items;

        if (current.some((existing) => existing.id === item.id)) {
          return { success: false, message: 'Component already selected for comparison' };
        }

        if (current.length >= MAX_COMPARE) {
          return {
            success: false,
            message: 'You can compare up to 2 components. Remove one first.',
          };
        }

        if (current.length === 1 && current[0].categorySlug !== item.categorySlug) {
          return {
            success: false,
            message: `Components must be from the same category (${current[0].categoryName})`,
          };
        }

        set({ items: [...current, item] });
        return { success: true };
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
      },

      clear: () => set({ items: [] }),

      hasItem: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: 'compare-store',
    },
  ),
);

export default useCompareStore;
