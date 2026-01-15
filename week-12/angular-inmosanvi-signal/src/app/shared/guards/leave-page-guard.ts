import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

// We define an interface that requires the component to have the canDeactivate method.
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

// The guard receives a component that complies with the previous interface.
export const leavePageGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  // If ‘component’ is null (because it didn't load properly), it returns undefined and we move on to ‘|| true’.
  return component?.canDeactivate ? component.canDeactivate() : true;
};
