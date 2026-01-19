import { Component, DestroyRef, effect, inject, signal, untracked, computed } from '@angular/core';
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

@Component({
  selector: 'property-form',
  standalone: true,
  // We import 'Field' here. This directive automatically handles validation logic.
  imports: [Field, EncodeBase64Directive],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})
export class PropertyForm implements CanComponentDeactivate {
  // Services Injection
  #provincesService = inject(ProvincesService);
  #propertiesService = inject(PropertiesService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #title = inject(Title);

  saved = false;

  // Model: Initialized with 'empty' values to trigger 'required' validators correctly.
  propertyModel = signal({
    title: '',
    description: '',
    price: 0,
    numRooms: 0,
    numBaths: 0,
    sqmeters: 0,
    address: '',
    townId: '0', // Initialized as string '0' for the <select>
    mainPhoto: '',
  });

  // Independent Form Field: Image (Custom validation flow)
  imageField = form(signal(''), (field) => {
    required(field, { message: 'You must choose an image file' });
  });

  // Independent Form Field: Province
  provinceField = form(signal('0'), (field) => {
    required(field, { message: 'You must choose a Province' });
    min(field, 1, { message: 'Province is required' });
  });

  // Computed signal: Transforms the province string ID into a number for the service.
  provinceIdSignal = computed(() => Number(this.provinceField().value()));

  // Main Form Schema: Defines rules and error messages.
  propertyForm = form(this.propertyModel, (f) => {
    // Basic Fields
    required(f.title, { message: 'Title cannot be empty' });
    required(f.description, { message: 'Description cannot be empty' });
    required(f.address, { message: 'Address cannot be empty' });

    // Complex Validations for Title
    minLength(f.title, 5, {
        message: (context) => `You must enter at least ${5 - context.value().length} characters more`,
    });
    pattern(f.title, RegExp('^[a-zA-Z][a-zA-Z ]*$'), { message: 'Only letters and spaces allowed' });

    // Numeric Validations
    required(f.price, { message: 'Price cannot be empty' });
    min(f.price, 1, { message: 'Price cannot be 0 or negative' });

    required(f.sqmeters, { message: 'Square meters cannot be empty' });
    min(f.sqmeters, 1, { message: 'Square meters cannot be less than 1' });

    required(f.numRooms, { message: 'Num. Rooms cannot be empty' });
    min(f.numRooms, 1, { message: 'Num Rooms cannot be less than 1' });
    max(f.numRooms, 20, { message: 'Num Rooms cannot be more than 20' });

    required(f.numBaths, { message: 'Num. baths cannot be empty' });
    min(f.numBaths, 1, { message: 'Num Baths cannot be less than 1' });
    max(f.numBaths, 20, { message: 'Num Baths cannot be more than 20' });

    // Select Validations
    required(f.townId, { message: 'Town cannot be empty' });
    min(f.townId, 1, { message: 'Town is required' });

    // Image Validation (on the model)
    required(f.mainPhoto, { message: 'Image cannot be empty' });
  });

  // Resources
  provincesResource = this.#provincesService.provincesResource;
  townsResource = this.#provincesService.getTownsResource(this.provinceIdSignal);

  constructor() {
    this.#title.setTitle('New Property | InmoSanvi');

    // Effect: Resets town selection when province changes
    effect(() => {
      this.provinceField(); // Track dependency
      // Use untracked to modify signal without creating a loop
      untracked(() => this.propertyForm.townId().value.set('0'));
    });
  }

  addProperty(event: Event) {
    event.preventDefault();

    // Prepare payload: Ensure all numbers are actual numbers
    const newProperty: PropertyInsert = {
      ...this.propertyModel(),
      price: Number(this.propertyModel().price),
      numRooms: Number(this.propertyModel().numRooms),
      numBaths: Number(this.propertyModel().numBaths),
      sqmeters: Number(this.propertyModel().sqmeters),
      townId: +this.propertyModel().townId // '+' converts string to number
    };

    this.#propertiesService
      .addProperty(newProperty)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((prop) => {
        this.saved = true;
        // Redirect to detail page
        this.#router.navigate(['/properties', prop.id]);
      });
  }

  canDeactivate() {
    if (this.saved || !this.propertyForm().dirty()) {
      return true;
    }
    return confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }
}
