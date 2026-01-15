import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PropertyCard } from '../property-card/property-card';
import { PropertiesService } from '../../shared/services/properties';
import { ProvincesService } from '../../shared/services/provinces';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, JsonPipe],
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

  // Reactive Resource (Server Request)
  // We pass the signals to the service. When ‘searchDebounced’ changes, the HTTP request is re-launched.
  // This eliminates the need for local ‘filteredProperties’
  propertiesResource = this.#propertiesService.getPropertiesResource(
    this.searchDebounced, // Usamos la versión con retraso
    this.province,
  );

  // We extract the properties of the resource to paint them.
  properties = this.#propertiesService.properties; // It is an internal computed signal of the resource.

  constructor() {
    // To change the title of the page
    this.#title.setTitle('Properties Page | InmoSanvi');
  }

  // Helpers for HTML (binding without ngModel)
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
