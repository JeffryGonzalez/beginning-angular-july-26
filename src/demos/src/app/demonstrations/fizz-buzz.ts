import { Component, computed, input, signal } from '@angular/core';

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
        <p>{{ message() }}</p>
      }
    }
  `,
  styles: ``,
})
export class FizzBuzz {
  num = input.required<number>();
  message = input('boring');

  fizzBuzz = computed(() => {
    const c = this.num();
    if (c === 0) {
      return 'none';
    }
    if (c % 3 === 0 && c % 5 === 0) {
      return 'fizzbuzz';
    }
    if (c % 3 === 0) {
      return 'fizz';
    }
    if (c % 5 === 0) {
      return 'buzz';
    }
    return 'none';
  });
}
