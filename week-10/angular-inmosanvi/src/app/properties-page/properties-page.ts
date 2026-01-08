import { Component, computed, inject, signal } from '@angular/core';
import { PropertyCard } from '../property-card/property-card'; // Asegúrate que la ruta sea correcta
import { PropertyForm } from '../property-form/property-form';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../services/properties';
import { ProvincesService } from '../services/provinces'; // <--- IMPORTANTE

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, PropertyForm, FormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  #propertiesService = inject(PropertiesService);
  #provincesService = inject(ProvincesService); // <--- Inyectamos servicio provincias

  // We display the provinces resource for HTML.
  provincesResource = this.#provincesService.provincesResource;

  search = signal<string>('');
  // Signal for province filter
  province = signal<string>('');

  properties = this.#propertiesService.properties;

  filteredProperties = computed(() => {
    const searchText = this.search().toLowerCase();
    // We obtain the selected province
    const provinceFilter = this.province();
    return this.properties().filter((p) => {
      // Text filter (title or address)
      const matchesText =
        p.title.toLowerCase().includes(searchText) || p.address.toLowerCase().includes(searchText);

      // 2. Province filter
      // If no province is selected (""), always pass.
      // If there is a province, we check if the address contains that name (e.g., “Madrid”).
      const matchesProvince =
        provinceFilter === '' || p.town?.province?.name === provinceFilter;

      return matchesText && matchesProvince;
    });
  });

  deleteProperty(id: number) {
    this.#propertiesService.deleteProperty(id).subscribe();
  }
}
