import { computed, effect } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
const countByValues = [1, 3, 5] as const;
type CountByValues = (typeof countByValues)[number];

interface CounterState {
  by: CountByValues;
  current: number;
}
const initialState: CounterState = {
  by: 1,
  current: 0,
};
export const counterStore = signalStore(
  withState<CounterState>(initialState),
  withProps(() => ({
    countByRange: countByValues,
  })),
  withMethods((state) => ({
    setBy: (by: CountByValues) => patchState(state, { by }),
    increment: () => patchState(state, { current: state.current() + state.by() }),
    decrement: () => patchState(state, { current: state.current() - state.by() }),
    reset: () => patchState(state, initialState),
  })),
  withComputed((state) => ({
    isEven: computed(() => {
      // it will track JUST the signal referred to inside this function - not EVERY singal.
      // when those signals produce a new value, this will be re-evaluated

      const c = state.current();

      if (c === 0) {
        return false;
      }
      return c % 2 === 0;
    }),
  })),
  withHooks({
    onInit(store) {
      // what if I wanted to save THIS stuff in local storage like our favorites?
      const saved = localStorage.getItem('counter-prefs');
      if (saved) {
        patchState(store, JSON.parse(saved));
      }
      effect(() => {
        const current = getState(store);
        localStorage.setItem('counter-prefs', JSON.stringify(current));
      });
    },
  }),
);
