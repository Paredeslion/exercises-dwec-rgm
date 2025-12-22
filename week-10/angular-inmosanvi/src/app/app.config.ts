// provideZonelessChangeDetection to enable a Zoneless project
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// New imports
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless here too
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // Adding provideHttpClient
    provideHttpClient(
      withInterceptors([baseUrlInterceptor])
    )
  ]
};
