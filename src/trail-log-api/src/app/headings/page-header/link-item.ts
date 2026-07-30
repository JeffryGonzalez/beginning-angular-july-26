import { Component, input } from '@angular/core';
import { ExternalLink } from '../../widgets/icons/external-link';
import { LinkItems } from './types';

@Component({
  selector: 'app-link-item',
  imports: [ExternalLink],
  template: `
    @let l = link();
    <a [href]="l.href" target="_blank" class="flex flex-row gap-2">
      <app-external-link />
      {{ l.linkText }}
    </a>
  `,
  styleUrls: ['./link-item.css'],
})
export class LinkItem {
  link = input.required<LinkItems>();
}
