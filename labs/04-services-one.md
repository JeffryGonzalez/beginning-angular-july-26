# Creating a service to handle favorites

We are getting close to having this trail log app be much more "real".

The first "get honest" moment. What the *heck* does a "favorite" mean on a trail?

Let's assume this app will get a list of trails from some API (it will tomorrow).

All users of the application will get the same list of trails.

Each user can decide whether a certain trail is their favorite or not.

So, we need two pieces of data, stored and retrieved from different places. One is the list of trails, and one is the list of favorite trails by an individual user.

## Update the trail type

Let's assume each trail we get from an API will have an Id. Everything has an Id. We'll add an Id to the trail, and we'll also take that favorite property out of that type.

We will create a *second* type, based on the Trail that *will* have a property that we will calculate called `favorite`.

In `src\app\trails\types.ts`, make the changes so they look like this:

```ts diff
export interface Trail {
+  id: string;
  name: string;
  miles: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
- favorite: boolean;
}

+ export type TrailModel = Trail & {
+  favorite: boolean;
+ };
```

> Note: This will break a *lot* of things in your project for a while. Hang in there!

## Fix up the trails-list component.

We will get rid of some of our errors now. We'll add a tiny bit of "fake" code until we get our new service in place.

In `src\app\trails\trails-list.ts`, we will update the list of trails to each have an Id, and we'll remove the favorite property from them.

We'll rename the existing `trails` signal to `apiTrails`.

Finally, we'll add a computed `trails` property that turns each of our trails into a `TrailModel`. For now we'll just say they are *all* our favorite.

```ts diff
import { Component, computed, inject, signal } from '@angular/core';

import { TrailStats } from './trail-stats';
import { Trail } from './types';
import { TrailCard } from './trail-card';
import { Favorites } from './favorites';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="trails()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (trail of trails(); track trail.name) {
          <app-trails-trail-card [trail]="trail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  readonly apiTrails = signal<Trail[]>([
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


  protected readonly trails = computed(() => {

    return this.apiTrails().map((trail) => ({
      ...trail,
      favorite: true, // this is the fake part! coming soon.
    }));
  });
}
```

## Update the input on the `trail-card` component.

You'll likely still have an error on the trail card. The `Trail` input doesn't have a favorite property.

Simply update the input type with our `TrailModel` type.

Here is just the class portion of `src\app\trails\trail-card.ts`  (leave the template as is):


```ts diff
export class TrailCard {
- readonly trail = input.required<Trail>();
+  readonly trail = input.required<TrailModel>();


  protected toggleFavorite() {
        // coming soon!
  }
}
```

Don't forget to update your imports!

## Update the input on the TrailStats component

TODO: add this

## Create the service

In the `/src/app/trails/` directory, create a new file called `favorites.ts`. This will be our new service.

This service will:
- expose a readonly signal of all the user's favorite trails (the ids).
- allow that signal to be updated by toggling the a particular trail as a favorite (or not favorite).

In `/src/app/trails/favorites.ts` add this:

```ts
import {  Service, signal } from '@angular/core';

@Service()
export class Favorites {
  private _favorites = signal<string[]>([]);
  public favorites = this._favorites.asReadonly();

  public toggleFavorite(trailId: string): void {
    const currentFavorites = this._favorites();

    const currentFavoritesSet = new Set(currentFavorites);
    if (currentFavoritesSet.has(trailId)) {
      currentFavoritesSet.delete(trailId);
    } else {
      currentFavoritesSet.add(trailId);
    }
    this._favorites.set(Array.from(currentFavoritesSet));
  }
}
```

As you can see we are keeping a `string[]` array of the ids of the favorite trails. 

In the `toggleFavorite` method, I am converting the array of favorites to a JavaScript set (search 'mdn set'). A set data structure is like an array but doesn't allow duplicates, and has helpful methods like `delete` and `has`. I convert it back to an Array for storage though.

## Update the trail card to use this service

Back in `/src/app/trails/trail-card.ts` we'll inject that new service, and *finally* can make our toggle work again (kind of).

Here is just the class part of that component (leave the template as it is):

```ts diff
export class TrailCard {
  readonly trail = input.required<TrailModel>();
+  protected readonly favorites = inject(Favorites);

  protected toggleFavorite() {
+    this.favorites.toggleFavorite(this.trail().id);
  }
}
```

The toggle should now "work", but the display won't update. Let's make that `computed` on trails list work correctly now.

## Update the trails-list

We'll make that fake computed look at the service that holds the list of favorites and update appropriately.

Again, just the class portion of `/src/app/trails/trails-list.ts` - leave the template the same.

```ts diff
export class TrailList {
  readonly apiTrails = signal<Trail[]>([
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

+  protected readonly favorites = inject(Favorites);

  protected readonly trails = computed(() => {
    const favoriteIds = this.favorites.favorites();
    return this.apiTrails().map((trail) => ({
      ...trail,
-      favorite: true, // this is the fake part! coming 
+      favorite: favoriteIds.some((id) => id === trail.id),
    }));
  });
}
```

At this point you should be able to toggle favorite trails off on and on!

## Bonus - save the data in localstorage so it survives browser refreshes

Right now if the user refreshes the browser, their favorites will be lost. Tomorrow we'll talk about APIs, but for now we'll use store the list of favorites in the browser using the `webStorage` API (specifically, `localStorage`). The `webStorage` API is a synchronous key-value store where both the key and the value is a string. 

We'll want this to be stored every time the list of favorites changes. And when the service is first created, we'll see if there *is* a list of favorites stored, and update our state accordingly.

We'll do this using an `effect`. Effect (think "side effect") is sort of like a computed in that it runs whenever a enclosed signal changes, but it doesn't return a value. It just *does something*. You can only use an `effect` in an "injection context", which for a class is a constructor. Add this  constructor to the `src\app\trails\favorites.ts`:

```ts
  constructor() {
    const storedFavorites = localStorage.getItem('favorites'); // if it is not stores, this will return null.
    if (storedFavorites) { // null is "falsy" so if there is nothing there, this will be skipped
// Jeff will talk about this more in the review.    
      this._favorites.set(JSON.parse(storedFavorites));
    }

// here is the effect - everyting the `_favorites()` signal changes, this will run, writing our values to the localStorage.
    effect(() => {
      const favs = this._favorites();
      localStorage.setItem('favorites', JSON.stringify(favs));
    });
  }

```