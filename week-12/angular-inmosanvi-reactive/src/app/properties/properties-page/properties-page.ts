import { Component, computed, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PropertyCard } from '../property-card/property-card';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PropertiesService } from '../../shared/services/properties';
import { ProvincesService } from '../../shared/services/provinces';
// Importing toSignal and RxJS operators
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';

@Component({
  selector: 'properties-page',
  standalone: true,
  imports: [PropertyCard, ReactiveFormsModule],
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
  properties = this.#propertiesService.properties;

  // New, using Reactive Forms: We create FormControls instead of simple Signals
  searchControl = new FormControl('');
  provinceControl = new FormControl('');

  // New, Reactive logic: We convert the Observable stream to a Signal.
  // We apply debounceTime(600) to wait 600ms before processing the search.
  search = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''), // Start with empty string
      debounceTime(600), // Wait 600ms after user stops typing
      distinctUntilChanged(), // Only emit if value is different from previous
    ),
    { initialValue: '' },
  );

  // We do the same for province (no debounce needed strictly, but consistent)
  province = toSignal(this.provinceControl.valueChanges.pipe(startWith('')), { initialValue: '' });

  // Computed: This code not changes
  // It reads the signals created by toSignal above.
  filteredProperties = computed(() => {
    const searchText = this.search()!.toLowerCase(); // Force string with !
    const provinceFilter = this.province();

    return this.properties().filter((p) => {
      const matchesText =
        p.title.toLowerCase().includes(searchText) || p.address.toLowerCase().includes(searchText);

      const matchesProvince = provinceFilter === '' || p.town?.province?.name === provinceFilter;

      return matchesText && matchesProvince;
    });
  });

  constructor() {
    this.#title.setTitle('Properties Page | InmoSanvi');
  }

  deleteProperty(id: number) {
    this.#propertiesService.deleteProperty(id).subscribe();
  }
}
