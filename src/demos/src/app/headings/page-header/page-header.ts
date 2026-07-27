import { Component, signal } from '@angular/core';
import { SideMenu } from '../../widgets/icons/side-menu';
import { EndPart } from './end-part';

@Component({
  selector: 'app-page-header',
  imports: [SideMenu, EndPart],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly links = signal([
    {
      text: 'Angular',
      href: 'https://angular.dev',
    },
    {
      text: 'Hypertheory Labs',
      href: 'https://class.hypertheory-labs.com',
    },
  ]);
}
