import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
  HostListener,
} from '@angular/core';

@Directive({
  selector: '[appValidationClasses]',
  standalone: true,
})
export class ValidationClassesDirective {
  // We use <any> instead of <Field> to bypass TypeScript strict checks,
  // as the type definition doesn't explicitly expose the internal state
  // signals (touched, dirty, errors) we need to access dynamically.
  validationClasses = input.required<any>();

  #element = inject(ElementRef);
  #renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const fieldSignal = this.validationClasses();
      // We obtain the field object
      const state = fieldSignal();

      // Get real errors
      // The key: .errors is a computed function2(). You have to execute it ().
      const errorsSignal = state.errors;
      const actualErrors = typeof errorsSignal === 'function' ? errorsSignal() : errorsSignal;

      // We verify if the error object has real keys (to avoid {} or null)
      const hasErrors = actualErrors && Object.keys(actualErrors).length > 0;

      const isInvalid = hasErrors;
      const isValid = !hasErrors;

      // Get Touched / Dirty
      // These are also signals (computed), so we execute them if they are functions.
      const touchedSignal = state.touched;
      const isTouched = typeof touchedSignal === 'function' ? touchedSignal() : touchedSignal;

      const dirtySignal = state.dirty;
      const isDirty = typeof dirtySignal === 'function' ? dirtySignal() : dirtySignal;

      // Apply CSS classes
      this.toggleClass('ng-valid', isValid);
      this.toggleClass('ng-invalid', isInvalid);

      this.toggleClass('ng-dirty', isDirty);
      this.toggleClass('ng-pristine', !isDirty);

      this.toggleClass('ng-touched', isTouched);
      this.toggleClass('ng-untouched', !isTouched);
    });
  }

  // Listener to mark as ‘touched’ when exiting
  @HostListener('blur')
  onBlur() {
    const fieldSignal = this.validationClasses();
    const state = fieldSignal();

    if (typeof fieldSignal.markAsTouched === 'function') {
      fieldSignal.markAsTouched();
    } else if (state && typeof state.markAsTouched === 'function') {
      state.markAsTouched();
    }
  }

  private toggleClass(className: string, condition: boolean) {
    if (condition) {
      this.#renderer.addClass(this.#element.nativeElement, className);
    } else {
      this.#renderer.removeClass(this.#element.nativeElement, className);
    }
  }
}
