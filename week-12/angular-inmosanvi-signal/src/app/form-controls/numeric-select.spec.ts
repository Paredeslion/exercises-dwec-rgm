import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericSelect } from './numeric-select';

describe('NumericSelect', () => {
  let component: NumericSelect;
  let fixture: ComponentFixture<NumericSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumericSelect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
