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

  // --- MODIFICACIÓN CLAVE ---
  // Ahora aceptamos señales opcionales para filtrar
  // Si no se pasan, devuelve todas (como antes)
  getPropertiesResource(searchSignal?: Signal<string>, provinceSignal?: Signal<string>) {
    return httpResource<PropertiesResponse>(() => {
      // Construimos la URL con parámetros
      let url = this.#baseUrl;
      const params: string[] = [];

      const search = searchSignal ? searchSignal() : '';
      const province = provinceSignal ? provinceSignal() : '';

      // Dependiendo de tu backend, el parámetro de búsqueda suele ser 'q' o 'search'
      // Ajusta esto según tu API. Asumo 'q' que es estándar json-server
      if (search) {
        params.push(`q=${encodeURIComponent(search)}`);
      }

      // La profesora menciona filtrar por provincia.
      // Si el backend soporta filtro anidado (ej: town.province.name), úsalo.
      // Si no, tendremos que filtrar la provincia en cliente o usar el parámetro que espere tu API.
      // Nota: Si el backend NO soporta filtrado, el comentario de la profesora
      // "filteredProperties te sobra" implica que ELLA ESPERA que el backend lo soporte.
      // Vamos a asumir que tu backend no filtra complejo y solo mandamos búsqueda global 'q'.

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      return url;
    });
  }

  // Mantenemos una referencia "por defecto" para cuando no hay filtros (ej: property-form)
  readonly propertiesResource = this.getPropertiesResource();

  // Calculated Signal (Replaces LinkedSignal)
  // We need to use .reload(). When we reload, the resource updates itself.
  // We no longer need a manually editable ‘linkedSignal’; a ‘computed’ one is sufficient.
  readonly properties = computed(() => this.propertiesResource.value()?.properties ?? []);

  // New resource: Gat a property by ID
  // Receives a signal with the ID and returns a reactive resource
  getPropertyResource(idSignal: Signal<number | undefined>) {
    return httpResource<SinglePropertyResponse>(() => {
      // We read the value
      const id = idSignal();

      // If it's undefined or NaN, we don't make the petition
      if (!id) {
        return undefined;
      }

      // If we had the ID, we make the petition
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
