import { Component, signal } from '@angular/core';
import { TreeIcon } from '../../widgets/icons/tree-icon';
import { LinkItem } from './link-item';
import { LinkItems } from './types';

@Component({
  selector: 'app-page-header',
  imports: [TreeIcon, LinkItem],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  // this is the body!
  // tiny bit classroom = probably wouldn't do this
  // in a "real" app **YET** (RUG)
  protected readonly links = signal<LinkItems[]>([
    {
      href: 'https://angular.dev',
      linkText: 'Angular Docs',
    },
    {
      href: 'https://class.hypertheory-labs.com',
      linkText: 'Hypertheory Labs',
    },
  ]);
}
