import { Component, DestroyRef, effect, inject, signal, untracked, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
// Signal Forms imports (Librería del curso)
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
  // We import 'Field' to bind inputs. ValidationClassesDirective is no longer needed.
  imports: [Field, EncodeBase64Directive],
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

  // Model: We define the initial data in a signal
  // Usamos strings para townId y valores iniciales en 0 para que salten las validaciones
  propertyModel = signal({
    title: '',
    description: '',
    price: 0,
    numRooms: 0,
    numBaths: 0,
    sqmeters: 0,
    address: '',
    townId: '0',
    mainPhoto: '',
  });

  // Campo independiente para la imagen (con validación propia)
  imageField = form(signal(''), (field) => {
    required(field, { message: 'You must choose an image file' });
  });

  // Campo independiente para la provincia (con validación propia)
  // Lo mantenemos como string '0' para que el HTML <select> funcione correctamente
  provinceField = form(signal('0'), (field) => {
    required(field, { message: 'You must choose a Province' });
    min(field, 1, { message: 'Province is required' });
  });

  // --- SOLUCIÓN AL ERROR DE TIPADO ---
  // Creamos una señal computada que transforma el string de provinceField en un number
  // Esta es la señal que le pasaremos al servicio para que esté contento con los tipos.
  provinceIdSignal = computed(() => Number(this.provinceField().value()));
  // Creating the Form: we create the form using the model and validation rules
  propertyForm = form(this.propertyModel, (f) => {
    // Title validations
    required(f.title, { message: 'Title cannot be empty' });
    minLength(f.title, 5, {
      message: (context) => `You must enter at least ${5 - context.value().length} characters more`,
    });

    // Using RegExp object /.../ for the pattern
    pattern(f.title, RegExp('^[a-zA-Z][a-zA-Z ]*$'), {
      message: 'Only letters and spaces allowed',
    });
    // Text validations
    required(f.description, { message: 'Description cannot be empty' });
    required(f.address, { message: 'Address cannot be empty' });
    // Numeric validations
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
    // Town validation
    required(f.townId, { message: 'Town cannot be empty' });
    min(f.townId, 1, { message: 'Town is required' });
    // Image validation
    required(f.mainPhoto, { message: 'Image cannot be empty' });
  });

  // Resources
  // We obtain the provinces directly from the service.
  provincesResource = this.#provincesService.provincesResource;
  // CORRECCIÓN: Pasamos provinceIdSignal (que es Signal<number>) en lugar del campo directamente
  townsResource = this.#provincesService.getTownsResource(this.provinceIdSignal);
  constructor() {
    // Page Title
    this.#title.setTitle('New Property | InmoSanvi');
    // Handling side effects
    // Watch provinceField to reset the town selection when it changes.
    effect(() => {
      // Watching the signal 'provinceField'
      this.provinceField();
      // When province changes, we reset the town in the FORM
      // Usamos untracked para evitar dependencias circulares al resetear el valor
      untracked(() => this.propertyForm.townId().value.set('0'));
    });
  }

  // Add Property Method
  addProperty(event: Event) {
    event.preventDefault();
    // We obtain the raw value from the form
    const rawValue = this.propertyModel();
    // We create the object, ensuring that the numbers are NUMBERS.
    // Usamos el operador '+' para convertir strings a números para el backend.
    const newProperty: PropertyInsert = {
      ...rawValue,
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
        next: () => {
          this.saved = true;
          this.#router.navigate(['/properties']);
        },
      });
  }

  // Guard Method
  canDeactivate() {
    // Check if saved OR if the form is pristine (not dirty)
    if (this.saved || !this.propertyForm().dirty()) {
      return true;
    }
    return confirm('¿Quieres abandonar la página?. Los cambios se perderán...');
  }
}
