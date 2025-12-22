import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Property } from '../interfaces/property';

@Component({
  selector: 'properties-page',
  imports: [FormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  // Dependency injection for Zoneless change detection
  #changeDetector = inject(ChangeDetectorRef);

  // Array to store the properties
  properties: Property[] = [];

  // Auxiliary variable to reset the file input
  fileName = '';

  // Object to store the form data
  newProperty: Property = {
    province: '',
    town: '',
    address: '',
    title: '',
    price: 0,
    sqmeters: 0,
    numRooms: 0,
    numBaths: 0,
    mainPhoto: '',
  };

  // Method to handle form submission
  addProperty(form: NgForm) {
    // Assign an ID (max ID + 1)
    const maxId =
      this.properties.length > 0 ? Math.max(...this.properties.map((p) => p.id || 0)) : 0;
    this.newProperty.id = maxId + 1;

    // Add the cloned object to the array
    this.properties.push({ ...this.newProperty });

    // Reset the form and the object
    this.newProperty = {
      province: '',
      town: '',
      address: '',
      title: '',
      price: 0,
      sqmeters: 0,
      numRooms: 0,
      numBaths: 0,
      mainPhoto: '',
    };
    this.fileName = '';
    form.resetForm();
  }

  // Method to convert the image to Base64
  changeImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
      this.newProperty.mainPhoto = '';
      return;
    }

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);

    reader.addEventListener('loadend', () => {
      this.newProperty.mainPhoto = reader.result as string;
      // Mark for check is necessary in Zoneless apps to update the view manually
      this.#changeDetector.markForCheck(); // Necessary in new Angular zoneless apps
    });
  }

  // Method to delete a property from the list
  deleteProperty(id: number) {
    this.properties = this.properties.filter((p) => p.id !== id);
  }
}
