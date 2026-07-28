import { Component, signal } from '@angular/core';
import { SideMenu } from '../../widgets/icons/side-menu';
import { EndPart } from './end-part';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-page-header',
  imports: [SideMenu, EndPart, RouterLink, RouterLinkActive],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly links = signal([
    {
      text: 'Home',
      href: '/home',
    },
    {
      text: 'Demos',
      href: '/demos',
    },
  ]);
}
