import { Http } from "./http.class.js";
import { SERVER } from "./constants.js";

export class ProvincesService {
	// Private field for Http instance
	#http = new Http();

	async getProvinces() {
		const data = await this.#http.get(`${SERVER}/provinces`);
		return data.provinces; // Only return the provinces array
	}

	async getTowns(idProvince) {
		const data = await this.#http.get(`${SERVER}/provinces/${idProvince}/towns`);
		return data.towns; // Only return the towns array
	}
}