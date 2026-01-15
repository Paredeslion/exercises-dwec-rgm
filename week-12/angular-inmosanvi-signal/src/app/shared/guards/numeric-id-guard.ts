import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const numericIdGuard: CanActivateFn = (route, state) => {
  // We obtain the id parameter from the route
  const id = route.paramMap.get('id');
  const router = inject(Router);

  // We check if it exists and if it is a valid number
  if (id && !isNaN(+id)) {
    // We let pass
    return true;
  }

  // If it is not valid, redirect to the list of properties
  return router.createUrlTree(['/properties']);
};
