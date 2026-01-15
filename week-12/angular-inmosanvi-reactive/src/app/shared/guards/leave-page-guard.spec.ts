import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { leavePageGuard } from './leave-page-guard';

describe('leavePageGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => leavePageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
