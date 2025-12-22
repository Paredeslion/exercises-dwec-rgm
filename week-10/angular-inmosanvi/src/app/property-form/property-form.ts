import { Component, effect, inject, output, signal, DestroyRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { PropertyInsert } from '../interfaces/property';
import { ProvincesService } from '../services/provinces';
import { PropertiesService } from '../services/properties';
import { EncodeBase64Directive } from '../directives/encode-base64';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'property-form',
  standalone: true,
  imports: [FormsModule, EncodeBase64Directive],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
})

export class PropertyForm {
  // Injecting services
  #provincesService = inject(ProvincesService);
  #propertiesService = inject(PropertiesService);

  // Injecting destroy reference
  #destroyRef = inject(DestroyRef);

  // Output to notify the parent (optional, if you want to close the form after adding)
  add = output<void>();

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
    mainPhoto: ''
  };

  constructor() {
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
      .subscribe(() => {
        // We wait for the server's response before clearing
        form.resetForm();
        this.resetModel();
        // Please note that this has been added (it's not mandatory)
        this.add.emit();
      });
  }

  // Method that receives the Base64 from the directive
  setImage(base64: string) {
    this.newProperty.mainPhoto = base64;
  }

  // Helper to return to initial values
  private resetModel() {
    this.newProperty = {
      title: '',
      description: '',
      price: 0,
      numRooms: 0,
      numBaths: 0,
      sqmeters: 0,
      address: '',
      townId: 0,
      mainPhoto: ''
    };
    // Return to "no province"
    this.provinceId.set(0);
  }
}
