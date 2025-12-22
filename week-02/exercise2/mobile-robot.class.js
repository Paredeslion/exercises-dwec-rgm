/**
 * @author Raúl Gonzálvez Mondéjar
 * @email paredeslion@gmail.com
 * @create date 11-10-2025 21:42:51
 * @modify date 12-10-2025 01:37:51
 * @desc [Mobile Robot Class]
 */

import { Robot } from "./robot.class.js";

export class MobileRobot extends Robot {
	#speed;

	constructor(model, speed) {
		super(model);
		this.#speed = speed;
	}

	get speed() {
		return this.#speed;
	}

	move() {
		console.log(`Moving ${this.model} at speed ${this.#speed} km/h`);
		this.battery -= 20;
	}

	toString() {
		return `Mobile Robot: Model = ${this.model}, Battery = ${this.battery}, Speed = ${this.#speed} km/h`;
	}
}