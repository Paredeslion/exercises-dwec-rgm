import { Routes } from '@angular/router';
import { numericIdGuard } from '../shared/guards/numeric-id-guard';
import { leavePageGuard } from '../shared/guards/leave-page-guard';

export const propertiesRoutes: Routes = [
  {
    path: '',
    // The main list
    loadComponent: () => import('./properties-page/properties-page').then(m => m.PropertiesPage)
  },
  {
    path: 'add',
    // The form (IMPORTANT: comes before :id)
    loadComponent: () => import('./property-form/property-form').then(m => m.PropertyForm),
    // Guard to not lose the changes
    canDeactivate: [leavePageGuard]
  },
  {
    path: ':id',
    // The detail
    loadComponent: () => import('./property-detail/property-detail').then(m => m.PropertyDetail),
    // Guard to secure that the ID is a number
    canActivate: [numericIdGuard]
  }
];
