import { Injectable, inject, linkedSignal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { PropertiesResponse, SinglePropertyResponse } from '../interfaces/responses';
import { Property, PropertyInsert } from '../interfaces/property';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  #http = inject(HttpClient);

  // Readonly public attribute. httpResource to get all properties
  readonly propertiesResource = httpResource<PropertiesResponse>(() => 'properties');

  // Linked Signal: Creates an editable copy of the resource data.
  // It updates automatically if propertiesResource changes (e.g., server reload),
  // but also allows us to modify it manually (e.g., delete a house).
  readonly properties = linkedSignal<Property[]>(
    () => this.propertiesResource.value()?.properties ?? [],
  );

  // Method to add property (returns Observable)
  addProperty(property: PropertyInsert): Observable<Property> {
    return this.#http.post<SinglePropertyResponse>('properties', property).pipe(
      map(resp => resp.property),
      // Updating the signal to receive the answer
      tap((newProperty) => {
        this.properties.update(currentProperties => [...currentProperties, newProperty]);
      })
    );
  }

  // Method to delete property (returns Observable)
  deleteProperty(id: number): Observable<void> {
    return this.#http.delete<void>(`properties/${id}`).pipe(
      tap(() => {
        this.properties.update(props => props.filter(p => p.id !== id));
      })
    );
  }
}
