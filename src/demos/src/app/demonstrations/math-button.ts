import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'button[appMathButton]',
  host: {
    '[class.math-button]': 'true',
    '[class.ring-2.ring-red-500]': 'isHovering()',
    '[class.ring-red-500]': 'isHovering()',
    '(mouseenter)': 'isHovering.set(true)',
    '(mouseleave)': 'isHovering.set(false)',
    '(click)': 'logIt()',
  },
})
export class MathButton {
  isHovering = signal(false);

  logIt() {
    console.log('Got a click!');
  }
}
