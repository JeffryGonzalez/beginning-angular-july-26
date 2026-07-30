import { Component, effect, inject } from '@angular/core';

import { trailsStore } from './services/trails-store';
import { TrailCard } from './trail-card';
import { TrailStats } from './trail-stats';

@Component({
  selector: 'app-trails-list',
  imports: [TrailStats, TrailCard],
  template: `
    @if (store.trailsResource.isLoading()) {}
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

  constructor() {
    effect((cleanup) => {
      const timerId = setInterval(() => this.store.trailsResource.reload(), 5000);
      cleanup(() => {
        clearInterval(timerId);
        console.log('quit polling');
      });
    });
  }
}
