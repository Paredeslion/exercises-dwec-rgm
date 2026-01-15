import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PropertyCard } from '../property-card/property-card';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../../shared/services/properties';
import { ProvincesService } from '../../shared/services/provinces';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, FormsModule],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  #propertiesService = inject(PropertiesService);
  #provincesService = inject(ProvincesService);
  // New in week 11
  #title = inject(Title);

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

  constructor() {
    // To change the title of the page
    this.#title.setTitle('Properties Page | InmoSanvi');
  }

  deleteProperty(id: number) {
    this.#propertiesService.deleteProperty(id).subscribe();
  }
}
