import { Component, ChangeDetectionStrategy, output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Property } from '../interfaces/property';

@Component({
  selector: 'property-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './property-form.html',
  styleUrl: './property-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyForm {
  // Output event: emits the created property to the parent
  added = output<Property>();

  // Internal signal for previewing the image
  imagePreview = signal<string>("");

  // Temporary object for the form
  newProperty: Property = {
    province: '',
    town: '',
    address: '',
    title: '',
    price: 0,
    sqmeters: 0,
    numRooms: 0,
    numBaths: 0,
    mainPhoto: ''
  };

  // To clear the input
  fileName = "";

  addProperty(form: NgForm) {
    // Assign the signal image to the mainPhoto attribute
    this.newProperty.mainPhoto = this.imagePreview();

    // Emit a COPY of the object to the parent
    this.added.emit({ ...this.newProperty });

    // Reset form and object
    this.newProperty = {
      province: '',
      town: '',
      address: '',
      title: '',
      price: 0,
      sqmeters: 0,
      numRooms: 0,
      numBaths: 0,
      mainPhoto: ''
    };
    // Clear the signal
    this.imagePreview.set('');
    this.fileName = '';
    form.resetForm();
  }

  changeImage(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) {
      this.imagePreview.set('');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);

    reader.addEventListener('loadend', () => {
      // Update the signal with the base64 image
      this.imagePreview.set(reader.result as string);
      // It's not necessary ChangeDetectorRef anymore signals trigger change detection
    });
  }
}
