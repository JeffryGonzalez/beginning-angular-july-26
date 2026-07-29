import { Component, computed, inject, input, output } from '@angular/core';
import { CounterData } from './counter-data';

@Component({
  selector: 'app-counter-fizzbuzz',
  imports: [],
  template: `
    @switch (fizzBuzz()) {
      @case ('fizz') {
        <p>Fizzing!</p>
      }
      @case ('buzz') {
        <p>Buzzing!</p>
      }
      @case ('fizzbuzz') {
        <p>FIZZBUZZ!!!</p>
      }
      @case ('none') {
        <p>{{ whatToShowIfThereIsNothingToShow() }}</p>
      }
    }
  `,
  styles: ``,
})
export class FizzBuzz {
  service = inject(CounterData);

  whatToShowIfThereIsNothingToShow = input('boring');
  fizzbuzzAchieved = output<string>();

  fizzBuzz = computed<'fizz' | 'buzz' | 'fizzbuzz' | 'none'>(() => {
    const c = this.service.current();

    if (c % 3 === 0 && c % 5 === 0) {
      // if we hit fizzbuzz, I want to let the parent component know this happened.
      this.fizzbuzzAchieved.emit('They got fizzbuzz');
      return 'fizzbuzz';
    }
    if (c % 3 === 0) {
      return 'fizz';
    }
    if (c % 5 === 0) {
      return 'buzz';
    }
    if (c === 0) {
      return 'none';
    } else {
      return 'none';
    }
  });
}
