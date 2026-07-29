import { computed, Service, signal } from '@angular/core';

const countByValues = [1, 3, 5] as const;
type CountByValues = (typeof countByValues)[number];

@Service() // no provider needs to be created, angular will do that for you. And as long as no other code provides this, this will be the only instance. (singleton?)
export class CounterData {
  // Note - I find all of this pretty hideous. I would fail this PR. I'll show you a better way after lunch.
  // the good thing about this is you should be able to think through it.

  private by = signal<CountByValues>(1);
  private _current = signal(0);
  public current = this._current.asReadonly();
  countByRange = countByValues;
  public byValue = this.by.asReadonly();

  public setBy(newValue: CountByValues) {
    // a seam for me to be able to do other things, like save it to local storage or whatever.
    this.by.set(newValue);
  }

  increment() {
    this._current.update((c) => c + this.by());
  }
  decrement() {
    this._current.update((c) => c - c + this.by());
  }

  reset() {
    this._current.set(0);
  }

  isEven = computed(() => {
    // it will track JUST the signal referred to inside this function - not EVERY singal.
    // when those signals produce a new value, this will be re-evaluated

    const c = this.current();

    if (c === 0) {
      return false;
    }
    return c % 2 === 0;
  });
}
