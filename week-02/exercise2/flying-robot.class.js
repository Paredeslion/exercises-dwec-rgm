/**
 * @author Raúl Gonzálvez Mondéjar
 * @email paredeslion@gmail.com
 * @create date 11-10-2025 21:43:11
 * @modify date 12-10-2025 01:37:59
 * @desc [Flying Robot Class]
 */

import { Robot } from "./robot.class.js";

export class FlyingRobot extends Robot {
	#altitude;

	constructor(model, altitude) {
		super(model);
		this.#altitude = altitude;
	}

	get altitude() {
		return this.#altitude;
	}

	fly() {
		console.log(`Flying ${this.model} to ${this.#altitude} meters`);
		this.battery -= 50;
	}

	toString() {
		return `Flying Robot: Model = ${this.model}, Battery = ${this.battery}, Altitude = ${this.#altitude} meters`;
	}
}