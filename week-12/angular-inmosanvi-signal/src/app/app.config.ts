// provideZonelessChangeDetection to enable a Zoneless project
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';
// New imports
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url-interceptor';
import { provideSignalFormsConfig, SignalFormsConfig } from '@angular/forms/signals';

// Necesario para cambiar las clases mediante formularios signals
export const NG_STATUS_CLASSES: SignalFormsConfig['classes'] = {
  'ng-touched': ({ state }) => state().touched(),
  'ng-untouched': ({ state }) => !state().touched(),
  'ng-dirty': ({ state }) => state().dirty(),
  'ng-pristine': ({ state }) => !state().dirty(),
  'ng-valid': ({ state }) => state().valid(),
  'ng-invalid': ({ state }) => state().invalid(),
  'ng-pending': ({ state }) => state().pending(),
};

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless here too
    provideZonelessChangeDetection(),
    provideRouter(routes,
      // If we don't add this line of code, the property will keep loading forever.
      withComponentInputBinding(),
      withPreloading(PreloadAllModules)
    ),
    // Adding provideHttpClient
    provideHttpClient(
      withInterceptors([baseUrlInterceptor])
    ),
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ]
};
