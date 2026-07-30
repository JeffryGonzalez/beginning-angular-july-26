import { computed, effect, signal } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Trail } from '../types';
import { withStellarDevtools } from '@hypertheory-labs/stellar-ng-devtools';

const apiTrails = signal<Trail[]>([
  {
    id: '1',
    name: 'Woodpecker Way Loop',
    miles: 1.8,
    difficulty: 'easy',
  },
  {
    id: '2',
    name: 'Eagle Rock Trail',
    miles: 3.2,
    difficulty: 'moderate',
  },
  {
    id: '3',
    name: 'Bear Creek Trail',
    miles: 2.5,
    difficulty: 'hard',
  },
  {
    id: '4',
    name: 'Cedar Ridge Trail',
    miles: 4.1,
    difficulty: 'extreme',
  },
  {
    id: '5',
    name: 'Pine Valley Trail',
    miles: 5.0,
    difficulty: 'moderate',
  },
]);

interface TrailsState {
  trails: Trail[];
  favorites: string[];
}
export const trailsStore = signalStore(
  withStellarDevtools('trails-store', {
    description: 'This keeps a list of trails and the favorites',
  }),
  withState<TrailsState>({
    trails: apiTrails(),
    favorites: [],
  }),
  withComputed((state) => ({
    trailsWithFavorites: computed(() => {
      return state.trails().map((trail) => ({
        ...trail,
        favorite: state.favorites().some((favoriteId) => favoriteId === trail.id),
      }));
    }),
  })),
  withMethods((state) => ({
    toggleFavorite: (trailId: string) => {
      const currentFavorites = state.favorites();
      const currentFavoritesSet = new Set(currentFavorites);
      if (currentFavoritesSet.has(trailId)) {
        currentFavoritesSet.delete(trailId);
      } else {
        currentFavoritesSet.add(trailId);
      }
      patchState(state, { favorites: Array.from(currentFavoritesSet) });
    },
  })),
  withHooks({
    onInit(store) {
      const savedItem = localStorage.getItem('favorites');
      if (savedItem) {
        const storedItems = JSON.parse(savedItem) as string[];
        patchState(store, { favorites: storedItems });
      }
      effect(() => {
        const favorites = store.favorites();
        localStorage.setItem('favorites', JSON.stringify(favorites));
      });
    },
  }),
);
