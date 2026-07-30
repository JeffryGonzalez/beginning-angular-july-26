# Consolidating services

In this lab we will create a new service called `trailsStore` using the @NGRX Signal Store. This service will hold both our favorites, and the list of trails. (In the next lab, this is where the API access will happen as well as the ability to add a new trail).

## Install the signal store library

In the terminal within your project, run the following:

```bash
npm i @ngrx/signals
```

If you get a version error (peer dependencies), run the following instead:

```bash
npm i @ngrx/signals --legacy-peer-deps
```

## Define the store state

Create a new file called `/src/app/trails/services/trails-store.ts`

In this file, define the "shape" of the data that this store will be responsible for.

```ts
interface TrailsState {
    trails: Trail[];
    favorites: string[];
}
```

> Note: You will have to handle the imports on your own here. Control + Period is your pal.

## Define the store

Below that interface, add the following:

```ts
export const trailsStore = signalStore(
    withState<TrailsState>({
        trails: [],
        favorites: []
    })
)
```

> Note: `signalStore` and `withState` need imported from `@ngrx/signals`, your pal Control+Period may fail you the first time you try. It'll get 'smarter'.

## Replicate the favorites feature

After the `withState` function, add a `withMethods` block that allows a favorite to be toggled. Your store will look like this:

```ts diff
export const trailsStore = signalStore(
  withState<TrailsState>({
    trails: apiTrails(),
    favorites: [],
  }),
+  withMethods((state) => ({
+    toggleFavorite: (trailId: string) => {
+      const currentFavorites = state.favorites();
+      const currentFavoritesSet = new Set(currentFavorites);
+      if (currentFavoritesSet.has(trailId)) {
+        currentFavoritesSet.delete(trailId);
+      } else {
+        currentFavoritesSet.add(trailId);
+     }
+     patchState(state, { favorites: Array.from(currentFavoritesSet) });
+    },
+ }))
);
```

## Add the persistence

A signal store does not have a constructor, but there is a `withHooks` feature. We will use that to retreive and store our favorites from localStorage.

```ts diff
export const trailsStore = signalStore(
  withState<TrailsState>({
    trails: apiTrails(),
    favorites: [],
  }),
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
+  withHooks({
+    onInit(store) {
+      const savedItem = localStorage.getItem('favorites');
+      if (savedItem) {
+        const storedItems = JSON.parse(savedItem) as string[];
+        patchState(store, { favorites: storedItems });
+      }
+      effect(() => {
+        const favorites = store.favorites();
+        localStorage.setItem('favorites', JSON.stringify(favorites));
+      });
+    },
+  }),
);
```

## Move the list of trails

In our next lab we will add the code to make an API call. For now, let's move the list of trails from our `trails-list.ts` component into this store. We'll also add a `withComputed` to create our `TrailModel[]`.

Here is the final (for now) `trails-store.ts`:

```ts diff
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

+const apiTrails = signal<Trail[]>([
+  {
+    id: '1',
+    name: 'Woodpecker Way Loop',
+    miles: 1.8,
+    difficulty: 'easy',
+  },
+  {
+    id: '2',
+   name: 'Eagle Rock Trail',
+    miles: 3.2,
+    difficulty: 'moderate',
+  },
+  {
+    id: '3',
+    name: 'Bear Creek Trail',
+    miles: 2.5,
+    difficulty: 'hard',
+  },
+  {
+    id: '4',
+    name: 'Cedar Ridge Trail',
+    miles: 4.1,
+    difficulty: 'extreme',
+ },
+  {
+    id: '5',
+    name: 'Pine Valley Trail',
+    miles: 5.0,
+    difficulty: 'moderate',
+  },
+]);

interface TrailsState {
  trails: Trail[];
  favorites: string[];
}
export const trailsStore = signalStore(
  withState<TrailsState>({
-    trails: [],
+    trails: apiTrails(),
    favorites: [],
  }),
+  withComputed((state) => ({
+    trailsWithFavorites: computed(() => {
+      return state.trails().map((trail) => ({
+        ...trail,
+        favorite: state.favorites().some((favoriteId) => favoriteId === trail.id),
+      }));
+    }),
+  })),
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
```

## Provide the service

We are going to *manually* provide this store, since we aren't using the `@Service` decorator. 

In your `/src/app/app.config.ts` add the store to the providers array:

```ts diff
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
+ import { trailsStore } from './trails/services/trails-store';

export const appConfig: ApplicationConfig = {
  providers: [
      provideBrowserGlobalErrorListeners(),
      provideRouter(routes),
+     trailsStore
    ],
};
```

## Update the trails-list component

The `/src/app/trails/trails-list.ts` component can will become much "cleaner" now that we have the store.

Here's the entire component:

```ts
import { Component, inject } from '@angular/core';

import { trailsStore } from './services/trails-store';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="store.trailsWithFavorites()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (daTrail of store.trailsWithFavorites(); track daTrail.name) {
          <app-trails-trail-card [trail]="daTrail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  readonly store = inject(trailsStore);
}
```

## Update the trail card to use the new service

Our `/src/app/trails/trail-card.ts` is still using the old `favorites` service. Update it to use the new service:

```ts diff
import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MilesToFeetPipe } from './pipes/miles-feet';
- import { Favorites } from './favorites';
+ import { trailsStore } from './services/trails-store';
import { TrailModel } from './types';

@Component({
  selector: 'app-trails-trail-card',
  imports: [TitleCasePipe, MilesToFeetPipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ trail().name }}</h2>
      <div class="stats stats-vertical lg:stats-vertical shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ trail().miles }}</div>
          <div class="stat-desc">{{ trail().miles | milesFeet }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Level</div>
          <div class="stat-value">
            <span
              [class.text-success]="trail().difficulty === 'easy'"
              [class.text-info]="trail().difficulty === 'moderate'"
              [class.text-warning]="trail().difficulty === 'hard'"
              [class.text-error]="trail().difficulty === 'extreme'"
              >{{ trail().difficulty | titlecase }}</span
            >
          </div>
        </div>
      </div>
      <div class="card-actions justify-end">
        <label
          class="label"
          [class.text-success]="trail().favorite"
          [class.text-neutral]="!trail().favorite"
        >
          {{ trail().favorite ? 'Favorite!' : 'Mark as Favorite' }}
          <input
            type="checkbox"
            [checked]="trail().favorite"
            (change)="toggleFavorite()"
            class="toggle toggle-sm"
          />
        </label>
      </div>
    </div>
  `,

  styleUrl: './trail-card.css',
  host: {
    '[class.ring-4]': 'trail().favorite',
    '[class.ring-success]': 'trail().favorite',
  },
})
export class TrailCard {
  readonly trail = input.required<TrailModel>();
-  favoriteService = inject(Favorites);  
+  readonly store = inject(trailsStore);
  protected toggleFavorite() {
-     this.favoriteService.toggleFavorite(this.trail().id);
+    this.store.toggleFavorite(this.trail().id);
  }
}
```
## Check it out

At this point, your app should work as it did before. This was a *refactoring* - nothing observable should have changed, but the code has progressed to much better patterns.