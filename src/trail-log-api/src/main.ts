import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isDevMode } from '@angular/core';

async function enableMocking() {
  if (isDevMode()) {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      quiet: true,
    });
  } else {
    return;
  }
}
// startup -

enableMocking().then(() => bootstrapApplication(App, appConfig).catch((err) => console.error(err)));
