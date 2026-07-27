import { Component } from '@angular/core';

@Component({
  selector: 'app-page-header-end-part',
  imports: [],
  template: `
    <div class="">
      <a class="btn">Button</a>
    </div>
  `,
  styles: ``,
  host: {
    '[class.navbar-end]': 'true',
  },
})
export class EndPart {}
