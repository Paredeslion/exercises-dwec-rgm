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

  // Readonly public attribute. httpResource to get all properties
  readonly propertiesResource = httpResource<PropertiesResponse>(() => this.#baseUrl);

  // Calculated Signal (Replaces LinkedSignal)
  // We need to use .reload(). When we reload, the resource updates itself.
  // We no longer need a manually editable ‘linkedSignal’; a ‘computed’ one is sufficient.
  readonly properties = computed(() => this.propertiesResource.value()?.properties ?? []);

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
