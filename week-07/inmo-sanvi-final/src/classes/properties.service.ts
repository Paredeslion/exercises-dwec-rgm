import { Http } from "./http.class";
import { SERVER } from "../constants";

// Properties services changes a lot from the previous exercise

import type {
  Property,
  PropertyInsert,
  PropertiesResponse,
  SinglePropertyResponse,
} from "../interfaces/property.interfaces";

export class PropertiesService {
  #http: Http;

  constructor() {
    this.#http = new Http();
  }

  // MODIFIED: Now accepts parameters (page, search, etc.) and returns the full answer
  async getProperties(
    searchParams?: URLSearchParams
  ): Promise<PropertiesResponse> {
    const params = searchParams ? "?" + searchParams.toString() : "";

    //Petition GET with filters
    // Server returns { properties: [], more: boolean, page: number }
    const resp = await this.#http.get<PropertiesResponse>(
      `${SERVER}/properties${params}`
    );
    return resp;
  }

  async getPropertyById(id: number): Promise<Property> {
    // El servidor devuelve un objeto { property: { ... } }
    const resp = await this.#http.get<SinglePropertyResponse>(
      `${SERVER}/properties/${id}`
    );
    return resp.property;
  }

  // MODIFIED: Strict typation with PropertyInsert and Property
  async insertProperty(property: PropertyInsert): Promise<Property> {
    return await this.#http.post<Property, PropertyInsert>(
      `${SERVER}/properties`,
      property
    );
  }

  // MODIFIED: Simple typation
  async deleteProperty(id: number): Promise<void> {
    await this.#http.delete<void>(`${SERVER}/properties/${id}`);
  }
}
