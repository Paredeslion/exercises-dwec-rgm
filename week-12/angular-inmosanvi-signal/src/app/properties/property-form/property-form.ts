import { Component, effect, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

// Signal Forms imports
import { Field, form, required, minLength, min, max, pattern } from '@angular/forms/signals';

// Services & Interfaces
import { PropertyInsert } from '../../shared/interfaces/property';
import { ProvincesService } from '../../shared/services/provinces';
import { PropertiesService } from '../../shared/services/properties';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';

// Directives
import { EncodeBase64Directive } from '../../directives/encode-base64';
import { ValidationClassesDirective } from '../../directives/validation-classes';

@Component({
  selector: 'property-form',
  standalone: true,
  // We import 'Field' to bind inputs, and 'ValidationClassesDirective' for the custom controls visual state
  imports: [Field, EncodeBase64Directive, ValidationClassesDirective],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm implements CanComponentDeactivate {
  // Injecting services
  #provincesService = inject(ProvincesService);
  #propertiesService = inject(PropertiesService);

  // Injecting destroy, router and title references
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #title = inject(Title);

  // To control if we saved (used by the Guard)
  saved = false;

  // Signal for Province (used to load towns)
  provinceId = signal(0);

  // To check if the province field has not been modified
  provinceTouched = signal(false);

  // Resources
  // We obtain the provinces directly from the service.
  provincesResource = this.#provincesService.provincesResource;
  // We obtain the towns DEPENDING on the provinceId signal
  townsResource = this.#provincesService.getTownsResource(this.provinceId);

  // Model: We define the initial data in a signal
  propertyModel = signal<PropertyInsert>({
    title: '',
    description: '',
    price: 0,
    // Initialized to 1 to match min validation logic
    numRooms: 1,
    numBaths: 1,
    sqmeters: 1,
    address: '',
    townId: 0,
    mainPhoto: '',
  });

  // Creating the Form: we create the form using the model and validation rules
  propertyForm = form(this.propertyModel, (f) => {
    // Title validations
    required(f.title);
    minLength(f.title, 5);
    // Using RegExp object /.../ for the pattern
    pattern(f.title, /^[a-zA-Z][a-zA-Z ]*$/);

    // Text validations
    required(f.description);
    required(f.address);

    // Numeric validations
    required(f.price);
    min(f.price, 1);

    required(f.sqmeters);
    min(f.sqmeters, 1);

    required(f.numRooms);
    min(f.numRooms, 1);
    max(f.numRooms, 20);

    required(f.numBaths);
    min(f.numBaths, 1);
    max(f.numBaths, 20);

    // Tip: We cast to 'any' so TS allows using a pattern on a number field.
    // The pattern prevents the value from being '0'.
    required(f.townId);
    min(f.townId, 1);

    // Image validation
    required(f.mainPhoto);
  });

  constructor() {
    // Page Title
    this.#title.setTitle('New Property | InmoSanvi');

    // Handling side effects
    // Since 'provinceId' is handled outside the main form model (in a separate signal),
    // we need to watch it to reset the town selection when it changes.
    effect(() => {
      // Watching the signal 'provinceId'
      this.provinceId();

      // When province changes, we reset the town in the FORM
      // We use .value.set() to update the form control value
      this.propertyForm.townId().value.set(0);
    });
  }

  // New helper to update the province without ngModel
  updateProvince(e: Event) {
    const val = (e.target as HTMLSelectElement).value;
    this.provinceId.set(Number(val));
  }

  addProperty() {
    // We obtain the raw value from the form
    const rawValue = this.propertyForm().value();

    // We create the object, ensuring that the numbers are NUMBERS (Number(...)).
    // If we do not do this, they are sent as strings (“120000”) and the backend fails (400).
    const newProperty: PropertyInsert = {
      title: rawValue.title,
      description: rawValue.description,
      address: rawValue.address,
      mainPhoto: rawValue.mainPhoto,
      // We explicitly convert to a number
      price: Number(rawValue.price),
      numRooms: Number(rawValue.numRooms),
      numBaths: Number(rawValue.numBaths),
      sqmeters: Number(rawValue.sqmeters),
      townId: Number(rawValue.townId),
    };

    this.#propertiesService
      .addProperty(newProperty)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (newProp) => {
          this.saved = true;
          this.#router.navigate(['/properties', newProp.id]);
        },
      });
  }

  // Method that receives the Base64 from the directive
  setImage(base64: string) {
    // We update the form control value manually
    this.propertyForm.mainPhoto().value.set(base64);
  }

  // Guard Method
  canDeactivate() {
    // Check if saved OR if the form is pristine (not dirty)
    if (this.saved || !this.propertyForm().dirty()) {
      return true;
    }
    return confirm('Do you want to leave this page? Changes may be lost.');
  }
}
