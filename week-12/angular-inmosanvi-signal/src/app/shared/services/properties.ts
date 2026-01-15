import { Injectable, inject, computed, Signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { PropertiesResponse, SinglePropertyResponse } from '../interfaces/responses';
import { Property, PropertyInsert } from '../interfaces/property';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  #http = inject(HttpClient);
  readonly #baseUrl = 'properties';

  // We store the signals internally to use them in the “emergency filter.”
  #searchSignal: Signal<string> | undefined;
  #provinceSignal: Signal<string> | undefined;

  getPropertiesResource(searchSignal?: Signal<string>, provinceSignal?: Signal<string>) {
    this.#searchSignal = searchSignal;
    this.#provinceSignal = provinceSignal;

    return httpResource<PropertiesResponse>(() => {
      // To search without filteredProperties
      // We read the signals. Angular will re-run the request when they change.
      const search = searchSignal ? searchSignal() : '';
      const province = provinceSignal ? provinceSignal() : '';

      // We build the URL with parameters (even though the backend ignores them, we send them)
      let url = this.#baseUrl;
      const params: string[] = [];

      if (search) params.push(`q=${encodeURIComponent(search)}`);
      // We adjust the province filter to the JSON structure
      if (province) params.push(`town.province.name=${encodeURIComponent(province)}`);

      if (params.length > 0) url += `?${params.join('&')}`;

      // We make the actual request to the server
      return url;
    });
  }

  // We maintain a “default” reference for when there are no filters (e.g., property-form).
  readonly propertiesResource = this.getPropertiesResource();

  // The MOST important
  // This computed signal processes the response.
  // If the server returns EVERYTHING (because it's dumb), we filter it here.
  readonly properties = computed(() => {
    // We obtain what the server has returned
    const rawData: any = this.propertiesResource.value();

    // We normalize the response (in case it is an array or object).
    let list: Property[] = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else {
      list = rawData?.properties ?? [];
    }

    // Security filter
    // We retrieve the current value of the filters
    const search = this.#searchSignal ? this.#searchSignal()?.toLowerCase() : '';
    const province = this.#provinceSignal ? this.#provinceSignal() : '';

    // If there are no filters, we return everything
    if (!search && !province) return list;

    // If there are filters, we apply the logic ourselves (since the backend failed)
    return list.filter((p) => {
      const matchesText =
        !search ||
        p.title.toLowerCase().includes(search) ||
        p.address.toLowerCase().includes(search);

      const matchesProvince = !province || p.town?.province?.name === province;

      return matchesText && matchesProvince;
    });
  });

  // New resource: Gat a property by ID
  // Receives a signal with the ID and returns a reactive resource
  getPropertyResource(idSignal: Signal<number | undefined>) {
    return httpResource<SinglePropertyResponse>(() => {
      // Leemos el valor
      const id = idSignal();

      // If it's undefined or NaN, we don't make the petition
      if (!id) {
        return undefined;
      }

      // Si tenemos ID, hacemos la petición
      return `properties/${id}`;
    });
  }

  // Method to add property (returns Observable)
  // We need to use .reload()
  addProperty(property: PropertyInsert): Observable<Property> {
    return this.#http.post<SinglePropertyResponse>(this.#baseUrl, property).pipe(
      map((resp) => resp.property),
      tap(() => {
        // Reload the list from the server
        this.propertiesResource.reload();
      }),
    );
  }

  // Method to delete property (returns Observable)
  // We need to use .reload()
  deleteProperty(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#baseUrl}/${id}`).pipe(
      tap(() => {
        // Reload the list from the server
        this.propertiesResource.reload();
      }),
    );
  }
}
