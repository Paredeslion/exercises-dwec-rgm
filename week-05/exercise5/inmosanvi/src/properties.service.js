import { Http } from "./http.class.js";
import { SERVER } from "./constants.js";

export class PropertiesService {
	// Private field for Http instance
	#http = new Http();

	async getProperties() {
		const data = await this.#http.get(`${SERVER}/properties`);
		return data.properties; // Only return the properties array
	}

	async insertProperty(propertyData) {
		const insertedProperty = await this.#http.post(`${SERVER}/properties`, propertyData);
		return insertedProperty; // Only return the created property
	}

	async deleteProperty(id) {
		return await this.#http.delete(`${SERVER}/properties/${id}`);
	}
}