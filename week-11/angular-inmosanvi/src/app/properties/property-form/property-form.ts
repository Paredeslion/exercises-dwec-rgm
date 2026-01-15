import { Component, effect, inject, signal, DestroyRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  imports: [FormsModule, EncodeBase64Directive],
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

  // To control if we saved (to the Guard)
  saved = false;

  // Signal for Province initialized to 0 (exercise says), separated from the property object
  provinceId = signal(0);

  // Resources
  // We obtain the provinces directly from the service.
  provincesResource = this.#provincesService.provincesResource;
  // We obtain the towns DEPENDING on the provinceId signal
  townsResource = this.#provincesService.getTownsResource(this.provinceId);

  // Object form (PropertyInsert)
  newProperty: PropertyInsert = {
    title: '',
    // New mandatory field
    description: '',
    price: 0,
    numRooms: 0,
    numBaths: 0,
    sqmeters: 0,
    address: '',
    // The town ID will be saved.
    townId: 0,
    mainPhoto: '',
  };

  constructor() {
    // Title of the page
    this.#title.setTitle('New Property | InmoSanvi');
    // Effect: When the province changes, we reset the town to 0.
    effect(() => {
      // We read the signal to create the dependency
      this.provinceId();
      // Resetting the town ID
      this.newProperty.townId = 0;
    });
  }

  addProperty(form: NgForm) {
    // We call the service to add
    this.#propertiesService
      .addProperty(this.newProperty)
      // Important: Avoid memory leaks using takeUntilDestroyed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      // We receive the created property (WITH ID)
      .subscribe((newProp) => {
        // We mark it as saved so that the guard will let us leave.
        this.saved = true;

        // REQUIREMENT: Redirect to the details of the new property
        this.#router.navigate(['/properties', newProp.id]);

        // We no longer reset the form because we are leaving the page.
      });
  }

  // Method that receives the Base64 from the directive
  setImage(base64: string) {
    this.newProperty.mainPhoto = base64;
  }

  // Guard Method
  canDeactivate() {
    // If we have already saved (saved = true), we let it go without asking.
    if (this.saved) {
      return true;
    }

    // If we have NOT saved, we ask for confirmation.
    return confirm('Do you want to leave this page? Changes may be lost.');
  }
}
