import { effect, Service, signal } from '@angular/core';

@Service()
export class xFavorites {
  private _favorites = signal<string[]>([]);
  public favorites = this._favorites.asReadonly();

  constructor() {
    const savedItem = localStorage.getItem('favorites');
    if (savedItem) {
      const storedItems = JSON.parse(savedItem) as string[];

      // validation - check to see if it is really what you expected.
      this._favorites.set(storedItems); // could be *bad*, but we'll take it for now.
    }
    // effect (is like a side-effect, not like special effects or something cool)
    effect(() => {
      const items = this._favorites();
      localStorage.setItem('favorites', JSON.stringify(items));
    });
  }

  public toggleFavorite(trailId: string): void {
    const currentFavorites = this._favorites();
    // send a message to the API for the user preferences or whatever...

    const currentFavoritesSet = new Set(currentFavorites);
    if (currentFavoritesSet.has(trailId)) {
      currentFavoritesSet.delete(trailId);
    } else {
      currentFavoritesSet.add(trailId);
    }
    this._favorites.set(Array.from(currentFavoritesSet));
  }
}
