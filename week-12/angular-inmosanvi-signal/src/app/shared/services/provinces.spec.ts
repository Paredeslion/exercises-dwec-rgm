import { TestBed } from '@angular/core/testing';

import { Provinces } from './provinces';

describe('Provinces', () => {
  let service: Provinces;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Provinces);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
