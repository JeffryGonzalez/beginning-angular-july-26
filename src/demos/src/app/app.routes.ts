import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { ChangeDetection } from './demonstrations/change-detection';

export const routes: Routes = [
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'demos',
    component: ChangeDetection,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
