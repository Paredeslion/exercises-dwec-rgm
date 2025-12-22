import { Http } from "./http.class";
import { SERVER } from "../constants";

import type {
	PresentInsert,
	Present,
	GetPresentsResponse,
	AddPresentResponse
} from "../interfaces/presents.interface";

export class PresentsService {
  #http: Http;

  constructor() {
    this.#http = new Http();
  }

  // GET presents
	// We need to declare that is a promise and inside <> we need to indicate what is inside the promise when it happens
  async getPresents(): Promise<Present[]> {
		// /Getting the full object from the server
		const response = await this.#http.get<GetPresentsResponse>(`${SERVER}/presents`);
		// response = { presents: [...] }
		// We need to return only the presents array
		return response.presents;
		// response.presents = [id: ..., photo: ..., description: ...]
  }

	// POST /presents
	/*present: the variable name 
	PresentInsert, the data only accepts objects with description and photo
	PresentInsert is what we send (photo + description) NO ID
	but Present is what the server returns confirmed, it HAS ID (id + photo + description)
	We need the ID to add the object to the DOM
	*/
  async addPresent(present: PresentInsert): Promise<Present> {
		/* This is the post from http class
		<AddPresentResponse, ...> What we receive { "present": { ... } }
		<..., PresentInsert> What we send. "Ey, server, I will send you data that complies with PresentInsert.""
		TS reviews that present is correct before sending it
		`${SERVER}/presents` = http://localhost:3000/presents , {description: ...}
		*/
		/* 
		TU CÓDIGO (Cliente)                       SERVIDOR (Backend)
   -------------------                       ------------------
				1. Preparas el envío (Validado por PresentInsert)
					{
						"desc": "Robot",      ===============>   RECIBE POST
						"photo": "base64..."                     (Guarda en BBDD...)
					}

																											RESPONDE (JSON)
					recibe la respuesta     <===============   {
					(Validada por                                "present": {
						AddPresentResponse)                           "id": 9,
					}                                              "desc": "Robot",
																													"photo": "url..."
																												}
																											}
		*/
		const response = await this.#http.post<AddPresentResponse, PresentInsert>(`${SERVER}/presents`, present);
		// Esta línea le dice a TypeScript: "Haz una petición POST. Te prometo que te envío datos de tipo PresentInsert (descripción + foto). 
		// A cambio, prométeme que lo que me devuelvas será de tipo AddPresentResponse (una caja con el regalo confirmado dentro)."
		/*response is the object { "present": { id: 9,... } }
		but we need only the object from inside {id: 9,... } 
		*/
		return response.present;
	}

  // void because returns nothing
	// "The server's response is empty (204)"
  async deletePresent(id: number): Promise<void> {
    await this.#http.delete<void>(`${SERVER}/presents/${id}`);
  }
}