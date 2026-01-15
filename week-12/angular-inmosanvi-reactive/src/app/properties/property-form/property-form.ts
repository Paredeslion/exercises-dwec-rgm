import { Component, effect, inject, signal, DestroyRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PropertyInsert } from '../../shared/interfaces/property';
import { ProvincesService } from '../../shared/services/provinces';
import { PropertiesService } from '../../shared/services/properties';
import { EncodeBase64Directive } from '../../directives/encode-base64';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CanComponentDeactivate } from '../../shared/guards/leave-page-guard';

@Component({
  selector: 'property-form',
  standalone: true,
  imports: [ReactiveFormsModule, EncodeBase64Directive],
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
  // We inject FormBuilder to create the group
  #fb = inject(FormBuilder);

  // To control if we saved (to the Guard)
  saved = false;

  // Signal for Province initialized to 0 (exercise says), separated from the property object
  provinceId = signal(0);

  // Resources
  // We obtain the provinces directly from the service.
  provincesResource = this.#provincesService.provincesResource;
  // We obtain the towns DEPENDING on the provinceId signal
  townsResource = this.#provincesService.getTownsResource(this.provinceId);

  // 2. We define the Form Group with all validation rules.
  // We use nonNullable so values are never null (they revert to initial value).
  propertyForm = this.#fb.nonNullable.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        // New pattern
        Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
      ],
    ],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1)]],
    numRooms: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    numBaths: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    sqmeters: [1, [Validators.required, Validators.min(1)]],
    address: ['', [Validators.required]],
    // For selects: We use pattern to ensure value starts with 1-9 (rejects "0")
    provinceId: [0, [Validators.required, Validators.pattern('[1-9]\\d*')]],
    townId: [0, [Validators.required, Validators.pattern('[1-9]\\d*')]],
    mainPhoto: ['', [Validators.required]],
  });

  constructor() {
    // Title of the page
    this.#title.setTitle('New Property | InmoSanvi');
    // Changing the logic (Week 12)
    // Instead of effect(), we use valueChanges from the form.
    // When the province select changes in the form:
    this.propertyForm.controls.provinceId.valueChanges
      // Clean up subscription automatically
      .pipe(takeUntilDestroyed())
      .subscribe((id) => {
        // 1. We update the signal so the Resource loads the new towns
        this.provinceId.set(+id);
        // 2. We reset the town selection to 0 in the form
        this.propertyForm.controls.townId.setValue(0);
      });
  }

  // Changing the logic (Week 12)
  addProperty() {
    // We get the data directly from the form
    const newProperty = this.propertyForm.getRawValue() as PropertyInsert;

    // We call the service to add
    this.#propertiesService
      .addProperty(newProperty)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((newProp) => {
        this.saved = true;

        // Exercise requirement: Mark form as pristine so the guard lets us leave
        this.propertyForm.markAsPristine();

        // Redirect to the details of the new property
        this.#router.navigate(['/properties', newProp.id]);
      });
  }

  // Method that receives the Base64 from the directive
  setImage(base64: string) {
    // We update the form control manually
    this.propertyForm.controls.mainPhoto.setValue(base64);
    // We mark it as touched so validation errors appear if it was empty
    this.propertyForm.controls.mainPhoto.markAsTouched();
  }

  // Guard Method
  canDeactivate() {
    // Exercise requirement: Allow leaving if saved OR form is pristine (not modified)
    if (this.saved || this.propertyForm.pristine) {
      return true;
    }

    // If we have unsaved changes, we ask for confirmation.
    return confirm('Do you want to leave this page? Changes may be lost.');
  }
}
