import { Injectable, Signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ProvincesResponse, TownsResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class ProvincesService {
  // Obtaining all provinces
  readonly provincesResource = httpResource<ProvincesResponse>(() => 'provinces', {
  defaultValue: { provinces: [] }
});

  /* httpResource EXPLANATION
  If the function returns a string (URL) -> Angular automatically sends the HTTP request.
  If the function returns undefined -> Angular cancels any request and does nothing.
  */

  getTownsResource(provinceId: Signal<number>) {
    // Returns an httpResource that fetches the towns based on the province id.
    return httpResource<TownsResponse>(
      () => {
        const id = provinceId();

        if (id > 0) {
          // If there's an ID, we request the towns from that province
          return `provinces/${id}/towns`;
        } else {
          // If the ID is 0 or less, we return undefined to NOT make the HTTP request.
          return undefined;
        }
      },
      {
        // Set a default value in the httpResource simulating a response object with an empty towns array.
        defaultValue: { towns: [] },
      },
    );
  }
}
