import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../shared/services/properties';
import { ProvincesService } from '../../shared/services/provinces';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard],
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

  // Requirement Debounce Logic
  // We convert the search signal to an Observable, wait 600ms, and convert back to a Signal.
  searchDebounced = toSignal(
    toObservable(this.search).pipe(debounceTime(600), distinctUntilChanged()),
    { initialValue: '' },
  );

  // 3. Recurso Reactivo (Petición al servidor)
  // Le pasamos las señales al servicio. Al cambiar 'searchDebounced', se relanza la petición HTTP.
  // ¡Esto elimina la necesidad de 'filteredProperties' local!
  propertiesResource = this.#propertiesService.getPropertiesResource(
    this.searchDebounced, // Usamos la versión con retraso
    this.province,
  );

  // Extraemos las propiedades del recurso para pintarlas
  properties = this.propertiesResource.value; // Es un computed signal interno del recurso

  constructor() {
    // To change the title of the page
    this.#title.setTitle('Properties Page | InmoSanvi');
  }

  // Helpers para el HTML (binding sin ngModel)
  updateSearch(e: Event) {
    this.search.set((e.target as HTMLInputElement).value);
  }

  updateProvince(e: Event) {
    this.province.set((e.target as HTMLSelectElement).value);
  }

  deleteProperty(id: number) {
    this.#propertiesService.deleteProperty(id).subscribe();
  }
}
