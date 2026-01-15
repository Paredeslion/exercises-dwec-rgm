import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
// Importing FormValueControl
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'numeric-select',
  standalone: true,
  imports: [],
  // Template
  template: `
    <select
      #select
      [id]="id()"
      [value]="value()"
      (change)="value.set(+select.value)"
      [class]="classes()"
      [class.ng-invalid]="invalid()"
      [class.ng-valid]="!invalid()"
      [class.ng-touched]="touched()"
      (blur)="touched.set(true)"
    >
      <option value="0">Select an option...</option>
      @for (option of options(); track option.value) {
        <option [value]="option.value">{{ option.text }}</option>
      }
    </select>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumericSelect implements FormValueControl<number> {
  id = input<string>('');
  // Receive the options in this specific format
  options = input<{ value: number; text: string }[]>();
  classes = input<string>('');

  // Models required by FormValueControl
  value = model<number>(0);
  touched = model<boolean>(false);
  invalid = input<boolean>(false);
}
