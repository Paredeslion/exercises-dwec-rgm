// provideZonelessChangeDetection to enable a Zoneless project
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless here too
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};
