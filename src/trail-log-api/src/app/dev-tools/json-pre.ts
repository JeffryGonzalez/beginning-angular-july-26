import { JsonPipe } from '@angular/common';
import { Component, input, isDevMode } from '@angular/core';

@Component({
  selector: 'app-dev-json-pre',
  imports: [JsonPipe],
  template: ` @if (isDev) {
    <pre> {{ obj() | json }}</pre>
  }`,
  styles: `
    pre {
      background-color: orange;
    }
  `,
})
export class JsonPre {
  obj = input.required<unknown>();

  isDev = isDevMode();
}
