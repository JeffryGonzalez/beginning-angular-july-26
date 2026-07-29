import { Component, computed, inject, signal } from '@angular/core';

import { Favorites } from './favorites';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';
import { Trail } from './types';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    <div class="flex flex-col md:flex-row gap-4">
      <app-trail-stats [trailList]="trails()"> </app-trail-stats>
      <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 w-fit gap-4">
        @for (daTrail of trails(); track daTrail.name) {
          <app-trails-trail-card [trail]="daTrail" class="" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class TrailList {
  readonly favoritesService = inject(Favorites);
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
      favorite: this.favoritesService.favorites().some((f) => f === trail.id),
    }));
  });
}
