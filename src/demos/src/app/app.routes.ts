import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { demoRoutes } from './demonstrations/demo-routes';

export const routes: Routes = [
  ...demoRoutes,
  {
    path: 'home',
    component: Home,
  },

  {
    path: '**',
    redirectTo: 'home',
  },
];
