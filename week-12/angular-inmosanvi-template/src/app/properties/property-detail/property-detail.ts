import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PropertiesService } from '../../shared/services/properties';
import { PropertyCard } from '../property-card/property-card';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'property-detail',
  standalone: true,
  imports: [PropertyCard],
  template: `
    @if (property()) {
      <property-card [property]="property()!" (deleted)="deleteProperty()"> </property-card>
    } @else {
      <p>Loading property...</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyDetail {
  id = input<number, unknown>(undefined, { transform: numberAttribute });

  #propertiesService = inject(PropertiesService);
  #router = inject(Router);
  #title = inject(Title);

  // We obtain the complete server “package.”
  propertyResource = this.#propertiesService.getPropertyResource(this.id);

  // We created a computed signal that extracts what's inside.
  // If resource.value() exists, we return .property. If not, undefined.
  property = computed(() => this.propertyResource.value()?.property);

  constructor() {
    effect(() => {
      // Now we read the clean signal
      const p = this.property();
      if (p) {
        // Here we already have access to .title because p is of type Property.
        this.#title.setTitle(p.title + ' | InmoSanvi');
      }
    });
  }

  deleteProperty() {
    // Actual ID
    const id = this.id();

    if (id) {
      // If the ID exists, is not undefined
      this.#propertiesService.deleteProperty(id).subscribe(() => {
        this.#router.navigate(['/properties']);
      });
    }
  }
}
