import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: Set<string>;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoritesCount: () => number;
}

const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: new Set<string>(),

      addFavorite: (id: string) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          newFavorites.add(id);
          return { favorites: newFavorites };
        });
      },

      removeFavorite: (id: string) => {
        set((state) => {
          const newFavorites = new Set(state.favorites);
          newFavorites.delete(id);
          return { favorites: newFavorites };
        });
      },

      isFavorite: (id: string) => {
        return get().favorites.has(id);
      },

      getFavoritesCount: () => {
        return get().favorites.size;
      },
    }),
    {
      name: 'favorites-store',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (item) {
            const parsed = JSON.parse(item);
            return {
              state: {
                favorites: new Set(parsed.state?.favorites || []),
              },
            };
          }
          return null;
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                favorites: Array.from(value.state.favorites),
              },
            }),
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

export default useFavoritesStore;
