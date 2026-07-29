import { Component, computed, signal } from '@angular/core';
import { FizzBuzz } from './fizz-buzz';

@Component({
  selector: 'app-change-detection',
  imports: [FizzBuzz],
  template: `
    <div class="p-4">
      @for (color of favoriteColors(); track $index) {
        <p>{{ color }}</p>
      } @empty {
        <p>No Favorite Colors. That is sad!</p>
      }

      <p>Hello from {{ myName() }} btw the number is even? {{ isEven() }}</p>
      <button (click)="myName.update((m) => m.toUpperCase())" class="btn btn-circle btn-error">
        XX
      </button>
      <button (click)="current.update((c) => c - 1)" class="btn btn-sm btn-primary">-</button>
      <span class="p-2">{{ current() }}</span>
      <button (click)="current.update((c) => c + 1)" class="btn btn-sm btn-primary">+</button>
    </div>

    <app-counter-fizzbuzz [num]="current()" [message]="myName()" />
  `,
  styles: ``,
})
export class ChangeDetection {
  current = signal(0);

  protected readonly favoriteColors = signal(['fuscia']);
  myName = signal('Jeff');

  isEven = computed(() => {
    // it will track JUST the signal referred to inside this function - not EVERY singal.
    // when those signals produce a new value, this will be re-evaluated

    const c = this.current();

    if (c === 0) {
      return false;
    }
    return c % 2 === 0;
  });

  increment() {
    this.current.set(this.current() + 1);
    // this.myName = this.myName.toUpperCase();
  }

  // before this runs, get a look at the state of this component and it's children
  decrement() {
    this.current.update((current) => current - 1);
  }
  // after this runs, compare and update anything that changed.
}
