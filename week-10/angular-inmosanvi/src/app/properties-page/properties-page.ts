import { Component, computed, inject, signal } from '@angular/core';
import { PropertyCard } from '../property-card/property-card';
import { PropertyForm } from '../property-form/property-form';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../services/properties';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, PropertyForm, FormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  // We inject the service that connects to the server
  #propertiesService = inject(PropertiesService);

  // Signals for filters
  search = signal<string>('');

  // DATA: We use the service's ‘linkedSignal’.
  // Since it is linked, if the server changes, this changes.
  properties = this.#propertiesService.properties;

  filteredProperties = computed(() => {
    const searchText = this.search().toLowerCase();

    return this.properties().filter((p) => {
      return (
        p.title.toLowerCase().includes(searchText) || p.address.toLowerCase().includes(searchText)
      );
    });
  });

  // DELETE: We delegate to the service
  deleteProperty(id: number) {
    this.#propertiesService.deleteProperty(id).subscribe();
  }
}
