import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    // Lazy loading of the component
    loadComponent: () => import('./login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    // (Optional) If you were registered, it would go here. For now, it redirects to login.
    redirectTo: 'login',
  },
];
