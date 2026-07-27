import { Component } from '@angular/core';
import { TreeIcon } from '../../widgets/icons/tree-icon';
import { ExternalLink } from '../../widgets/icons/external-link';

@Component({
  selector: 'app-page-header',
  imports: [TreeIcon, ExternalLink],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {}
