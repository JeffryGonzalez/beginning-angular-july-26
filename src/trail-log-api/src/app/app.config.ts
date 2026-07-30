import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStellar } from '@hypertheory-labs/stellar-ng-devtools';
import { routes } from './app.routes';
import { trailsStore } from './trails/services/trails-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    trailsStore,
    provideStellar(),
  ],
};
