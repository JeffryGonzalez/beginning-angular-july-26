import { TitleCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-trails-trail-card',
  imports: [TitleCasePipe],
  template: `
    <div class="card-body">
      <h2 class="card-title text-secondary">{{ name() }}</h2>
      <div class="stats stats-vertical lg:stats-horizontal shadow">
        <div class="stat">
          <div class="stat-title">Miles</div>
          <div class="stat-value">{{ miles() }}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Level</div>
          <div
            class="stat-value"
            [class.text-success]="difficulty() === 'easy'"
            [class.text-info]="difficulty() === 'moderate'"
            [class.text-warning]="difficulty() === 'hard'"
            [class.text-error]="difficulty() === 'extreme'"
          >
            {{ difficulty() | titlecase }}
          </div>
        </div>
      </div>

      <div class="card-actions justify-end">
        <label class="label" [class.text-success]="favorite()" [class.text-neutral]="!favorite()">
          {{ favorite() ? 'Favorite!' : 'Mark as Favorite' }}
          <input
            type="checkbox"
            [checked]="favorite()"
            (change)="toggleFavorite()"
            class="toggle toggle-sm"
          />
        </label>
      </div>
    </div>
  `,
  styleUrl: './trail-card.css',
})
export class TrailCard {
  protected readonly name = signal('Woodpecker Way Loop');
  protected readonly miles = signal(1.8);
  protected readonly difficulty = signal<'easy' | 'moderate' | 'hard' | 'extreme'>('extreme');
  protected readonly favorite = signal(false);

  toggleFavorite() {
    this.favorite.update((f) => !f);
  }
}
