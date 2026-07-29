import { Component, inject, signal } from '@angular/core';
import { CounterReset } from './counter-reset';
import { counterStore } from './counter-store';
import { FizzBuzz } from './fizz-buzz';

@Component({
  selector: 'app-change-detection',
  imports: [FizzBuzz, CounterReset],
  template: `
    <div class="p-4">
      <button (click)="service.decrement()" class="btn btn-sm btn-primary">-</button>
      <span class="p-2">{{ service.current() }}</span>
      <button (click)="service.increment()" class="btn btn-sm btn-primary">+</button>
    </div>

    <app-counter-fizzbuzz
      (fizzbuzzAchieved)="onFizzbuzz($event)"
      [whatToShowIfThereIsNothingToShow]="myName()"
    />

    <app-counter-reset />
  `,
  styles: ``,
})
export class ChangeDetection {
  service = inject(counterStore);
  myName = signal('Neither fizz, nor buzz, nor ');

  onFizzbuzz(s: string) {
    console.log(s);
  }
}
