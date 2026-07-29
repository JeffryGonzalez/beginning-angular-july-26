import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { counterStore } from './demonstrations/counter-store';

export const appConfig: ApplicationConfig = {
  providers: [counterStore, provideBrowserGlobalErrorListeners(), provideRouter(routes)],
};
