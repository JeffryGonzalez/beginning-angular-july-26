import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject } from '@angular/core';
import { withStellarDevtools } from '@hypertheory-labs/stellar-ng-devtools';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { Trail, TrailCreate } from '../types';
import { firstValueFrom } from 'rxjs';

interface TrailsState {
  favorites: string[];
}
export const trailsStore = signalStore(
  withStellarDevtools('trails-store', {
    description: 'This keeps a list of trails and the favorites',
  }),
  withState<TrailsState>({
    favorites: [],
  }),
  withProps(() => ({
    trailsResource: httpResource<Trail[]>(() => 'http://localhost:3000/trails'),
  })),
  withComputed((state) => ({
    trailsWithFavorites: computed(() => {
      const trails = state.trailsResource.value() || [];
      return trails.map((trail) => ({
        ...trail,
        favorite: state.favorites().some((favoriteId) => favoriteId === trail.id),
      }));
    }),
  })),
  withMethods((state) => {
    const httpClient = inject(HttpClient);
    return {
      addTrail: async (trail: TrailCreate) => {
        return await firstValueFrom(httpClient.post<Trail>('http://localhost:3000/trails', trail));
      },
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
    };
  }),
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
