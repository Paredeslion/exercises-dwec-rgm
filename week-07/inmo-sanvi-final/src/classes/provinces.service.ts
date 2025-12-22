// A lot of changes from previous exercise

import { Http } from "./http.class";
import { SERVER } from "../constants";
import type { Province, Town } from "../interfaces/location.interfaces";

export class ProvincesService {
  #http: Http;

  constructor() {
    this.#http = new Http();
  }

  async getProvinces(): Promise<Province[]> {
    // Saying to http.get that we are waiting an object with "provinces" property
    const resp = await this.#http.get<{ provinces: Province[] }>(
      `${SERVER}/provinces`
    );
    return resp.provinces;
  }

  async getTowns(idProvince: number): Promise<Town[]> {
    // Here we are waiting an object with "towns" property
    const resp = await this.#http.get<{ towns: Town[] }>(
      `${SERVER}/provinces/${idProvince}/towns`
    );
    return resp.towns;
  }
}
