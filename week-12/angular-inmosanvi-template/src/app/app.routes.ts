import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    // Lazy loading to auth routes
    loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'properties',
    // Lazy loading to properties routes
    loadChildren: () => import('./properties/properties.routes').then((m) => m.propertiesRoutes),
  },
  {
    path: '',
    // Default redirection when entering the empty website
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    // Any unknown route sends you to the login page.
    redirectTo: '/auth/login',
  },
];
